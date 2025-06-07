// CategoryPage.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookMarked } from 'lucide-react';
import CourseCard from '@/components/CourseCard';


import Header from '@/components/Header';
import CategorySelector from '@/components/category/CategorySelector';
import UniversityBrowser from '@/components/category/UniversityBrowser';
import { CourseData } from '@/components/types/type';

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null); // category object
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [savedCourses, setSavedCourses] = useState<string[]>([]);
  const [savedCoursesLoading, setSavedCoursesLoading] = useState(true); // <-- Add this

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const apiUrl = import.meta.env.VITE_BACKEND_URI || 'http://localhost:5000';
        const res = await axios.get(`${apiUrl}/api/categories`);
        setCategories(res.data);

        // Default: first category
        if (res.data.length > 0) {
          setSelectedCategory(res.data[0]);
        }
      } catch (error) {
        console.error('Failed to load categories', error);
      }
    };

    // Fetch saved courses for logged-in user
    const fetchSavedCourses = async () => {
      try {
        const apiUrl = import.meta.env.VITE_BACKEND_URI || 'http://localhost:5000';
        const token = localStorage.getItem('token'); // adjust if you store token differently
        if (!token) return;
        const res = await axios.get(`${apiUrl}/api/users/saved`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSavedCourses(res.data.map((course: CourseData) => course._id));
      } catch (error) {
        setSavedCourses([]);
      } finally {
        setSavedCoursesLoading(false); // <-- Set loading to false
      }
    };

    fetchCategories();
    fetchSavedCourses();
  }, []);

  const handleCategorySelect = (categoryName) => {
    const found = categories.find((cat) => cat.name === categoryName);
    if (found) {
      setSelectedCategory(found);
      setSelectedUniversity('');
      setSelectedSemester('');
      setSelectedCourse('');
    }
  };

  const handleUniversitySelect = (universityId) => {
    setSelectedUniversity(universityId);
    setSelectedSemester('');
    setSelectedCourse('');
  };

  const handleSemesterCourseSelect = (semesterId, courseId) => {
    setSelectedSemester(semesterId);
    setSelectedCourse(courseId);
  };

  const handleToggleSave = async (courseId: string) => {
    const apiUrl = import.meta.env.VITE_BACKEND_URI || 'http://localhost:5000';
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      if (savedCourses.includes(courseId)) {
        // Unsave
        await axios.delete(`${apiUrl}/api/user/unsave/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSavedCourses(savedCourses.filter(id => id !== courseId));
      } else {
        // Save
        await axios.post(`${apiUrl}/api/user/save/${courseId}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSavedCourses([...savedCourses, courseId]);
      }
    } catch (error) {
      console.error('Failed to toggle save:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 dark:bg-background">
          {/* Category Selector */}
          <div className="lg:col-span-3 bg-gray-50 dark:bg-background">
            <CategorySelector
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
            />
          </div>

          {/* University Browser */}
          {selectedCategory?.type === 'university' && (
            <div className="lg:col-span-9">
              <UniversityBrowser
                universities={selectedCategory.universities || []}
                selectedUniversity={selectedUniversity}
                onUniversitySelect={handleUniversitySelect}
                onSemesterCourseSelect={handleSemesterCourseSelect}
              />
            </div>
          )}

          {/* Course Content
          {selectedCategory?.type === 'university' && selectedCourse && (
            <div className="lg:col-span-6">
              <CourseViewer
                university={selectedUniversity}
                semester={selectedSemester}
                course={selectedCourse}
              />
            </div>
          )} */}

          {/* Other Categories */}
          {selectedCategory && selectedCategory.type !== 'university' && (
            <div className="lg:col-span-9">
              <h2 className="text-2xl font-bold mb-4">{selectedCategory.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedCoursesLoading ? (
                  <p>Loading courses...</p>
                ) : (selectedCategory.courses?.length ?? 0) > 0 ? (
                  selectedCategory.courses.map((course: CourseData) => (
                    <CourseCard
                      key={course._id}
                      courseId={course._id}
                      title={course.name}
                      view={course.views}
                      image={course.image}
                      badge={course.badge}
                      initiallyBookmarked={savedCourses.includes(course._id)}
                    />
                  ))
                ) : (
                  <p>No courses available.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
