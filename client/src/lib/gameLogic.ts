// Game logic and utility functions for DeFi Quest

export interface GameConfig {
  xpPerLevel: number;
  streakMultiplier: number;
  dailyQuestXP: number;
  weeklyQuestXP: number;
  goalCompletionBonus: number;
}

export const GAME_CONFIG: GameConfig = {
  xpPerLevel: 100,
  streakMultiplier: 1.1,
  dailyQuestXP: 25,
  weeklyQuestXP: 150,
  goalCompletionBonus: 50
};

// Calculate level from total XP
export const calculateLevel = (totalXP: number): number => {
  return Math.floor(totalXP / GAME_CONFIG.xpPerLevel) + 1;
};

// Calculate XP needed for next level
export const getXPForNextLevel = (currentXP: number): number => {
  const currentLevel = calculateLevel(currentXP);
  return (currentLevel * GAME_CONFIG.xpPerLevel) - currentXP;
};

// Calculate progress to next level (0-100)
export const getLevelProgress = (currentXP: number): number => {
  const levelXP = currentXP % GAME_CONFIG.xpPerLevel;
  return (levelXP / GAME_CONFIG.xpPerLevel) * 100;
};

// Calculate streak bonus XP
export const calculateStreakBonus = (baseXP: number, streakDays: number): number => {
  const multiplier = Math.pow(GAME_CONFIG.streakMultiplier, Math.min(streakDays, 30));
  return Math.floor(baseXP * multiplier);
};

// Calculate consistency score based on goals completed vs goals created
export const calculateConsistencyScore = (goalsCompleted: number, totalGoals: number): number => {
  if (totalGoals === 0) return 0;
  return Math.round((goalsCompleted / totalGoals) * 100);
};

// Generate random quest progress for simulation
export const simulateQuestProgress = (currentProgress: number, target: number): number => {
  const maxIncrease = Math.min(target - currentProgress, Math.ceil(target * 0.3));
  const increase = Math.floor(Math.random() * maxIncrease) + 1;
  return Math.min(currentProgress + increase, target);
};

// Calculate goal difficulty based on duration and type
export const calculateGoalDifficulty = (
  type: string,
  duration: number,
  targetAmount?: number
): 'easy' | 'medium' | 'hard' | 'extreme' => {
  let difficultyScore = 0;

  // Base difficulty by type
  switch (type) {
    case 'holding':
      difficultyScore += 1;
      break;
    case 'dca':
      difficultyScore += 2;
      break;
    case 'staking':
      difficultyScore += 2;
      break;
    case 'trading':
      difficultyScore += 3;
      break;
  }

  // Duration factor
  if (duration >= 90) difficultyScore += 3;
  else if (duration >= 30) difficultyScore += 2;
  else if (duration >= 7) difficultyScore += 1;

  // Amount factor (if specified)
  if (targetAmount) {
    if (targetAmount >= 10) difficultyScore += 2;
    else if (targetAmount >= 5) difficultyScore += 1;
  }

  // Return difficulty level
  if (difficultyScore >= 7) return 'extreme';
  if (difficultyScore >= 5) return 'hard';
  if (difficultyScore >= 3) return 'medium';
  return 'easy';
};

// Calculate XP reward based on goal difficulty and duration
export const calculateGoalXPReward = (
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme',
  duration: number
): number => {
  const baseXP = duration * 10; // 10 XP per day

  const difficultyMultipliers = {
    easy: 1.0,
    medium: 1.5,
    hard: 2.0,
    extreme: 3.0
  };

  return Math.floor(baseXP * difficultyMultipliers[difficulty]);
};

// Generate mock ZK proof hash
export const generateZKProofHash = (): string => {
  const chars = '0123456789abcdef';
  let hash = 'zk_0x';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
};

// Validate commitment data
export const validateCommitment = (data: {
  title: string;
  type: string;
  duration: string;
  description?: string;
}): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.title || data.title.trim().length < 3) {
    errors.push('Title must be at least 3 characters long');
  }

  if (!data.type || !['holding', 'dca', 'staking', 'trading'].includes(data.type)) {
    errors.push('Please select a valid goal type');
  }

  const duration = parseInt(data.duration);
  if (!duration || duration < 1 || duration > 365) {
    errors.push('Duration must be between 1 and 365 days');
  }

  if (data.description && data.description.length > 500) {
    errors.push('Description must be less than 500 characters');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

// Format time remaining
export const formatTimeRemaining = (endDate: string): string => {
  const now = new Date();
  const end = new Date(endDate);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return 'Expired';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) return `${days} day${days !== 1 ? 's' : ''} left`;
  if (hours > 0) return `${hours} hour${hours !== 1 ? 's' : ''} left`;
  return 'Less than 1 hour left';
};

// Check if user should get achievement
export const checkAchievements = (user: any, goals: any[]): string[] => {
  const newAchievements: string[] = [];

  // First goal achievement
  if (goals.length >= 1 && !user.achievements?.includes('first_goal')) {
    newAchievements.push('first_goal');
  }

  // Level-based achievements
  const level = calculateLevel(user.totalXP);
  if (level >= 5 && !user.achievements?.includes('level_5')) {
    newAchievements.push('level_5');
  }

  // Streak achievements
  if (user.currentStreak >= 7 && !user.achievements?.includes('streak_7')) {
    newAchievements.push('streak_7');
  }

  if (user.currentStreak >= 30 && !user.achievements?.includes('streak_30')) {
    newAchievements.push('streak_30');
  }

  // Goal completion achievements
  const completedGoals = goals.filter(g => g.completed).length;
  if (completedGoals >= 10 && !user.achievements?.includes('goals_10')) {
    newAchievements.push('goals_10');
  }

  return newAchievements;
};
