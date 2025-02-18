import {
  type Planet,
  type InsertPlanet,
  type RestConcept,
  type InsertRestConcept,
} from "@shared/schema";

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

export class MemStorage implements IStorage {
  private planets: Map<number, Planet>;
  private restConcepts: Map<number, RestConcept>;
  private currentPlanetId: number;
  private currentConceptId: number;

  constructor() {
    this.planets = new Map();
    this.restConcepts = new Map();
    this.currentPlanetId = 1;
    this.currentConceptId = 1;
    this.initializeData();
  }

  private initializeData() {
    // Initialize planets
    const planetsData: InsertPlanet[] = [
      {
        name: "Mercury",
        description: "The smallest and innermost planet in the Solar System",
        type: "Terrestrial",
        distanceFromSun: 57,
        imageUrl: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5",
      },
      // Add more planets...
    ];

    planetsData.forEach(planet => this.createPlanet(planet));

    // Initialize REST concepts
    const conceptsData: InsertRestConcept[] = [
      {
        title: "GET Request",
        description: "Retrieve resource information",
        method: "GET",
        example: "/api/planets/1",
      },
      // Add more concepts...
    ];

    conceptsData.forEach(concept => {
      const id = this.currentConceptId++;
      this.restConcepts.set(id, { ...concept, id });
    });
  }

  async getPlanets(): Promise<Planet[]> {
    return Array.from(this.planets.values());
  }

  async getPlanet(id: number): Promise<Planet | undefined> {
    return this.planets.get(id);
  }

  async createPlanet(planet: InsertPlanet): Promise<Planet> {
    const id = this.currentPlanetId++;
    const newPlanet = { ...planet, id };
    this.planets.set(id, newPlanet);
    return newPlanet;
  }

  async updatePlanet(id: number, planet: Partial<InsertPlanet>): Promise<Planet | undefined> {
    const existing = this.planets.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...planet };
    this.planets.set(id, updated);
    return updated;
  }

  async deletePlanet(id: number): Promise<boolean> {
    return this.planets.delete(id);
  }

  async getRestConcepts(): Promise<RestConcept[]> {
    return Array.from(this.restConcepts.values());
  }

  async getRestConcept(id: number): Promise<RestConcept | undefined> {
    return this.restConcepts.get(id);
  }
}

export const storage = new MemStorage();
