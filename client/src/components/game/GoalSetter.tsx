import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { useCommitment } from "../../lib/stores/useCommitment";
import { Calendar, Target, Plus } from "lucide-react";
import { Badge } from "../ui/badge";

export default function GoalSetter() {
  const { addGoal, activeGoals } = useCommitment();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    duration: '',
    targetAmount: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.type || !formData.duration) return;

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + parseInt(formData.duration));

    const newGoal = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      type: formData.type as 'holding' | 'dca' | 'staking' | 'trading',
      startDate: new Date().toISOString(),
      endDate: endDate.toISOString(),
      targetAmount: formData.targetAmount ? parseFloat(formData.targetAmount) : undefined,
      progress: 0,
      xpReward: parseInt(formData.duration) * 10, // 10 XP per day
      completed: false,
    };

    addGoal(newGoal);
    setFormData({ title: '', description: '', type: '', duration: '', targetAmount: '' });
    setIsCreating(false);
  };

  const goalTypes = [
    { value: 'holding', label: 'Hold Position', description: 'Maintain a position for a set period' },
    { value: 'dca', label: 'DCA Strategy', description: 'Regular dollar-cost averaging' },
    { value: 'staking', label: 'Staking Commitment', description: 'Stake tokens for rewards' },
    { value: 'trading', label: 'Trading Goal', description: 'Complete specific trading activities' },
  ];

  return (
    <Card className="bg-black/20 backdrop-blur-sm border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span className="flex items-center">
            <Target className="w-5 h-5 mr-2 text-purple-400" />
            DeFi Commitments
          </span>
          <Button
            onClick={() => setIsCreating(!isCreating)}
            size="sm"
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="w-4 h-4 mr-1" />
            New Goal
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isCreating && (
          <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title" className="text-white">Goal Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Hold ETH for 30 days"
                  className="bg-black/20 border-white/20 text-white placeholder:text-gray-400"
                  required
                />
              </div>

              <div>
                <Label htmlFor="type" className="text-white">Goal Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger className="bg-black/20 border-white/20 text-white">
                    <SelectValue placeholder="Select goal type" />
                  </SelectTrigger>
                  <SelectContent>
                    {goalTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div>
                          <div className="font-medium">{type.label}</div>
                          <div className="text-xs text-gray-500">{type.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="duration" className="text-white">Duration (days)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="30"
                  min="1"
                  max="365"
                  className="bg-black/20 border-white/20 text-white placeholder:text-gray-400"
                  required
                />
              </div>

              <div>
                <Label htmlFor="targetAmount" className="text-white">Target Amount (optional)</Label>
                <Input
                  id="targetAmount"
                  type="number"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                  placeholder="e.g., 1.5"
                  step="0.01"
                  className="bg-black/20 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-white">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your commitment strategy..."
                className="bg-black/20 border-white/20 text-white placeholder:text-gray-400"
                rows={3}
              />
            </div>

            <div className="flex space-x-2">
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                Create Commitment
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreating(false)}
                className="border-white/20 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        {/* Active Goals List */}
        <div className="space-y-3">
          {activeGoals.map((goal) => {
            const daysLeft = Math.ceil((new Date(goal.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            const isExpired = daysLeft < 0;
            
            return (
              <div key={goal.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-white font-medium">{goal.title}</h4>
                    <p className="text-sm text-gray-400">{goal.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant={goal.type === 'holding' ? 'default' : 'secondary'} className="capitalize">
                      {goal.type}
                    </Badge>
                    {isExpired ? (
                      <Badge variant="destructive">Expired</Badge>
                    ) : (
                      <Badge variant="outline" className="text-blue-300 border-blue-300">
                        <Calendar className="w-3 h-3 mr-1" />
                        {daysLeft} days
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex justify-between text-sm text-purple-300">
                  <span>Progress: {goal.progress || 0}%</span>
                  <span>Reward: {goal.xpReward} XP</span>
                </div>
              </div>
            );
          })}

          {activeGoals.length === 0 && !isCreating && (
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No active commitments yet</p>
              <Button
                onClick={() => setIsCreating(true)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Create Your First Goal
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
