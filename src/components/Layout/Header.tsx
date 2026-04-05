
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, User } from 'lucide-react';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuthStore();
  
  const getInitials = (name: string): string =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase();
  
  return (
    <header className="bg-card/80 backdrop-blur-xl border-b border-border sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center h-14 px-4">
        <h1 className="font-display text-xl font-bold gradient-text">Summarizer</h1>
        
        {isAuthenticated && user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative p-0 h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="gradient-bg text-primary-foreground font-display text-sm font-semibold">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-3 py-2">
                <p className="font-display font-medium text-sm text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()} className="text-destructive focus:text-destructive">
                <LogOut className="h-4 w-4 mr-2" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default Header;
