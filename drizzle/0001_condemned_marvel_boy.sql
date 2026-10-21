ALTER TABLE "store_order" ADD COLUMN "admin_note" text;--> statement-breakpoint
ALTER TABLE "store_order" ADD COLUMN "tracking_number" text;--> statement-breakpoint
ALTER TABLE "product" ADD COLUMN "source_id" text;--> statement-breakpoint
ALTER TABLE "variant" ADD COLUMN "source_id" text;--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_source_id_unique" UNIQUE("source_id");--> statement-breakpoint
ALTER TABLE "variant" ADD CONSTRAINT "variant_source_id_unique" UNIQUE("source_id");