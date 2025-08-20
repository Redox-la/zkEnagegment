import { 
  users, goals, quests, userQuests, achievements, userAchievements, 
  zkProofs, socialPosts, socialInteractions, accountabilityPartners,
  type User, type InsertUser, type Goal, type InsertGoal, type Quest,
  type UserQuest, type Achievement, type ZKProof, type InsertZKProof,
  type SocialPost, type InsertSocialPost, type SocialInteraction
} from "@shared/schema";

// Enhanced storage interface for the gamified DeFi platform
export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;

  // Goal management
  getUserGoals(userId: number): Promise<Goal[]>;
  createGoal(goal: InsertGoal): Promise<Goal>;
  updateGoal(id: number, updates: Partial<Goal>): Promise<Goal | undefined>;
  completeGoal(id: number): Promise<Goal | undefined>;

  // Quest management
  getUserQuests(userId: number): Promise<(UserQuest & { quest: Quest })[]>;
  completeQuest(questId: number, userId: number): Promise<UserQuest | undefined>;
  updateQuestProgress(questId: number, userId: number, progress: number): Promise<UserQuest | undefined>;

  // Achievement management
  getUserAchievements(userId: number): Promise<Achievement[]>;
  unlockAchievement(data: { userId: number; achievementId: number }): Promise<void>;

  // ZK Proof management
  createZKProof(proof: InsertZKProof): Promise<ZKProof>;
  getUserZKProofs(userId: number): Promise<ZKProof[]>;
  verifyZKProof(id: number): Promise<ZKProof | undefined>;

  // Social features
  getSocialFeed(limit: number, offset: number): Promise<(SocialPost & { user: User })[]>;
  createSocialPost(post: InsertSocialPost): Promise<SocialPost>;
  likeSocialPost(postId: number, userId: number): Promise<void>;

  // Leaderboard
  getLeaderboard(type: string, limit: number): Promise<User[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private goals: Map<number, Goal>;
  private quests: Map<number, Quest>;
  private userQuests: Map<string, UserQuest>; // key: `${userId}-${questId}`
  private achievements: Map<number, Achievement>;
  private userAchievements: Map<string, { userId: number; achievementId: number; unlockedAt: Date }>;
  private zkProofs: Map<number, ZKProof>;
  private socialPosts: Map<number, SocialPost>;
  private socialInteractions: Map<number, SocialInteraction>;
  
  private currentUserId: number;
  private currentGoalId: number;
  private currentQuestId: number;
  private currentAchievementId: number;
  private currentZKProofId: number;
  private currentSocialPostId: number;

  constructor() {
    this.users = new Map();
    this.goals = new Map();
    this.quests = new Map();
    this.userQuests = new Map();
    this.achievements = new Map();
    this.userAchievements = new Map();
    this.zkProofs = new Map();
    this.socialPosts = new Map();
    this.socialInteractions = new Map();
    
    this.currentUserId = 1;
    this.currentGoalId = 1;
    this.currentQuestId = 1;
    this.currentAchievementId = 1;
    this.currentZKProofId = 1;
    this.currentSocialPostId = 1;

    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Initialize default quests
    const defaultQuests: Quest[] = [
      {
        id: this.currentQuestId++,
        title: 'Check Portfolio',
        description: 'View your DeFi portfolio and update progress',
        type: 'daily',
        category: 'general',
        target: 1,
        xpReward: 25,
        difficulty: 'easy',
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: this.currentQuestId++,
        title: 'DCA Execute',
        description: 'Complete your daily DCA transaction',
        type: 'daily',
        category: 'trading',
        target: 1,
        xpReward: 50,
        difficulty: 'medium',
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: this.currentQuestId++,
        title: 'Community Engage',
        description: 'Interact with 3 community posts',
        type: 'daily',
        category: 'social',
        target: 3,
        xpReward: 35,
        difficulty: 'easy',
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: this.currentQuestId++,
        title: 'Consistency Master',
        description: 'Complete all daily quests for 5 days this week',
        type: 'weekly',
        category: 'general',
        target: 5,
        xpReward: 200,
        difficulty: 'hard',
        isActive: true,
        createdAt: new Date(),
      }
    ];

    defaultQuests.forEach(quest => this.quests.set(quest.id, quest));

    // Initialize achievements
    const defaultAchievements: Achievement[] = [
      {
        id: this.currentAchievementId++,
        title: 'First Step',
        description: 'Create your first DeFi commitment',
        type: 'bronze',
        rarity: 'common',
        icon: 'target',
        xpReward: 50,
        criteria: { type: 'goals_created', target: 1 },
        isActive: true,
      },
      {
        id: this.currentAchievementId++,
        title: 'Week Warrior',
        description: 'Maintain a 7-day activity streak',
        type: 'silver',
        rarity: 'common',
        icon: 'flame',
        xpReward: 100,
        criteria: { type: 'streak_days', target: 7 },
        isActive: true,
      },
      {
        id: this.currentAchievementId++,
        title: 'Rising Star',
        description: 'Reach level 5',
        type: 'gold',
        rarity: 'rare',
        icon: 'star',
        xpReward: 250,
        criteria: { type: 'level', target: 5 },
        isActive: true,
      }
    ];

    defaultAchievements.forEach(achievement => this.achievements.set(achievement.id, achievement));
  }

  // User management
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      totalXP: 0,
      currentStreak: 0,
      longestStreak: 0,
      level: 1,
      goalsCompleted: 0,
      consistencyScore: 0,
      joinDate: new Date(),
      lastActive: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Goal management
  async getUserGoals(userId: number): Promise<Goal[]> {
    return Array.from(this.goals.values()).filter(goal => goal.userId === userId);
  }

  async createGoal(goalData: InsertGoal): Promise<Goal> {
    const id = this.currentGoalId++;
    const goal: Goal = {
      ...goalData,
      id,
      description: goalData.description || null,
      progress: goalData.progress || 0,
      completed: goalData.completed || false,
      difficulty: goalData.difficulty || 'medium',
      startDate: goalData.startDate || new Date(),
      targetAmount: goalData.targetAmount || null,
      createdAt: new Date(),
      completedAt: null,
    };
    this.goals.set(id, goal);
    return goal;
  }

  async updateGoal(id: number, updates: Partial<Goal>): Promise<Goal | undefined> {
    const goal = this.goals.get(id);
    if (!goal) return undefined;

    const updatedGoal = { ...goal, ...updates };
    this.goals.set(id, updatedGoal);
    return updatedGoal;
  }

  async completeGoal(id: number): Promise<Goal | undefined> {
    const goal = this.goals.get(id);
    if (!goal) return undefined;

    const completedGoal = { 
      ...goal, 
      completed: true, 
      progress: 100,
      completedAt: new Date() 
    };
    this.goals.set(id, completedGoal);

    // Update user stats
    const user = this.users.get(goal.userId);
    if (user) {
      const updatedUser = {
        ...user,
        totalXP: user.totalXP + goal.xpReward,
        goalsCompleted: user.goalsCompleted + 1,
        level: Math.floor((user.totalXP + goal.xpReward) / 100) + 1,
      };
      this.users.set(user.id, updatedUser);
    }

    return completedGoal;
  }

  // Quest management
  async getUserQuests(userId: number): Promise<(UserQuest & { quest: Quest })[]> {
    const userQuestsList: (UserQuest & { quest: Quest })[] = [];
    
    // Get all quests and create user quest entries if they don't exist
    for (const quest of Array.from(this.quests.values())) {
      const key = `${userId}-${quest.id}`;
      let userQuest = this.userQuests.get(key);
      
      if (!userQuest) {
        // Create new user quest entry
        userQuest = {
          id: Date.now() + Math.random(), // Simple ID generation
          userId,
          questId: quest.id,
          progress: 0,
          completed: false,
          completedAt: null,
          createdAt: new Date(),
        };
        this.userQuests.set(key, userQuest);
      }
      
      userQuestsList.push({ ...userQuest, quest });
    }
    
    return userQuestsList;
  }

  async completeQuest(questId: number, userId: number): Promise<UserQuest | undefined> {
    const key = `${userId}-${questId}`;
    const userQuest = this.userQuests.get(key);
    if (!userQuest) return undefined;

    const quest = this.quests.get(questId);
    if (!quest) return undefined;

    const completedUserQuest = {
      ...userQuest,
      completed: true,
      progress: quest.target,
      completedAt: new Date(),
    };
    this.userQuests.set(key, completedUserQuest);

    // Award XP to user
    const user = this.users.get(userId);
    if (user) {
      const updatedUser = {
        ...user,
        totalXP: user.totalXP + quest.xpReward,
        level: Math.floor((user.totalXP + quest.xpReward) / 100) + 1,
      };
      this.users.set(userId, updatedUser);
    }

    return completedUserQuest;
  }

  async updateQuestProgress(questId: number, userId: number, progress: number): Promise<UserQuest | undefined> {
    const key = `${userId}-${questId}`;
    const userQuest = this.userQuests.get(key);
    if (!userQuest) return undefined;

    const updatedUserQuest = { ...userQuest, progress };
    this.userQuests.set(key, updatedUserQuest);
    return updatedUserQuest;
  }

  // Achievement management
  async getUserAchievements(userId: number): Promise<Achievement[]> {
    const userAchievementIds = Array.from(this.userAchievements.values())
      .filter(ua => ua.userId === userId)
      .map(ua => ua.achievementId);

    return Array.from(this.achievements.values())
      .filter(achievement => userAchievementIds.includes(achievement.id));
  }

  async unlockAchievement(data: { userId: number; achievementId: number }): Promise<void> {
    const key = `${data.userId}-${data.achievementId}`;
    this.userAchievements.set(key, {
      userId: data.userId,
      achievementId: data.achievementId,
      unlockedAt: new Date(),
    });

    // Award XP
    const achievement = this.achievements.get(data.achievementId);
    const user = this.users.get(data.userId);
    if (achievement && user) {
      const updatedUser = {
        ...user,
        totalXP: user.totalXP + achievement.xpReward,
        level: Math.floor((user.totalXP + achievement.xpReward) / 100) + 1,
      };
      this.users.set(data.userId, updatedUser);
    }
  }

  // ZK Proof management
  async createZKProof(proofData: InsertZKProof): Promise<ZKProof> {
    const id = this.currentZKProofId++;
    const proof: ZKProof = {
      ...proofData,
      id,
      goalId: proofData.goalId || null,
      verified: true, // Auto-verify for demo
      verifiedAt: new Date(),
      createdAt: new Date(),
    };
    this.zkProofs.set(id, proof);
    return proof;
  }

  async getUserZKProofs(userId: number): Promise<ZKProof[]> {
    return Array.from(this.zkProofs.values()).filter(proof => proof.userId === userId);
  }

  async verifyZKProof(id: number): Promise<ZKProof | undefined> {
    const proof = this.zkProofs.get(id);
    if (!proof) return undefined;

    const verifiedProof = { ...proof, verified: true, verifiedAt: new Date() };
    this.zkProofs.set(id, verifiedProof);
    return verifiedProof;
  }

  // Social features
  async getSocialFeed(limit: number, offset: number): Promise<(SocialPost & { user: User })[]> {
    const posts = Array.from(this.socialPosts.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(offset, offset + limit);

    return posts.map(post => {
      const user = this.users.get(post.userId);
      return { ...post, user: user! };
    }).filter(p => p.user); // Filter out posts without users
  }

  async createSocialPost(postData: InsertSocialPost): Promise<SocialPost> {
    const id = this.currentSocialPostId++;
    const post: SocialPost = {
      ...postData,
      id,
      likes: 0,
      comments: 0,
      shares: 0,
      createdAt: new Date(),
    };
    this.socialPosts.set(id, post);
    return post;
  }

  async likeSocialPost(postId: number, userId: number): Promise<void> {
    const post = this.socialPosts.get(postId);
    if (!post) return;

    const updatedPost = { ...post, likes: post.likes + 1 };
    this.socialPosts.set(postId, updatedPost);
  }

  // Leaderboard
  async getLeaderboard(type: string, limit: number): Promise<User[]> {
    const users = Array.from(this.users.values());
    
    switch (type) {
      case 'xp':
        return users.sort((a, b) => b.totalXP - a.totalXP).slice(0, limit);
      case 'streak':
        return users.sort((a, b) => b.longestStreak - a.longestStreak).slice(0, limit);
      case 'consistency':
        return users.sort((a, b) => b.consistencyScore - a.consistencyScore).slice(0, limit);
      default:
        return users.sort((a, b) => b.totalXP - a.totalXP).slice(0, limit);
    }
  }
}

export const storage = new MemStorage();
