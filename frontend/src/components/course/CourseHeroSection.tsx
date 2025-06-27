import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { CourseData } from '../types/type';



type CourseHeroSectionProps = { course: CourseData };

const CourseHeroSection = ({ course }: CourseHeroSectionProps) => {

  const handleStartCourseClick = () => {
    window.scrollTo({
      top: window.innerHeight / 1.5,
      behavior: 'smooth',
    });
  };

  return (
    <section className="bg-gradient-to-r from-orange-400 to-yellow-400 py-16">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="text-white">
            <Card className="bg-white text-gray-900 p-8 max-w-md">
              <h1 className="text-3xl font-bold mb-4">
                {course.name}
              </h1>
              <p className="text-gray-600 mb-6">
                {course.description || 'Your career in full stack web development starts here. Fast-track learning and interview prep. Grow skills at your own pace. Unlock your earnings potential.'}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Users className="h-5 w-5 text-purple-600 mr-1" />
                    <span className="font-bold">{course.views}</span>
                  </div>
                  <p className="text-xs text-gray-600">average course Views</p>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">{course.resources.length}</div>
                  <p className="text-xs text-gray-600">No of Resources</p>
                </div>

              </div>

              <Button
                className="w-full bg-purple-600 hover:bg-purple-700 mb-4"
                onClick={handleStartCourseClick}
              >
                Start Course
              </Button>
              {/* <p className="text-sm text-gray-500">Starts at ₹850/mo. Cancel anytime.</p> */}
             
            </Card>
          </div>

          {/* Right Content - Instructor Image */}
          <div className="relative flex justify-center">
            <div className="bg-white rounded-lg flex flex-col items-center p-8 w-[500px] min-h-[256px] overflow-hidden">
              <img
                src={course.image || '/placeholder.svg'}
                alt="Instructor"
                className="object-cover rounded-lg w-56 h-56 mb-4"
              />
              {/* <div className="text-center">
      <h3 className="font-bold text-gray-900">Lead Instructor</h3>
      <p className="text-gray-600">Full Stack Developer Expert</p>
    </div> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseHeroSection;
