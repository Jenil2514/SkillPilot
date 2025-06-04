import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Users, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import courseService, { Course } from '@/services/courseService';

const FeaturedCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        const data = await courseService.getCourses();
        setCourses(Array.isArray(data) ? data.slice(0, 6) : []);
      } catch (error) {
        console.log('API call failed, using mock data:', error);
        setCourses([
          {
            _id: '1',
            name: 'Complete Web Development Bootcamp',
            description: 'Learn HTML, CSS, JavaScript, React, Node.js and more',
            image: '/placeholder.svg',
            views: 15420,
            checkpoints: [],
            resources: []
          },
          {
            _id: '2',
            name: 'Data Science and Machine Learning Masterclass',
            description: 'Become a data scientist and learn machine learning algorithms',
            image: '/placeholder.svg',
            views: 12870,
            checkpoints: [],
            resources: []
          },
          {
            _id: '3',
            name: 'The Ultimate Digital Marketing Course',
            description: 'Master digital marketing, SEO, social media, and content marketing',
            image: '/placeholder.svg',
            views: 11230,
            checkpoints: [],
            resources: []
          },
          {
            _id: '4',
            name: 'Learn Ethical Hacking From Scratch',
            description: 'Start from zero and become an ethical hacker',
            image: '/placeholder.svg',
            views: 9870,
            checkpoints: [],
            resources: []
          },
          {
            _id: '5',
            name: 'The Complete Financial Analyst Course',
            description: 'Become a financial analyst and master financial modeling',
            image: '/placeholder.svg',
            views: 8540,
            checkpoints: [],
            resources: []
          },
          {
            _id: '6',
            name: 'The Complete iOS App Development Bootcamp',
            description: 'Learn iOS app development with Swift',
            image: '/placeholder.svg',
            views: 7210,
            checkpoints: [],
            resources: []
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCourses();
  }, []);

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
          {courses.map((course) => (
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
              </div>
              
              <CardHeader>
                <CardTitle className="text-xl">{course.name}</CardTitle>
                <p className="text-gray-600 dark:text-gray-300">{course.description}</p>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">4.8</span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">(1,234)</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Users className="h-4 w-4" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">{course.views}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">12 hours</span>
                  </div>
                  <Link 
                    to={`/course/${course._id}`}
                    className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors text-sm font-medium"
                  >
                    View Course
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
