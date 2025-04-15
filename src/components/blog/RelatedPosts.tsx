
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  category: string;
}

interface RelatedPostsProps {
  posts: RelatedPost[];
}

const RelatedPosts = ({ posts }: RelatedPostsProps) => {
  if (posts.length === 0) return null;
  
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold mb-6">Artikel Terkait</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((relatedPost) => (
          <Link to={`/blog/${relatedPost.slug}`} key={relatedPost.id}>
            <Card className="h-full hover:shadow-md transition-all">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={relatedPost.coverImage} 
                  alt={relatedPost.title} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <CardContent className="p-4">
                <div className="flex items-center mb-2">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {relatedPost.category}
                  </span>
                </div>
                <h3 className="text-lg font-semibold hover:text-primary transition-colors">
                  {relatedPost.title}
                </h3>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedPosts;
