import { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertPlanetSchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  // Get all planets
  app.get("/api/planets", async (_req, res) => {
    const planets = await storage.getPlanets();
    res.json(planets);
  });

  // Get single planet
  app.get("/api/planets/:id", async (req, res) => {
    const planet = await storage.getPlanet(Number(req.params.id));
    if (!planet) {
      return res.status(404).json({ message: "Planet not found" });
    }
    res.json(planet);
  });

  // Create planet
  app.post("/api/planets", async (req, res) => {
    const parsed = insertPlanetSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid planet data" });
    }
    const planet = await storage.createPlanet(parsed.data);
    res.status(201).json(planet);
  });

  // Update planet
  app.patch("/api/planets/:id", async (req, res) => {
    const parsed = insertPlanetSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid planet data" });
    }
    const planet = await storage.updatePlanet(Number(req.params.id), parsed.data);
    if (!planet) {
      return res.status(404).json({ message: "Planet not found" });
    }
    res.json(planet);
  });

  // Delete planet
  app.delete("/api/planets/:id", async (req, res) => {
    const success = await storage.deletePlanet(Number(req.params.id));
    if (!success) {
      return res.status(404).json({ message: "Planet not found" });
    }
    res.status(204).send();
  });

  // Get REST concepts
  app.get("/api/concepts", async (_req, res) => {
    const concepts = await storage.getRestConcepts();
    res.json(concepts);
  });

  const httpServer = createServer(app);
  return httpServer;
}
