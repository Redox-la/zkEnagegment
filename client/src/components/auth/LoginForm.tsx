import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardHeader, CardContent, CardFooter } from "../ui/card";
import { Zap, Eye, EyeOff } from "lucide-react";

interface LoginFormProps {
  onLogin: (username: string, password: string) => Promise<void>;
  onSwitchToSignup: () => void;
  isLoading: boolean;
  error?: string;
}

export default function LoginForm({ onLogin, onSwitchToSignup, isLoading, error }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      await onLogin(username.trim(), password);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">DeFi Quest</h1>
          <p className="text-purple-200">Level up your DeFi game</p>
        </div>

        <Card className="bg-black/20 backdrop-blur-lg border-purple-500/20">
          <CardHeader>
            <h2 className="text-2xl font-bold text-white text-center">Welcome Back</h2>
            <p className="text-purple-200 text-center">Sign in to continue your DeFi journey</p>
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
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="bg-white/10 border-purple-500/30 text-white placeholder:text-gray-400"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
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
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                disabled={isLoading || !username.trim() || !password.trim()}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Demo accounts info */}
            <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-3 mt-4">
              <p className="text-blue-200 text-sm font-medium mb-2">Try Demo Accounts:</p>
              <div className="space-y-1 text-xs text-blue-300">
                <p>• Username: <span className="font-mono">demo</span> | Password: <span className="font-mono">password</span></p>
                <p>• Username: <span className="font-mono">alice</span> | Password: <span className="font-mono">password</span></p>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center">
              <span className="text-purple-200 text-sm">Don't have an account? </span>
              <Button
                variant="link"
                onClick={onSwitchToSignup}
                className="text-purple-400 hover:text-purple-300 p-0 h-auto"
                disabled={isLoading}
              >
                Sign up here
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}