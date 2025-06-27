import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {  Users,Book, Bookmark ,Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Resource ,CourseData } from './types/type';
import courseService, { Course } from '@/services/courseService';

const FeaturedCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedCourses, setSavedCourses] = useState<string[]>([]); // Track saved course IDs

  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        const data = await courseService.getCourses();
        setCourses(Array.isArray(data) ? data.slice(0, 6) : []);
        // Fetch saved courses for the logged-in user
        const token = localStorage.getItem('token');
        if (token) {
          const apiUrl = import.meta.env.VITE_BACKEND_URI || 'http://localhost:5000';
          const res = await axios.get(`${apiUrl}/api/users/saved`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setSavedCourses(res.data.map((c: CourseData) => c._id));
        }
      } catch (error) {
        console.log('API call failed, using mock data:', error);

      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCourses();
  }, []);


  const handleBookmark = async (
    e: React.MouseEvent,
    courseId: string,
    isSaved: boolean
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const token = localStorage.getItem('token');
    if (!token) {
      // Optionally, redirect to login or show a message
      return;
    }
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    try {
      if (isSaved) {
        await axios.delete(`${apiUrl}/api/users/unsave/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSavedCourses((prev) => prev.filter((id) => id !== courseId));
      } else {
        await axios.post(`${apiUrl}/api/users/save/${courseId}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSavedCourses((prev) => [...prev, courseId]);
      }
    } catch (err) {
      // Optionally handle error (e.g., show a toast)
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Featured Courses</h2>
            <p className="text-xl text-foreground">Loading courses...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Featured Courses</h2>
          <p className="text-xl text-foreground">Discover our most popular courses and start learning today</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses
            .filter(course => course.badge === 'featured') // Only show courses with badge 'featured'
            .map((course) => {
              const isSaved = savedCourses.includes(course._id);
              return (
                <Card key={course._id} className="hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={course.image || '/placeholder.svg'}
                      alt={course.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Badge className="absolute top-4 left-4 bg-purple-600 text-white">
                      Featured
                    </Badge>
                    <button
                      onClick={(e) => handleBookmark(e, course._id, isSaved)}
                      className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
                    >
                      <Bookmark
                        className={`h-4 w-4 ${isSaved ? 'fill-purple-600 text-purple-600' : 'text-gray-600'}`}
                      />
                    </button>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{course.name}</CardTitle>
                    <p className="text-gray-600 dark:text-gray-300">{course.description}</p>
                  </CardHeader>

                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1">
                        <Book className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Resources</span>
                        <span className="text-3x1 text-gray-600 dark:text-gray-300">{course.resources.length}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Users className="h-4 w-4" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">{course.views > 1000 ? "1K+" : course.views}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Tag className="h-4 w-4" />
                        <div className="flex flex-wrap gap-1">
                          {(() => {
                            // Flatten all tags from resources, remove duplicates, and filter falsy
                            const tags = Array.from(
                              new Set(
                                course.resources
                                  .flatMap((resource: Resource) => resource.tags || [])
                                  .filter(Boolean)
                              )
                            );
                            const displayTags = tags.slice(0, 2);
                            return (
                              <>
                                {displayTags.map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded mr-1"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                                {tags.length > 2 && (
                                  <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded">
                                    +{tags.length - 2}
                                  </span>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      </div>
                      <button
                        className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors text-sm font-medium"
                      >
                        <Link to={`/course/${course._id}`}>View Course 
                        </Link>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
