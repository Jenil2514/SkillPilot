
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CourseCard from '@/components/CourseCard';
import { Button } from '@/components/ui/button';
import axios from 'axios';

interface Course {
  id: string;
  title: string;
  instructor: string;
  rating: number;
  reviewCount: string;
  price: string;
  image: string;
  badge?: string;
}

const SavedCourses = () => {
  const [savedCourses, setSavedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedCourses = async () => {
      try {
        const response = await axios.get('/api/users/saved-courses');
        setSavedCourses(response.data);
      } catch (error) {
        console.log('API call failed, using mock data:', error);
        // Mock data as fallback
        setSavedCourses([
          {
            id: "1",
            title: "Complete Web Development Bootcamp",
            instructor: "Dr. Angela Yu",
            rating: 4.7,
            reviewCount: "268,789",
            price: "$84.99",
            image: "/placeholder.svg",
            badge: "Bestseller"
          },
          {
            id: "2",
            title: "React - The Complete Guide",
            instructor: "Maximilian Schwarzmüller",
            rating: 4.6,
            reviewCount: "195,123",
            price: "$79.99",
            image: "/placeholder.svg"
          },
          {
            id: "3",
            title: "JavaScript: The Advanced Concepts",
            instructor: "Andrei Neagoie",
            rating: 4.8,
            reviewCount: "89,456",
            price: "$89.99",
            image: "/placeholder.svg",
            badge: "Hot & New"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedCourses();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading saved courses...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Saved Courses</h1>
          <p className="text-gray-600">Courses you've bookmarked for later</p>
        </div>

        {savedCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {savedCourses.map((course) => (
              <CourseCard
                key={course.id}
                title={course.title}
                instructor={course.instructor}
                rating={course.rating}
                reviewCount={course.reviewCount}
                price={course.price}
                image={course.image}
                badge={course.badge}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="mb-4">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto flex items-center justify-center">
                  <span className="text-4xl">📚</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">No saved courses yet</h2>
              <p className="text-gray-600 mb-6">
                Start exploring courses and save the ones you're interested in for later.
              </p>
              <Button className="bg-purple-600 hover:bg-purple-700">
                Browse Courses
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default SavedCourses;
