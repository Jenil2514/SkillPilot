import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ThumbsUp, MessageCircle, Plus, ExternalLink, Youtube } from 'lucide-react';
import axios from 'axios';
import { Resource, CourseData, SemesterData, } from '@/components/types/type';
import { CourseViewerProps } from '@/components/types/type';
import { University } from '@/components/types/type';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

// import { CourseData } from '@/components/types/type';

const CourseViewerSkeleton = () => (
  <Card className="animate-pulse">
    <CardHeader>
      <CardTitle>Course Details</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="h-6 bg-gray-100 rounded w-1/2 mb-4" />
      <div className="h-4 bg-gray-100 rounded w-full mb-2" />
      <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-100 rounded w-2/3 mb-2" />
    </CardContent>
  </Card>
);

const CourseViewer = ({ university, selectedSemester, selectedCourse, loading = false }: CourseViewerProps) => {
  const [sources, setResources] = useState<Resource[]>([]);
  const [upvotedSources, setUpvotedSources] = useState<string[]>([]);
  const [showAddSource, setShowAddSource] = useState(false);
  const [universityData, setUniversityData] = useState<University | null>(null);
  const [courseData, setcourseData] = useState<CourseData[]>([]);
  const [semesterData, setsemesterData] = useState<SemesterData[]>([]);
  const [userNames, setUserNames] = useState<{ [userId: string]: string }>({});

  useEffect(() => {
    setUniversityData(university);
    setsemesterData(university.semesters);
    setcourseData(university.semesters.flatMap(semester => semester.courses));
    // If you want to log the updated courseData, use a separate useEffect below
  }, [university]);

  // Optional: If you want to log courseData when it changes, use this effect
  // useEffect(() => {
  //   // console.log("courseData", courseData);
  // }, [courseData]);
  // console.log('University Data:', universityData);
  // console.log('Selected Semester:', selectedSemester);
  // console.log('Selected Course:', selectedCourse);

  // Flatten all resources from all courses and keep course info with each resource


  // Now you can use allResources as a flat array of resources with course info
  // console.log(allResources);

  // Example: Store in state if needed
  // const [flattenedResources, setFlattenedResources] = useState<typeof allResources>([]);

  // useEffect(() => {
  //   setFlattenedResources(allResources);
  // }, [courseData]);


  // Add source form state
  const [newSource, setNewSource] = useState({
    title: '',
    url: '',
    description: '',
    tags: ''
  });

  // Check if user is logged in
  const isLoggedIn = Boolean(localStorage.getItem('token'));


  // LEft off here: Implement upvote functionality------------------------------------
  const handleUpvote = async (sourceId: string) => {
    // Check for token before making request
    const token = localStorage.getItem('token');
    if (!token) {
      toast({
        title: 'You need to login',
        description: 'Please login to upvote resources.',
        variant: 'destructive',
      });
      window.location.href = '/auth'; // Redirect to login page
      return;
    }
    // Find the courseId for this resource
    const course = courseData.find(c => c.resources.some(r => r._id === sourceId));
    const courseId = course?._id;
    const resourceId = sourceId;

    if (!courseId) {
      console.error('Course ID not found for resource:', sourceId);
      return;
    }

    const apiUrl = import.meta.env.VITE_BACKEND_URI || 'http://localhost:5000';

    try {
      const response = await axios.post(
        `${apiUrl}/api/courses/${courseId}/resources/${resourceId}/upvote`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      // Use backend upvote count
      const newUpvotes = response.data.upvotes;
      setcourseData(prevCourseData =>
        prevCourseData.map(course => ({
          ...course,
          resources: course.resources.map(resource =>
            resource._id === sourceId
              ? { ...resource, upvotes: newUpvotes }
              : resource
          ),
        }))
      );
      setUpvotedSources(prev => [...prev, sourceId]);
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        (error as { response?: { status?: number } }).response?.status === 400
      ) {
        toast({
          title: "Already upvoted",
          description: "You have already upvoted this resource.",
        });
        setUpvotedSources(prev => [...prev, sourceId]);
      } else if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        (error as { response?: { status?: number } }).response?.status === 401
      ) {
        toast({
          title: 'You need to login',
          description: 'Please login to upvote resources.',
          variant: 'destructive',
        });
        window.location.href = '/auth';
      } else {
        console.error('Failed to upvote:', error);
      }
    }
  };


  //------------------------------------Done ADD RESOURCE------------------------------------
  const handleAddSource = async () => {
    if (newSource.title && newSource.url && newSource.description) {
      try {
        const sourceData = {
          title: newSource.title,
          url: newSource.url,
          description: newSource.description,
          tags: newSource.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          type: newSource.url.includes('youtube') ? 'video' : 'other'
        };
        const courseid = selectedCourse;
        const apiUrl = import.meta.env.VITE_BACKEND_URI || 'http://localhost:5000';
        const response = await axios.post(
          `${apiUrl}/api/courses/${courseid}/resources`,
          sourceData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        setResources(prev => [
          {
            ...response.data.resource, // use resource from backend
            AddedBy: response.data.resource?.AddedBy || localStorage.getItem('username') || 'Anonymous'
          },
          ...prev
        ]);
        setNewSource({ title: '', url: '', description: '', tags: '' });
        setShowAddSource(false);
        toast({
          title: response.data.message || "Resource added successfully!",
        });
      } catch (error) {
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
        setShowAddSource(false);
      }
    }
  };



  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Youtube className="h-5 w-5 text-red-500" />;
      case 'documentation':
        return <span className="text-blue-500">📚</span>;
      default:
        return <span className="text-gray-500">🔗</span>;
    }
  };





  // Find the selected course
  const selectedCourseData = courseData.find(course => course._id === selectedCourse);

  // Use the resources of the selected course, or an empty array if not found
  const selectedCourseResources = selectedCourseData
    ? [...selectedCourseData.resources].sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
    : [];

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

  useEffect(() => {
    selectedCourseResources.forEach(source => {
      if (source.AddedBy) fetchUserName(source.AddedBy);
    });
  }, [selectedCourseResources]);


  if (loading) return <CourseViewerSkeleton />;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>
              {selectedCourseData ? selectedCourseData.name : ''}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {universityData ? universityData.name : ''} 
            </p>
          </div>
          <Button
            onClick={() => {
              if (!isLoggedIn) {
                window.location.href = '/auth';
              } else {
                setShowAddSource(!showAddSource);
              }
            }}
            className={
              isLoggedIn
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
            disabled={!isLoggedIn}
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
                <Button onClick={handleAddSource} className="bg-purple-600 hover:bg-purple-700 text-white">
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
          <h3 className="font-semibold text-lg">
            Learning Sources ({selectedCourseResources.length})
          </h3>
          {/* Scrollable resource list */}
          <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            {selectedCourseResources.map((source) => (
              <Card key={source._id} className="border-gray-200 mb-2">
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
                          {Array.isArray(source.tags) && source.tags.map((tag) => (
                            <span
                              key={tag}
                              className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2 hover:underline cursor-pointer" >
                          <Link to={`/user/${source.AddedBy}`}>
                            Added by {userNames[source.AddedBy] || 'Anonymous'}
                          </Link>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpvote(source._id)}
                        className={upvotedSources.includes(source._id) ? 'bg-blue-50 border-blue-300 dark:text-black hover:dark:text-white': ''}
                      >
                        <ThumbsUp className={`h-4 w-4 mr-1 ${upvotedSources.includes(source._id) ? 'fill-blue-500 text-blue-500' : ''}`} />
                        {source.upvotes}
                      </Button>

                      {/* <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowComments(showComments === source._id ? null : source._id)}
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {Array.isArray(source.comments) ? source.comments.length : 0}
                      </Button> */}
                    </div>
                  </div>

                  {/* Comments Section */}
                  {/* {showComments === source._id && (
                    <div className="mt-4 border-t pt-4">
                      <h5 className="font-medium mb-3">Comments</h5> */}

                  {/* Add Comment */}
                  {/* <div className="mb-4">
                        <Textarea
                          placeholder="Add a comment..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="mb-2"
                        />
                        
                      </div> */}

                  {/* Existing Comments */}
                  {/* <div className="space-y-3">
                        {Array.isArray(source.comments) && source.comments.map((comment) => (
                          <div key={comment._id} className="bg-gray-50 p-3 rounded">
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-medium text-sm">{comment.user}</span>
                              <span className="text-xs text-gray-500">{comment.timestamp}</span>
                            </div>
                            <p className="text-sm">{comment.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )} */}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseViewer;
