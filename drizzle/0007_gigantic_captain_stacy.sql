ALTER TABLE "inquiries" ALTER COLUMN "country" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "inquiries" ALTER COLUMN "state" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "inquiries" ALTER COLUMN "city" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "inquiries" ALTER COLUMN "property_type" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "inquiries" ALTER COLUMN "building_type" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "inquiries" ALTER COLUMN "building_name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "inquiries" ALTER COLUMN "project_urgency" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "email" text NOT NULL;--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "contact_number" text NOT NULL;--> statement-breakpoint
ALTER TABLE "inquiries" DROP COLUMN "whats_app";