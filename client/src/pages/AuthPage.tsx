import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient'; // Import apiRequest for absolute URLs

export default function AuthPage() {
  const [location, setLocation] = useLocation();
  const [isLogin, setIsLogin] = useState(location === '/login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const queryClient = useQueryClient();

  useEffect(() => {
    setIsLogin(location === '/login');
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';

    try {
      const response = await apiRequest('POST', endpoint, { email, password });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Something went wrong');
      }

      // Clear all cache and force immediate refetch
      queryClient.clear();

      // Wait a moment for cookies to be set
      await new Promise(resolve => setTimeout(resolve, 100));

      // Force refetch auth state
      await queryClient.refetchQueries({ queryKey: ["/api/auth/user"] });

      // Handle successful login/signup, redirect to home
      setLocation("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setLocation(isLogin ? '/signup' : '/login');
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-center">{isLogin ? 'Login' : 'Sign Up'}</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <Button type="submit" className="w-full">
            {isLogin ? 'Login' : 'Sign Up'}
          </Button>
        </form>
        <p className="text-center text-sm">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={toggleForm} className="text-blue-500 hover:underline">
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
}
