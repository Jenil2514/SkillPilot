
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Briefcase, Monitor, Palette, Megaphone } from 'lucide-react';
import { Category } from '@/pages/CategoryPage';

interface CategorySelectorProps {
  selectedCategory: Category;
  onCategorySelect: (category: Category) => void;
}

const CategorySelector = ({ selectedCategory, onCategorySelect }: CategorySelectorProps) => {
  const categories = [
    { id: 'university' as Category, name: 'University', icon: GraduationCap, color: 'bg-purple-100 text-purple-600' },
    { id: 'business' as Category, name: 'Business', icon: Briefcase, color: 'bg-blue-100 text-blue-600' },
    { id: 'technology' as Category, name: 'Technology', icon: Monitor, color: 'bg-green-100 text-green-600' },
    { id: 'design' as Category, name: 'Design', icon: Palette, color: 'bg-pink-100 text-pink-600' },
    { id: 'marketing' as Category, name: 'Marketing', icon: Megaphone, color: 'bg-orange-100 text-orange-600' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                selectedCategory === category.id
                  ? 'bg-purple-600 text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              <div className={`p-2 rounded-lg ${selectedCategory === category.id ? 'bg-white bg-opacity-20' : category.color}`}>
                <IconComponent className={`h-5 w-5 ${selectedCategory === category.id ? 'text-white' : ''}`} />
              </div>
              <span className="font-medium">{category.name}</span>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default CategorySelector;
