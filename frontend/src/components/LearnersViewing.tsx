import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import CourseCard from "./CourseCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CourseData } from "./types/type";
import { useAuth } from "../hooks/useAuth"; // If you have an auth hook for token

const LearnersViewing = () => {
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedCourses, setSavedCourses] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Get token once at the top
  const token = localStorage.getItem("token");

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_BACKEND_URI || 'http://localhost:5000';
    const fetchCourses = async () => {
      try {
        if (!token) {
          console.error("No authentication token found");
          return;
        }
        const res = await axios.get(`${apiUrl}/api/courses`);
        const sortedCourses = res.data.sort((a, b) => (b.views || 0) - (a.views || 0));
        setCourses(sortedCourses);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchSavedCourses = async () => {
      if (!token) {
        console.error("No authentication token found");
        return;
      }
      try {
        const res = await axios.get(`${apiUrl}/api/users/saved`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSavedCourses(res.data.map((course: CourseData) => course._id));
      } catch (error) {
        setSavedCourses([]);
      }
    };

    fetchCourses();
    if (token) fetchSavedCourses();
  }, [token]);

  // Save/Unsave handlers
  const handleSave = async (courseId: string) => {
    if (!token) return;
    const apiUrl = import.meta.env.VITE_BACKEND_URI || 'http://localhost:5000';
    try {
      await axios.post(
        `${apiUrl}/api/users/save/${courseId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSavedCourses((prev) => [...prev, courseId]);
    } catch (error) {
      // handle error
    }
  };

  const handleUnsave = async (courseId: string) => {
    if (!token) return;
    const apiUrl = import.meta.env.VITE_BACKEND_URI || 'http://localhost:5000';
    try {
      await axios.delete(
        `${apiUrl}/api/users/unsave/${courseId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSavedCourses((prev) => prev.filter((id) => id !== courseId));
    } catch (error) {
      // handle error
    }
  };

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
                  <CourseCard
                    {...course}
                    courseId={course._id}
                    title={course.name}
                    view={course.views}
                    initiallyBookmarked={savedCourses.includes(course._id)}
                    
                  />
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
