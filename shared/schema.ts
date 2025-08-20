import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  totalXP: integer("total_xp").notNull().default(0),
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  level: integer("level").notNull().default(1),
  goalsCompleted: integer("goals_completed").notNull().default(0),
  consistencyScore: integer("consistency_score").notNull().default(0),
  joinDate: timestamp("join_date").notNull().defaultNow(),
  lastActive: timestamp("last_active").notNull().defaultNow(),
});

// Goals/Commitments table
export const goals = pgTable("goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(), // 'holding', 'dca', 'staking', 'trading'
  startDate: timestamp("start_date").notNull().defaultNow(),
  endDate: timestamp("end_date").notNull(),
  targetAmount: decimal("target_amount", { precision: 18, scale: 8 }),
  progress: integer("progress").notNull().default(0), // 0-100
  xpReward: integer("xp_reward").notNull(),
  completed: boolean("completed").notNull().default(false),
  difficulty: text("difficulty").notNull().default('medium'), // 'easy', 'medium', 'hard', 'extreme'
  createdAt: timestamp("created_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Quests table
export const quests = pgTable("quests", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // 'daily', 'weekly'
  category: text("category").notNull(), // 'trading', 'staking', 'holding', 'social', 'general'
  target: integer("target").notNull(),
  xpReward: integer("xp_reward").notNull(),
  difficulty: text("difficulty").notNull(), // 'easy', 'medium', 'hard'
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// User Quest Progress table
export const userQuests = pgTable("user_quests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  questId: integer("quest_id").notNull().references(() => quests.id),
  progress: integer("progress").notNull().default(0),
  completed: boolean("completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Achievements table
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // 'bronze', 'silver', 'gold', 'platinum'
  rarity: text("rarity").notNull(), // 'common', 'rare', 'epic', 'legendary'
  icon: text("icon").notNull(),
  xpReward: integer("xp_reward").notNull(),
  criteria: jsonb("criteria").notNull(), // JSON object with achievement criteria
  isActive: boolean("is_active").notNull().default(true),
});

// User Achievements table
export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  achievementId: integer("achievement_id").notNull().references(() => achievements.id),
  unlockedAt: timestamp("unlocked_at").notNull().defaultNow(),
});

// ZK Proofs table
export const zkProofs = pgTable("zk_proofs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  goalId: integer("goal_id").references(() => goals.id),
  proofHash: text("proof_hash").notNull().unique(),
  proofType: text("proof_type").notNull(), // 'transaction', 'balance', 'position'
  description: text("description").notNull(),
  verified: boolean("verified").notNull().default(false),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Social Posts table
export const socialPosts = pgTable("social_posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  type: text("type").notNull(), // 'achievement', 'goal', 'milestone', 'update'
  likes: integer("likes").notNull().default(0),
  comments: integer("comments").notNull().default(0),
  shares: integer("shares").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Social Interactions table
export const socialInteractions = pgTable("social_interactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  postId: integer("post_id").notNull().references(() => socialPosts.id),
  type: text("type").notNull(), // 'like', 'comment', 'share'
  content: text("content"), // For comments
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Accountability Partners table
export const accountabilityPartners = pgTable("accountability_partners", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  partnerId: integer("partner_id").notNull().references(() => users.id),
  status: text("status").notNull().default('pending'), // 'pending', 'accepted', 'declined'
  createdAt: timestamp("created_at").notNull().defaultNow(),
  acceptedAt: timestamp("accepted_at"),
});

// Schema validation
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertGoalSchema = createInsertSchema(goals).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertQuestSchema = createInsertSchema(quests).omit({
  id: true,
  createdAt: true,
});

export const insertZKProofSchema = createInsertSchema(zkProofs).omit({
  id: true,
  createdAt: true,
  verifiedAt: true,
});

export const insertSocialPostSchema = createInsertSchema(socialPosts).omit({
  id: true,
  createdAt: true,
  likes: true,
  comments: true,
  shares: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Goal = typeof goals.$inferSelect;
export type InsertGoal = z.infer<typeof insertGoalSchema>;

export type Quest = typeof quests.$inferSelect;
export type InsertQuest = z.infer<typeof insertQuestSchema>;

export type UserQuest = typeof userQuests.$inferSelect;

export type Achievement = typeof achievements.$inferSelect;
export type UserAchievement = typeof userAchievements.$inferSelect;

export type ZKProof = typeof zkProofs.$inferSelect;
export type InsertZKProof = z.infer<typeof insertZKProofSchema>;

export type SocialPost = typeof socialPosts.$inferSelect;
export type InsertSocialPost = z.infer<typeof insertSocialPostSchema>;

export type SocialInteraction = typeof socialInteractions.$inferSelect;

export type AccountabilityPartner = typeof accountabilityPartners.$inferSelect;
