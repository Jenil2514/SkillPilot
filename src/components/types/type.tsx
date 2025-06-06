// types.ts
export interface Resource {
  _id: string;
  title: string;
  url: string;
  description: string;
  tags: string[];
  upvotes: number;
  comments: Comment[];
  AddedBy: string;
  type: 'video' | 'article' | 'documentation' | 'other';
}

export interface checkpoints{
  title: string;
  resources: Resource[];
}

export interface Comment {
  _id: string;
  user: string;
  content: string;
  timestamp: string;
}

export interface CourseData {
  _id: string;
  name: string;
  image: string;
  views: number;
  description: string;
  resources: Resource[];
  checkpoints: checkpoints[];
  instructor: string,
  badge: string,

}

export interface SemesterData {
  _id: string;
  number: number;
  courses: CourseData[];
}

export interface University {
  _id: string;
  name: string;
  semesters: SemesterData[];
}

export interface CourseViewerProps {
  university: University | null;
    selectedSemester: string | null;
    selectedCourse: string | null;
}
