// /api/inquiries/route.ts
/* eslint-disable @typescript-eslint/no-unused-vars */
/*eslint-disable  @typescript-eslint/no-explicit-any */
import { db } from "@/db";
import { InquiriesTable, UsersTable } from "@/db/schema";
import { eq, and, desc, ilike, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get('id');
  const createdBy = searchParams.get('createdBy');
  const jobType = searchParams.get('jobType');
  const city = searchParams.get('city');
  const area = searchParams.get('area');
  const propertyType = searchParams.get('propertyType');
  const budgetRange = searchParams.get('budgetRange');
  const projectUrgency = searchParams.get('projectUrgency');
  const search = searchParams.get('search');
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

  try {
    if (id) {
      // Get single inquiry with user details
      const inquiry = await db
        .select({
          inquiry: InquiriesTable,
          user: {
            id: UsersTable.id,
            name: UsersTable.name,
            email: UsersTable.email,
            role: UsersTable.role,
          }
        })
        .from(InquiriesTable)
        .leftJoin(UsersTable, eq(InquiriesTable.createdBy, UsersTable.id))
        .where(eq(InquiriesTable.id, id));

      if (!inquiry.length) {
        return NextResponse.json({ message: "Inquiry not found" }, { status: 404 });
      }

      return NextResponse.json({
        ...inquiry[0].inquiry,
        createdByUser: inquiry[0].user
      });
    }

    // Build query conditions
    const conditions = [];

    if (createdBy) {
      conditions.push(eq(InquiriesTable.createdBy, createdBy));
    }

    if (jobType) {
      conditions.push(eq(InquiriesTable.jobType, jobType as any));
    }

    if (city) {
      conditions.push(ilike(InquiriesTable.city, `%${city}%`));
    }

    if (area) {
      conditions.push(ilike(InquiriesTable.area, `%${area}%`));
    }

    if (propertyType) {
      conditions.push(eq(InquiriesTable.propertyType, propertyType as any));
    }

    if (budgetRange) {
      conditions.push(eq(InquiriesTable.budgetRange, budgetRange as any));
    }

    if (projectUrgency) {
      conditions.push(eq(InquiriesTable.projectUrgency, projectUrgency as any));
    }

    if (search) {
      conditions.push(
        or(
          ilike(InquiriesTable.city, `%${search}%`),
          ilike(InquiriesTable.area, `%${search}%`),
          ilike(InquiriesTable.buildingName, `%${search}%`),
          ilike(InquiriesTable.specialRequirements, `%${search}%`)
        )
      );
    }

    const query = db
      .select({
        inquiry: InquiriesTable,
        user: {
          id: UsersTable.id,
          name: UsersTable.name,
          email: UsersTable.email,
          role: UsersTable.role,
        }
      })
      .from(InquiriesTable)
      .leftJoin(UsersTable, eq(InquiriesTable.createdBy, UsersTable.id))
      .orderBy(desc(InquiriesTable.createdAt)) as any; // 👈 TypeScript bypass if needed


    const data = await query;

    const formattedData = data.map((item: { inquiry: typeof InquiriesTable; user: { id: string; name: string; email: string; role: string } }) => ({
      ...item.inquiry,
      createdByUser: item.user
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("GET /api/inquiries error:", error);
    return NextResponse.json({ message: "Failed to fetch inquiries" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const inquiries = Array.isArray(body) ? body : [body];
    const result = [];

    for (const inquiry of inquiries) {
      // Validate required fields
      if (!inquiry.createdBy || !inquiry.name || inquiry.contactNumber || !inquiry.jobType) {
        return NextResponse.json(
          { message: "Missing required fields: createdBy, name, contactNumber, jobType" },
          { status: 400 }
        );
      }

      // Verify user exists
      const user = await db.select().from(UsersTable).where(eq(UsersTable.id, inquiry.createdBy));
      if (!user.length) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 400 }
        );
      }

      const inserted = await db.insert(InquiriesTable).values({
        ...inquiry,
        updatedAt: new Date(),
      }).returning();

      result.push(inserted[0]);
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("POST /api/inquiries error:", error);
    return NextResponse.json({ message: "Failed to create inquiry" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    // Extract ID from URL
    const id = new URL(request.url).searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { message: "Missing ID parameter" },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { createdBy, createdByUser, createdAt, ...data } = body;

    // Validation: Check if required fields are present
    const requiredFields = ['name', 'email', 'ContactNumber', 'jobType'];
    const missingFields = requiredFields.filter(field => !data[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          message: "Missing required fields",
          missingFields
        },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.email && !emailRegex.test(data.email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    const processDateField = (value: any): Date | null => {
      if (!value) return null;
      
      // If it's already a Date object
      if (value instanceof Date) {
        return isNaN(value.getTime()) ? null : value;
      }
      
      // If it's a string that looks like a date
      if (typeof value === 'string') {
        // Check if it's already in ISO format
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/.test(value)) {
          const date = new Date(value);
          return isNaN(date.getTime()) ? null : date;
        }
        // Handle other date string formats if needed
      }
      
      // If it's a number (timestamp)
      if (typeof value === 'number') {
        const date = new Date(value);
        return isNaN(date.getTime()) ? null : date;
      }
      
      return null;
    };

    // Prepare update data
    const updateData: Record<string, any> = {
      ...data,
      updatedAt: new Date(), // Always set updatedAt to current date
    };

    // Process date fields
    ['preferredInspectionDate', 'alternativeInspectionDate'].forEach(field => {
      if (field in updateData) {
        updateData[field] = processDateField(updateData[field]);
      }
    });

    // Remove undefined values but keep null
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    console.log('Processed update data:', updateData);

    // Validate that the inquiry exists before updating
    const existingInquiry = await db
      .select()
      .from(InquiriesTable)
      .where(eq(InquiriesTable.id, id))
      .limit(1);

    if (!existingInquiry.length) {
      return NextResponse.json(
        { message: "Inquiry not found" },
        { status: 404 }
      );
    }

    // Perform the update
    const updated = await db
      .update(InquiriesTable)
      .set(updateData)
      .where(eq(InquiriesTable.id, id))
      .returning();

    if (!updated.length) {
      return NextResponse.json(
        { message: "Failed to update inquiry" },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json({
      message: "Inquiry updated successfully",
      data: updated[0]
    }, { status: 200 });

  } catch (error) {
    console.error("PUT /api/inquiries error:", error);

    // Handle specific error types
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { message: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // Database constraint errors
    if (typeof error === "object" && error !== null && "code" in error && (error as { code?: string }).code === '23505') {
      return NextResponse.json(
        { message: "Duplicate entry found" },
        { status: 409 }
      );
    }

    // Generic error response
    return NextResponse.json(
      {
        message: "Internal server error",
        error: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
      },
      { status: 500 }
    );
  }
}


// export async function PUT(request: Request) {
//   try {
//     const id = new URL(request.url).searchParams.get('id');
//     if (!id) {
//       return NextResponse.json({ message: "Missing ID" }, { status: 400 });
//     }

//     const body = await request.json();

//     // Define the expected shape of the update data
//     interface InquiryUpdateData {
//       name?: string;
//       email?: string;
//       ContactNumber?: string;
//       jobType?: string;
//       country?: string;
//       state?: string;
//       city?: string;
//       area?: string;
//       propertyType?: string;
//       buildingType?: string;
//       buildingName?: string;
//       inspectionPropertyType?: string;
//       budgetRange?: string;
//       projectUrgency?: string;
//       preferredInspectionDate?: string | Date | null;
//       alternativeInspectionDate?: string | Date | null;
//       specialRequirements?: string;
//       status?: string;
//       mapLocation?: string;
//     }

//     // Validate and sanitize the input
//     const validateInquiryData = (data: any): InquiryUpdateData => {
//       const validJobTypes = ['joineries-wood-work', 'painting-decorating', 'electrical', 'sanitary-plumbing-toilets-washroom', 'equipment-installation-maintenance', 'other'];
//       const validStatuses = ['new', 'in-progress', 'completed', 'cancelled'];
//       const validPropertyTypes = ['residential', 'commercial'];
//       const validBuildingTypes = ['villa', 'apartment', 'shop', 'office'];

//       return {
//         name: data.name ? String(data.name).trim() : undefined,
//         email: data.email ? String(data.email).trim().toLowerCase() : undefined,
//         ContactNumber: data.ContactNumber ? String(data.ContactNumber).trim() : undefined,
//         jobType: data.jobType && validJobTypes.includes(data.jobType) ? data.jobType : undefined,
//         country: data.country ? String(data.country).trim() : undefined,
//         state: data.state ? String(data.state).trim() : undefined,
//         city: data.city ? String(data.city).trim() : undefined,
//         area: data.area ? String(data.area).trim() : undefined,
//         propertyType: data.propertyType && validPropertyTypes.includes(data.propertyType) ? data.propertyType : undefined,
//         buildingType: data.buildingType && validBuildingTypes.includes(data.buildingType) ? data.buildingType : undefined,
//         buildingName: data.buildingName ? String(data.buildingName).trim() : undefined,
//         inspectionPropertyType: data.inspectionPropertyType ? String(data.inspectionPropertyType).trim() : undefined,
//         budgetRange: data.budgetRange ? String(data.budgetRange).trim() : undefined,
//         projectUrgency: data.projectUrgency ? String(data.projectUrgency).trim() : undefined,
//         preferredInspectionDate: data.preferredInspectionDate,
//         alternativeInspectionDate: data.alternativeInspectionDate,
//         specialRequirements: data.specialRequirements ? String(data.specialRequirements).trim() : undefined,
//         status: data.status && validStatuses.includes(data.status) ? data.status : undefined,
//         mapLocation: data.mapLocation ? String(data.mapLocation).trim() : undefined,
//       };
//     };

//     const { createdBy, ...rawData } = body;
//     const validatedData = validateInquiryData(rawData);

//     // Convert dates safely
//     const safeDate = (value: any): Date | null => {
//       if (!value) return null;
//       if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
//       if (typeof value === 'string') {
//         const date = new Date(value);
//         return isNaN(date.getTime()) ? null : date;
//       }
//       return null;
//     };

//     const updateData = {
//       ...validatedData,
//       jobType: validatedData.jobType as
//         | "joineries-wood-work"
//         | "painting-decorating"
//         | "electrical"
//         | "sanitary-plumbing-toilets-washroom"
//         | "equipment-installation-maintenance"
//         | "other"
//         | undefined,
//       propertyType: validatedData.propertyType as
//         | "residential"
//         | "commercial"
//         | undefined,
//       buildingType: validatedData.buildingType as
//         | "villa"
//         | "apartment"
//         | "shop"
//         | "office"
//         | undefined,
//       status: validatedData.status as
//         | "new"
//         | "in-progress"
//         | "completed"
//         | "cancelled"
//         | undefined,
//       preferredInspectionDate: safeDate(validatedData.preferredInspectionDate),
//       alternativeInspectionDate: safeDate(validatedData.alternativeInspectionDate),
//       updatedAt: new Date(),
//     };

//     // Remove undefined values
//     Object.keys(updateData).forEach(key => {
//       if (updateData[key as keyof typeof updateData] === undefined) {
//         delete updateData[key as keyof typeof updateData];
//       }
//     });

//     const updated = await db
//       .update(InquiriesTable)
//       .set(updateData)
//       .where(eq(InquiriesTable.id, id))
//       .returning();

//     if (!updated.length) {
//       return NextResponse.json({ message: "Inquiry not found" }, { status: 404 });
//     }

//     return NextResponse.json({
//       message: "Inquiry updated successfully",
//       data: updated[0]
//     });

//   } catch (error) {
//     console.error("PUT /api/inquiries error:", error);
//     return NextResponse.json(
//       { message: "Failed to update inquiry", error: error.message }, 
//       { status: 500 }
//     );
//   }
// }

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ message: "Missing ID" }, { status: 400 });

  try {
    const deleted = await db
      .delete(InquiriesTable)
      .where(eq(InquiriesTable.id, id))
      .returning();

    if (!deleted.length) {
      return NextResponse.json({ message: "Inquiry not found" }, { status: 404 });
    }

    return NextResponse.json(deleted[0]);
  } catch (error) {
    console.error("DELETE /api/inquiries error:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to delete inquiry" },
      { status: 500 }
    );
  }
}