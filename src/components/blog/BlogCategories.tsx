
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface BlogCategoriesProps {
  categories: string[];
  activeCategory?: string;
}

const BlogCategories = ({ categories, activeCategory }: BlogCategoriesProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Link to="/blog">
        <Badge 
          variant={!activeCategory ? "default" : "outline"}
          className="cursor-pointer"
        >
          All
        </Badge>
      </Link>
      
      {categories.map((category) => (
        <Link to={`/blog/category/${category.toLowerCase()}`} key={category}>
          <Badge 
            variant={activeCategory === category.toLowerCase() ? "default" : "outline"}
            className="cursor-pointer"
          >
            {category}
          </Badge>
        </Link>
      ))}
    </div>
  );
};

export default BlogCategories;
