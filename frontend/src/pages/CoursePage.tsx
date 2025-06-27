import React, { useState ,useEffect} from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CourseHeroSection from '@/components/course/CourseHeroSection';
import CourseContent from '@/components/course/CourseContent';
import CourseFAQ from '@/components/course/CourseFAQ';
import LearnersViewing from '@/components/LearnersViewing';
import axios from 'axios';
import { CourseData } from '@/components/types/type';

// Skeleton Loader Components
const HeroSkeleton = () => (
  <section className="bg-gradient-to-r from-orange-400 to-yellow-400 py-16 animate-pulse">
    <div className="container mx-auto px-4">
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        <div className="text-white">
          <div className="bg-white p-8 max-w-md rounded-lg">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-full mb-6" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-6" />
            <div className="h-10 bg-gray-300 rounded w-full mb-4" />
          </div>
        </div>
        <div className="relative flex justify-center">
          <div className="bg-white rounded-lg flex flex-col items-center p-8 w-[500px] min-h-[256px] overflow-hidden">
            <div className="w-56 h-56 bg-gray-200 rounded-lg mb-4" />
          </div>
        </div>
      </div>
    </div>
  </section>
);

const ContentSkeleton = () => (
  <section className="py-12 bg-gray-50 animate-pulse">
    <div className="container mx-auto px-4">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg p-6 mb-4">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded mb-4" />
            ))}
          </div>
        </div>
        <div>
          <div className="bg-white rounded-lg p-6">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4" />
            <div className="h-4 bg-gray-100 rounded w-full mb-2" />
            <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
          </div>
        </div>
      </div>
    </div>
  </section>
);

const CoursePage = () => {
  const { courseId } = useParams();
    const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    const fetchCourse = async () => {
      try {
        // Increment view count (fire and forget)
        axios.patch(`${apiUrl}/api/courses/${courseId}/views`).catch(() => {});
        // Fetch course data
        const res = await axios.get(`${apiUrl}/api/courses/${courseId}`);
        setCourse(res.data);
        // console.log('Course data fetched:', res.data);
      } catch (err) {
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  if (loading) return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSkeleton />
      <ContentSkeleton />
      <Footer />
    </div>
  );
  if (!course) return <div>Course not found.</div>;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <CourseHeroSection course={course} />
      <CourseContent course={course}/>
      {/* <CourseTestimonials /> */}
      {/* <CourseFAQ /> */}
      <LearnersViewing />
      <Footer />
    </div>
  );
};

export default CoursePage;
