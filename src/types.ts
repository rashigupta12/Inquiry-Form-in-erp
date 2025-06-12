import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { 
  UsersTable, 
  InquiriesTable,
  EmailVerificationTokenTable,
  PasswordResetTokenTable 
} from '@/db/schema';

// User Types
export type User = InferSelectModel<typeof UsersTable>;
export type NewUser = InferInsertModel<typeof UsersTable>;

// Inquiry Types
export type Inquiry = InferSelectModel<typeof InquiriesTable>;
export type NewInquiry = InferInsertModel<typeof InquiriesTable>;

// Inquiry with User relation
export type InquiryWithUser = Inquiry & {
  createdByUser: User;
};

// Auth Token Types
export type EmailVerificationToken = InferSelectModel<typeof EmailVerificationTokenTable>;
export type NewEmailVerificationToken = InferInsertModel<typeof EmailVerificationTokenTable>;

export type PasswordResetToken = InferSelectModel<typeof PasswordResetTokenTable>;
export type NewPasswordResetToken = InferInsertModel<typeof PasswordResetTokenTable>;

// API Request/Response Types
export interface CreateInquiryRequest {
  createdBy: string; // User ID
  whatsApp: string;
  jobType: JobType;
  city: string;
  area: string;
  propertyType: PropertyType;
  buildingType: BuildingType;
  buildingName: string;
  mapLocation?: string;
  inspectionPropertyType?: InspectionPropertyType;
  budgetRange: BudgetRange;
  projectUrgency: ProjectUrgency;
  specialRequirements?: string;
  preferredInspectionDate?: Date;
  alternativeInspectionDate?: Date;
}

export interface UpdateInquiryRequest extends Partial<CreateInquiryRequest> {
  id: string;
}

export interface InquiryFilters {
  jobType?: JobType;
  country?: string;
  state?: string;
  city?: string;
  area?: string;
  propertyType?: PropertyType;
  buildingType?: BuildingType;
  inspectionPropertyType?: InspectionPropertyType;
  budgetRange?: BudgetRange;
  projectUrgency?: ProjectUrgency;
  createdBy?: string;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'preferredInspectionDate' | 'city' | 'area';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Enum Types (derived from schema)
export type JobType = 
  | "joineries-wood-work"
  | "painting-decorating" 
  | "electrical"
  | "sanitary-plumbing-toilets-washroom"
  | "equipment-installation-maintenance"
  | "other";

export type PropertyType = 
  | "residential"
  | "commercial";

export type BuildingType = 
  | "villa"
  | "apartment" 
  | "shop"
  | "office";

export type InspectionPropertyType = 
  | "residential"
  | "commercial"
  | "industrial";

export type BudgetRange = 
  | "under-10k"
  | "10k-50k"
  | "50k-100k" 
  | "100k-500k"
  | "above-500k";

export type ProjectUrgency = 
  | "urgent"
  | "normal"
  | "flexible"
  | "future-planning";

export type UserRole = 
  | "SALES_REP" 
  | "SALES_COORD" 
  | "TECH_INSPECTOR" 
  | "SALES_MGR" 
  | "PROJECT_MGR" 
  | "ADMIN";

// Constants for validation (can be used in forms, etc.)
export const JOB_TYPES: JobType[] = [
  "joineries-wood-work",
  "painting-decorating", 
  "electrical",
  "sanitary-plumbing-toilets-washroom",
  "equipment-installation-maintenance",
  "other"
];

export const PROPERTY_TYPES: PropertyType[] = [
  "residential",
  "commercial"
];

export const BUILDING_TYPES: BuildingType[] = [
  "villa",
  "apartment", 
  "shop",
  "office"
];

export const INSPECTION_PROPERTY_TYPES: InspectionPropertyType[] = [
  "residential",
  "commercial",
  "industrial"
];

export const BUDGET_RANGES: BudgetRange[] = [
  "under-10k",
  "10k-50k",
  "50k-100k", 
  "100k-500k",
  "above-500k"
];

export const PROJECT_URGENCIES: ProjectUrgency[] = [
  "urgent",
  "normal",
  "flexible",
  "future-planning"
];

export const USER_ROLES: UserRole[] = [
  "SALES_REP", 
  "SALES_COORD", 
  "TECH_INSPECTOR", 
  "SALES_MGR", 
  "PROJECT_MGR", 
  "ADMIN"
];