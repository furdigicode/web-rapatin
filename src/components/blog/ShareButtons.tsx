
import React from 'react';
import { Facebook, Twitter, Linkedin, Mail, Share2, Whatsapp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ShareButtonsProps {
  showLikeComment?: boolean;
}

const ShareButtons = ({ showLikeComment = true }: ShareButtonsProps) => {
  const currentUrl = window.location.href;
  const handleShare = (platform: string) => {
    const text = document.title;
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + currentUrl)}`,
      gmail: `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(currentUrl)}`
    };

    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  return (
    <>
      <div className="flex items-center gap-2 mb-8">
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => handleShare('facebook')}
        >
          <Facebook size={16} />
          <span>Facebook</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => handleShare('twitter')}
        >
          <Twitter size={16} />
          <span>Twitter</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => handleShare('whatsapp')}
        >
          <Whatsapp size={16} />
          <span>WhatsApp</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => handleShare('linkedin')}
        >
          <Linkedin size={16} />
          <span>LinkedIn</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => handleShare('gmail')}
        >
          <Mail size={16} />
          <span>Email</span>
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
