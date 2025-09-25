import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Clock } from 'lucide-react';
import { BlogPost } from '@/types/BlogTypes';

interface BlogPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: BlogPost | null;
}

export const BlogPreviewDialog: React.FC<BlogPreviewDialogProps> = ({
  open,
  onOpenChange,
  post
}) => {
  if (!post) return null;

  // Calculate reading time (average 200 words per minute)
  const readingTime = Math.ceil(post.wordCount / 200);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline" className="text-muted-foreground">
              Draft Preview
            </Badge>
          </div>
          <DialogTitle className="text-left text-2xl lg:text-3xl font-bold leading-tight">
            {post.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Cover Image */}
          {post.coverImage && (
            <div className="w-full h-64 lg:h-80 rounded-lg overflow-hidden">
              <img 
                src={post.coverImage} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-b pb-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(post.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{readingTime} menit baca</span>
            </div>
            {post.category && (
              <Badge variant="secondary">{post.category}</Badge>
            )}
          </div>

          {/* Excerpt */}
          {post.excerpt && (
            <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-primary">
              <p className="text-lg text-muted-foreground italic leading-relaxed">
                {post.excerpt}
              </p>
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div 
              className="text-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* SEO Information */}
          <div className="bg-muted/30 p-4 rounded-lg space-y-3">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Informasi SEO
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">SEO Title:</span>
                <p className="mt-1 text-muted-foreground">{post.seoTitle || post.title}</p>
              </div>
              <div>
                <span className="font-medium">Meta Description:</span>
                <p className="mt-1 text-muted-foreground">{post.metaDescription || 'Tidak ada deskripsi'}</p>
              </div>
              <div>
                <span className="font-medium">Focus Keyword:</span>
                <p className="mt-1 text-muted-foreground">{post.focusKeyword || 'Tidak ada keyword'}</p>
              </div>
              <div>
                <span className="font-medium">Jumlah Kata:</span>
                <p className="mt-1 text-muted-foreground">{post.wordCount} kata</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};