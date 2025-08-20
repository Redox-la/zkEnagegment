import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export interface AuthUser {
  id: number;
  username: string;
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  level: number;
  goalsCompleted: number;
  consistencyScore: number;
  joinDate: string;
  lastActive: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuth = create<AuthState>()(
  subscribeWithSelector((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    login: async (username: string, password: string) => {
      set({ isLoading: true, error: null });
      
      try {
        // Check for demo accounts first
        if ((username === 'demo' || username === 'alice') && password === 'password') {
          const demoUser: AuthUser = {
            id: username === 'demo' ? 1 : 2,
            username,
            totalXP: username === 'demo' ? 350 : 275,
            currentStreak: username === 'demo' ? 7 : 5,
            longestStreak: username === 'demo' ? 15 : 12,
            level: username === 'demo' ? 4 : 3,
            goalsCompleted: username === 'demo' ? 3 : 2,
            consistencyScore: username === 'demo' ? 87 : 82,
            joinDate: new Date().toISOString(),
            lastActive: new Date().toISOString()
          };
          
          localStorage.setItem('defi-quest-auth', JSON.stringify(demoUser));
          set({ user: demoUser, isAuthenticated: true, isLoading: false });
          return;
        }

        // Check localStorage for existing user
        const existingUsers = JSON.parse(localStorage.getItem('defi-quest-users') || '{}');
        const storedUser = existingUsers[username];
        
        if (storedUser && storedUser.password === password) {
          const authUser: AuthUser = {
            id: storedUser.id,
            username: storedUser.username,
            totalXP: storedUser.totalXP || 0,
            currentStreak: storedUser.currentStreak || 1,
            longestStreak: storedUser.longestStreak || 1,
            level: storedUser.level || 1,
            goalsCompleted: storedUser.goalsCompleted || 0,
            consistencyScore: storedUser.consistencyScore || 0,
            joinDate: storedUser.joinDate || new Date().toISOString(),
            lastActive: new Date().toISOString()
          };
          
          localStorage.setItem('defi-quest-auth', JSON.stringify(authUser));
          set({ user: authUser, isAuthenticated: true, isLoading: false });
        } else {
          set({ error: 'Invalid username or password', isLoading: false });
        }
      } catch (error) {
        set({ error: 'Login failed. Please try again.', isLoading: false });
      }
    },

    signup: async (username: string, password: string) => {
      set({ isLoading: true, error: null });
      
      try {
        // Check if username already exists
        const existingUsers = JSON.parse(localStorage.getItem('defi-quest-users') || '{}');
        
        if (existingUsers[username]) {
          set({ error: 'Username already exists', isLoading: false });
          return;
        }

        // Create new user
        const newUser = {
          id: Date.now(),
          username,
          password,
          totalXP: 0,
          currentStreak: 1,
          longestStreak: 1,
          level: 1,
          goalsCompleted: 0,
          consistencyScore: 0,
          joinDate: new Date().toISOString(),
          lastActive: new Date().toISOString()
        };

        // Save to localStorage
        existingUsers[username] = newUser;
        localStorage.setItem('defi-quest-users', JSON.stringify(existingUsers));

        // Create auth user (without password)
        const authUser: AuthUser = {
          id: newUser.id,
          username: newUser.username,
          totalXP: newUser.totalXP,
          currentStreak: newUser.currentStreak,
          longestStreak: newUser.longestStreak,
          level: newUser.level,
          goalsCompleted: newUser.goalsCompleted,
          consistencyScore: newUser.consistencyScore,
          joinDate: newUser.joinDate,
          lastActive: newUser.lastActive
        };

        localStorage.setItem('defi-quest-auth', JSON.stringify(authUser));
        set({ user: authUser, isAuthenticated: true, isLoading: false });
      } catch (error) {
        set({ error: 'Signup failed. Please try again.', isLoading: false });
      }
    },

    logout: () => {
      localStorage.removeItem('defi-quest-auth');
      localStorage.removeItem('defi-quest-user'); // Clear old user data
      localStorage.removeItem('defi-quest-goals'); // Clear old goals data
      set({ user: null, isAuthenticated: false, error: null });
    },

    clearError: () => {
      set({ error: null });
    }
  }))
);

// Auto-login on app start if user data exists
const initializeAuth = () => {
  const storedAuth = localStorage.getItem('defi-quest-auth');
  if (storedAuth) {
    try {
      const user = JSON.parse(storedAuth);
      useAuth.setState({ user, isAuthenticated: true });
    } catch (error) {
      localStorage.removeItem('defi-quest-auth');
    }
  }
};

// Initialize auth on import
initializeAuth();