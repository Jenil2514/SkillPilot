
import CourseCard from "./CourseCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const FeaturedCourses = () => {
  const courses = [
    {
      title: "Photoshop masterclass with photoshop 2025 - all in...",
      instructor: "Film Sensei, Video School",
      rating: 4.5,
      reviewCount: "92,119",
      price: "₹699",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop",
      badge: "Bestseller"
    },
    {
      title: "The Ultimate drawing course - beginner to advanced",
      instructor: "Jaysen Batchelor, Quinton Batchelor",
      rating: 4.6,
      reviewCount: "124,696",
      price: "₹599",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop"
    },
    {
      title: "After effects CC masterclass: VFX, motion graphics, animation+",
      instructor: "Phil Ebiner, video school",
      rating: 4.5,
      reviewCount: "31,587",
      price: "₹599",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop"
    },
    {
      title: "Complete Blender creator: learn 3D modelling for...",
      instructor: "GameDev.tv Team, Rick Davidson",
      rating: 4.7,
      reviewCount: "66,455",
      price: "₹699",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop"
    },
    {
      title: "Character art school: the complete character drawing...",
      instructor: "Scott Harris, Pencil Kings",
      rating: 4.3,
      reviewCount: "231,081",
      price: "₹539",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop"
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="relative">
          {/* Navigation Arrows */}
          <button className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-black text-white rounded-full p-3 shadow-lg hover:bg-gray-800 transition-colors z-10">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-black text-white rounded-full p-3 shadow-lg hover:bg-gray-800 transition-colors z-10">
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Course Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {courses.map((course, index) => (
              <CourseCard key={index} {...course} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
