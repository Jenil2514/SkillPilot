import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type Course = {
  title: string;
  instructor: string;
  rating: number;
  reviewCount: string;
  price: string;
  image: string;
};

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);

  // Mock courses data - in a real app, this would come from an API
  const allCourses = [
    {
      title: "Complete Python Bootcamp From Zero to Hero",
      instructor: "Jose Portilla",
      rating: 4.5,
      reviewCount: "231,081",
      price: "₹3,549",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop"
    },
    {
      title: "The Complete Web Development Bootcamp",
      instructor: "Angela Yu",
      rating: 4.7,
      reviewCount: "189,432",
      price: "₹3,559",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop"
    },
    {
      title: "React - The Complete Guide",
      instructor: "Maximilian Schwarzmüller",
      rating: 4.6,
      reviewCount: "156,789",
      price: "₹2,999",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop"
    },
    {
      title: "JavaScript - The Complete Guide",
      instructor: "Maximilian Schwarzmüller",
      rating: 4.6,
      reviewCount: "89,234",
      price: "₹2,799",
      image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=300&fit=crop"
    },
    {
      title: "Node.js - The Complete Guide",
      instructor: "Maximilian Schwarzmüller",
      rating: 4.5,
      reviewCount: "67,891",
      price: "₹3,199",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop"
    },
    {
      title: "Machine Learning A-Z",
      instructor: "Kirill Eremenko",
      rating: 4.4,
      reviewCount: "98,765",
      price: "₹4,299",
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop"
    },
    {
      title: "AWS Certified Solutions Architect",
      instructor: "Stephane Maarek",
      rating: 4.6,
      reviewCount: "163,959",
      price: "₹399",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop"
    },
    {
      title: "Data Science and Machine Learning Bootcamp",
      instructor: "Jose Portilla",
      rating: 4.5,
      reviewCount: "75,432",
      price: "₹3,899",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop"
    },
    {
      title: "Flutter & Dart - The Complete Guide",
      instructor: "Maximilian Schwarzmüller",
      rating: 4.3,
      reviewCount: "45,123",
      price: "₹3,299",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop"
    },
    {
      title: "Docker and Kubernetes: The Complete Guide",
      instructor: "Stephen Grider",
      rating: 4.6,
      reviewCount: "52,876",
      price: "₹2,599",
      image: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=400&h=300&fit=crop"
    }
  ];

  useEffect(() => {
    if (searchQuery) {
      const filtered = allCourses.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCourses(filtered);
    } else {
      setFilteredCourses(allCourses);
    }
  }, [searchQuery]);

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
            {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course, index) => (
              <CourseCard key={index} {...course} />
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