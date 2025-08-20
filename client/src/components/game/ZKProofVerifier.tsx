import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Shield, CheckCircle, AlertTriangle, Lock, Eye, EyeOff } from "lucide-react";
import { useCommitment } from "../../lib/stores/useCommitment";

interface ZKProof {
  id: string;
  goalId: string;
  proofHash: string;
  timestamp: string;
  verified: boolean;
  proofType: 'transaction' | 'balance' | 'position';
  description: string;
}

export default function ZKProofVerifier() {
  const { currentUser, activeGoals, updateGoalProgress } = useCommitment();
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState('');
  const [proofData, setProofData] = useState('');
  const [proofType, setProofType] = useState<'transaction' | 'balance' | 'position'>('transaction');
  const [showProofDetails, setShowProofDetails] = useState(false);

  // Mock ZK proofs for demonstration
  const [zkProofs] = useState<ZKProof[]>([
    {
      id: '1',
      goalId: 'goal1',
      proofHash: 'zk_0x7f9a2b8c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      verified: true,
      proofType: 'balance',
      description: 'Verified ETH holding without revealing exact amount'
    },
    {
      id: '2',
      goalId: 'goal2',
      proofHash: 'zk_0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      verified: true,
      proofType: 'transaction',
      description: 'Verified DCA transaction completion'
    }
  ]);

  const generateZKProof = async () => {
    if (!selectedGoal || !proofData) return;

    setIsGenerating(true);

    // Simulate ZK proof generation
    setTimeout(() => {
      const mockProofHash = `zk_0x${Math.random().toString(16).substr(2, 64)}`;
      
      // Update goal progress based on proof verification
      const progressIncrease = Math.floor(Math.random() * 30) + 10; // 10-40% progress
      updateGoalProgress(selectedGoal, progressIncrease);

      console.log('ZK Proof Generated:', {
        goalId: selectedGoal,
        proofHash: mockProofHash,
        proofType,
        verified: true
      });

      setIsGenerating(false);
      setProofData('');
      alert('ZK Proof generated and verified! Your progress has been updated.');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* ZK Proof Generator */}
      <Card className="bg-black/20 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Shield className="w-5 h-5 mr-2 text-green-400" />
            ZK Proof Generator
          </CardTitle>
          <p className="text-sm text-gray-400">
            Generate zero-knowledge proofs to verify your DeFi activities while keeping your data private
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="goal-select" className="text-white">Select Goal to Verify</Label>
            <select
              id="goal-select"
              value={selectedGoal}
              onChange={(e) => setSelectedGoal(e.target.value)}
              className="w-full mt-1 bg-black/20 border border-white/20 text-white rounded-md px-3 py-2"
            >
              <option value="">Choose a goal...</option>
              {activeGoals.map(goal => (
                <option key={goal.id} value={goal.id}>{goal.title}</option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="proof-type" className="text-white">Proof Type</Label>
            <select
              id="proof-type"
              value={proofType}
              onChange={(e) => setProofType(e.target.value as 'transaction' | 'balance' | 'position')}
              className="w-full mt-1 bg-black/20 border border-white/20 text-white rounded-md px-3 py-2"
            >
              <option value="transaction">Transaction Hash</option>
              <option value="balance">Wallet Balance</option>
              <option value="position">Position Holding</option>
            </select>
          </div>

          <div>
            <Label htmlFor="proof-data" className="text-white">Proof Data</Label>
            <Textarea
              id="proof-data"
              value={proofData}
              onChange={(e) => setProofData(e.target.value)}
              placeholder="Enter transaction hash, wallet address, or position details..."
              className="bg-black/20 border-white/20 text-white placeholder:text-gray-400"
              rows={3}
            />
            <p className="text-xs text-gray-400 mt-1">
              Your actual data will be encrypted and only the proof of completion will be stored
            </p>
          </div>

          <Button
            onClick={generateZKProof}
            disabled={!selectedGoal || !proofData || isGenerating}
            className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Generating ZK Proof...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Generate ZK Proof
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Privacy Explanation */}
      <Card className="bg-black/20 backdrop-blur-sm border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Lock className="w-5 h-5 mr-2 text-blue-400" />
            Privacy Protection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-gray-300">
                <strong className="text-white">Zero Knowledge:</strong> Proves you completed an action without revealing amounts, addresses, or strategies
              </p>
            </div>
            <div className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-gray-300">
                <strong className="text-white">Privacy First:</strong> Your transaction data and wallet balances remain completely private
              </p>
            </div>
            <div className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-gray-300">
                <strong className="text-white">Verifiable:</strong> Community can verify your commitment completion without seeing sensitive details
              </p>
            </div>
            <div className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-gray-300">
                <strong className="text-white">Secure:</strong> Uses cryptographic proofs that cannot be forged or manipulated
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent ZK Proofs */}
      <Card className="bg-black/20 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-green-400" />
              Recent ZK Proofs
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowProofDetails(!showProofDetails)}
              className="text-white hover:bg-white/10"
            >
              {showProofDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {zkProofs.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No ZK proofs generated yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {zkProofs.map((proof) => (
                <div key={proof.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant={proof.verified ? 'default' : 'secondary'} className="text-xs">
                          {proof.verified ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Pending
                            </>
                          )}
                        </Badge>
                        <Badge variant="outline" className="text-xs capitalize">
                          {proof.proofType}
                        </Badge>
                      </div>
                      <p className="text-white text-sm">{proof.description}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(proof.timestamp).toLocaleDateString()} at{' '}
                        {new Date(proof.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  
                  {showProofDetails && (
                    <div className="mt-3 p-2 bg-black/20 rounded text-xs">
                      <p className="text-gray-400 mb-1">Proof Hash:</p>
                      <p className="text-green-400 font-mono break-all">{proof.proofHash}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
