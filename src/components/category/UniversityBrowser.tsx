import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Search } from 'lucide-react';
import CourseViewer from '@/components/category/CourseViewer';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { useEffect } from 'react';
import { University } from '@/components/types/type';
// import { Resource } from '@/components/types/type';
// import { Comment } from '@/components/types/type';
import { CourseData } from '@/components/types/type';



interface UniversityBrowserProps {
  universities: University[];
  selectedUniversity: string;
  onUniversitySelect: (university: string) => void;
  onSemesterCourseSelect: (semester: string, course: string) => void;
}

const UniversityBrowser = ({ universities, selectedUniversity, onUniversitySelect, onSemesterCourseSelect, }: UniversityBrowserProps) => {
  const [openSemesters, setOpenSemesters] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUniversities = universities.filter((university :University) =>
    university.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSemester = (semesterId: string) => {
    setOpenSemesters((prev) =>
      prev.includes(semesterId)
        ? prev.filter((id) => id !== semesterId)
        : [...prev, semesterId]
    );
  };

  const handleUniversityClick = (universityId: string) => {
    onUniversitySelect(universityId);
    setOpenSemesters([]);
  };
  const [selectedUniversityData, setSelectedUniversityData] = useState<University | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  useEffect(() => {
    const fetchUniversityData = async () => {
      if (!selectedUniversity) return;
      setLoading(true);
      try {
        const apiUrl = import.meta.env.VITE_BACKEND_URI || 'http://localhost:5000';
        const res = await axios.get(`${apiUrl}/api/universities/${selectedUniversity}`);
        setSelectedUniversityData(res.data);
      } catch (err) {
        console.error('Failed to fetch university data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversityData();
  }, [selectedUniversity]);
  // console.log(selectedUniversityData);
  return (
    <Card className="w-[900px] max-w-full mx-auto">
      <CardHeader>
        <CardTitle>University</CardTitle>
      </CardHeader>
      <CardContent>
        {!selectedUniversity ? (
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search universities..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* University List */}
            <div className="space-y-2">
              {filteredUniversities.map((university) => (
                <button
                  key={university._id}
                  onClick={() => handleUniversityClick(university._id)}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-purple-50 hover:bg-white hover:text-purple-600 text-left"
                >
                  <span className="font-medium">{university.name}</span>
                  <ChevronRight className="h-4 w-4 text-purple-600" />
                </button>
              ))}
              {filteredUniversities.length === 0 && (
                <p className="text-gray-500 text-center py-4">No universities found</p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex gap-6">
            {/* Left: Semester List */}
            <div className="w-1/2">
              <button
                onClick={() => onUniversitySelect('')}
                className="text-blue-600 hover:underline mb-4 text-sm"
              >
                ← Back to Universities
              </button>

              <h3 className="font-bold text-lg mb-4">{selectedUniversityData?.name}</h3>

              <div className="space-y-2">
                {selectedUniversityData?.semesters.map((semester) => (
                  <Collapsible
                    key={semester._id}
                    open={openSemesters.includes(semester._id)}
                    onOpenChange={() => toggleSemester(semester._id)}
                  >
                    <CollapsibleTrigger className="w-full">
                      <div className="flex items-center justify-between p-3 rounded-lg hover:bg-purple-50 hover:text-purple-600">
                        <span className="font-medium">Semester {semester.number}</span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${openSemesters.includes(semester._id) ? 'rotate-180' : ''}`}
                        />
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-4">
                      <div className="space-y-1 mt-2">
                        {semester.courses.map((course) => (
                          <button
                            key={course._id}
                            onClick={() => {
                              setSelectedSemester(String(semester.number));
                              setSelectedCourse(course._id);
                              onSemesterCourseSelect(String(semester.number), course._id);
                            }}
                            className="w-full text-left p-2 rounded hover:bg-blue-50 text-sm hover:bg-white hover:text-purple-600"
                          >
                            {course.name}
                          </button>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </div>

            {/* Right: Course Viewer */}
            <div className="w-1/2">
              {selectedCourse && selectedSemester && (
                <CourseViewer
                  university={selectedUniversityData}
                  selectedSemester={selectedSemester}
                  selectedCourse={selectedCourse}
                  />
                )}
            </div>
          </div>
        )}
        
      </CardContent>
    </Card>
  );
};

export default UniversityBrowser;
