
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share, User } from 'lucide-react';

interface ShortsViewerProps {
  skill?: string;
  topic?: string;
  mode: 'browse' | 'random';
}

interface VideoData {
  id: string;
  title: string;
  creator: string;
  thumbnail: string;
  likes: number;
  comments: number;
  skill: string;
  topic: string;
  tags: string[];
}

const mockVideos: VideoData[] = [
  {
    id: '1',
    title: 'React Hooks in 60 seconds',
    creator: 'CodeMaster',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=400&fit=crop',
    likes: 1200,
    comments: 45,
    skill: 'Web Development',
    topic: 'React Basics',
    tags: ['react', 'hooks', 'javascript']
  },
  {
    id: '2',
    title: 'CSS Grid Layout Quick Tips',
    creator: 'DesignPro',
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=300&h=400&fit=crop',
    likes: 890,
    comments: 32,
    skill: 'Web Development',
    topic: 'CSS Animations',
    tags: ['css', 'grid', 'layout']
  },
  {
    id: '3',
    title: 'Python Data Analysis',
    creator: 'DataGuru',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=400&fit=crop',
    likes: 756,
    comments: 28,
    skill: 'Data Science',
    topic: 'Python Basics',
    tags: ['python', 'data', 'analysis']
  }
];

const ShortsViewer = ({ skill, topic, mode }: ShortsViewerProps) => {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (mode === 'browse' && skill && topic) {
      const filteredVideos = mockVideos.filter(
        video => video.skill === skill && video.topic === topic
      );
      setVideos(filteredVideos);
    } else if (mode === 'random') {
      // Shuffle videos for random mode
      const shuffled = [...mockVideos].sort(() => Math.random() - 0.5);
      setVideos(shuffled);
    } else {
      setVideos([]);
    }
    setCurrentVideoIndex(0);
    setLiked(false);
  }, [skill, topic, mode]);

  const currentVideo = videos[currentVideoIndex];

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleNextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
    setLiked(false);
  };

  const handlePrevVideo = () => {
    setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length);
    setLiked(false);
  };

  if (!currentVideo) {
    return (
      <div className="flex items-center justify-center h-96 text-white">
        <p>Select a skill and topic to view videos</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <Card className="bg-black border-gray-800 overflow-hidden">
        <div className="relative">
          <img 
            src={currentVideo.thumbnail} 
            alt={currentVideo.title}
            className="w-full h-96 object-cover"
          />
          
          {/* Video overlay controls */}
          <div className="absolute inset-0 bg-black bg-opacity-20">
            <div className="absolute bottom-4 left-4 right-20 text-white">
              <div className="flex items-center mb-2">
                <User className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">{currentVideo.creator}</span>
              </div>
              <h3 className="font-bold mb-2">{currentVideo.title}</h3>
              <div className="flex flex-wrap gap-1">
                {currentVideo.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-purple-600 px-2 py-1 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Side actions */}
            <div className="absolute right-4 bottom-4 flex flex-col space-y-4">
              <Button
                onClick={handleLike}
                variant="ghost"
                size="icon"
                className={`rounded-full ${liked ? 'text-red-500' : 'text-white'}`}
              >
                <Heart className={`h-6 w-6 ${liked ? 'fill-current' : ''}`} />
              </Button>
              <span className="text-white text-xs text-center">
                {currentVideo.likes + (liked ? 1 : 0)}
              </span>

              <Button variant="ghost" size="icon" className="rounded-full text-white">
                <MessageCircle className="h-6 w-6" />
              </Button>
              <span className="text-white text-xs text-center">{currentVideo.comments}</span>

              <Button variant="ghost" size="icon" className="rounded-full text-white">
                <Share className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between mt-4">
        <Button 
          onClick={handlePrevVideo}
          disabled={videos.length <= 1}
          variant="outline"
          className="text-white border-gray-600"
        >
          Previous
        </Button>
        <span className="text-white self-center">
          {currentVideoIndex + 1} of {videos.length}
        </span>
        <Button 
          onClick={handleNextVideo}
          disabled={videos.length <= 1}
          variant="outline"
          className="text-white border-gray-600"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ShortsViewer;
