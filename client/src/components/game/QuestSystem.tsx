import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { useQuests } from "../../lib/stores/useQuests";
import { useCommitment } from "../../lib/stores/useCommitment";
import { Zap, Clock, CheckCircle, Star, Flame, Calendar } from "lucide-react";

export default function QuestSystem() {
  const { dailyQuests, weeklyQuests, completeQuest } = useQuests();
  const { addXP } = useCommitment();

  const handleCompleteQuest = (questId: string, xpReward: number) => {
    completeQuest(questId);
    addXP(xpReward);
  };

  const QuestCard = ({ quest, type }: { quest: any; type: 'daily' | 'weekly' }) => {
    const timeLeft = type === 'daily' ? 
      Math.max(0, 24 - new Date().getHours()) : 
      Math.max(0, 7 - new Date().getDay());

    return (
      <div className="p-4 bg-white/5 rounded-lg border border-white/10">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <Zap className="w-4 h-4 text-yellow-400 mr-2" />
              <h4 className="text-white font-medium">{quest.title}</h4>
              {quest.completed && <CheckCircle className="w-4 h-4 text-green-400 ml-2" />}
            </div>
            <p className="text-sm text-gray-400 mb-2">{quest.description}</p>
            <div className="flex items-center space-x-4 text-xs">
              <span className="text-purple-300 flex items-center">
                <Star className="w-3 h-3 mr-1" />
                {quest.xpReward} XP
              </span>
              <span className="text-blue-300 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {timeLeft} {type === 'daily' ? 'hours' : 'days'} left
              </span>
              {quest.difficulty && (
                <Badge variant={
                  quest.difficulty === 'easy' ? 'secondary' : 
                  quest.difficulty === 'medium' ? 'default' : 'destructive'
                } className="text-xs">
                  {quest.difficulty}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-300">Progress</span>
            <span className="text-purple-300">{quest.progress}/{quest.target}</span>
          </div>
          <Progress value={(quest.progress / quest.target) * 100} />
        </div>

        {quest.completed ? (
          <Button disabled className="w-full bg-green-600 text-white">
            <CheckCircle className="w-4 h-4 mr-2" />
            Completed
          </Button>
        ) : quest.progress >= quest.target ? (
          <Button
            onClick={() => handleCompleteQuest(quest.id, quest.xpReward)}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            <Zap className="w-4 h-4 mr-2" />
            Claim Reward
          </Button>
        ) : (
          <Button
            variant="outline"
            disabled
            className="w-full border-white/20 text-gray-400"
          >
            In Progress...
          </Button>
        )}
      </div>
    );
  };

  const completedDailyQuests = dailyQuests.filter(q => q.completed).length;
  const completedWeeklyQuests = weeklyQuests.filter(q => q.completed).length;

  return (
    <div className="space-y-6">
      {/* Quest Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-black/20 backdrop-blur-sm border-orange-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-300">Daily Streak</p>
                <p className="text-2xl font-bold text-white">7</p>
              </div>
              <Flame className="h-8 w-8 text-orange-400" />
            </div>
            <p className="text-xs text-orange-300">consecutive days</p>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-300">Daily Complete</p>
                <p className="text-2xl font-bold text-white">{completedDailyQuests}/{dailyQuests.length}</p>
              </div>
              <Zap className="h-8 w-8 text-purple-400" />
            </div>
            <p className="text-xs text-purple-300">quests finished</p>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-300">Weekly Complete</p>
                <p className="text-2xl font-bold text-white">{completedWeeklyQuests}/{weeklyQuests.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-400" />
            </div>
            <p className="text-xs text-blue-300">weekly challenges</p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Quests */}
      <Card className="bg-black/20 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Flame className="w-5 h-5 mr-2 text-orange-400" />
            Daily Quests
          </CardTitle>
          <p className="text-sm text-gray-400">Complete these before midnight to maintain your streak</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dailyQuests.map((quest) => (
              <QuestCard key={quest.id} quest={quest} type="daily" />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Quests */}
      <Card className="bg-black/20 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-400" />
            Weekly Challenges
          </CardTitle>
          <p className="text-sm text-gray-400">More challenging quests with bigger rewards</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {weeklyQuests.map((quest) => (
              <QuestCard key={quest.id} quest={quest} type="weekly" />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quest Tips */}
      <Card className="bg-black/20 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white text-lg">Quest Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p className="text-gray-300">Complete daily quests to maintain your streak and earn consistent XP</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p className="text-gray-300">Weekly challenges offer higher XP rewards but require more commitment</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p className="text-gray-300">ZK proofs verify your activities while keeping your strategies private</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p className="text-gray-300">Quest difficulty affects XP rewards - harder quests give more points</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
