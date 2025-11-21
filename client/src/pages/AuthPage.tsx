import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export default function AuthPage() {
  const [location, setLocation] = useLocation();
  const [isLogin, setIsLogin] = useState(location === '/login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [society, setSociety] = useState('');
  const [flatNumber, setFlatNumber] = useState('');
  const [error, setError] = useState('');
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [societyRequestForm, setSocietyRequestForm] = useState({
    name: "",
    societyName: "",
    phone: "",
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    setIsLogin(location === '/login');
  }, [location]);

  const handleSocietyChange = (value: string) => {
    if (value === "other") {
      setRequestModalOpen(true);
      setSociety("");
    } else {
      setSociety(value);
    }
  };

  const handleSocietyRequest = async () => {
    if (!societyRequestForm.name.trim() || !societyRequestForm.societyName.trim() || !societyRequestForm.phone.trim()) {
      toast({
        title: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await apiRequest("POST", "/api/society-requests", societyRequestForm);
      if (!response.ok) throw new Error("Failed to submit request");

      toast({
        title: "Request submitted!",
        description: "We'll notify you when we start delivering to your society.",
      });
      setSocietyRequestForm({ name: "", societyName: "", phone: "" });
      setRequestModalOpen(false);
      setSociety("");
    } catch (error) {
      toast({
        title: "Failed to submit request",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';

    console.log('[AuthPage] Starting authentication:', { endpoint, email });

    // Include profile data for signup
    const requestData = isLogin
      ? { email, password }
      : {
          email,
          password,
          shippingName: name,
          shippingPhone: phone,
          shippingAddress: society,
          shippingFlatNumber: flatNumber
        };

    try {
      const response = await apiRequest('POST', endpoint, requestData);

      console.log('[AuthPage] Auth response received:', response.status);

      if (!response.ok) {
        const data = await response.json();
        console.error('[AuthPage] Auth failed:', data);
        throw new Error(data.error || 'Something went wrong');
      }

      // Get the session token from response
      const data = await response.json();
      console.log('[AuthPage] Auth successful, received token:', data.sessionToken);

      // CRITICAL: Store session token in localStorage for mobile auth
      if (data.sessionToken) {
        localStorage.setItem('sessionToken', data.sessionToken);
        console.log('[AuthPage] Token stored in localStorage');
      }

      console.log('[AuthPage] Clearing cache...');

      // Clear all cache and force immediate refetch
      queryClient.clear();

      // Wait longer for cookies to be set in WebView
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log('[AuthPage] Refetching user data...');

      // Force refetch auth state
      const result = await queryClient.refetchQueries({ queryKey: ["/api/auth/user"] });

      console.log('[AuthPage] Refetch result:', result);

      console.log('[AuthPage] Redirecting to home...');

      // Handle successful login/signup, redirect to home
      setLocation("/");
    } catch (err: any) {
      console.error('[AuthPage] Authentication error:', err);
      setError(err.message || 'Network error - please check your connection');
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

          {/* Additional fields for signup */}
          {!isLogin && (
            <>
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <Label htmlFor="society">Society Name</Label>
                <Select
                  value={society}
                  onValueChange={handleSocietyChange}
                  required
                >
                  <SelectTrigger id="society">
                    <SelectValue placeholder="Select your society" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Supertech Eco Village 2">
                      Supertech Eco Village 2
                    </SelectItem>
                    <SelectItem value="Ajnara Homes">Ajnara Homes</SelectItem>
                    <SelectItem value="Panchsheel Greens 1">
                      Panchsheel Greens 1
                    </SelectItem>
                    <SelectItem value="other">
                      Other / Not in List?
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="flatNumber">Flat/House Number</Label>
                <Input
                  id="flatNumber"
                  type="text"
                  value={flatNumber}
                  onChange={(e) => setFlatNumber(e.target.value)}
                  placeholder="Enter flat/house number (optional)"
                />
              </div>
            </>
          )}

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

      {/* Society Request Modal */}
      <Dialog open={requestModalOpen} onOpenChange={setRequestModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Delivery to Your Society</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="requestName">Your Name *</Label>
              <Input
                id="requestName"
                value={societyRequestForm.name}
                onChange={(e) =>
                  setSocietyRequestForm({ ...societyRequestForm, name: e.target.value })
                }
                placeholder="Enter your name"
              />
            </div>
            <div>
              <Label htmlFor="requestSociety">Society Name *</Label>
              <Input
                id="requestSociety"
                value={societyRequestForm.societyName}
                onChange={(e) =>
                  setSocietyRequestForm({ ...societyRequestForm, societyName: e.target.value })
                }
                placeholder="Enter your society name"
              />
            </div>
            <div>
              <Label htmlFor="requestPhone">Phone Number *</Label>
              <Input
                id="requestPhone"
                type="tel"
                value={societyRequestForm.phone}
                onChange={(e) =>
                  setSocietyRequestForm({ ...societyRequestForm, phone: e.target.value })
                }
                placeholder="Enter your phone number"
              />
            </div>
            <Button onClick={handleSocietyRequest} className="w-full">
              Submit Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
