CREATE TABLE "patients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"address" text,
	"email" text NOT NULL,
	"phone" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "patients_email_unique" UNIQUE("email")
);
