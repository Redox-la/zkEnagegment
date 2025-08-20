import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { useCommitment } from "../../lib/stores/useCommitment";
import { useQuests } from "../../lib/stores/useQuests";
import AchievementSystem from "./AchievementSystem";
import { Flame, Target, Zap, Clock, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const { currentUser, activeGoals } = useCommitment();
  const { dailyQuests, weeklyQuests } = useQuests();

  if (!currentUser) return null;

  const currentLevel = Math.floor(currentUser.totalXP / 100) + 1;
  const xpForNextLevel = (currentLevel * 100) - currentUser.totalXP;
  const levelProgress = ((currentUser.totalXP % 100) / 100) * 100;

  const completedDailyQuests = dailyQuests.filter(q => q.completed).length;
  const completedWeeklyQuests = weeklyQuests.filter(q => q.completed).length;

  return (
    <div className="space-y-6">
      {/* User Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-black/20 backdrop-blur-sm border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-300">Level</p>
                <p className="text-2xl font-bold text-white">{currentLevel}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-400" />
            </div>
            <Progress value={levelProgress} className="mt-2" />
            <p className="text-xs text-purple-300 mt-1">{xpForNextLevel} XP to next level</p>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-300">Streak</p>
                <p className="text-2xl font-bold text-white">{currentUser.currentStreak}</p>
              </div>
              <Flame className="h-8 w-8 text-orange-400" />
            </div>
            <p className="text-xs text-blue-300">days active</p>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-300">Goals</p>
                <p className="text-2xl font-bold text-white">{activeGoals.length}</p>
              </div>
              <Target className="h-8 w-8 text-green-400" />
            </div>
            <p className="text-xs text-green-300">active commitments</p>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-yellow-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-300">Total XP</p>
                <p className="text-2xl font-bold text-white">{currentUser.totalXP}</p>
              </div>
              <Zap className="h-8 w-8 text-yellow-400" />
            </div>
            <p className="text-xs text-yellow-300">experience points</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Goals Overview */}
      <Card className="bg-black/20 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Target className="w-5 h-5 mr-2 text-purple-400" />
            Active Commitments
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeGoals.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              No active commitments. Set your first DeFi goal to start earning XP!
            </p>
          ) : (
            <div className="space-y-4">
              {activeGoals.slice(0, 3).map((goal) => {
                const progress = goal.progress || 0;
                const daysLeft = Math.ceil((new Date(goal.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                
                return (
                  <div key={goal.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-white font-medium">{goal.title}</h4>
                        <p className="text-sm text-gray-400">{goal.description}</p>
                      </div>
                      <Badge variant={goal.type === 'holding' ? 'default' : 'secondary'} className="capitalize">
                        {goal.type}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-purple-300">{progress}% complete</span>
                      <span className="text-blue-300 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {daysLeft} days left
                      </span>
                    </div>
                    <Progress value={progress} className="mt-2" />
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quest Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-black/20 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg">Daily Quests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-300">Progress</span>
              <span className="text-purple-300">{completedDailyQuests}/{dailyQuests.length}</span>
            </div>
            <Progress value={(completedDailyQuests / dailyQuests.length) * 100} />
            <p className="text-xs text-gray-400 mt-2">
              Complete daily quests to maintain your streak
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg">Weekly Quests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-300">Progress</span>
              <span className="text-blue-300">{completedWeeklyQuests}/{weeklyQuests.length}</span>
            </div>
            <Progress value={(completedWeeklyQuests / weeklyQuests.length) * 100} />
            <p className="text-xs text-gray-400 mt-2">
              Weekly challenges for bonus XP
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <AchievementSystem />
    </div>
  );
}
