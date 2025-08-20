import { create } from "zustand";

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly';
  target: number;
  progress: number;
  xpReward: number;
  completed: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'trading' | 'staking' | 'holding' | 'social' | 'general';
}

interface QuestState {
  dailyQuests: Quest[];
  weeklyQuests: Quest[];
  lastReset: string;

  // Actions
  completeQuest: (questId: string) => void;
  updateQuestProgress: (questId: string, progress: number) => void;
  resetDailyQuests: () => void;
  resetWeeklyQuests: () => void;
}

const generateDailyQuests = (): Quest[] => [
  {
    id: 'daily_1',
    title: 'Check Portfolio',
    description: 'View your DeFi portfolio and update progress',
    type: 'daily',
    target: 1,
    progress: 1,
    xpReward: 25,
    completed: true,
    difficulty: 'easy',
    category: 'general'
  },
  {
    id: 'daily_2',
    title: 'DCA Execute',
    description: 'Complete your daily DCA transaction',
    type: 'daily',
    target: 1,
    progress: 0,
    xpReward: 50,
    completed: false,
    difficulty: 'medium',
    category: 'trading'
  },
  {
    id: 'daily_3',
    title: 'Hold Strong',
    description: 'Maintain your holding commitments without selling',
    type: 'daily',
    target: 1,
    progress: 1,
    xpReward: 30,
    completed: true,
    difficulty: 'easy',
    category: 'holding'
  },
  {
    id: 'daily_4',
    title: 'Community Engage',
    description: 'Interact with 3 community posts',
    type: 'daily',
    target: 3,
    progress: 1,
    xpReward: 35,
    completed: false,
    difficulty: 'easy',
    category: 'social'
  }
];

const generateWeeklyQuests = (): Quest[] => [
  {
    id: 'weekly_1',
    title: 'Consistency Master',
    description: 'Complete all daily quests for 5 days this week',
    type: 'weekly',
    target: 5,
    progress: 2,
    xpReward: 200,
    completed: false,
    difficulty: 'hard',
    category: 'general'
  },
  {
    id: 'weekly_2',
    title: 'DeFi Explorer',
    description: 'Try a new DeFi protocol or strategy',
    type: 'weekly',
    target: 1,
    progress: 0,
    xpReward: 150,
    completed: false,
    difficulty: 'medium',
    category: 'trading'
  },
  {
    id: 'weekly_3',
    title: 'Stake Champion',
    description: 'Increase your staking positions by any amount',
    type: 'weekly',
    target: 2,
    progress: 1,
    xpReward: 175,
    completed: false,
    difficulty: 'medium',
    category: 'staking'
  },
  {
    id: 'weekly_4',
    title: 'Social Builder',
    description: 'Help 5 community members with accountability',
    type: 'weekly',
    target: 5,
    progress: 2,
    xpReward: 250,
    completed: false,
    difficulty: 'hard',
    category: 'social'
  }
];

export const useQuests = create<QuestState>((set, get) => ({
  dailyQuests: generateDailyQuests(),
  weeklyQuests: generateWeeklyQuests(),
  lastReset: new Date().toDateString(),

  completeQuest: (questId: string) => {
    set((state) => {
      // Check if it's a daily quest
      const dailyQuestIndex = state.dailyQuests.findIndex(q => q.id === questId);
      if (dailyQuestIndex !== -1) {
        const updatedDailyQuests = [...state.dailyQuests];
        updatedDailyQuests[dailyQuestIndex] = {
          ...updatedDailyQuests[dailyQuestIndex],
          completed: true,
          progress: updatedDailyQuests[dailyQuestIndex].target
        };
        return { dailyQuests: updatedDailyQuests };
      }

      // Check if it's a weekly quest
      const weeklyQuestIndex = state.weeklyQuests.findIndex(q => q.id === questId);
      if (weeklyQuestIndex !== -1) {
        const updatedWeeklyQuests = [...state.weeklyQuests];
        updatedWeeklyQuests[weeklyQuestIndex] = {
          ...updatedWeeklyQuests[weeklyQuestIndex],
          completed: true,
          progress: updatedWeeklyQuests[weeklyQuestIndex].target
        };
        return { weeklyQuests: updatedWeeklyQuests };
      }

      return {};
    });
  },

  updateQuestProgress: (questId: string, progress: number) => {
    set((state) => {
      // Check if it's a daily quest
      const dailyQuestIndex = state.dailyQuests.findIndex(q => q.id === questId);
      if (dailyQuestIndex !== -1) {
        const updatedDailyQuests = [...state.dailyQuests];
        updatedDailyQuests[dailyQuestIndex] = {
          ...updatedDailyQuests[dailyQuestIndex],
          progress: Math.min(progress, updatedDailyQuests[dailyQuestIndex].target)
        };
        return { dailyQuests: updatedDailyQuests };
      }

      // Check if it's a weekly quest
      const weeklyQuestIndex = state.weeklyQuests.findIndex(q => q.id === questId);
      if (weeklyQuestIndex !== -1) {
        const updatedWeeklyQuests = [...state.weeklyQuests];
        updatedWeeklyQuests[weeklyQuestIndex] = {
          ...updatedWeeklyQuests[weeklyQuestIndex],
          progress: Math.min(progress, updatedWeeklyQuests[weeklyQuestIndex].target)
        };
        return { weeklyQuests: updatedWeeklyQuests };
      }

      return {};
    });
  },

  resetDailyQuests: () => {
    set({
      dailyQuests: generateDailyQuests(),
      lastReset: new Date().toDateString()
    });
  },

  resetWeeklyQuests: () => {
    set({
      weeklyQuests: generateWeeklyQuests()
    });
  }
}));
