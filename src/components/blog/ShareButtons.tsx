
import React from 'react';
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Linkedin, Mail, Share2, MessageCircle } from "lucide-react";

interface ShareButtonsProps {
  url?: string;
  title?: string;
}

export default function ShareButtons({ url = window.location.href, title = document.title }: ShareButtonsProps) {
  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    gmail: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`
  };

  const handleShare = (platform: keyof typeof shareUrls) => {
    window.open(shareUrls[platform], '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex items-center gap-2 mb-8">
      <Button variant="outline" size="sm" onClick={() => handleShare('facebook')} className="gap-2">
        <Facebook size={16} />
      </Button>
      <Button variant="outline" size="sm" onClick={() => handleShare('twitter')} className="gap-2">
        <Twitter size={16} />
      </Button>
      <Button variant="outline" size="sm" onClick={() => handleShare('whatsapp')} className="gap-2">
        <MessageCircle size={16} />
      </Button>
      <Button variant="outline" size="sm" onClick={() => handleShare('linkedin')} className="gap-2">
        <Linkedin size={16} />
      </Button>
      <Button variant="outline" size="sm" onClick={() => handleShare('gmail')} className="gap-2">
        <Mail size={16} />
      </Button>
    </div>
  );
}
