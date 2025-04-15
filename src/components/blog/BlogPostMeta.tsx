
import React from 'react';
import { Calendar, User, Tag } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { BlogPost } from '@/types/BlogTypes';

interface BlogPostMetaProps {
  post: BlogPost;
}

const BlogPostMeta = ({ post }: BlogPostMetaProps) => {
  return (
    <div className="flex items-center gap-6 mb-8">
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
        </Avatar>
        <span className="text-sm">{post.author}</span>
      </div>
      
      <div className="flex items-center text-sm text-muted-foreground">
        <Calendar size={14} className="mr-1" />
        <span>{post.date}</span>
      </div>
      
      {post.category && (
        <div className="flex items-center text-sm">
          <Tag size={14} className="mr-1 text-primary" />
          <span className="text-primary">{post.category}</span>
        </div>
      )}
    </div>
  );
};

export default BlogPostMeta;
