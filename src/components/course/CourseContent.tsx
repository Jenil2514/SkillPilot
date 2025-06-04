import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Clock } from 'lucide-react';
import CourseTopicItem from './CourseTopicItem';
import axios from 'axios';

interface CourseLink {
  id: string;
  title: string;
  url: string;
  type: 'youtube' | 'github' | 'documentation' | 'article';
  upvotes: number;
  comments: Comment[];
}

interface Comment {
  id: string;
  user: string;
  content: string;
  timestamp: string;
}

interface CourseTopic {
  id: string;
  title: string;
  description: string;
  links: CourseLink[];
  isCompleted: boolean;
}

const CourseContent = () => {
  const [openSections, setOpenSections] = useState<string[]>(['01']);
  const [upvotedLinks, setUpvotedLinks] = useState<string[]>([]);
  const [showComments, setShowComments] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [completedTopics, setCompletedTopics] = useState<string[]>(['01']);
  const [courseTopics, setCourseTopics] = useState<CourseTopic[]>([]);
  const [loading, setLoading] = useState(true);

  // API call to fetch course content
  useEffect(() => {
    const fetchCourseContent = async () => {
      try {
        // Temporary API endpoint - replace with actual backend URL
        const response = await axios.get('/api/courses/1/content');
        // Ensure response.data is an array
        const topicsData = Array.isArray(response.data) ? response.data : [];
        setCourseTopics(topicsData);
      } catch (error) {
        console.log('API call failed, using mock data:', error);
        // Mock data as fallback - ensure it's always an array
        setCourseTopics([
          {
            id: '01',
            title: 'Introduction to Web Development',
            description: 'Learn web architecture essentials and set up the development environment.',
            isCompleted: true,
            links: [
              {
                id: '1',
                title: 'HTML Basics Tutorial',
                url: 'https://www.youtube.com/watch?v=example1',
                type: 'youtube',
                upvotes: 42,
                comments: [
                  { id: '1', user: 'John Doe', content: 'Great explanation of HTML fundamentals!', timestamp: '2 hours ago' },
                  { id: '2', user: 'Jane Smith', content: 'This helped me understand semantic HTML better.', timestamp: '1 day ago' }
                ]
              },
              {
                id: '2',
                title: 'CSS Fundamentals Guide',
                url: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
                type: 'documentation',
                upvotes: 38,
                comments: []
              }
            ]
          },
          {
            id: '02',
            title: 'Frontend Development',
            description: 'Master React, JavaScript, and modern frontend frameworks.',
            isCompleted: false,
            links: [
              {
                id: '3',
                title: 'React Complete Tutorial',
                url: 'https://www.youtube.com/watch?v=example2',
                type: 'youtube',
                upvotes: 156,
                comments: [
                  { id: '3', user: 'Mike Johnson', content: 'Best React tutorial I have found!', timestamp: '3 hours ago' }
                ]
              }
            ]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseContent();
  }, []);

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleTopicComplete = async (topicId: string, checked: boolean) => {
    try {
      // API call to update topic completion
      await axios.post(`/api/courses/1/topics/${topicId}/complete`, { completed: checked });
      
      setCompletedTopics(prev => 
        checked
          ? [...prev, topicId]
          : prev.filter(id => id !== topicId)
      );
    } catch (error) {
      console.log('Failed to update topic completion:', error);
      // Update locally as fallback
      setCompletedTopics(prev => 
        checked
          ? [...prev, topicId]
          : prev.filter(id => id !== topicId)
      );
    }
  };

  const handleUpvote = async (linkId: string) => {
    try {
      // API call to upvote link
      await axios.post(`/api/links/${linkId}/upvote`);
      
      setUpvotedLinks(prev => 
        prev.includes(linkId)
          ? prev.filter(id => id !== linkId)
          : [...prev, linkId]
      );
    } catch (error) {
      console.log('Failed to upvote link:', error);
      // Update locally as fallback
      setUpvotedLinks(prev => 
        prev.includes(linkId)
          ? prev.filter(id => id !== linkId)
          : [...prev, linkId]
      );
    }
  };

  const handleAddComment = async (linkId: string) => {
    if (newComment.trim()) {
      try {
        // API call to add comment
        await axios.post(`/api/links/${linkId}/comments`, { content: newComment });
        
        console.log(`Adding comment to link ${linkId}: ${newComment}`);
        setNewComment('');
      } catch (error) {
        console.log('Failed to add comment:', error);
        setNewComment('');
      }
    }
  };

  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">Loading course content...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Course Structure */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Course Content</CardTitle>
                <p className="text-gray-600">7 sections • 42 lectures • 87.6 total hours</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.isArray(courseTopics) && courseTopics.map((topic) => (
                  <CourseTopicItem
                    key={topic.id}
                    topic={topic}
                    isOpen={openSections.includes(topic.id)}
                    isCompleted={completedTopics.includes(topic.id)}
                    onToggle={() => toggleSection(topic.id)}
                    onTopicComplete={(checked) => handleTopicComplete(topic.id, checked)}
                    upvotedLinks={upvotedLinks}
                    onUpvote={handleUpvote}
                    showComments={showComments}
                    setShowComments={setShowComments}
                    newComment={newComment}
                    setNewComment={setNewComment}
                    onAddComment={handleAddComment}
                  />
                ))}
              </CardContent>
            </Card>
          </div>

          {/* What's Included Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>What's included</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="text-purple-600">🏆</span>
                  <span className="text-sm">3 top-rated courses</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">4.7 average course rating</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-purple-600">💻</span>
                  <span className="text-sm">126 hands-on practice exercises</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-600" />
                  <span className="text-sm">87.6 hours of on-demand content</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseContent;
