import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, ExternalLink, ThumbsUp, MessageCircle, Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

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

  const courseTopics: CourseTopic[] = [
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
        },
        {
          id: '4',
          title: 'JavaScript ES6+ Features',
          url: 'https://github.com/example/js-es6',
          type: 'github',
          upvotes: 89,
          comments: []
        }
      ]
    },
    {
      id: '03',
      title: 'Backend Development',
      description: 'Learn Node.js, Express, and database management.',
      isCompleted: false,
      links: [
        {
          id: '5',
          title: 'Node.js Crash Course',
          url: 'https://www.youtube.com/watch?v=example3',
          type: 'youtube',
          upvotes: 203,
          comments: []
        }
      ]
    }
  ];

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleUpvote = (linkId: string) => {
    setUpvotedLinks(prev => 
      prev.includes(linkId)
        ? prev.filter(id => id !== linkId)
        : [...prev, linkId]
    );
  };

  const handleAddComment = (linkId: string) => {
    if (newComment.trim()) {
      // In a real app, this would call an API
      console.log(`Adding comment to link ${linkId}: ${newComment}`);
      setNewComment('');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'youtube':
        return '📺';
      case 'github':
        return '⚡';
      case 'documentation':
        return '📚';
      default:
        return '🔗';
    }
  };

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
                {courseTopics.map((topic) => (
                  <Collapsible 
                    key={topic.id}
                    open={openSections.includes(topic.id)}
                    onOpenChange={() => toggleSection(topic.id)}
                  >
                    <CollapsibleTrigger className="w-full">
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-3">
                          <span className="font-bold text-lg">{topic.id}</span>
                          <div className="text-left">
                            <h3 className="font-semibold">{topic.title}</h3>
                            <p className="text-sm text-gray-600">{topic.description}</p>
                          </div>
                        </div>
                        {openSections.includes(topic.id) ? 
                          <ChevronUp className="h-5 w-5" /> : 
                          <ChevronDown className="h-5 w-5" />
                        }
                      </div>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent className="pt-4">
                      <div className="space-y-4 pl-8">
                        {topic.links.map((link) => (
                          <div key={link.id} className="border rounded-lg p-4 bg-white">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <span className="text-xl">{getTypeIcon(link.type)}</span>
                                <div>
                                  <h4 className="font-medium">{link.title}</h4>
                                  <a 
                                    href={link.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline text-sm flex items-center"
                                  >
                                    View Resource <ExternalLink className="h-3 w-3 ml-1" />
                                  </a>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleUpvote(link.id)}
                                  className={upvotedLinks.includes(link.id) ? 'bg-blue-50 border-blue-300' : ''}
                                >
                                  <ThumbsUp className={`h-4 w-4 mr-1 ${upvotedLinks.includes(link.id) ? 'fill-blue-500 text-blue-500' : ''}`} />
                                  {link.upvotes + (upvotedLinks.includes(link.id) ? 1 : 0)}
                                </Button>
                                
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setShowComments(showComments === link.id ? null : link.id)}
                                >
                                  <MessageCircle className="h-4 w-4 mr-1" />
                                  {link.comments.length}
                                </Button>
                              </div>
                            </div>
                            
                            {/* Comments Section */}
                            {showComments === link.id && (
                              <div className="mt-4 border-t pt-4">
                                <h5 className="font-medium mb-3">Comments</h5>
                                
                                {/* Add Comment */}
                                <div className="mb-4">
                                  <Textarea
                                    placeholder="Add a comment..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    className="mb-2"
                                  />
                                  <Button 
                                    size="sm" 
                                    onClick={() => handleAddComment(link.id)}
                                    disabled={!newComment.trim()}
                                  >
                                    Post Comment
                                  </Button>
                                </div>
                                
                                {/* Existing Comments */}
                                <div className="space-y-3">
                                  {link.comments.map((comment) => (
                                    <div key={comment.id} className="bg-gray-50 p-3 rounded">
                                      <div className="flex justify-between items-start mb-2">
                                        <span className="font-medium text-sm">{comment.user}</span>
                                        <span className="text-xs text-gray-500">{comment.timestamp}</span>
                                      </div>
                                      <p className="text-sm">{comment.content}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
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
