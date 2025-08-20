import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useLeaderboard } from "../../lib/stores/useLeaderboard";
import { useCommitment } from "../../lib/stores/useCommitment";
import { Trophy, Medal, Award, TrendingUp, Flame, Target, Zap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export default function Leaderboard() {
  const { leaderboard, consistencyLeaders, streakLeaders } = useLeaderboard();
  const { currentUser } = useCommitment();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <div className="w-5 h-5 flex items-center justify-center text-gray-400 font-bold">{rank}</div>;
    }
  };

  const getPlayerPosition = (username: string) => {
    const position = leaderboard.findIndex(player => player.username === username) + 1;
    return position === 0 ? 'Unranked' : `#${position}`;
  };

  const LeaderboardCard = ({ players, title, icon, description }: {
    players: any[];
    title: string;
    icon: React.ReactNode;
    description: string;
  }) => (
    <Card className="bg-black/20 backdrop-blur-sm border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
        </CardTitle>
        <p className="text-sm text-gray-400">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {players.map((player, index) => (
            <div
              key={player.username}
              className={`flex items-center justify-between p-3 rounded-lg ${
                player.username === currentUser?.username 
                  ? 'bg-purple-600/20 border border-purple-500/30' 
                  : 'bg-white/5'
              }`}
            >
              <div className="flex items-center space-x-3">
                {getRankIcon(index + 1)}
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs">
                    {player.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-white font-medium">{player.username}</p>
                  <p className="text-xs text-gray-400">Level {Math.floor(player.totalXP / 100) + 1}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-medium">{player.score}</p>
                <p className="text-xs text-purple-300">{player.metric}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Player's Current Position */}
      {currentUser && (
        <Card className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                    {currentUser.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-white font-bold text-lg">{currentUser.username}</h3>
                  <p className="text-purple-300">Your Current Standing</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{getPlayerPosition(currentUser.username)}</p>
                <p className="text-purple-300">Overall Rank</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leaderboard Tabs */}
      <Tabs defaultValue="overall" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-black/20 backdrop-blur-sm border border-white/10">
          <TabsTrigger value="overall" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            <TrendingUp className="w-4 h-4 mr-2" />
            Overall
          </TabsTrigger>
          <TabsTrigger value="consistency" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            <Target className="w-4 h-4 mr-2" />
            Consistency
          </TabsTrigger>
          <TabsTrigger value="streaks" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            <Flame className="w-4 h-4 mr-2" />
            Streaks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overall">
          <LeaderboardCard
            players={leaderboard.map(player => ({
              ...player,
              score: player.totalXP,
              metric: 'XP'
            }))}
            title="Overall Leaderboard"
            icon={<TrendingUp className="w-5 h-5 text-purple-400" />}
            description="Ranked by total experience points earned"
          />
        </TabsContent>

        <TabsContent value="consistency">
          <LeaderboardCard
            players={consistencyLeaders.map(player => ({
              ...player,
              score: `${player.consistencyScore}%`,
              metric: 'Consistency'
            }))}
            title="Consistency Champions"
            icon={<Target className="w-5 h-5 text-green-400" />}
            description="Ranked by goal completion rate and reliability"
          />
        </TabsContent>

        <TabsContent value="streaks">
          <LeaderboardCard
            players={streakLeaders.map(player => ({
              ...player,
              score: player.longestStreak,
              metric: 'Days'
            }))}
            title="Streak Masters"
            icon={<Flame className="w-5 h-5 text-orange-400" />}
            description="Ranked by longest activity streaks maintained"
          />
        </TabsContent>
      </Tabs>

      {/* Competition Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-black/20 backdrop-blur-sm border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-300">Active Players</p>
                <p className="text-2xl font-bold text-white">{leaderboard.length}</p>
              </div>
              <Zap className="h-8 w-8 text-purple-400" />
            </div>
            <p className="text-xs text-purple-300">in the competition</p>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-300">Total Goals</p>
                <p className="text-2xl font-bold text-white">1,247</p>
              </div>
              <Target className="h-8 w-8 text-green-400" />
            </div>
            <p className="text-xs text-green-300">commitments tracked</p>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-orange-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-300">Avg Streak</p>
                <p className="text-2xl font-bold text-white">12</p>
              </div>
              <Flame className="h-8 w-8 text-orange-400" />
            </div>
            <p className="text-xs text-orange-300">days maintained</p>
          </CardContent>
        </Card>
      </div>

      {/* Seasonal Competition Info */}
      <Card className="bg-black/20 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
            Current Season
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Season 1: "DeFi Pioneers"</span>
              <Badge variant="default" className="bg-purple-600">Active</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Time Remaining</span>
              <span className="text-purple-300">23 days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Prize Pool</span>
              <span className="text-green-400">Special NFT Badges</span>
            </div>
            <div className="text-sm text-gray-400">
              <p>Compete for exclusive season rewards based on consistency and achievement completion. 
              Top performers get unique NFT badges and early access to new features!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
