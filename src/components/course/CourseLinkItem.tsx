import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ThumbsUp, MessageCircle, ExternalLink } from 'lucide-react';

interface Comment {
  id: string;
  user: string;
  content: string;
  timestamp: string;
}

interface CourseLink {
  id: string;
  title: string;
  url: string;
  type: 'youtube' | 'github' | 'documentation' | 'article';
  upvotes: number;
  comments: Comment[];
}

interface CourseLinkItemProps {
  link: CourseLink;
  isUpvoted: boolean;
  onUpvote: () => void;
  showComments: boolean;
  onToggleComments: () => void;
  newComment: string;
  setNewComment: (comment: string) => void;
  onAddComment: () => void;
}

const CourseLinkItem = ({
  link,
  isUpvoted,
  onUpvote,
  showComments,
  onToggleComments,
  newComment,
  setNewComment,
  onAddComment
}: CourseLinkItemProps) => {
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
    <div className="border rounded-lg p-4 bg-white">
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
            onClick={onUpvote}
            className={isUpvoted ? 'bg-blue-50 border-blue-300' : ''}
          >
            <ThumbsUp className={`h-4 w-4 mr-1 ${isUpvoted ? 'fill-blue-500 text-blue-500' : ''}`} />
            {link.upvotes + (isUpvoted ? 1 : 0)}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleComments}
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            {link.comments.length}
          </Button>
        </div>
      </div>
      
      {/* Comments Section */}
      {showComments && (
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
              onClick={onAddComment}
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
  );
};

export default CourseLinkItem;
