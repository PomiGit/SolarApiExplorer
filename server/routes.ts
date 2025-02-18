import { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertPlanetSchema, insertUserSchema, insertProgressSchema, insertQuizQuestionSchema, insertQuizAttemptSchema } from "@shared/schema";
import passport from "passport";
import { ensureAuthenticated } from "./auth";

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

  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const parsed = insertUserSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid user data" });
      }

      const existingUser = await storage.getUserByUsername(parsed.data.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const user = await storage.createUser(parsed.data);
      res.status(201).json({
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      });
    } catch (error) {
      res.status(500).json({ message: "Error creating user" });
    }
  });

  app.post("/api/auth/login", passport.authenticate("local"), (req, res) => {
    const user = req.user as any;
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    });
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout(() => {
      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = req.user as any;
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    });
  });


  // Progress tracking routes
  app.get("/api/progress", ensureAuthenticated, async (req, res) => {
    const user = req.user as any;
    const progress = await storage.getProgress(user.id);
    res.json(progress);
  });

  app.post("/api/progress/:conceptId", ensureAuthenticated, async (req, res) => {
    const user = req.user as any;
    const conceptId = Number(req.params.conceptId);
    const parsed = insertProgressSchema.partial().safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid progress data" });
    }

    const concept = await storage.getRestConcept(conceptId);
    if (!concept) {
      return res.status(404).json({ message: "Concept not found" });
    }

    const progress = await storage.updateProgress(user.id, conceptId, parsed.data);
    res.json(progress);
  });

  // Get REST concepts
  app.get("/api/concepts", async (_req, res) => {
    const concepts = await storage.getRestConcepts();
    res.json(concepts);
  });

  // Quiz routes
  app.get("/api/concepts/:conceptId/quiz", ensureAuthenticated, async (req, res) => {
    const conceptId = Number(req.params.conceptId);
    const questions = await storage.getQuizQuestions(conceptId);

    // Remove correct answer from response to prevent cheating
    const sanitizedQuestions = questions.map(({ correctAnswer, ...rest }) => rest);
    res.json(sanitizedQuestions);
  });

  app.post("/api/quiz/submit", ensureAuthenticated, async (req, res) => {
    const user = req.user as any;
    const { questionId, selectedAnswer } = req.body;

    if (typeof questionId !== 'number' || typeof selectedAnswer !== 'number') {
      return res.status(400).json({ message: "Invalid quiz attempt data" });
    }

    const question = await storage.getQuizQuestion(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const isCorrect = selectedAnswer === question.correctAnswer;
    const attempt = await storage.submitQuizAttempt({
      userId: user.id,
      questionId,
      selectedAnswer,
      isCorrect,
    });

    res.json({
      ...attempt,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
    });
  });

  app.get("/api/concepts/:conceptId/quiz/progress", ensureAuthenticated, async (req, res) => {
    const user = req.user as any;
    const conceptId = Number(req.params.conceptId);
    const attempts = await storage.getUserQuizAttempts(user.id, conceptId);

    const stats = {
      totalAttempts: attempts.length,
      correctAttempts: attempts.filter(a => a.isCorrect).length,
    };

    res.json(stats);
  });

  // Admin route to create quiz questions
  app.post("/api/quiz/questions", ensureAuthenticated, async (req, res) => {
    const parsed = insertQuizQuestionSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid question data" });
    }

    const question = await storage.createQuizQuestion(parsed.data);
    res.status(201).json(question);
  });

  const httpServer = createServer(app);
  return httpServer;
}