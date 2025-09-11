import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, User, Settings, LogOut, Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import axios from 'axios';

interface UserData {
  name: string;
  email: string;
  role: 'student' | 'university' | 'admin';
  avatar?: string;
}

const Header: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      try {
        const res = await axios.get("http://127.0.0.1:8080/api/v1/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = res.data;
        const imageUrl = userData.profile_image?.startsWith("http")
          ? userData.profile_image
          : `http://127.0.0.1:8080${userData.profile_image}`;

        setUser({
          name: userData.username,
          email: userData.email,
          role: userData.role || "student",
          avatar: imageUrl,
        });
      } catch (err) {
        console.error("Failed to fetch user in header:", err);
        localStorage.removeItem("access_token");
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl heading-academic">UniRepo</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/projects"
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/projects') ? 'text-primary' : 'text-muted-foreground'}`}
          >
            Projects
          </Link>
          <Link
            to="/forum"
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/forum') ? 'text-primary' : 'text-muted-foreground'}`}
          >
            Forum
          </Link>
          <Link
            to="/universities"
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/universities') ? 'text-primary' : 'text-muted-foreground'}`}
          >
            Universities
          </Link>
        </nav>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
  <Button variant="ghost" className="flex items-center space-x-2">
    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary">
      <img 
        src="https://i.pravatar.cc/150?img=3" // <-- default avatar URL
        alt="Default Avatar" 
        className="w-8 h-8 object-cover"
      />
    </div>
    <span className="hidden sm:block text-sm font-medium">{user?.name}</span>
  </Button>
</DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {user.role}
                  </Badge>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                {user.role !== 'student' && (
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center">
                      <Settings className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => {
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("user");
                    window.location.href = "/";
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Join as University</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
