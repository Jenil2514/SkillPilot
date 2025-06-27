import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CourseCard from '@/components/CourseCard';
import { Button } from '@/components/ui/button';
import courseService from '@/services/courseService';
import { CourseData, } from '@/components/types/type';
import { useNavigate } from 'react-router-dom';

// Skeleton Loader for SavedCourses
const SavedCoursesSkeleton = () => (
  <div className="container mx-auto px-4 py-8 animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-40 bg-gray-100 rounded mb-4" />
      ))}
    </div>
  </div>
);

const SavedCourses = () => {
  const [savedCourses, setSavedCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchSavedCourses = async () => {
      try {
        const courses = await courseService.getSavedCourses();
        // Transform the API response to match our CourseData interface
        const mappedCourses: CourseData[] = courses.map((course: CourseData) => ({
          ...course,
          instructor: course.instructor ?? '', // Provide default if missing
          badge: course.badge ?? '', // Provide default if missing
        }));
        setSavedCourses(mappedCourses);
      } catch (error) {
        console.log('API call failed, using mock data:', error);
        // Mock data as fallback
        ;
      } finally {
        setLoading(false);
      }
    };

    fetchSavedCourses();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <SavedCoursesSkeleton />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Saved Courses</h1>
          <p className="text-muted-foreground">Courses you've bookmarked for later</p>
        </div>

        {Array.isArray(savedCourses) && savedCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {savedCourses.map((course) => (
              <CourseCard
                courseId={course._id}
                title={course.name}
                view={course.views}
                image={course.image}
                badge={course.badge}
                initiallyBookmarked={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="mb-4">
                <div className="w-24 h-24 bg-muted rounded-full mx-auto flex items-center justify-center">
                  <span className="text-4xl">📚</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">No saved courses yet</h2>
              <p className="text-muted-foreground mb-6">
                Start exploring courses and save the ones you're interested in for later.
              </p>
              <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => navigate('/search')}>

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
