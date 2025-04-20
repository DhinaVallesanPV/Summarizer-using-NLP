
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { loginUser, registerUser } from '@/db/users';
import { LogIn, UserPlus, Lock } from 'lucide-react';

const AuthForm = () => {
  const { login, register: registerAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    try {
      const user = loginUser(email, password);
      
      if (user) {
        login(user);
        toast.success('Logged in successfully');
      }
    } catch (error) {
      toast.error('Login failed');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const name = formData.get('name') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    
    if (!email || !name || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    try {
      const user = registerUser(email, name, password);
      
      if (user) {
        registerAuth(user);
        toast.success('Registered successfully');
      }
    } catch (error) {
      toast.error('Registration failed');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      <Card className="w-full max-w-md shadow-xl animate-fade-in border-indigo-100">
        <CardHeader className="space-y-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-center">PaperScribe</CardTitle>
          <CardDescription className="text-center text-indigo-100">
            The intelligent research paper summarizer
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-5">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-indigo-800">Email</Label>
                  <div className="relative">
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      placeholder="example@email.com" 
                      className="pl-10 border-indigo-200 focus:ring-indigo-500"
                      required 
                    />
                    <div className="absolute left-3 top-3 text-indigo-400">
                      <LogIn className="h-4 w-4" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-indigo-800">Password</Label>
                  <div className="relative">
                    <Input 
                      id="password" 
                      name="password" 
                      type="password" 
                      className="pl-10 border-indigo-200 focus:ring-indigo-500"
                      required 
                    />
                    <div className="absolute left-3 top-3 text-indigo-400">
                      <Lock className="h-4 w-4" />
                    </div>
                  </div>
                </div>
                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-indigo-800">Name</Label>
                  <div className="relative">
                    <Input 
                      id="name" 
                      name="name" 
                      placeholder="John Doe" 
                      className="pl-10 border-indigo-200 focus:ring-indigo-500"
                      required 
                    />
                    <div className="absolute left-3 top-3 text-indigo-400">
                      <UserPlus className="h-4 w-4" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email" className="text-indigo-800">Email</Label>
                  <div className="relative">
                    <Input 
                      id="reg-email" 
                      name="email" 
                      type="email" 
                      placeholder="example@email.com" 
                      className="pl-10 border-indigo-200 focus:ring-indigo-500"
                      required 
                    />
                    <div className="absolute left-3 top-3 text-indigo-400">
                      <LogIn className="h-4 w-4" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password" className="text-indigo-800">Password</Label>
                  <div className="relative">
                    <Input 
                      id="reg-password" 
                      name="password" 
                      type="password" 
                      className="pl-10 border-indigo-200 focus:ring-indigo-500"
                      required 
                    />
                    <div className="absolute left-3 top-3 text-indigo-400">
                      <Lock className="h-4 w-4" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-indigo-800">Confirm Password</Label>
                  <div className="relative">
                    <Input 
                      id="confirmPassword" 
                      name="confirmPassword" 
                      type="password" 
                      className="pl-10 border-indigo-200 focus:ring-indigo-500"
                      required 
                    />
                    <div className="absolute left-3 top-3 text-indigo-400">
                      <Lock className="h-4 w-4" />
                    </div>
                  </div>
                </div>
                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={isLoading}>
                  {isLoading ? 'Registering...' : 'Register'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="justify-center bg-gray-50 rounded-b-lg">
          <p className="text-sm text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthForm;
