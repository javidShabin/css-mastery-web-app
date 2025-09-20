import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Code, Trophy, Menu, Sun, Moon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import type { UserProgress, User } from "@shared/schema";

export default function Header() {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const { data: user } = useQuery<User>({
    queryKey: ["/api/user/default"]
  });

  const { data: progress } = useQuery<UserProgress[]>({
    queryKey: ["/api/progress", "default-user"]
  });

  const completedLessons = progress?.filter(p => p.completed).length || 0;
  const totalLessons = 24; // This should come from the lessons count in a real app

  const getInitials = (username: string) => {
    return username.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Code className="h-6 w-6 text-primary" />
              <Link href="/">
                <h1 className="text-xl font-bold text-foreground hover:text-primary transition-colors cursor-pointer" data-testid="title-header">
                  CSS Academy
                </h1>
              </Link>
            </div>
            
            {!isMobile && (
              <nav className="hidden md:flex space-x-6">
                <Link href="/">
                  <Button variant="ghost" size="sm" data-testid="nav-dashboard">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/playground">
                  <Button variant="ghost" size="sm" data-testid="nav-playground">
                    Playground
                  </Button>
                </Link>
              </nav>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {!isMobile && (
              <div className="hidden sm:flex items-center space-x-2 text-sm text-muted-foreground">
                <Trophy className="h-4 w-4 text-accent" />
                <span data-testid="text-progress">
                  {completedLessons}/{totalLessons}
                </span>
                <span>Lessons Complete</span>
              </div>
            )}

            {/* Theme Toggle Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="h-8 w-8 p-0"
              data-testid="button-theme-toggle"
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                {user ? getInitials(user.username) : 'ST'}
              </AvatarFallback>
            </Avatar>

            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                data-testid="button-mobile-menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobile && mobileMenuOpen && (
          <div className="mt-4 pt-4 border-t border-border">
            <nav className="flex flex-col space-y-2">
              <Link href="/">
                <Button variant="ghost" size="sm" className="w-full justify-start" data-testid="mobile-nav-dashboard">
                  Dashboard
                </Button>
              </Link>
              <Link href="/playground">
                <Button variant="ghost" size="sm" className="w-full justify-start" data-testid="mobile-nav-playground">
                  Playground
                </Button>
              </Link>
            </nav>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Trophy className="h-4 w-4 text-accent" />
                <span data-testid="mobile-text-progress">
                  {completedLessons}/{totalLessons} Lessons Complete
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="h-8 w-8 p-0"
                data-testid="mobile-button-theme-toggle"
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
