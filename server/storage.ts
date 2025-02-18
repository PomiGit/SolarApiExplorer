import { planets, restConcepts, type Planet, type InsertPlanet, type RestConcept, type InsertRestConcept } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Planet operations
  getPlanets(): Promise<Planet[]>;
  getPlanet(id: number): Promise<Planet | undefined>;
  createPlanet(planet: InsertPlanet): Promise<Planet>;
  updatePlanet(id: number, planet: Partial<InsertPlanet>): Promise<Planet | undefined>;
  deletePlanet(id: number): Promise<boolean>;

  // REST Concepts
  getRestConcepts(): Promise<RestConcept[]>;
  getRestConcept(id: number): Promise<RestConcept | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getPlanets(): Promise<Planet[]> {
    return await db.select().from(planets);
  }

  async getPlanet(id: number): Promise<Planet | undefined> {
    const [planet] = await db.select().from(planets).where(eq(planets.id, id));
    return planet;
  }

  async createPlanet(planet: InsertPlanet): Promise<Planet> {
    const [newPlanet] = await db.insert(planets).values(planet).returning();
    return newPlanet;
  }

  async updatePlanet(id: number, planetData: Partial<InsertPlanet>): Promise<Planet | undefined> {
    const [updated] = await db
      .update(planets)
      .set(planetData)
      .where(eq(planets.id, id))
      .returning();
    return updated;
  }

  async deletePlanet(id: number): Promise<boolean> {
    const [deleted] = await db
      .delete(planets)
      .where(eq(planets.id, id))
      .returning();
    return !!deleted;
  }

  async getRestConcepts(): Promise<RestConcept[]> {
    return await db.select().from(restConcepts);
  }

  async getRestConcept(id: number): Promise<RestConcept | undefined> {
    const [concept] = await db.select().from(restConcepts).where(eq(restConcepts.id, id));
    return concept;
  }
}

export const storage = new DatabaseStorage();