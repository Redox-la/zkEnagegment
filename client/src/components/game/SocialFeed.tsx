import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import { Users, MessageCircle, Heart, Share2, Trophy, Target, Flame, Plus } from "lucide-react";
import { useCommitment } from "../../lib/stores/useCommitment";

interface SocialPost {
  id: string;
  username: string;
  timestamp: string;
  type: 'achievement' | 'goal' | 'milestone' | 'update';
  content: string;
  likes: number;
  comments: number;
  shares: number;
  liked: boolean;
}

export default function SocialFeed() {
  const { currentUser } = useCommitment();
  const [newPost, setNewPost] = useState('');
  const [posts] = useState<SocialPost[]>([
    {
      id: '1',
      username: 'CryptoPro',
      timestamp: '2 hours ago',
      type: 'achievement',
      content: '🎉 Just completed my 30-day ETH holding challenge! Consistency pays off. The ZK proofs made it easy to verify without revealing my stack size.',
      likes: 24,
      comments: 8,
      shares: 3,
      liked: false
    },
    {
      id: '2',
      username: 'DeFiDegen',
      timestamp: '4 hours ago',
      type: 'milestone',
      content: '🔥 Hit a 50-day activity streak! Daily DCA has become a habit thanks to this platform. Who else is maintaining their consistency?',
      likes: 18,
      comments: 12,
      shares: 5,
      liked: true
    },
    {
      id: '3',
      username: 'YieldFarmer',
      timestamp: '6 hours ago',
      type: 'goal',
      content: 'Starting a new challenge: Stake 100% of my rewards for the next 3 months. Let\'s see if I can resist the urge to unstake early! 💪',
      likes: 15,
      comments: 6,
      shares: 2,
      liked: false
    },
    {
      id: '4',
      username: 'LiquidityKing',
      timestamp: '1 day ago',
      type: 'update',
      content: 'Halfway through my LP commitment! Market\'s been volatile but staying disciplined. The social accountability here is a game-changer.',
      likes: 31,
      comments: 14,
      shares: 7,
      liked: true
    },
    {
      id: '5',
      username: 'HODLQueen',
      timestamp: '1 day ago',
      type: 'achievement',
      content: '🏆 Level 5 reached! Started this journey 3 months ago with zero discipline. Now I\'m consistently hitting my DeFi goals. Thank you community!',
      likes: 42,
      comments: 19,
      shares: 8,
      liked: false
    }
  ]);

  const handlePost = () => {
    if (newPost.trim()) {
      // Add new post logic here
      console.log('New post:', newPost);
      setNewPost('');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return <Trophy className="w-4 h-4 text-yellow-400" />;
      case 'goal':
        return <Target className="w-4 h-4 text-blue-400" />;
      case 'milestone':
        return <Flame className="w-4 h-4 text-orange-400" />;
      default:
        return <MessageCircle className="w-4 h-4 text-purple-400" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      achievement: 'bg-yellow-600',
      goal: 'bg-blue-600',
      milestone: 'bg-orange-600',
      update: 'bg-purple-600'
    };
    return colors[type as keyof typeof colors] || colors.update;
  };

  return (
    <div className="space-y-6">
      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-black/20 backdrop-blur-sm border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-300">Active Members</p>
                <p className="text-2xl font-bold text-white">1,247</p>
              </div>
              <Users className="h-8 w-8 text-purple-400" />
            </div>
            <p className="text-xs text-purple-300">online now</p>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-300">Goals Shared</p>
                <p className="text-2xl font-bold text-white">3,891</p>
              </div>
              <Target className="h-8 w-8 text-green-400" />
            </div>
            <p className="text-xs text-green-300">this week</p>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-orange-500/30">
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-orange-300">Success Rate</p>
              <p className="text-2xl font-bold text-white">87%</p>
            </div>
            <p className="text-xs text-orange-300">goals completed</p>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-sm border-blue-500/30">
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-blue-300">Avg Streak</p>
              <p className="text-2xl font-bold text-white">23</p>
            </div>
            <p className="text-xs text-blue-300">days maintained</p>
          </CardContent>
        </Card>
      </div>

      {/* Create Post */}
      <Card className="bg-black/20 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Plus className="w-5 h-5 mr-2 text-purple-400" />
            Share Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs">
                {currentUser?.username.slice(0, 2).toUpperCase() || 'YU'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share your DeFi journey, achievements, or ask for accountability..."
                className="bg-black/20 border-white/20 text-white placeholder:text-gray-400"
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Badge variant="outline" className="text-xs">
                #DeFiGoals
              </Badge>
              <Badge variant="outline" className="text-xs">
                #Accountability
              </Badge>
            </div>
            <Button
              onClick={handlePost}
              disabled={!newPost.trim()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Post Update
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Social Feed */}
      <Card className="bg-black/20 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-400" />
            Community Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-start space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-green-500 text-white text-xs">
                      {post.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-white font-medium">{post.username}</span>
                      <Badge className={`${getTypeBadge(post.type)} text-xs flex items-center`}>
                        {getTypeIcon(post.type)}
                        <span className="ml-1 capitalize">{post.type}</span>
                      </Badge>
                      <span className="text-xs text-gray-400">{post.timestamp}</span>
                    </div>
                    
                    <p className="text-gray-300 mb-3">{post.content}</p>
                    
                    <div className="flex items-center space-x-6 text-sm">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`text-gray-400 hover:text-red-400 hover:bg-red-400/10 ${
                          post.liked ? 'text-red-400' : ''
                        }`}
                      >
                        <Heart className={`w-4 h-4 mr-1 ${post.liked ? 'fill-current' : ''}`} />
                        {post.likes}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-blue-400 hover:bg-blue-400/10"
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        {post.comments}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-green-400 hover:bg-green-400/10"
                      >
                        <Share2 className="w-4 h-4 mr-1" />
                        {post.shares}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Accountability Partners */}
      <Card className="bg-black/20 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Users className="w-5 h-5 mr-2 text-green-400" />
            Your Accountability Circle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {['CryptoPro', 'DeFiDegen', 'YieldFarmer'].map((username, index) => (
              <div key={username} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-500 text-white text-xs">
                      {username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-white font-medium">{username}</p>
                    <p className="text-xs text-gray-400">
                      {index === 0 ? 'Supporting 3 goals' : index === 1 ? 'Active streak buddy' : 'DCA accountability partner'}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                  Message
                </Button>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Plus className="w-4 h-4 mr-2" />
              Find Accountability Partners
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
