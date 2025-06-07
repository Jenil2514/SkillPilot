
import React, { useState } from 'react';
import Header from '@/components/Header';
import ShortsViewer from '@/components/shorts/ShortsViewer';
import SkillSelector from '@/components/shorts/SkillSelector';
import VideoCreator from '@/components/shorts/VideoCreator';
import { Button } from '@/components/ui/button';
import { Shuffle, Play, Plus } from 'lucide-react';

type ViewMode = 'browse' | 'create' | 'random';

const ShortsPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('browse');
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');

  const handleSkillTopicSelect = (skill: string, topic: string) => {
    setSelectedSkill(skill);
    setSelectedTopic(topic);
  };

  const handleRandomMode = () => {
    setViewMode('random');
    // Clear previous selections for random mode
    setSelectedSkill('');
    setSelectedTopic('');
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      {/* Mode Selection */}
      <div className="flex justify-center items-center py-4 bg-gray-900 border-b border-gray-800">
        <div className="flex space-x-4">
          <Button
            onClick={() => setViewMode('browse')}
            variant={viewMode === 'browse' ? 'default' : 'ghost'}
            className="text-white"
          >
            <Play className="h-4 w-4 mr-2" />
            Browse
          </Button>
          <Button
            onClick={() => setViewMode('create')}
            variant={viewMode === 'create' ? 'default' : 'ghost'}
            className="text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create
          </Button>
          <Button
            onClick={handleRandomMode}
            variant={viewMode === 'random' ? 'default' : 'ghost'}
            className="text-white"
          >
            <Shuffle className="h-4 w-4 mr-2" />
            Random
          </Button>
        </div>
      </div>

      {/* Content based on selected mode */}
      <div className="container mx-auto px-4">
        {viewMode === 'browse' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-6">
            <div className="lg:col-span-1">
              <SkillSelector onSkillTopicSelect={handleSkillTopicSelect} />
            </div>
            <div className="lg:col-span-2">
              <ShortsViewer 
                skill={selectedSkill} 
                topic={selectedTopic} 
                mode="browse"
              />
            </div>
          </div>
        )}

        {viewMode === 'create' && (
          <div className="py-6">
            <VideoCreator />
          </div>
        )}

        {viewMode === 'random' && (
          <div className="py-6">
            <ShortsViewer mode="random" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ShortsPage;
