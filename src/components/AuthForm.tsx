
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { loginUser, registerUser } from '@/db/users';
import { LogIn, UserPlus, Lock, Mail, User, Loader2 } from 'lucide-react';

const AuthForm = () => {
  const { login, register: registerAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    if (!email || !password) { toast.error('Please fill in all fields'); return; }
    
    setIsLoading(true);
    try {
      const user = loginUser(email, password);
      if (user) { login(user); toast.success('Welcome back!'); }
    } catch (error) {
      toast.error('Invalid credentials');
    } finally { setIsLoading(false); }
  };
  
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const name = formData.get('name') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    
    if (!email || !name || !password) { toast.error('Please fill in all fields'); return; }
    if (password !== confirmPassword) { toast.error('Passwords do not match'); return; }
    
    setIsLoading(true);
    try {
      const user = registerUser(email, name, password);
      if (user) { registerAuth(user); toast.success('Account created!'); }
    } catch (error) {
      toast.error('Registration failed');
    } finally { setIsLoading(false); }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 gradient-bg-subtle">
      <Card className="w-full max-w-md glass-card animate-fade-in rounded-2xl overflow-hidden">
        <CardHeader className="gradient-bg text-center py-8">
          <CardTitle className="font-display text-3xl font-bold text-primary-foreground">
            PaperScribe
          </CardTitle>
          <CardDescription className="text-primary-foreground/80 mt-1">
            AI-powered research paper summarizer
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 px-6">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 rounded-xl h-11">
              <TabsTrigger value="login" className="rounded-lg font-display font-medium">Login</TabsTrigger>
              <TabsTrigger value="register" className="rounded-lg font-display font-medium">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="email" name="email" type="email" placeholder="you@example.com" className="pl-10 rounded-lg" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="password" name="password" type="password" className="pl-10 rounded-lg" required />
                  </div>
                </div>
                <Button type="submit" className="w-full gradient-bg text-primary-foreground rounded-lg h-11 font-display font-semibold" disabled={isLoading}>
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in…</> : 'Login'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-foreground">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="name" name="name" placeholder="John Doe" className="pl-10 rounded-lg" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email" className="text-sm font-medium text-foreground">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="reg-email" name="email" type="email" placeholder="you@example.com" className="pl-10 rounded-lg" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password" className="text-sm font-medium text-foreground">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="reg-password" name="password" type="password" className="pl-10 rounded-lg" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="confirmPassword" name="confirmPassword" type="password" className="pl-10 rounded-lg" required />
                  </div>
                </div>
                <Button type="submit" className="w-full gradient-bg text-primary-foreground rounded-lg h-11 font-display font-semibold" disabled={isLoading}>
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account…</> : 'Register'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="justify-center pb-6">
          <p className="text-xs text-muted-foreground">
            By continuing, you agree to our Terms of Service
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthForm;
