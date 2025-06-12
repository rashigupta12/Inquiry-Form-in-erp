ALTER TABLE "inquiries" ADD COLUMN "inspection_property_type" "inspection_property_type";--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "preferred_inspection_date" timestamp;--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "alternative_inspection_date" timestamp;