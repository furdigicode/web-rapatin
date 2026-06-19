import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Mail,
  MessageCircle,
  Send,
  Facebook,
  Twitter,
  Linkedin,
  AtSign,
  Link2,
  Share2,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface SocialShareBarProps {
  url: string;
  title: string;
  description?: string;
  variant?: 'inline' | 'sticky';
  className?: string;
}

type Platform =
  | 'email'
  | 'whatsapp'
  | 'telegram'
  | 'facebook'
  | 'twitter'
  | 'linkedin'
  | 'threads';

const platformLabels: Record<Platform, string> = {
  email: 'Email',
  whatsapp: 'WhatsApp',
  telegram: 'Telegram',
  facebook: 'Facebook',
  twitter: 'X (Twitter)',
  linkedin: 'LinkedIn',
  threads: 'Threads',
};

const buildShareUrl = (
  platform: Platform,
  url: string,
  title: string,
): string => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedText = encodeURIComponent(`Baca artikel menarik: ${title}`);

  switch (platform) {
    case 'email':
      return `mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`;
    case 'whatsapp':
      return `https://wa.me/?text=${encodedText}%0A%0A${encodedUrl}`;
    case 'telegram':
      return `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case 'twitter':
      return `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
    case 'linkedin':
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    case 'threads':
      return `https://threads.net/intent/post?text=${encodedText}%20${encodedUrl}`;
    default:
      return '';
  }
};

const SocialShareBar: React.FC<SocialShareBarProps> = ({
  url,
  title,
  description,
  variant = 'inline',
  className,
}) => {
  const handleShare = (platform: Platform) => {
    const shareUrl = buildShareUrl(platform, url, title);
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: description || title, url });
      } catch {
        // user cancelled
      }
    } else {
      await copyURL();
    }
  };

  const copyURL = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link artikel berhasil disalin');
    } catch {
      toast.error('Gagal menyalin link');
    }
  };

  const platforms: { id: Platform; icon: React.ReactNode }[] = [
    { id: 'whatsapp', icon: <MessageCircle size={16} /> },
    { id: 'facebook', icon: <Facebook size={16} /> },
    { id: 'twitter', icon: <Twitter size={16} /> },
    { id: 'linkedin', icon: <Linkedin size={16} /> },
    { id: 'telegram', icon: <Send size={16} /> },
    { id: 'threads', icon: <AtSign size={16} /> },
    { id: 'email', icon: <Mail size={16} /> },
  ];

  if (variant === 'sticky') {
    return (
      <div
        className={cn(
          'hidden xl:flex flex-col gap-2 fixed left-6 top-1/2 -translate-y-1/2 z-30 bg-background/90 backdrop-blur-sm border rounded-full p-2 shadow-md',
          className,
        )}
        aria-label="Bagikan artikel ini"
        role="complementary"
      >
        {platforms.map(({ id, icon }) => (
          <Button
            key={id}
            variant="ghost"
            size="icon"
            className="rounded-full h-9 w-9 hover:bg-primary/10 hover:text-primary"
            onClick={() => handleShare(id)}
            aria-label={`Bagikan ke ${platformLabels[id]}`}
            title={`Bagikan ke ${platformLabels[id]}`}
          >
            {icon}
          </Button>
        ))}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-9 w-9 hover:bg-primary/10 hover:text-primary"
          onClick={copyURL}
          aria-label="Salin link artikel"
          title="Salin link"
        >
          <Link2 size={16} />
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn('flex items-center gap-1 flex-wrap', className)}
      aria-label="Bagikan artikel ini"
      role="group"
    >
      {platforms.map(({ id, icon }) => (
        <Button
          key={id}
          variant="outline"
          size="sm"
          onClick={() => handleShare(id)}
          aria-label={`Bagikan ke ${platformLabels[id]}`}
          title={`Bagikan ke ${platformLabels[id]}`}
        >
          {icon}
        </Button>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={copyURL}
        aria-label="Salin link artikel"
        title="Salin link"
      >
        <Link2 size={16} />
      </Button>
      {typeof navigator !== 'undefined' && 'share' in navigator && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleNativeShare}
          aria-label="Bagikan via menu sistem"
          title="Bagikan"
        >
          <Share2 size={16} />
        </Button>
      )}
    </div>
  );
};

export default SocialShareBar;
