import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Heart, Youtube, Dock, FileText, BookOpen, Link2, Heart as HeartFilled } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Comment } from '../types/type';
import axios from 'axios';
import { CourseData, Resource, checkpoints } from '../types/type';
import { useToast } from '@/hooks/use-toast'; // Import your toast hook






interface CourseContentPorps {
  course: CourseData;
  loading?: boolean;
}
// Skeleton Loader for CourseContent
const CourseContentSkeleton = () => (
  <section className="py-12 bg-gray-50 animate-pulse">
    <div className="container mx-auto px-4">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg p-6 mb-4">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded mb-4" />
            ))}
          </div>
        </div>
        <div>
          <div className="bg-white rounded-lg p-6">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4" />
            <div className="h-4 bg-gray-100 rounded w-full mb-2" />
            <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
          </div>
        </div>
      </div>
    </div>
  </section>
);
const CourseContent = ({ course, loading = false }: CourseContentPorps) => {
  const [upvotedLinks, setUpvotedLinks] = useState<string[]>([]);
  const [upvoteCounts, setUpvoteCounts] = useState<{ [id: string]: number }>({});
  const [showAddSourceCheckpoint, setShowAddSourceCheckpoint] = useState<string | null>(null);
  const [completedCheckpoints, setCompletedCheckpoints] = useState<string[]>([]);
  const [sidebarComment, setSidebarComment] = useState('');
  const [sidebarResourceId, setSidebarResourceId] = useState<string | null>(null);
  const [sidebarResourceComments, setSidebarResourceComments] = useState<Comment[]>([]);
  const [userNames, setUserNames] = useState<{ [userId: string]: string }>({});

  const { toast } = useToast();
  // Add source form state
  const [newSource, setNewSource] = useState({
    title: '',
    url: '',
    description: '',
    tags: ''
  });


  // Helper: localStorage key for this course
  const localKey = `progress_${course._id}`;
  // Helper: localStorage key for upvotes for this course
  const upvoteKey = `upvotes_${course._id}`;

  // Fetch user progress on mount
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        // Try localStorage first for instant UI
        const local = localStorage.getItem(localKey);
        if (local) {
          setCompletedCheckpoints(JSON.parse(local));
        }
        // Fetch from backend
        const apiUrl = import.meta.env.VITE_BACKEND_URI || 'http://localhost:5000';
        const res = await axios.get(`${apiUrl}/api/users/progress`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const userProgress = res.data.find((p: any) => p.course._id === course._id);
        if (userProgress) {
          setCompletedCheckpoints(userProgress.completedCheckpoints);
          localStorage.setItem(localKey, JSON.stringify(userProgress.completedCheckpoints));
        }
      } catch (err) {
        // fallback to localStorage only
      }
    };
    fetchProgress();
    // eslint-disable-next-line
  }, [course._id]);

  // Load upvotedLinks and upvoteCounts from localStorage and course data on mount
  useEffect(() => {
    const local = localStorage.getItem(upvoteKey);
    if (local) setUpvotedLinks(JSON.parse(local));
    // Initialize upvoteCounts from course.resources
    const counts: { [id: string]: number } = {};
    if (course.resources) {
      course.resources.forEach(r => {
        counts[r._id] = r.upvotes || 0;
      });
    }
    setUpvoteCounts(counts);
  }, [course._id, course.resources, upvoteKey]);

  // Save upvotedLinks to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(upvoteKey, JSON.stringify(upvotedLinks));
  }, [upvotedLinks, upvoteKey]);

  // Handle checkbox change
  const handleCheckpointToggle = async (checkpointId: string, checked: boolean) => {
    let updated: string[];
    if (checked) {
      updated = [...completedCheckpoints, checkpointId];
    } else {
      updated = completedCheckpoints.filter(id => id !== checkpointId);
    }
    setCompletedCheckpoints(updated);
    localStorage.setItem(localKey, JSON.stringify(updated));
    // Update backend
    const apiUrl = import.meta.env.VITE_BACKEND_URI || 'http://localhost:5000';
    try {
      await axios.put(
        `${apiUrl}/api/users/progress/${course._id}`,
        { completedCheckpoints: updated },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
    } catch (err) {
      // Optionally show error
    }
  };


  //------------------------------------Done ADD RESOURCE------------------------------------
  const handleAddSource = async (checkpointId: string) => {
    if (newSource.title && newSource.url && newSource.description) {
      try {
        const sourceData = {
          title: newSource.title,
          url: newSource.url,
          description: newSource.description,
          tags: newSource.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          type: newSource.url.includes('youtube') ? 'video' : 'other'
        };
        const apiUrl = import.meta.env.VITE_BACKEND_URI || 'http://localhost:5000';
        // POST to the checkpoint-specific endpoint
        const response = await axios.post(
          `${apiUrl}/api/courses/${course._id}/checkpoints/${checkpointId}/resources`,
          sourceData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        // Optionally update local state here if needed
        setNewSource({ title: '', url: '', description: '', tags: '' });
        setShowAddSourceCheckpoint(null);
        toast({
          title: response.data.message || "Resource added successfully!",
        });
      } catch (error: any) {
        let errorMessage = 'Failed to add resource';
        if (error && typeof error === 'object' && 'response' in error && error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        toast({
          title: "Failed to add resource",
          description: errorMessage,
          variant: "destructive",
        });
        setNewSource({ title: '', url: '', description: '', tags: '' });
        setShowAddSourceCheckpoint(null);
      }
    }
  };

  // Find the selected course


  const handleUpvote = async (resourceId: string) => {
    const apiUrl = import.meta.env.VITE_BACKEND_URI || 'http://localhost:5000';
    const courseId = course._id;
    const isUpvoted = upvotedLinks.includes(resourceId);

    // Optimistically update UI and localStorage
    if (isUpvoted) {
      setUpvotedLinks(prev => {
        const updated = prev.filter(id => id !== resourceId);
        localStorage.setItem(upvoteKey, JSON.stringify(updated));
        return updated;
      });
      setUpvoteCounts(prev => ({
        ...prev,
        [resourceId]: Math.max((prev[resourceId] || 1) - 1, 0),
      }));
    } else {
      setUpvotedLinks(prev => {
        const updated = [...prev, resourceId];
        localStorage.setItem(upvoteKey, JSON.stringify(updated));
        return updated;
      });
      setUpvoteCounts(prev => ({
        ...prev,
        [resourceId]: (prev[resourceId] || 0) + 1,
      }));
    }

    try {
      if (isUpvoted) {
        await axios.post(
          `${apiUrl}/api/courses/${courseId}/resources/${resourceId}/remove-upvote`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
      } else {
        await axios.post(
          `${apiUrl}/api/courses/${courseId}/resources/${resourceId}/upvote`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
      }
    } catch (error: any) {
      // Revert UI on error
      setUpvotedLinks(prev => {
        const reverted = isUpvoted
          ? [...prev, resourceId]
          : prev.filter(id => id !== resourceId);
        localStorage.setItem(upvoteKey, JSON.stringify(reverted));
        return reverted;
      });
      setUpvoteCounts(prev => ({
        ...prev,
        [resourceId]: isUpvoted
          ? (prev[resourceId] || 0) + 1
          : Math.max((prev[resourceId] || 1) - 1, 0),
      }));
      // Show toast if already upvoted or other error
      toast({
        title: 'Upvote Error',
        description: error?.response?.data?.message || 'Failed to update upvote.',
      });
    }
  };





  const handleSidebarAddComment = async () => {
    if (!sidebarComment.trim() || !sidebarResourceId) return;
    try {
      const apiUrl = import.meta.env.VITE_BACKEND_URI || 'http://localhost:5000';
      await axios.post(
        `${apiUrl}/api/courses/${course._id}/resources/${sidebarResourceId}/comments`,
        { text: sidebarComment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setSidebarComment('');
      // Refresh comments
      handleToggleResourceComments(sidebarResourceId);
    } catch (err) {
      // Optionally show error
    }
  };

  // Fetch user name by user ID
  const fetchUserName = async (userId: string) => {
    if (!userId || userNames[userId]) return;
    try {
      const apiUrl = import.meta.env.VITE_BACKEND_URI || 'http://localhost:5000';
      const res = await axios.get(`${apiUrl}/api/users/name/${userId}`);
      setUserNames(prev => ({ ...prev, [userId]: res.data.name }));
    } catch {
      setUserNames(prev => ({ ...prev, [userId]: 'Anonymous' }));
    }
  };

  // Call fetchUserName for each AddedBy in visible resources
  useEffect(() => {
    const addedByIds = new Set<string>();
    course.checkpoints.forEach(checkpoint => {
      checkpoint.resources.forEach(resId => {
        const resource = course.resources.find(r => r._id === resId);
        if (resource && resource.AddedBy) {
          addedByIds.add(resource.AddedBy);
        }
      });
    });
    addedByIds.forEach(userId => {
      fetchUserName(userId);
    });
    // eslint-disable-next-line
  }, [course]);

  const handleToggleResourceComments = async (resourceId: string) => {
    if (sidebarResourceId === resourceId) {
      setSidebarResourceId(null);
      setSidebarResourceComments([]);
    } else {
      setSidebarResourceId(resourceId);
      try {
        const apiUrl = import.meta.env.VITE_BACKEND_URI || 'http://localhost:5000';
        const res = await axios.get(
          `${apiUrl}/api/courses/${course._id}/resources/${resourceId}/comments`
        );
        // Fetch user info for avatars
        const commentsWithUser = await Promise.all(
          (res.data.comments || []).map(async (c: Comment, idx: number) => {
            let user = { name: 'User', avatar: '' };
            try {
              const userRes = await axios.get(`${apiUrl}/api/users/profile/${c.user}`);
              user = {
                name: userRes.data.name,
                avatar: userRes.data.avatar || '',
              };
            } catch {
              // Ignore errors fetching user profile
            }
            return {
              id: c._id || idx.toString(),
              user: user.name,
              avatar: user.avatar,
              content: c.text,
              timestamp: c.createdAt
                ? new Date(c.createdAt).toLocaleString()
                : '',
            };
          })
        );
        setSidebarResourceComments(commentsWithUser);
      } catch (err) {
        setSidebarResourceComments([]);
      }
    }
  };

  // Helper to get icon by resource type
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Youtube className="inline h-5 w-5 text-red-500 mr-1" />;
      case 'article':
      case 'other':
        return <FileText className="inline h-5 w-5 text-blue-500 mr-1" />;
      case 'documentation':
        return <BookOpen className="inline h-5 w-5 text-green-600 mr-1" />;
      case 'github':
        return <Dock className="inline h-5 w-5 text-gray-800 mr-1" />;
      default:
        return <Link2 className="inline h-5 w-5 text-gray-400 mr-1" />;
    }
  };

  const isLoggedIn = Boolean(localStorage.getItem('token'));

  if (loading) return <CourseContentSkeleton />;

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Course Structure */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Course Content</CardTitle>
                <p className="text-gray-600">No of Checkpoints : {course.checkpoints.length}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.isArray(course.checkpoints) && course.checkpoints.map((checkpoint) => (
                  <Card key={checkpoint.title} className="mb-4">
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-5 justify-between">
                        <span className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={completedCheckpoints.includes(checkpoint._id)}
                            onChange={e => handleCheckpointToggle(checkpoint._id, e.target.checked)}
                            className="mr-2"
                          />
                          {checkpoint.title}
                        </span>
                        {/* Add Resource Button */}
                        <button
                          className="px-2 py-1 bg-purple-600 text-white rounded text-sm"
                          onClick={() => {
                            if (!isLoggedIn) {
                              window.location.href = '/auth';
                            } else {
                              setShowAddSourceCheckpoint(checkpoint._id);
                            }
                          }}
                          type="button"
                        >
                          + Add Resource
                        </button>
                      </CardTitle>
                      {/* Add Source Form for this checkpoint */}
                      {showAddSourceCheckpoint === checkpoint._id && (
                        <Card className="border-purple-200 mt-2">
                          <CardHeader>
                            <CardTitle className="text-lg">Add New Source</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">Title *</label>
                              <Input
                                placeholder="Enter source title"
                                value={newSource.title}
                                required={true}
                                onChange={(e) => setNewSource(prev => ({ ...prev, title: e.target.value }))}
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-2">URL *</label>
                              <Input
                                placeholder="https://..."
                                value={newSource.url}
                                required={true}
                                onChange={(e) => setNewSource(prev => ({ ...prev, url: e.target.value }))}
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-2">Description *</label>
                              <Textarea
                                placeholder="Describe what this source covers..."
                                value={newSource.description}
                                required={true}
                                onChange={(e) => setNewSource(prev => ({ ...prev, description: e.target.value }))}
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-2">Tags</label>
                              <Input
                                placeholder="beginner, tutorial, advanced (comma separated)"
                                value={newSource.tags}
                                required={true}
                                onChange={(e) => setNewSource(prev => ({ ...prev, tags: e.target.value }))}
                              />
                            </div>

                            <div className="flex space-x-2">
                              <Button onClick={() => handleAddSource(checkpoint._id)} className="bg-purple-600 hover:bg-purple-700 text-white">
                                Add Source
                              </Button>
                              <Button variant="outline" onClick={() => setShowAddSourceCheckpoint(null)}>
                                Cancel
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </CardHeader>
                    <CardContent>
                      {checkpoint.resources && checkpoint.resources.length > 0 ? (
                        <ul
                          className="space-y-2 max-h-64 overflow-y-auto pr-2" // fixed height and scroll
                          style={{ minHeight: '64px' }}
                        >
                          {checkpoint.resources
                            .map((res: string | Resource) => {
                              // If res is a string, treat as resource ID; if object, get its _id
                              const resId = typeof res === 'string' ? res : res._id;
                              return course.resources.find(r => r._id === resId);
                            })
                            .filter(Boolean)
                            .sort((a, b) => (b?.upvotes || 0) - (a?.upvotes || 0)) // sort by upvotes descending
                            .map(resource => {
                              if (!resource) return null;
                              return (
                                <li key={resource._id}>
                                  <div className="border rounded p-4 flex flex-col gap-2 bg-white shadow-sm">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        {getResourceIcon(resource.type)}
                                        <span className="font-semibold">{resource.title}</span>
                                        <span className="ml-2 text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
                                          {resource.type === 'video'
                                            ? 'YouTube'
                                            : resource.type === 'other'
                                              ? 'Article'
                                              : resource.type.charAt(0).toUpperCase() + resource.type.slice(1)
                                          }
                                        </span>
                                          <p className="text-xs text-gray-500 mt-2 hover:underline cursor-pointer" >
                                            <Link to={`/user/${resource.AddedBy}`}>
                                              Added by {userNames[resource.AddedBy] || 'Anonymous'}
                                            </Link>
                                          </p>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <a
                                          href={resource.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-blue-600 underline text-sm"
                                        >
                                          Open
                                        </a>
                                        <button
                                          className={`text-sm px-2 py-1 rounded border ${upvotedLinks.includes(resource._id) ? 'bg-red-100 text-red-600 border-red-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}
                                          onClick={() => handleUpvote(resource._id)}
                                        >
                                          {upvotedLinks.includes(resource._id) ? (
                                            <HeartFilled className="inline h-4 w-4 mr-1 fill-red-600 text-red-600" />
                                          ) : (
                                            <Heart className="inline h-4 w-4 mr-1" />
                                          )}
                                          {upvoteCounts[resource._id] || 0}
                                        </button>
                                        <button
                                          className="text-sm px-2 py-1 rounded bg-gray-100 border border-gray-200 text-gray-600"
                                          onClick={() => handleToggleResourceComments(resource._id)}
                                        >
                                          💬 Comment
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              );
                            })}
                        </ul>
                      ) : (
                        <div className="text-gray-500">No resources for this checkpoint.</div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* What's Included Sidebar */}
          <div>
            {/* <Card>
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
            </Card> */}

            {/* Sidebar: Course Comments Feed */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>
                    {sidebarResourceId
                      ? `Comments for Resource`
                      : 'Select a resource to view comments'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Add Comment */}
                  {sidebarResourceId && (
                    <div className="mb-4">
                      <textarea
                        className="w-full border rounded p-2 mb-2"
                        placeholder="Add a comment..."
                        value={sidebarComment}
                        onChange={e => setSidebarComment(e.target.value)}
                      />
                      <button
                        className="bg-blue-600 text-white px-4 py-1 rounded"
                        onClick={() => {
                          if (!isLoggedIn) {
                            window.location.href = '/auth';
                          } else {
                            handleSidebarAddComment();
                          }
                        }}
                        disabled={!sidebarComment.trim()}
                      >
                        Post Comment
                      </button>
                    </div>
                  )}
                  {/* Comments Feed */}
                  <div className="h-80 overflow-y-auto space-y-3">
                    {sidebarResourceId ? (
                      sidebarResourceComments.length === 0
                        ? <div className="text-gray-500 text-sm">No comments yet.</div>
                        : sidebarResourceComments.map(comment => (
                          <div key={comment.id} className="bg-gray-50 p-3 rounded flex gap-3 items-start">

                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold">
                              {comment.user?.[0]?.toUpperCase() || 'U'}
                            </div>

                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-medium text-sm">{comment.user}</span>
                                <span className="text-xs text-gray-500">{comment.timestamp}</span>
                              </div>
                              <p className="text-sm">{comment.content}</p>
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className="text-gray-500 text-sm">Select a resource to view comments.</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseContent;
