
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Video, Plus, X } from 'lucide-react';

const skills = [
  'Web Development',
  'Data Science', 
  'Design',
  'Mobile Development',
  'DevOps'
];

const VideoCreator = () => {
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const handleSubmit = () => {
    if (videoTitle && selectedSkill && videoFile) {
      console.log('Video submitted:', {
        title: videoTitle,
        description: videoDescription,
        skill: selectedSkill,
        tags,
        file: videoFile
      });
      // Reset form
      setVideoTitle('');
      setVideoDescription('');
      setSelectedSkill('');
      setTags([]);
      setVideoFile(null);
      alert('Video uploaded successfully!');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-gray-900 border-gray-800 text-white">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Video className="h-5 w-5 mr-2" />
            Create Learning Short
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Video Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Upload Video</label>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
              {videoFile ? (
                <div className="space-y-2">
                  <Video className="h-12 w-12 mx-auto text-green-500" />
                  <p className="text-green-500">{videoFile.name}</p>
                  <Button 
                    onClick={() => setVideoFile(null)}
                    variant="outline"
                    size="sm"
                    className="text-white border-gray-600"
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-12 w-12 mx-auto text-gray-400" />
                  <p className="text-gray-400">Click to upload or drag and drop</p>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="video-upload"
                  />
                  <label htmlFor="video-upload">
                    <Button variant="outline" className="text-white border-gray-600" asChild>
                      <span>Choose File</span>
                    </Button>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Video Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Video Title</label>
            <Input
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              placeholder="Enter a catchy title for your video"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          {/* Video Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              value={videoDescription}
              onChange={(e) => setVideoDescription(e.target.value)}
              placeholder="Describe what viewers will learn from this video"
              className="bg-gray-800 border-gray-700 text-white"
              rows={3}
            />
          </div>

          {/* Skill Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Skill Category</label>
            <Select onValueChange={setSelectedSkill}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select the skill category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {skills.map((skill) => (
                  <SelectItem key={skill} value={skill} className="text-white hover:bg-gray-700">
                    {skill}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span key={tag} className="bg-purple-600 px-3 py-1 rounded-full text-sm flex items-center">
                  #{tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-white hover:text-red-300"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                className="bg-gray-800 border-gray-700 text-white"
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              />
              <Button 
                onClick={handleAddTag}
                variant="outline"
                size="icon"
                className="text-white border-gray-600"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!videoTitle || !selectedSkill || !videoFile}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            Upload Video
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VideoCreator;
