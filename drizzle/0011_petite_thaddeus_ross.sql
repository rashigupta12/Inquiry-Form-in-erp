ALTER TABLE "inquiries" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "public"."inquiries" ALTER COLUMN "budget_range" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."budget_range";--> statement-breakpoint
CREATE TYPE "public"."budget_range" AS ENUM('under-500-aed', '500-2000-aed', '2000-4500-aed', '4500-22000-aed', 'above-22000-aed');--> statement-breakpoint
ALTER TABLE "public"."inquiries" ALTER COLUMN "budget_range" SET DATA TYPE "public"."budget_range" USING "budget_range"::"public"."budget_range";