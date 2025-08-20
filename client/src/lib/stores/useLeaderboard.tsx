import { create } from "zustand";

export interface LeaderboardPlayer {
  username: string;
  totalXP: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  goalsCompleted: number;
  consistencyScore: number;
  joinDate: string;
}

interface LeaderboardState {
  leaderboard: LeaderboardPlayer[];
  consistencyLeaders: LeaderboardPlayer[];
  streakLeaders: LeaderboardPlayer[];
  lastUpdated: string;

  // Actions
  updateLeaderboard: () => void;
  addPlayer: (player: LeaderboardPlayer) => void;
}

// Mock leaderboard data
const generateMockPlayers = (): LeaderboardPlayer[] => [
  {
    username: 'CryptoPro',
    totalXP: 2850,
    level: 29,
    currentStreak: 45,
    longestStreak: 87,
    goalsCompleted: 34,
    consistencyScore: 94,
    joinDate: '2024-01-15'
  },
  {
    username: 'DeFiDegen',
    totalXP: 2650,
    level: 27,
    currentStreak: 32,
    longestStreak: 76,
    goalsCompleted: 28,
    consistencyScore: 89,
    joinDate: '2024-02-01'
  },
  {
    username: 'YieldFarmer',
    totalXP: 2400,
    level: 25,
    currentStreak: 28,
    longestStreak: 65,
    goalsCompleted: 25,
    consistencyScore: 91,
    joinDate: '2024-01-20'
  },
  {
    username: 'LiquidityKing',
    totalXP: 2250,
    level: 23,
    currentStreak: 21,
    longestStreak: 58,
    goalsCompleted: 22,
    consistencyScore: 87,
    joinDate: '2024-02-10'
  },
  {
    username: 'HODLQueen',
    totalXP: 2100,
    level: 22,
    currentStreak: 38,
    longestStreak: 92,
    goalsCompleted: 19,
    consistencyScore: 96,
    joinDate: '2024-01-05'
  },
  {
    username: 'StakeWizard',
    totalXP: 1950,
    level: 20,
    currentStreak: 15,
    longestStreak: 43,
    goalsCompleted: 18,
    consistencyScore: 82,
    joinDate: '2024-03-01'
  },
  {
    username: 'FlashLoanMaster',
    totalXP: 1800,
    level: 19,
    currentStreak: 12,
    longestStreak: 39,
    goalsCompleted: 16,
    consistencyScore: 78,
    joinDate: '2024-02-15'
  },
  {
    username: 'ArbTrader',
    totalXP: 1650,
    level: 17,
    currentStreak: 9,
    longestStreak: 34,
    goalsCompleted: 14,
    consistencyScore: 75,
    joinDate: '2024-03-10'
  },
  {
    username: 'GasOptimizer',
    totalXP: 1500,
    level: 16,
    currentStreak: 7,
    longestStreak: 28,
    goalsCompleted: 12,
    consistencyScore: 73,
    joinDate: '2024-03-15'
  },
  {
    username: 'Player1',
    totalXP: 150,
    level: 2,
    currentStreak: 3,
    longestStreak: 3,
    goalsCompleted: 1,
    consistencyScore: 85,
    joinDate: new Date().toISOString().split('T')[0]
  }
];

export const useLeaderboard = create<LeaderboardState>((set, get) => ({
  leaderboard: generateMockPlayers().sort((a, b) => b.totalXP - a.totalXP),
  consistencyLeaders: generateMockPlayers().sort((a, b) => b.consistencyScore - a.consistencyScore),
  streakLeaders: generateMockPlayers().sort((a, b) => b.longestStreak - a.longestStreak),
  lastUpdated: new Date().toISOString(),

  updateLeaderboard: () => {
    const players = generateMockPlayers();
    set({
      leaderboard: players.sort((a, b) => b.totalXP - a.totalXP),
      consistencyLeaders: players.sort((a, b) => b.consistencyScore - a.consistencyScore),
      streakLeaders: players.sort((a, b) => b.longestStreak - a.longestStreak),
      lastUpdated: new Date().toISOString()
    });
  },

  addPlayer: (player: LeaderboardPlayer) => {
    set((state) => {
      const existingIndex = state.leaderboard.findIndex(p => p.username === player.username);
      
      let updatedPlayers;
      if (existingIndex !== -1) {
        // Update existing player
        updatedPlayers = [...state.leaderboard];
        updatedPlayers[existingIndex] = player;
      } else {
        // Add new player
        updatedPlayers = [...state.leaderboard, player];
      }

      return {
        leaderboard: updatedPlayers.sort((a, b) => b.totalXP - a.totalXP),
        consistencyLeaders: updatedPlayers.sort((a, b) => b.consistencyScore - a.consistencyScore),
        streakLeaders: updatedPlayers.sort((a, b) => b.longestStreak - a.longestStreak),
        lastUpdated: new Date().toISOString()
      };
    });
  }
}));
