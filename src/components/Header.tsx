import { Button } from "@/components/ui/button";
import { Search, ShoppingCart, Globe, User, Bookmark } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import ProfileDropdown from "@/components/ProfileDropdown";
import { useAuth } from "@/hooks/useAuth";


const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();


  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <Link to="/">
              <h1 className="text-2xl font-bold text-purple-600">EduLearn</h1>
            </Link>

            {/* Categories */}
            <nav className="hidden md:flex space-x-10">
              <Link to="/categories" className="text-foreground hover:text-purple-600 transition-colors">
                Categories
              </Link>
              <Link to="/community" className="text-foreground hover:text-purple-600 transition-colors">
                Community
              </Link>
              <Link to="/contactUs" className="text-foreground hover:text-purple-600 transition-colors">
                Contact
              </Link>
              <Link
                to="/search"
                className="flex items-center space-x-1 text-foreground hover:text-purple-600 transition-colors"
              >
                <Search className="h-4 w-4" />
                <span>Search</span>
              </Link>
            </nav>
          </div>

          {/* Right Navigation */}
          <div className="flex items-center space-x-4">
            <Link to="/saved-courses" className="p-2">
              <Bookmark className="h-5 w-5 text-foreground" />
            </Link>
            
            {/* Conditional Login/Signup buttons */}
            {!isAuthenticated && (
              <>
                <Link to="/auth">
                  <Button variant="outline" className="hidden md:inline-flex">
                    Log in
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    Sign up
                  </Button>
                </Link>
              </>
            )}

            {/* Profile Dropdown */}
            <ProfileDropdown />
            <ThemeToggle />
            
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;