import { pgTable, text, serial, varchar, integer } from "drizzle-orm/pg-core";
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

export type Planet = typeof planets.$inferSelect;
export type InsertPlanet = z.infer<typeof insertPlanetSchema>;
export type RestConcept = typeof restConcepts.$inferSelect;
export type InsertRestConcept = z.infer<typeof insertRestConceptSchema>;
