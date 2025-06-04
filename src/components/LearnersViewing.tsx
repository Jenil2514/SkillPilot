
import CourseCard from "./CourseCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const LearnersViewing = () => {
  const courses = [
    {
      title: "Days of Code: The Complete Python Pro Bootcamp",
      instructor: "Jose Portilla, Pierian Training",
      rating: 4.3,
      reviewCount: "231,081",
      price: "₹3,549",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop"
    },
    {
      title: "The Complete Full-Stack Web Development Bootcamp",
      instructor: "Jose Portilla, Pierian Training",
      rating: 4.2,
      reviewCount: "231,081",
      price: "₹3,559",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop"
    },
    {
      title: "[NEW] Ultimate AWS Certified Cloud Practitioner CLF-C02...",
      instructor: "Stephane Maarek, Ryan Academy",
      rating: 4.5,
      reviewCount: "15,258",
      price: "₹469",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop"
    },
    {
      title: "Ultimate AWS Certified Solutions Architect Associate...",
      instructor: "Maarek Analytics - 1,000,000+ Enrollments, Data...",
      rating: 4.6,
      reviewCount: "163,959",
      price: "₹399",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop"
    },
    {
      title: "The Complete Python Bootcamp From Zero to Hero in...",
      instructor: "FLI Education, Andrew Bayrshay",
      rating: 4.7,
      reviewCount: "132,786",
      price: "₹399",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop"
    }
  ];

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-600 dark:text-white mb-8">Learners are viewing</h2>
        
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

export default LearnersViewing;
