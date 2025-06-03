
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Star, Users, Clock, Award } from 'lucide-react';

const CourseHeroSection = () => {
  return (
    <section className="bg-gradient-to-r from-orange-400 to-yellow-400 py-16">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="text-white">
            <Card className="bg-white text-gray-900 p-8 max-w-md">
              <h1 className="text-3xl font-bold mb-4">
                Full Stack Web Developer Career Accelerator
              </h1>
              <p className="text-gray-600 mb-6">
                Your career in full stack web development starts here. Fast-track learning and interview prep. Grow skills at your own pace. Unlock your earnings potential.
              </p>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Star className="h-4 w-4 text-orange-500 fill-current mr-1" />
                    <span className="font-bold">4.7</span>
                  </div>
                  <p className="text-xs text-gray-600">average course rating</p>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">126</div>
                  <p className="text-xs text-gray-600">practice exercises</p>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">87.6</div>
                  <p className="text-xs text-gray-600">hours of content</p>
                </div>
              </div>

              <Button className="w-full bg-purple-600 hover:bg-purple-700 mb-4">
                Start subscription
              </Button>
              <p className="text-sm text-gray-500">Starts at ₹850/mo. Cancel anytime.</p>
              <p className="text-sm text-gray-600 mt-2">
                <Users className="h-4 w-4 inline mr-1" />
                1.5M learners already enrolled
              </p>
            </Card>
          </div>

          {/* Right Content - Instructor Image */}
          <div className="relative">
            <div className="bg-white rounded-lg p-8 max-w-md ml-auto">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
                alt="Instructor"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <div className="text-center">
                <h3 className="font-bold text-gray-900">Lead Instructor</h3>
                <p className="text-gray-600">Full Stack Developer Expert</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseHeroSection;
