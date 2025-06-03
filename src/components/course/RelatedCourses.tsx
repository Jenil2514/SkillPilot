
import React from 'react';
import CourseCard from '@/components/CourseCard';

const RelatedCourses = () => {
  const relatedCourses = [
    {
      title: "The Complete Full-Stack Web Development Bootcamp",
      instructor: "Dr. Angela Yu, Developer and Lead Instructor",
      rating: 4.7,
      reviewCount: "439,456",
      price: "₹519",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop"
    },
    {
      title: "The Web Developer Bootcamp 2025",
      instructor: "Colt Steele",
      rating: 4.7,
      reviewCount: "281,043",
      price: "₹549",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop"
    },
    {
      title: "Web Development Masterclass - Online Certification Course",
      instructor: "YouAccel Training",
      rating: 4.5,
      reviewCount: "10,968",
      price: "₹549",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop"
    },
    {
      title: "The Complete Web Developer Course 3.0",
      instructor: "Rob Percival, Codestars - over 2 million students worldwide",
      rating: 4.4,
      reviewCount: "72,492",
      price: "₹779",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop"
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Discover more courses for Full Stack Web Developer careers</h2>
        
        <div className="flex flex-wrap gap-4 mb-8">
          <button className="px-4 py-2 bg-purple-600 text-white rounded-full text-sm">Web Development</button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-gray-300">JavaScript</button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-gray-300">HTML</button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-gray-300">CSS</button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-gray-300">Node.js</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedCourses.map((course, index) => (
            <CourseCard key={index} {...course} />
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Button variant="outline">Show all Web Development courses</Button>
        </div>
      </div>
    </section>
  );
};

export default RelatedCourses;
