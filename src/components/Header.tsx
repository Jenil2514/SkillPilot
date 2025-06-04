
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart, Globe, User, Bookmark } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <Link to="/">
              <h1 className="text-2xl font-bold text-purple-600">EduLearn</h1>
            </Link>
            
            {/* Categories */}
            <nav className="hidden md:flex space-x-6">
              <Link to="/categories" className="text-gray-700 hover:text-purple-600 transition-colors">
                Categories
              </Link>
              <Link to="/social" className="text-gray-700 hover:text-purple-600 transition-colors">
                Community
              </Link>
              <Link to="/shorts" className="text-gray-700 hover:text-purple-600 transition-colors">
                Shorts
              </Link>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-8 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search for anything" 
                className="pl-10 w-full border-black"
              />
            </div>
          </div>

          {/* Right Navigation */}
          <div className="flex items-center space-x-4">
            <button className="hidden lg:block text-gray-700 hover:text-purple-600 transition-colors">
              Plans & Pricing
            </button>
            <button className="hidden lg:block text-gray-700 hover:text-purple-600 transition-colors">
              EduLearn Business
            </button>
            <button className="hidden lg:block text-gray-700 hover:text-purple-600 transition-colors">
              Teach on EduLearn
            </button>
            <Link to="/saved-courses" className="p-2">
              <Bookmark className="h-5 w-5 text-gray-700" />
            </Link>
            <button className="p-2">
              <ShoppingCart className="h-5 w-5 text-gray-700" />
            </button>
            <Link to="/auth">
              <Button variant="outline" className="hidden md:inline-flex">
                Log in
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-purple-600 hover:bg-purple-700">
                Sign up
              </Button>
            </Link>
            <Link to="/profile" className="p-2">
              <User className="h-5 w-5 text-gray-700" />
            </Link>
            <button className="p-2">
              <Globe className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
