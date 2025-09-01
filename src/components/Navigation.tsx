import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Shield, User, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isAdmin = user && ['admin@credimed.com', 'grant830318@gmail.com'].includes(user.email || '');

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <Shield className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">CrediMed</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  location.pathname === item.href ? "text-foreground" : "text-foreground/60"
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/privacy"
              className={cn(
                "transition-colors hover:text-foreground/80",
                location.pathname === "/privacy" ? "text-foreground" : "text-foreground/60"
              )}
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className={cn(
                "transition-colors hover:text-foreground/80",
                location.pathname === "/terms" ? "text-foreground" : "text-foreground/60"
              )}
            >
              Terms
            </Link>
            {isAdmin && (
              <Link to="/admin" className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
                location.pathname === "/admin" ? "text-primary" : "text-muted-foreground"
              )}>
                <Shield className="h-4 w-4" />
                Admin
              </Link>
            )}
          </nav>
        </div>

        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Link to="/" className="flex items-center space-x-2 md:hidden">
              <Shield className="h-6 w-6" />
              <span className="font-bold">CrediMed</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <Button asChild variant="outline">
              <Link to="/questionnaire">Compare Plans</Link>
            </Button>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    {user.user_metadata?.first_name || user.email}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    Profile
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <Shield className="h-4 w-4 mr-2" />
                      Admin Portal
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </div>
        </div>

        {isOpen && (
          <div className="fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] w-full grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 md:hidden">
            <div className="relative z-20 grid gap-6 rounded-md bg-popover p-4 text-popover-foreground shadow-md">
              <Link to="/" className="flex items-center space-x-2">
                <Shield className="h-6 w-6" />
                <span className="font-bold">CrediMed</span>
              </Link>
              <nav className="grid grid-flow-row auto-rows-max text-sm">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                {isAdmin && (
                  <Link to="/admin" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                    <Shield className="h-4 w-4" />
                    Admin
                  </Link>
                )}
              </nav>
              
              <div className="px-4 py-2 space-y-2">
                <Button asChild className="w-full">
                  <Link to="/questionnaire">Compare Plans</Link>
                </Button>
                
                {user ? (
                  <>
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/profile">Profile</Link>
                    </Button>
                    <Button onClick={handleSignOut} variant="ghost" className="w-full">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Button asChild className="w-full">
                    <Link to="/auth">Sign In</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navigation;