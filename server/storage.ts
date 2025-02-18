import { planets, restConcepts, users, progress, type Planet, type InsertPlanet, type RestConcept, type InsertRestConcept, type User, type InsertUser, type Progress, type InsertProgress } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

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

  // User operations
  createUser(data: InsertUser & { password: string }): Promise<User>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserById(id: number): Promise<User | undefined>;

  // Progress operations
  getProgress(userId: number): Promise<Progress[]>;
  updateProgress(userId: number, conceptId: number, data: Partial<InsertProgress>): Promise<Progress>;
  getProgressByConceptId(userId: number, conceptId: number): Promise<Progress | undefined>;
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

  async createUser(data: InsertUser & { password: string }): Promise<User> {
    const { password, ...userData } = data;
    const passwordHash = await bcrypt.hash(password, 10);
    const [user] = await db
      .insert(users)
      .values({ ...userData, passwordHash })
      .returning();
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user;
  }

  async getUserById(id: number): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id));
    return user;
  }

  async getProgress(userId: number): Promise<Progress[]> {
    return await db
      .select()
      .from(progress)
      .where(eq(progress.userId, userId));
  }

  async updateProgress(userId: number, conceptId: number, data: Partial<InsertProgress>): Promise<Progress> {
    const existing = await this.getProgressByConceptId(userId, conceptId);
    if (existing) {
      const [updated] = await db
        .update(progress)
        .set({ ...data, completedAt: data.completed ? new Date() : null })
        .where(eq(progress.id, existing.id))
        .returning();
      return updated;
    } else {
      const [newProgress] = await db
        .insert(progress)
        .values({
          userId,
          conceptId,
          ...data,
          completedAt: data.completed ? new Date() : null,
        })
        .returning();
      return newProgress;
    }
  }

  async getProgressByConceptId(userId: number, conceptId: number): Promise<Progress | undefined> {
    const [userProgress] = await db
      .select()
      .from(progress)
      .where(eq(progress.userId, userId))
      .where(eq(progress.conceptId, conceptId));
    return userProgress;
  }
}

export const storage = new DatabaseStorage();