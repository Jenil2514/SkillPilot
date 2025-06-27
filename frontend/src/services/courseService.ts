import { Resource, checkpoints } from '@/components/types/type';
import api from './api';

export interface Course {
  _id: string;
  name: string;
  description: string;
  image: string;
  views: number;
  checkpoints: checkpoints[];
  resources: Resource[];
  badge: string;
}

class CourseService {
  async getCourses(): Promise<Course[]> {
    const response = await api.get('/courses'); // '/api/courses' handled by baseURL
    return response.data;
  }

  async getCourseById(id: string): Promise<Course> {
    const response = await api.get(`/courses/${id}`); // '/api/courses/:id'
    return response.data;
  }

  async saveCourse(courseId: string): Promise<{ message: string }> {
    const response = await api.post(`/users/save/${courseId}`); // '/api/users/save/:courseId'
    return response.data;
  }

  async unsaveCourse(courseId: string): Promise<{ message: string }> {
    const response = await api.delete(`/users/unsave/${courseId}`); // '/api/users/unsave/:courseId'
    return response.data;
  }

  async getSavedCourses(): Promise<Course[]> {
    const response = await api.get('/users/saved'); // '/api/users/saved'
    return response.data;
  }

  async updateProgress(courseId: string, checkpointId: string): Promise<void> {
    await api.post(`/courses/${courseId}/progress`, { checkpointId }); // '/api/courses/:courseId/progress'
  }
}

export default new CourseService();
