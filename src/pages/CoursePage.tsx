
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CourseHeroSection from '@/components/course/CourseHeroSection';
import CourseContent from '@/components/course/CourseContent';
import CourseTestimonials from '@/components/course/CourseTestimonials';
import CourseFAQ from '@/components/course/CourseFAQ';
import RelatedCourses from '@/components/course/RelatedCourses';

const CoursePage = () => {
  const { courseId } = useParams();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <CourseHeroSection />
      <CourseContent />
      <CourseTestimonials />
      <CourseFAQ />
      <RelatedCourses />
      <Footer />
    </div>
  );
};

export default CoursePage;
