import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardHeader, CardContent, CardFooter } from "../ui/card";
import { Zap, Eye, EyeOff, CheckCircle } from "lucide-react";

interface SignupFormProps {
  onSignup: (username: string, password: string) => Promise<void>;
  onSwitchToLogin: () => void;
  isLoading: boolean;
  error?: string;
}

export default function SignupForm({ onSignup, onSwitchToLogin, isLoading, error }: SignupFormProps) {
  const [username, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password.trim() && password === confirmPassword) {
      await onSignup(username.trim(), password);
    }
  };

  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  const isFormValid = username.trim() && password.trim() && passwordsMatch;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">DeFi Quest</h1>
          <p className="text-purple-200">Start your DeFi adventure</p>
        </div>

        <Card className="bg-black/20 backdrop-blur-lg border-purple-500/20">
          <CardHeader>
            <h2 className="text-2xl font-bold text-white text-center">Join the Quest</h2>
            <p className="text-purple-200 text-center">Create your account to begin your DeFi journey</p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Choose a username"
                  className="bg-white/10 border-purple-500/30 text-white placeholder:text-gray-400"
                  disabled={isLoading}
                  required
                />
                {username.length > 0 && username.length < 3 && (
                  <p className="text-orange-300 text-xs">Username must be at least 3 characters long</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    className="bg-white/10 border-purple-500/30 text-white placeholder:text-gray-400 pr-10"
                    disabled={isLoading}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {password.length > 0 && password.length < 6 && (
                  <p className="text-orange-300 text-xs">Password must be at least 6 characters long</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="bg-white/10 border-purple-500/30 text-white placeholder:text-gray-400 pr-10"
                    disabled={isLoading}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {confirmPassword.length > 0 && (
                  <div className="flex items-center space-x-2">
                    {passwordsMatch ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <p className="text-green-300 text-xs">Passwords match</p>
                      </>
                    ) : (
                      <p className="text-red-300 text-xs">Passwords don't match</p>
                    )}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                disabled={isLoading || !isFormValid}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            {/* Benefits info */}
            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 mt-4">
              <p className="text-green-200 text-sm font-medium mb-2">What you'll get:</p>
              <div className="space-y-1 text-xs text-green-300">
                <p>• Track your DeFi goals and progress</p>
                <p>• Complete daily and weekly quests</p>
                <p>• Earn XP and climb the leaderboards</p>
                <p>• Privacy-first with ZK proof verification</p>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center">
              <span className="text-purple-200 text-sm">Already have an account? </span>
              <Button
                variant="link"
                onClick={onSwitchToLogin}
                className="text-purple-400 hover:text-purple-300 p-0 h-auto"
                disabled={isLoading}
              >
                Sign in here
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}