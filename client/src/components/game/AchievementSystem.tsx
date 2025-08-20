import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { useCommitment } from "../../lib/stores/useCommitment";
import { Award, Crown, Star, Flame, Target, Zap, Trophy, Medal, Shield } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  type: 'bronze' | 'silver' | 'gold' | 'platinum';
  unlocked: boolean;
  progress: number;
  target: number;
  xpReward: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export default function AchievementSystem() {
  const { currentUser } = useCommitment();

  const achievements: Achievement[] = [
    {
      id: 'first_goal',
      title: 'First Step',
      description: 'Create your first DeFi commitment',
      icon: <Target className="w-5 h-5" />,
      type: 'bronze',
      unlocked: true,
      progress: 1,
      target: 1,
      xpReward: 50,
      rarity: 'common'
    },
    {
      id: 'streak_7',
      title: 'Week Warrior',
      description: 'Maintain a 7-day activity streak',
      icon: <Flame className="w-5 h-5" />,
      type: 'silver',
      unlocked: true,
      progress: 7,
      target: 7,
      xpReward: 100,
      rarity: 'common'
    },
    {
      id: 'level_5',
      title: 'Rising Star',
      description: 'Reach level 5',
      icon: <Star className="w-5 h-5" />,
      type: 'gold',
      unlocked: currentUser ? Math.floor(currentUser.totalXP / 100) + 1 >= 5 : false,
      progress: currentUser ? Math.floor(currentUser.totalXP / 100) + 1 : 0,
      target: 5,
      xpReward: 250,
      rarity: 'rare'
    },
    {
      id: 'goals_10',
      title: 'Commitment Master',
      description: 'Complete 10 DeFi goals',
      icon: <Trophy className="w-5 h-5" />,
      type: 'gold',
      unlocked: false,
      progress: 3,
      target: 10,
      xpReward: 300,
      rarity: 'rare'
    },
    {
      id: 'streak_30',
      title: 'Iron Will',
      description: 'Maintain a 30-day streak',
      icon: <Shield className="w-5 h-5" />,
      type: 'platinum',
      unlocked: false,
      progress: currentUser?.longestStreak || 0,
      target: 30,
      xpReward: 500,
      rarity: 'epic'
    },
    {
      id: 'perfect_month',
      title: 'Perfect Discipline',
      description: 'Complete all daily quests for 30 days',
      icon: <Crown className="w-5 h-5" />,
      type: 'platinum',
      unlocked: false,
      progress: 12,
      target: 30,
      xpReward: 750,
      rarity: 'legendary'
    },
    {
      id: 'community_hero',
      title: 'Community Hero',
      description: 'Help 50 users with accountability',
      icon: <Medal className="w-5 h-5" />,
      type: 'platinum',
      unlocked: false,
      progress: 8,
      target: 50,
      xpReward: 600,
      rarity: 'epic'
    },
    {
      id: 'defi_legend',
      title: 'DeFi Legend',
      description: 'Reach level 25 with 100+ completed goals',
      icon: <Crown className="w-5 h-5" />,
      type: 'platinum',
      unlocked: false,
      progress: 0,
      target: 1,
      xpReward: 1000,
      rarity: 'legendary'
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'bronze': return 'border-amber-600 bg-amber-600/20';
      case 'silver': return 'border-gray-400 bg-gray-400/20';
      case 'gold': return 'border-yellow-400 bg-yellow-400/20';
      case 'platinum': return 'border-purple-400 bg-purple-400/20';
      default: return 'border-gray-600 bg-gray-600/20';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  return (
    <Card className="bg-black/20 backdrop-blur-sm border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span className="flex items-center">
            <Award className="w-5 h-5 mr-2 text-purple-400" />
            Achievements
          </span>
          <Badge variant="outline" className="text-purple-300 border-purple-300">
            {unlockedAchievements.length}/{achievements.length}
          </Badge>
        </CardTitle>
        <p className="text-sm text-gray-400">
          Complete challenges and milestones to unlock achievements and earn XP
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Unlocked Achievements */}
        {unlockedAchievements.length > 0 && (
          <div>
            <h4 className="text-white font-medium mb-3 flex items-center">
              <Zap className="w-4 h-4 mr-2 text-green-400" />
              Unlocked ({unlockedAchievements.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {unlockedAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-lg border-2 ${getTypeColor(achievement.type)}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`${getRarityColor(achievement.rarity)} mt-1`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h5 className="text-white font-medium">{achievement.title}</h5>
                        <Badge variant="outline" className={`text-xs capitalize ${getRarityColor(achievement.rarity)} border-current`}>
                          {achievement.rarity}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-300 mb-2">{achievement.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-green-400">✓ Completed</span>
                        <span className="text-purple-300">+{achievement.xpReward} XP</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Locked Achievements */}
        <div>
          <h4 className="text-white font-medium mb-3 flex items-center">
            <Target className="w-4 h-4 mr-2 text-gray-400" />
            In Progress ({lockedAchievements.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {lockedAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className="p-4 rounded-lg border border-white/10 bg-white/5"
              >
                <div className="flex items-start space-x-3">
                  <div className="text-gray-500 mt-1">
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="text-gray-300 font-medium">{achievement.title}</h5>
                      <Badge variant="outline" className={`text-xs capitalize ${getRarityColor(achievement.rarity)} border-current opacity-60`}>
                        {achievement.rarity}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{achievement.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-purple-300">{achievement.progress}/{achievement.target}</span>
                      </div>
                      <Progress value={(achievement.progress / achievement.target) * 100} className="h-2" />
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 capitalize">{achievement.type} tier</span>
                        <span className="text-purple-300">+{achievement.xpReward} XP</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievement Stats */}
        <div className="pt-4 border-t border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-white">{unlockedAchievements.length}</p>
              <p className="text-xs text-purple-300">Unlocked</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {unlockedAchievements.reduce((sum, a) => sum + a.xpReward, 0)}
              </p>
              <p className="text-xs text-purple-300">XP Earned</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {unlockedAchievements.filter(a => a.rarity === 'rare' || a.rarity === 'epic').length}
              </p>
              <p className="text-xs text-purple-300">Rare+</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {Math.round((unlockedAchievements.length / achievements.length) * 100)}%
              </p>
              <p className="text-xs text-purple-300">Complete</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
