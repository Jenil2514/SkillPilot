import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios"; // <-- Add this line
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { CourseData } from "@/components/types/type"; // Adjust the import path as needed


const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [allCourses, setAllCourses] = useState<CourseData[]>([]);
  const [savedCourses, setSavedCourses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      const ApiUrl = import.meta.env.VITE_BACKEND_URI || "";
      try {
        const res = await axios.get(`${ApiUrl}/api/courses`);
        const courses = Array.isArray(res.data) ? res.data : [];
        setAllCourses(courses);
      } catch (err: any) {
        setError("Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Fetch saved courses for the user
  useEffect(() => {
    const fetchSavedCourses = async () => {
      const ApiUrl = import.meta.env.VITE_BACKEND_URI || "";
      const token = localStorage.getItem("token"); // Adjust if you store token differently
      if (!token) return;
      try {
        const res = await axios.get(`${ApiUrl}/api/users/saved`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // res.data is an array of course objects, extract their _id
        setSavedCourses(res.data.map((course: any) => course._id));
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchSavedCourses();
  }, []);

  // Filter courses based on search query
  const displayedCourses = searchQuery
    ? allCourses.filter(course =>
        course.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allCourses;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim()) {
      setSearchParams({ q: e.target.value });
    }
  };

  // Add this handler in SearchPage
  const handleBookmarkToggle = async (courseId: string, currentlyBookmarked: boolean) => {
    const ApiUrl = import.meta.env.VITE_BACKEND_URI || "";
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      if (currentlyBookmarked) {
        await axios.delete(`${ApiUrl}/api/users/unsave/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSavedCourses(prev => prev.filter(id => id !== courseId));
      } else {
        await axios.post(`${ApiUrl}/api/users/save/${courseId}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSavedCourses(prev => [...prev, courseId]);
      }
    } catch (err) {
      // Optionally handle error
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search for courses..."
                value={searchQuery}
                onChange={handleInputChange}
                className="pl-12 h-12 text-lg border-2 border-gray-300 focus:border-purple-600"
              />
            </div>
          </form>
        </div>

        {/* Results Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-300">
            {searchQuery ? `Search results for "${searchQuery}"` : 'All Courses'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {displayedCourses.length} course{displayedCourses.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Loading/Error State */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading courses...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : Array.isArray(displayedCourses) && displayedCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedCourses.map((course) => (
              <CourseCard
                key={course._id}
                courseId={course._id}
                title={course.name}
                view={course.views}
                image={course.image}
                badge={course.badge}
                initiallyBookmarked={savedCourses.includes(course._id)}
                onBookmarkToggle={handleBookmarkToggle} // Pass handler
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">No courses found</div>
            <p className="text-gray-400">Try searching with different keywords</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SearchPage;