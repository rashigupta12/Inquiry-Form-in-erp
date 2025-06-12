CREATE TYPE "public"."budget_range" AS ENUM('under-10k', '10k-50k', '50k-100k', '100k-500k', 'above-500k');--> statement-breakpoint
CREATE TYPE "public"."building_type" AS ENUM('villa', 'apartment', 'shop', 'office');--> statement-breakpoint
CREATE TYPE "public"."inspection_property_type" AS ENUM('residential', 'commercial', 'industrial');--> statement-breakpoint
CREATE TYPE "public"."job_type" AS ENUM('joineries-wood-work', 'painting-decorating', 'electrical', 'sanitary-plumbing-toilets-washroom', 'equipment-installation-maintenance', 'other');--> statement-breakpoint
CREATE TYPE "public"."project_urgency" AS ENUM('urgent', 'normal', 'flexible', 'future-planning');--> statement-breakpoint
CREATE TYPE "public"."property_type" AS ENUM('residential', 'commercial');--> statement-breakpoint
CREATE TABLE "inquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_by" uuid NOT NULL,
	"whats_app" text NOT NULL,
	"job_type" "job_type" NOT NULL,
	"city" text NOT NULL,
	"area" text NOT NULL,
	"property_type" "property_type" NOT NULL,
	"building_type" "building_type" NOT NULL,
	"building_name" text NOT NULL,
	"unit_number" text NOT NULL,
	"map_location" text,
	"inspection_property_type" "inspection_property_type" NOT NULL,
	"budget_range" "budget_range" NOT NULL,
	"project_urgency" "project_urgency" NOT NULL,
	"special_requirements" text,
	"preferred_inspection_date" timestamp NOT NULL,
	"alternative_inspection_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'SALES_REP';--> statement-breakpoint
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "inquiries_job_type_idx" ON "inquiries" USING btree ("job_type");--> statement-breakpoint
CREATE INDEX "inquiries_city_area_idx" ON "inquiries" USING btree ("city","area");--> statement-breakpoint
CREATE INDEX "inquiries_created_at_idx" ON "inquiries" USING btree ("created_at");--> statement-breakpoint
ALTER TABLE "public"."users" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."user_role";--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('SALES_REP', 'SALES_COORD', 'TECH_INSPECTOR', 'SALES_MGR', 'PROJECT_MGR', 'ADMIN');--> statement-breakpoint
ALTER TABLE "public"."users" ALTER COLUMN "role" SET DATA TYPE "public"."user_role" USING "role"::"public"."user_role";