// CategorySelector.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Briefcase, Monitor, Palette, Megaphone } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  GraduationCap,
  Briefcase,
  Monitor,
  Palette,
  Megaphone,
};

interface CategoryData {
  _id: string;
  name: string;
  icon: string; // icon name from backend (e.g. 'GraduationCap')
  type: string;
}

interface CategorySelectorProps {
  categories: CategoryData[];
  selectedCategory: CategoryData | null;
  onCategorySelect: (categoryName: string) => void;
  loading?: boolean;
}

const CategorySelectorSkeleton = () => (
  <Card>
    <CardHeader>
      <CardTitle>Categories</CardTitle>
    </CardHeader>
    <CardContent className="space-y-2 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-10 bg-gray-100 rounded w-full" />
      ))}
    </CardContent>
  </Card>
);

const CategorySelector = ({ categories, selectedCategory, onCategorySelect, loading = false }: CategorySelectorProps) => {
  if (loading) return <CategorySelectorSkeleton />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {categories.map((category) => {
          const IconComponent = iconMap[category.icon] || GraduationCap;
          const isSelected = selectedCategory?.name === category.name;

          return (
            <button
              key={category._id}
              onClick={() => onCategorySelect(category.name)}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isSelected
                  ? 'bg-purple-600 text-white'
                  : 'hover:bg-purple-50 hover:text-purple-600'
              }`}
            >
              <div className={`p-2 rounded-lg ${isSelected ? 'bg-white bg-opacity-20' : ''}`}>
                <IconComponent className={`h-5 w-5 ${isSelected ? 'text-white' : ''}`} />
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
