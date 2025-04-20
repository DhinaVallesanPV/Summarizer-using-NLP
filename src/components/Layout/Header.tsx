
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuthStore();
  
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <header className="bg-white border-b border-border py-3 px-4 sm:px-6">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-brand-600">PaperScribe</h1>
        </div>
        
        {isAuthenticated && user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative p-0 h-8 w-8 rounded-full">
                <Avatar>
                  <AvatarFallback className="bg-brand-100 text-brand-800">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="p-2 text-sm font-medium">{user.name}</div>
              <div className="p-2 text-xs text-muted-foreground">{user.email}</div>
              <DropdownMenuItem onClick={() => logout()}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default Header;
