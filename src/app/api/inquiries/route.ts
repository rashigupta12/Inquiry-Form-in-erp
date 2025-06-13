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
      if (!inquiry.createdBy || !inquiry.name ||inquiry.contactNumber || !inquiry.jobType) {
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
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ message: "Missing ID" }, { status: 400 });

  try {
    const { createdBy, ...data } = await request.json();

    // Don't allow changing the creator
    const updateData = {
      ...data,
      updatedAt: new Date(),
    };

    const updated = await db
      .update(InquiriesTable)
      .set(updateData)
      .where(eq(InquiriesTable.id, id))
      .returning();

    if (!updated.length) {
      return NextResponse.json({ message: "Inquiry not found" }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("PUT /api/inquiries error:", error);
    return NextResponse.json({ message: "Failed to update inquiry" }, { status: 500 });
  }
}

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