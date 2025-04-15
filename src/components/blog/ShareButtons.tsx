
import React from 'react';
import { Share2, Bookmark, ThumbsUp, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ShareButtonsProps {
  showLikeComment?: boolean;
}

const ShareButtons = ({ showLikeComment = true }: ShareButtonsProps) => {
  return (
    <>
      <div className="flex items-center gap-2 mb-8">
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 size={16} />
          <span>Bagikan</span>
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <Bookmark size={16} />
          <span>Simpan</span>
        </Button>
      </div>
      
      {showLikeComment && (
        <div className="flex items-center gap-4 mb-10">
          <Button variant="outline" size="sm" className="gap-2">
            <ThumbsUp size={16} />
            <span>Suka</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <MessageSquare size={16} />
            <span>Komentar</span>
          </Button>
        </div>
      )}
    </>
  );
};

export default ShareButtons;
