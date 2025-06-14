import { relations } from "drizzle-orm";
import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const UserRole = pgEnum("user_role", [
  "SALES_REP", 
  "SALES_COORD", 
  "TECH_INSPECTOR", 
  "SALES_MGR", 
  "PROJECT_MGR", 
  "ADMIN"
]);

// User Table
export const UsersTable = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    emailVerified: timestamp("email_verified", { mode: "date" }),
    password: text("password").notNull(),
    mobile: text("mobile"),
    role: UserRole("role").default("SALES_REP").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("users_email_key").on(table.email),
    index("users_name_email_mobile_idx").on(
      table.name,
      table.email,
      table.mobile
    ),
  ]
);

// =====================
// Authentication Tables
// =====================

// Email Verification Tokens
export const EmailVerificationTokenTable = pgTable(
  "email_verification_tokens",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    email: text("email").notNull(),
    token: uuid("token").notNull(),
    expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
  },
  (table) => [
    uniqueIndex("email_verification_tokens_email_token_key").on(
      table.email,
      table.token
    ),
    uniqueIndex("email_verification_tokens_token_key").on(table.token),
  ]
);

// Password Reset Tokens
export const PasswordResetTokenTable = pgTable(
  "password_reset_tokens",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    email: text("email").notNull(),
    token: uuid("token").notNull(),
    expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
  },
  (table) => [
    uniqueIndex("password_reset_tokens_email_token_key").on(
      table.email,
      table.token
    ),
    uniqueIndex("password_reset_tokens_token_key").on(table.token),
  ]
);

// =====================
// Inquiry System Tables
// =====================

// Enums for Inquiry Form
export const JobType = pgEnum("job_type", [
  "joineries-wood-work",
  "painting-decorating", 
  "electrical",
  "sanitary-plumbing-toilets-washroom",
  "equipment-installation-maintenance",
  "other"
]);

export const InquiryStatus = pgEnum("inquiry_status", [
  "new",
  "in-progress",
  "completed",
  "cancelled",
  "on-hold"
]);

export const PropertyType = pgEnum("property_type", [
  "residential",
  "commercial"
]);

export const BuildingType = pgEnum("building_type", [
  "villa",
  "apartment", 
  "shop",
  "office"
]);

export const InspectionPropertyType = pgEnum("inspection_property_type", [
  "residential",
  "commercial",
  "industrial"
]);

export const BudgetRange = pgEnum("budget_range", [
  "under-500-aed",
  "500-2000-aed",
  "2000-4500-aed",
  "4500-22000-aed",
  "above-22000-aed"
]);


export const ProjectUrgency = pgEnum("project_urgency", [
  "urgent",
  "normal",
  "flexible",
  "future-planning"
]);

// Main Inquiries Table
export const InquiriesTable = pgTable(
  "inquiries",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    createdBy: uuid("created_by").references(() => UsersTable.id).notNull(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    ContactNumber: text("contact_number").notNull(),
    jobType: JobType("job_type").notNull(),
    
    // Property Address
    country: text("country"),
    state: text("state"),
    city: text("city"),
    area: text("area"),
    propertyType: PropertyType("property_type"),
    buildingType: BuildingType("building_type"),
    buildingName: text("building_name"),
    mapLocation: text("map_location"),
    
    // Inspection Details
    inspectionPropertyType: InspectionPropertyType("inspection_property_type"),
    budgetRange: BudgetRange("budget_range"),
    
    // Timeline and Requirements
    projectUrgency: ProjectUrgency("project_urgency"),
    specialRequirements: text("special_requirements"),
    
    // Scheduling - FIXED: Added mode: "date" for proper Date object handling
    preferredInspectionDate: timestamp("preferred_inspection_date", { mode: "date" }),
    alternativeInspectionDate: timestamp("alternative_inspection_date", { mode: "date" }),
    
    // Status
    status: InquiryStatus("status").default("new").notNull(),
    
    // System fields - FIXED: Added mode: "date" and defaultNow() for updatedAt
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [
    index("inquiries_job_type_idx").on(table.jobType),
    index("inquiries_city_area_idx").on(table.city, table.area),
    index("inquiries_created_at_idx").on(table.createdAt),
  ]
);

export const usersRelations = relations(UsersTable, ({ many }) => ({
  inquiries: many(InquiriesTable),
}));

// Inquiry Relations
export const inquiriesRelations = relations(InquiriesTable, ({ one }) => ({
  createdBy: one(UsersTable, {
    fields: [InquiriesTable.createdBy],
    references: [UsersTable.id],
  }),
}));