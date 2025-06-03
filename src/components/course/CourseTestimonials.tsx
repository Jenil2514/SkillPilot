
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const CourseTestimonials = () => {
  const testimonials = [
    {
      id: 1,
      content: "Taking this course was a great decision for me, as it boosted my confidence into finally doing something and feeling capable of being a solid web developer",
      author: "Diego José V.",
      course: "The Ultimate 2025 FullStack Web Development Bootcamp",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: 2,
      content: "Udemy was truly a game-changer and a great guide for me as we brought Dimensional to Udemy",
      author: "Alvin Lim",
      role: "Technical Co-Founder, CTO at Dimensional",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: 3,
      content: "Udemy was rated the most popular online course or certification program for learning how to code according to StackOverflow's 2023 Developer survey",
      source: "StackOverflow",
      responses: "37,076 responses collected",
      avatar: "https://cdn.sstatic.net/Sites/stackoverflow/img/apple-touch-icon.png"
    }
  ];

  return (
    <section className="py-12 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">What other learners are saying</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-white text-gray-900">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">"</div>
                <p className="mb-6 text-gray-700">{testimonial.content}</p>
                
                <div className="flex items-center space-x-3">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    {testimonial.course && (
                      <p className="text-sm text-gray-600">Review from {testimonial.course}</p>
                    )}
                    {testimonial.role && (
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    )}
                    {testimonial.responses && (
                      <p className="text-sm text-gray-600">{testimonial.responses}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseTestimonials;
