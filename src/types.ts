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
  createdBy: User;
};

// Auth Token Types
export type EmailVerificationToken = InferSelectModel<typeof EmailVerificationTokenTable>;
export type NewEmailVerificationToken = InferInsertModel<typeof EmailVerificationTokenTable>;

export type PasswordResetToken = InferSelectModel<typeof PasswordResetTokenTable>;
export type NewPasswordResetToken = InferInsertModel<typeof PasswordResetTokenTable>;

// API Request/Response Types
export interface CreateInquiryRequest {
  whatsApp: string;
  jobType: string;
  city: string;
  area: string;
  propertyType: string;
  buildingType: string;
  buildingName: string;
  unitNumber: string;
  mapLocation?: string;
  inspectionPropertyType: string;
  budgetRange: string;
  projectUrgency: string;
  specialRequirements?: string;
  preferredInspectionDate: Date;
  alternativeInspectionDate?: Date;
}

export interface UpdateInquiryRequest extends Partial<CreateInquiryRequest> {
  id: string;
}

export interface InquiryFilters {
  jobType?: string;
  city?: string;
  area?: string;
  propertyType?: string;
  buildingType?: string;
  inspectionPropertyType?: string;
  budgetRange?: string;
  projectUrgency?: string;
  createdBy?: string;
  dateFrom?: Date;
  dateTo?: Date;
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

// Enum Values for validation
export const JOB_TYPES = [
  "joineries-wood-work",
  "painting-decorating", 
  "electrical",
  "sanitary-plumbing-toilets-washroom",
  "equipment-installation-maintenance",
  "other"
] as const;

export const PROPERTY_TYPES = [
  "residential",
  "commercial"
] as const;

export const BUILDING_TYPES = [
  "villa",
  "apartment", 
  "shop",
  "office"
] as const;

export const INSPECTION_PROPERTY_TYPES = [
  "residential",
  "commercial",
  "industrial"
] as const;

export const BUDGET_RANGES = [
  "under-10k",
  "10k-50k",
  "50k-100k", 
  "100k-500k",
  "above-500k"
] as const;

export const PROJECT_URGENCIES = [
  "urgent",
  "normal",
  "flexible",
  "future-planning"
] as const;

export const USER_ROLES = [
  "SALES_REP", 
  "SALES_COORD", 
  "TECH_INSPECTOR", 
  "SALES_MGR", 
  "PROJECT_MGR", 
  "ADMIN"
] as const;