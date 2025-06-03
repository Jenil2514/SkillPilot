
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface UniversityBrowserProps {
  selectedUniversity: string;
  onUniversitySelect: (university: string) => void;
  onSemesterCourseSelect: (semester: string, course: string) => void;
}

const UniversityBrowser = ({ 
  selectedUniversity, 
  onUniversitySelect, 
  onSemesterCourseSelect 
}: UniversityBrowserProps) => {
  const [openSemesters, setOpenSemesters] = useState<string[]>([]);

  const universities = [
    {
      id: 'mit',
      name: 'MIT',
      semesters: [
        {
          id: 'sem1',
          name: 'Semester 1',
          courses: ['Computer Science Fundamentals', 'Mathematics I', 'Physics I', 'English Composition']
        },
        {
          id: 'sem2',
          name: 'Semester 2',
          courses: ['Data Structures', 'Mathematics II', 'Physics II', 'Digital Logic']
        },
        {
          id: 'sem3',
          name: 'Semester 3',
          courses: ['Algorithms', 'Database Systems', 'Computer Networks', 'Operating Systems']
        }
      ]
    },
    {
      id: 'stanford',
      name: 'Stanford University',
      semesters: [
        {
          id: 'sem1',
          name: 'Semester 1',
          courses: ['Introduction to Programming', 'Calculus I', 'Chemistry', 'Critical Thinking']
        },
        {
          id: 'sem2',
          name: 'Semester 2',
          courses: ['Object-Oriented Programming', 'Calculus II', 'Statistics', 'Economics']
        }
      ]
    },
    {
      id: 'harvard',
      name: 'Harvard University',
      semesters: [
        {
          id: 'sem1',
          name: 'Semester 1',
          courses: ['CS50: Introduction to Computer Science', 'Linear Algebra', 'Philosophy', 'Writing & Communication']
        },
        {
          id: 'sem2',
          name: 'Semester 2',
          courses: ['Web Programming', 'Discrete Mathematics', 'Psychology', 'Research Methods']
        }
      ]
    }
  ];

  const toggleSemester = (semesterId: string) => {
    setOpenSemesters(prev =>
      prev.includes(semesterId)
        ? prev.filter(id => id !== semesterId)
        : [...prev, semesterId]
    );
  };

  const handleUniversityClick = (universityId: string) => {
    onUniversitySelect(universityId);
    // Clear semester selections when switching universities
    setOpenSemesters([]);
  };

  const selectedUniversityData = universities.find(u => u.id === selectedUniversity);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Universities</CardTitle>
      </CardHeader>
      <CardContent>
        {!selectedUniversity ? (
          <div className="space-y-2">
            {universities.map((university) => (
              <button
                key={university.id}
                onClick={() => handleUniversityClick(university.id)}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 text-left"
              >
                <span className="font-medium">{university.name}</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
            ))}
          </div>
        ) : (
          <div>
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
                  key={semester.id}
                  open={openSemesters.includes(semester.id)}
                  onOpenChange={() => toggleSemester(semester.id)}
                >
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100">
                      <span className="font-medium">{semester.name}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${
                        openSemesters.includes(semester.id) ? 'rotate-180' : ''
                      }`} />
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-4">
                    <div className="space-y-1 mt-2">
                      {semester.courses.map((course) => (
                        <button
                          key={course}
                          onClick={() => onSemesterCourseSelect(semester.name, course)}
                          className="w-full text-left p-2 rounded hover:bg-blue-50 text-sm"
                        >
                          {course}
                        </button>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UniversityBrowser;
