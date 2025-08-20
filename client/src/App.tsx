import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAudio } from "./lib/stores/useAudio";
import { useAuth } from "./lib/stores/useAuth";
import LoginForm from "./components/auth/LoginForm";
import SignupForm from "./components/auth/SignupForm";
import Dashboard from "./components/game/Dashboard";
import GoalSetter from "./components/game/GoalSetter";
import QuestSystem from "./components/game/QuestSystem";
import Leaderboard from "./components/game/Leaderboard";
import SocialFeed from "./components/game/SocialFeed";
import { useCommitment } from "./lib/stores/useCommitment";
import { Button } from "./components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Trophy, Target, Users, Zap, LogOut } from "lucide-react";
import "@fontsource/inter";

const queryClient = new QueryClient();

function GameContent() {
  const { user: authUser, isAuthenticated, isLoading, error, login, signup, logout, clearError } = useAuth();
  const { currentUser, initializeUser } = useCommitment();
  const { toggleMute, isMuted } = useAudio();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    // Initialize commitment user when authenticated user exists
    if (isAuthenticated && authUser && !currentUser) {
      initializeUser(authUser.username);
    }
  }, [isAuthenticated, authUser, currentUser, initializeUser]);

  const handleLogin = async (username: string, password: string) => {
    clearError();
    await login(username, password);
  };

  const handleSignup = async (username: string, password: string) => {
    clearError();
    await signup(username, password);
  };

  const handleLogout = () => {
    logout();
    setActiveTab("dashboard");
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Processing...</p>
        </div>
      </div>
    );
  }

  // Show authentication screens if not authenticated
  if (!isAuthenticated) {
    if (authMode === 'signup') {
      return (
        <SignupForm
          onSignup={handleSignup}
          onSwitchToLogin={() => setAuthMode('login')}
          isLoading={isLoading}
          error={error || undefined}
        />
      );
    }
    
    return (
      <LoginForm
        onLogin={handleLogin}
        onSwitchToSignup={() => setAuthMode('signup')}
        isLoading={isLoading}
        error={error || undefined}
      />
    );
  }

  // Show loading if initializing game data
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading your DeFi Quest data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">DeFi Quest</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-white text-sm">
              <span className="text-purple-300">@{authUser?.username}</span>
              <span className="ml-2">Level {Math.floor(currentUser.totalXP / 100) + 1}</span>
              <span className="ml-2">{currentUser.totalXP} XP</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              className="text-white hover:bg-white/10"
            >
              {isMuted ? "🔇" : "🔊"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-white hover:bg-white/10"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-black/20 backdrop-blur-sm border border-white/10">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Target className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="quests" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Zap className="w-4 h-4 mr-2" />
              Quests
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Trophy className="w-4 h-4 mr-2" />
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="social" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              Social
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <Dashboard />
            <GoalSetter />
          </TabsContent>

          <TabsContent value="quests">
            <QuestSystem />
          </TabsContent>

          <TabsContent value="leaderboard">
            <Leaderboard />
          </TabsContent>

          <TabsContent value="social">
            <SocialFeed />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GameContent />
    </QueryClientProvider>
  );
}

export default App;
