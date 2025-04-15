
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  category: string;
}

interface PostNavigationProps {
  relatedPosts: RelatedPost[];
}

const PostNavigation = ({ relatedPosts }: PostNavigationProps) => {
  return (
    <div className="flex justify-between">
      <Button variant="outline" asChild className="gap-2">
        <Link to="/blog">
          <ArrowLeft size={16} />
          <span>Kembali ke Blog</span>
        </Link>
      </Button>
      {relatedPosts.length > 0 && (
        <Button variant="outline" asChild className="gap-2">
          <Link to={`/blog/${relatedPosts[0].slug}`}>
            <span>Artikel Berikutnya</span>
            <ArrowRight size={16} />
          </Link>
        </Button>
      )}
    </div>
  );
};

export default PostNavigation;
