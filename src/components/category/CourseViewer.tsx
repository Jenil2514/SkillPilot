import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ThumbsUp, MessageCircle, Plus, ExternalLink, Youtube } from 'lucide-react';
import axios from 'axios';

interface Source {
  id: string;
  title: string;
  url: string;
  description: string;
  tags: string[];
  upvotes: number;
  comments: Comment[];
  addedBy: string;
  type: 'youtube' | 'article' | 'documentation' | 'other';
}

interface Comment {
  id: string;
  user: string;
  content: string;
  timestamp: string;
}

interface CourseViewerProps {
  university: string;
  semester: string;
  course: string;
}

const CourseViewer = ({ university, semester, course }: CourseViewerProps) => {
  const [sources, setSources] = useState<Source[]>([]);
  const [upvotedSources, setUpvotedSources] = useState<string[]>([]);
  const [showAddSource, setShowAddSource] = useState(false);
  const [showComments, setShowComments] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  // Add source form state
  const [newSource, setNewSource] = useState({
    title: '',
    url: '',
    description: '',
    tags: ''
  });

  // Fetch sources from API
  useEffect(() => {
    const fetchSources = async () => {
      try {
        const response = await axios.get(`/api/universities/${university}/semesters/${semester}/courses/${course}/sources`);
        setSources(response.data);
      } catch (error) {
        console.log('API call failed, using mock data:', error);
        // Mock data as fallback
        setSources([
          {
            id: '1',
            title: 'CS50 Introduction to Computer Science',
            url: 'https://www.youtube.com/watch?v=example',
            description: 'Harvard CS50 full course - comprehensive introduction to computer science',
            tags: ['beginner', 'fundamentals', 'harvard'],
            upvotes: 245,
            comments: [
              { id: '1', user: 'student123', content: 'Excellent course!', timestamp: '2 hours ago' }
            ],
            addedBy: 'john_doe',
            type: 'youtube'
          },
          {
            id: '2',
            title: 'MDN Web Development Guide',
            url: 'https://developer.mozilla.org/en-US/docs/Learn',
            description: 'Comprehensive web development documentation and tutorials',
            tags: ['web', 'documentation', 'reference'],
            upvotes: 156,
            comments: [],
            addedBy: 'jane_smith',
            type: 'documentation'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (university && semester && course) {
      fetchSources();
    }
  }, [university, semester, course]);

  const handleUpvote = async (sourceId: string) => {
    try {
      await axios.post(`/api/sources/${sourceId}/upvote`);
      
      setUpvotedSources(prev =>
        prev.includes(sourceId)
          ? prev.filter(id => id !== sourceId)
          : [...prev, sourceId]
      );
    } catch (error) {
      console.log('Failed to upvote source:', error);
      // Update locally as fallback
      setUpvotedSources(prev =>
        prev.includes(sourceId)
          ? prev.filter(id => id !== sourceId)
          : [...prev, sourceId]
      );
    }
  };

  const handleAddSource = async () => {
    if (newSource.title && newSource.url && newSource.description) {
      try {
        const sourceData = {
          title: newSource.title,
          url: newSource.url,
          description: newSource.description,
          tags: newSource.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          type: newSource.url.includes('youtube') ? 'youtube' : 'other'
        };

        const response = await axios.post(`/api/universities/${university}/semesters/${semester}/courses/${course}/sources`, sourceData);
        
        setSources(prev => [response.data, ...prev]);
        setNewSource({ title: '', url: '', description: '', tags: '' });
        setShowAddSource(false);
      } catch (error) {
        console.log('Failed to add source:', error);
        // Add locally as fallback
        const source: Source = {
          id: Date.now().toString(),
          title: newSource.title,
          url: newSource.url,
          description: newSource.description,
          tags: newSource.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          upvotes: 0,
          comments: [],
          addedBy: 'current_user',
          type: newSource.url.includes('youtube') ? 'youtube' : 'other'
        };

        setSources(prev => [source, ...prev]);
        setNewSource({ title: '', url: '', description: '', tags: '' });
        setShowAddSource(false);
      }
    }
  };

  const handleAddComment = async (sourceId: string) => {
    if (newComment.trim()) {
      try {
        await axios.post(`/api/sources/${sourceId}/comments`, { content: newComment });
        
        console.log(`Adding comment to source ${sourceId}: ${newComment}`);
        setNewComment('');
      } catch (error) {
        console.log('Failed to add comment:', error);
        setNewComment('');
      }
    }
  };

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'youtube':
        return <Youtube className="h-5 w-5 text-red-500" />;
      case 'documentation':
        return <span className="text-blue-500">📚</span>;
      default:
        return <span className="text-gray-500">🔗</span>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading course sources...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{course}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">{university} • {semester}</p>
          </div>
          <Button
            onClick={() => setShowAddSource(!showAddSource)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Source
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Add Source Form */}
        {showAddSource && (
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="text-lg">Add New Source</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <Input
                  placeholder="Enter source title"
                  value={newSource.title}
                  onChange={(e) => setNewSource(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">URL *</label>
                <Input
                  placeholder="https://..."
                  value={newSource.url}
                  onChange={(e) => setNewSource(prev => ({ ...prev, url: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <Textarea
                  placeholder="Describe what this source covers..."
                  value={newSource.description}
                  onChange={(e) => setNewSource(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tags</label>
                <Input
                  placeholder="beginner, tutorial, advanced (comma separated)"
                  value={newSource.tags}
                  onChange={(e) => setNewSource(prev => ({ ...prev, tags: e.target.value }))}
                />
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleAddSource} className="bg-purple-600 hover:bg-purple-700">
                  Add Source
                </Button>
                <Button variant="outline" onClick={() => setShowAddSource(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sources List */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Learning Sources ({sources.length})</h3>
          
          {sources.map((source) => (
            <Card key={source.id} className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3 flex-1">
                    {getSourceIcon(source.type)}
                    <div className="flex-1">
                      <h4 className="font-medium text-lg">{source.title}</h4>
                      <p className="text-gray-600 text-sm mt-1">{source.description}</p>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm flex items-center mt-2"
                      >
                        Visit Source <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {source.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Added by {source.addedBy}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpvote(source.id)}
                      className={upvotedSources.includes(source.id) ? 'bg-blue-50 border-blue-300' : ''}
                    >
                      <ThumbsUp className={`h-4 w-4 mr-1 ${upvotedSources.includes(source.id) ? 'fill-blue-500 text-blue-500' : ''}`} />
                      {source.upvotes + (upvotedSources.includes(source.id) ? 1 : 0)}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowComments(showComments === source.id ? null : source.id)}
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {source.comments.length}
                    </Button>
                  </div>
                </div>

                {/* Comments Section */}
                {showComments === source.id && (
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
                        onClick={() => handleAddComment(source.id)}
                        disabled={!newComment.trim()}
                      >
                        Post Comment
                      </Button>
                    </div>

                    {/* Existing Comments */}
                    <div className="space-y-3">
                      {source.comments.map((comment) => (
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
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseViewer;
