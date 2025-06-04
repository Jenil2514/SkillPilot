
import React, { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import CourseLinkItem from './CourseLinkItem';

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

interface CourseTopicItemProps {
  topic: CourseTopic;
  isOpen: boolean;
  isCompleted: boolean;
  onToggle: () => void;
  onTopicComplete: (checked: boolean) => void;
  upvotedLinks: string[];
  onUpvote: (linkId: string) => void;
  showComments: string | null;
  setShowComments: (linkId: string | null) => void;
  newComment: string;
  setNewComment: (comment: string) => void;
  onAddComment: (linkId: string) => void;
}

const CourseTopicItem = ({
  topic,
  isOpen,
  isCompleted,
  onToggle,
  onTopicComplete,
  upvotedLinks,
  onUpvote,
  showComments,
  setShowComments,
  newComment,
  setNewComment,
  onAddComment
}: CourseTopicItemProps) => {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger className="w-full">
        <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
          <div className="flex items-center space-x-3">
            <Checkbox
              checked={isCompleted}
              onCheckedChange={onTopicComplete}
              onClick={(e) => e.stopPropagation()}
            />
            <span className="font-bold text-lg">{topic.id}</span>
            <div className="text-left">
              <h3 className="font-semibold">{topic.title}</h3>
              <p className="text-sm text-gray-600">{topic.description}</p>
            </div>
          </div>
          {isOpen ? 
            <ChevronUp className="h-5 w-5" /> : 
            <ChevronDown className="h-5 w-5" />
          }
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="pt-4">
        <div className="space-y-4 pl-8">
          {topic.links.map((link) => (
            <CourseLinkItem
              key={link.id}
              link={link}
              isUpvoted={upvotedLinks.includes(link.id)}
              onUpvote={() => onUpvote(link.id)}
              showComments={showComments === link.id}
              onToggleComments={() => setShowComments(showComments === link.id ? null : link.id)}
              newComment={newComment}
              setNewComment={setNewComment}
              onAddComment={() => onAddComment(link.id)}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CourseTopicItem;
