import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const patients = pgTable("patients", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  address: text("address"),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow()
});
