import React, { useState } from 'react';
import Header from '@/components/Header';
import CategorySelector from '@/components/category/CategorySelector';
import UniversityBrowser from '@/components/category/UniversityBrowser';
import CourseViewer from '@/components/category/CourseViewer';

export type Category = 'university' | 'business' | 'technology' | 'design' | 'marketing';

const CategoryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('university');
  const [selectedUniversity, setSelectedUniversity] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<string>('');

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setSelectedUniversity('');
    setSelectedSemester('');
    setSelectedCourse('');
  };

  const handleUniversitySelect = (university: string) => {
    setSelectedUniversity(university);
    setSelectedSemester('');
    setSelectedCourse('');
  };

  const handleSemesterCourseSelect = (semester: string, course: string) => {
    setSelectedSemester(semester);
    setSelectedCourse(course);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 dark:bg-background">
          {/* Category Selector */}
          <div className="lg:col-span-3 bg-gray-50 dark:bg-background">
            <CategorySelector 
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
            />
          </div>

          {/* University Browser */}
          {selectedCategory === 'university' && (
            <div className="lg:col-span-3">
              <UniversityBrowser
                selectedUniversity={selectedUniversity}
                onUniversitySelect={handleUniversitySelect}
                onSemesterCourseSelect={handleSemesterCourseSelect}
              />
            </div>
          )}

          {/* Course Content */}
          {selectedCategory === 'university' && selectedCourse && (
            <div className="lg:col-span-6">
              <CourseViewer
                university={selectedUniversity}
                semester={selectedSemester}
                course={selectedCourse}
              />
            </div>
          )}

          {/* Other Categories Content */}
          {selectedCategory !== 'university' && (
            <div className="lg:col-span-9">
              <div className="bg-background rounded-lg p-8 text-center ">
                <h2 className="text-2xl font-bold text-gray-800 dark:white mb-4">
                  {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Category
                </h2>
                <p className="text-gray-600 dark:text-white">
                  Content for {selectedCategory} category coming soon...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
