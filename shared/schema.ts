import { pgTable, text, serial, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const planets = pgTable("planets", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description").notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  distanceFromSun: integer("distance_from_sun").notNull(),
  imageUrl: text("image_url").notNull(),
});

export const restConcepts = pgTable("rest_concepts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 100 }).notNull(),
  description: text("description").notNull(),
  method: varchar("method", { length: 10 }).notNull(),
  example: text("example").notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const progress = pgTable("progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  conceptId: integer("concept_id").references(() => restConcepts.id).notNull(),
  completed: boolean("completed").default(false).notNull(),
  completedAt: timestamp("completed_at"),
  notes: text("notes"),
});

// Existing schemas
export const insertPlanetSchema = createInsertSchema(planets).pick({
  name: true,
  description: true,
  type: true,
  distanceFromSun: true,
  imageUrl: true,
});

export const insertRestConceptSchema = createInsertSchema(restConcepts).pick({
  title: true,
  description: true,
  method: true,
  example: true,
});

// New schemas for users and progress
export const insertUserSchema = createInsertSchema(users)
  .pick({
    username: true,
    email: true,
  })
  .extend({
    password: z.string().min(8, "Password must be at least 8 characters"),
  });

export const insertProgressSchema = createInsertSchema(progress).pick({
  userId: true,
  conceptId: true,
  completed: true,
  notes: true,
});

// Export types
export type Planet = typeof planets.$inferSelect;
export type InsertPlanet = z.infer<typeof insertPlanetSchema>;
export type RestConcept = typeof restConcepts.$inferSelect;
export type InsertRestConcept = z.infer<typeof insertRestConceptSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Progress = typeof progress.$inferSelect;
export type InsertProgress = z.infer<typeof insertProgressSchema>;