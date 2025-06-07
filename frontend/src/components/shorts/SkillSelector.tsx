
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SkillSelectorProps {
  onSkillTopicSelect: (skill: string, topic: string) => void;
}

const skills = [
  {
    name: 'Web Development',
    topics: ['React Basics', 'CSS Animations', 'JavaScript ES6', 'Node.js', 'Database Design']
  },
  {
    name: 'Data Science',
    topics: ['Python Basics', 'Machine Learning', 'Data Visualization', 'Statistics', 'SQL']
  },
  {
    name: 'Design',
    topics: ['UI/UX Principles', 'Color Theory', 'Typography', 'Figma Tips', 'Prototyping']
  },
  {
    name: 'Mobile Development',
    topics: ['React Native', 'Flutter', 'iOS Development', 'Android Development', 'Cross-platform']
  },
  {
    name: 'DevOps',
    topics: ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Monitoring']
  }
];

const SkillSelector = ({ onSkillTopicSelect }: SkillSelectorProps) => {
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');

  const handleSkillChange = (skill: string) => {
    setSelectedSkill(skill);
    setSelectedTopic(''); // Reset topic when skill changes
  };

  const handleTopicChange = (topic: string) => {
    setSelectedTopic(topic);
  };

  const handleSearch = () => {
    if (selectedSkill && selectedTopic) {
      onSkillTopicSelect(selectedSkill, selectedTopic);
    }
  };

  const selectedSkillData = skills.find(skill => skill.name === selectedSkill);

  return (
    <Card className="bg-gray-900 border-gray-800 text-white">
      <CardHeader>
        <CardTitle className="text-white">Select Skill & Topic</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Choose Skill</label>
          <Select onValueChange={handleSkillChange}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Select a skill" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {skills.map((skill) => (
                <SelectItem key={skill.name} value={skill.name} className="text-white hover:bg-gray-700">
                  {skill.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedSkillData && (
          <div>
            <label className="block text-sm font-medium mb-2">Choose Topic</label>
            <Select onValueChange={handleTopicChange}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select a topic" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {selectedSkillData.topics.map((topic) => (
                  <SelectItem key={topic} value={topic} className="text-white hover:bg-gray-700">
                    {topic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <Button 
          onClick={handleSearch}
          disabled={!selectedSkill || !selectedTopic}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          Find Videos
        </Button>
      </CardContent>
    </Card>
  );
};

export default SkillSelector;
