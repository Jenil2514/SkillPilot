import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import CourseCard from "./CourseCard";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import { CourseData } from "./types/type";

const LearnersViewing = () => {
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/courses"); // Update the URL if needed
        // Sort courses by views descending (most viewed first)
        const sortedCourses = res.data.sort((a, b) => (b.views || 0) - (a.views || 0));
        setCourses(sortedCourses);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -clientWidth : clientWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-600 dark:text-white mb-8">Learners are viewing</h2>
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-black text-white rounded-full p-3 shadow-lg hover:bg-gray-800 transition-colors z-10"
            onClick={() => scroll("left")}
            aria-label="Scroll Left"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-black text-white rounded-full p-3 shadow-lg hover:bg-gray-800 transition-colors z-10"
            onClick={() => scroll("right")}
            aria-label="Scroll Right"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Horizontal Carousel */}
          <div
            ref={scrollRef}
            className="flex gap-6 py-2 custom-carousel"
            style={{ scrollBehavior: "smooth", overflowX: "hidden", pointerEvents: "none" }}
          >
            {loading ? (
              <div className="flex-1 text-center">Loading...</div>
            ) : (
              courses.map((course, index) => (
                <div
                  key={course._id || index}
                  className="min-w-[300px] max-w-xs flex-shrink-0"
                  style={{ pointerEvents: "auto" }} // Allow interaction with cards
                >
                  <CourseCard {...course} courseId={course._id} title={course.name} view={course.views}/>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LearnersViewing;
