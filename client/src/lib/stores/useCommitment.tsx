import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export interface Goal {
  id: string;
  title: string;
  description: string;
  type: 'holding' | 'dca' | 'staking' | 'trading';
  startDate: string;
  endDate: string;
  targetAmount?: number;
  progress: number;
  xpReward: number;
  completed: boolean;
}

export interface User {
  username: string;
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  level: number;
  goalsCompleted: number;
  joinDate: string;
}

interface CommitmentState {
  currentUser: User | null;
  activeGoals: Goal[];
  completedGoals: Goal[];
  
  // Actions
  initializeUser: (username: string) => void;
  addGoal: (goal: Goal) => void;
  updateGoalProgress: (goalId: string, progressIncrease: number) => void;
  completeGoal: (goalId: string) => void;
  addXP: (amount: number) => void;
  updateStreak: (days: number) => void;
}

export const useCommitment = create<CommitmentState>()(
  subscribeWithSelector((set, get) => ({
    currentUser: null,
    activeGoals: [],
    completedGoals: [],

    initializeUser: (username: string) => {
      const existingUser = localStorage.getItem('defi-quest-user');
      if (existingUser) {
        const user = JSON.parse(existingUser);
        set({ currentUser: user });
        
        // Load goals
        const goals = localStorage.getItem('defi-quest-goals');
        if (goals) {
          const parsedGoals = JSON.parse(goals);
          set({
            activeGoals: parsedGoals.active || [],
            completedGoals: parsedGoals.completed || []
          });
        }
      } else {
        const newUser: User = {
          username,
          totalXP: 0,
          currentStreak: 1,
          longestStreak: 1,
          level: 1,
          goalsCompleted: 0,
          joinDate: new Date().toISOString()
        };
        
        set({ currentUser: newUser });
        localStorage.setItem('defi-quest-user', JSON.stringify(newUser));
      }
    },

    addGoal: (goal: Goal) => {
      set((state) => {
        const newActiveGoals = [...state.activeGoals, goal];
        
        // Save to localStorage
        localStorage.setItem('defi-quest-goals', JSON.stringify({
          active: newActiveGoals,
          completed: state.completedGoals
        }));
        
        return { activeGoals: newActiveGoals };
      });
    },

    updateGoalProgress: (goalId: string, progressIncrease: number) => {
      set((state) => {
        const updatedGoals = state.activeGoals.map(goal => {
          if (goal.id === goalId) {
            const newProgress = Math.min(100, goal.progress + progressIncrease);
            return { ...goal, progress: newProgress };
          }
          return goal;
        });

        // Save to localStorage
        localStorage.setItem('defi-quest-goals', JSON.stringify({
          active: updatedGoals,
          completed: state.completedGoals
        }));

        return { activeGoals: updatedGoals };
      });
    },

    completeGoal: (goalId: string) => {
      set((state) => {
        const goalToComplete = state.activeGoals.find(g => g.id === goalId);
        if (!goalToComplete) return {};

        const completedGoal = { ...goalToComplete, completed: true, progress: 100 };
        const remainingActiveGoals = state.activeGoals.filter(g => g.id !== goalId);
        const newCompletedGoals = [...state.completedGoals, completedGoal];

        // Update user stats
        const updatedUser = state.currentUser ? {
          ...state.currentUser,
          totalXP: state.currentUser.totalXP + goalToComplete.xpReward,
          goalsCompleted: state.currentUser.goalsCompleted + 1,
          level: Math.floor((state.currentUser.totalXP + goalToComplete.xpReward) / 100) + 1
        } : null;

        // Save to localStorage
        if (updatedUser) {
          localStorage.setItem('defi-quest-user', JSON.stringify(updatedUser));
        }
        localStorage.setItem('defi-quest-goals', JSON.stringify({
          active: remainingActiveGoals,
          completed: newCompletedGoals
        }));

        return {
          activeGoals: remainingActiveGoals,
          completedGoals: newCompletedGoals,
          currentUser: updatedUser
        };
      });
    },

    addXP: (amount: number) => {
      set((state) => {
        if (!state.currentUser) return {};

        const updatedUser = {
          ...state.currentUser,
          totalXP: state.currentUser.totalXP + amount,
          level: Math.floor((state.currentUser.totalXP + amount) / 100) + 1
        };

        localStorage.setItem('defi-quest-user', JSON.stringify(updatedUser));
        return { currentUser: updatedUser };
      });
    },

    updateStreak: (days: number) => {
      set((state) => {
        if (!state.currentUser) return {};

        const updatedUser = {
          ...state.currentUser,
          currentStreak: days,
          longestStreak: Math.max(state.currentUser.longestStreak, days)
        };

        localStorage.setItem('defi-quest-user', JSON.stringify(updatedUser));
        return { currentUser: updatedUser };
      });
    }
  }))
);
