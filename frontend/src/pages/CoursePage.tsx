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

  if (loading) return <div>Loading...</div>;
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
