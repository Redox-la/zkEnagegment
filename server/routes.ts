import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // User management routes
  app.get("/api/user/:id", async (req, res) => {
    try {
      const user = await storage.getUser(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/user", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }
      
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }

      const user = await storage.createUser({ username, password });
      res.status(201).json({ id: user.id, username: user.username });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Goal management routes
  app.get("/api/goals/:userId", async (req, res) => {
    try {
      const goals = await storage.getUserGoals(parseInt(req.params.userId));
      res.json(goals);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/goals", async (req, res) => {
    try {
      const goal = await storage.createGoal(req.body);
      res.status(201).json(goal);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/goals/:id", async (req, res) => {
    try {
      const goal = await storage.updateGoal(parseInt(req.params.id), req.body);
      if (!goal) {
        return res.status(404).json({ message: "Goal not found" });
      }
      res.json(goal);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Quest routes
  app.get("/api/quests/:userId", async (req, res) => {
    try {
      const quests = await storage.getUserQuests(parseInt(req.params.userId));
      res.json(quests);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/quests/:questId/complete", async (req, res) => {
    try {
      const { userId } = req.body;
      const quest = await storage.completeQuest(parseInt(req.params.questId), userId);
      if (!quest) {
        return res.status(404).json({ message: "Quest not found" });
      }
      res.json(quest);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Leaderboard routes
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const { type = 'xp', limit = 10 } = req.query;
      const leaderboard = await storage.getLeaderboard(type as string, parseInt(limit as string));
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ZK Proof routes
  app.post("/api/zk-proof", async (req, res) => {
    try {
      const proof = await storage.createZKProof(req.body);
      res.status(201).json(proof);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/zk-proof/:userId", async (req, res) => {
    try {
      const proofs = await storage.getUserZKProofs(parseInt(req.params.userId));
      res.json(proofs);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Achievement routes
  app.get("/api/achievements/:userId", async (req, res) => {
    try {
      const achievements = await storage.getUserAchievements(parseInt(req.params.userId));
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/achievements", async (req, res) => {
    try {
      const achievement = await storage.unlockAchievement(req.body);
      res.status(201).json(achievement);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Social feed routes
  app.get("/api/feed", async (req, res) => {
    try {
      const { limit = 20, offset = 0 } = req.query;
      const feed = await storage.getSocialFeed(parseInt(limit as string), parseInt(offset as string));
      res.json(feed);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/posts", async (req, res) => {
    try {
      const post = await storage.createSocialPost(req.body);
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
