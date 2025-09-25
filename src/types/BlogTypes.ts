
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  author: string; // Legacy field for display
  author_id: string; // New FK to authors table
  date: string;
  status: 'draft' | 'published' | 'scheduled';
  publishedAt: string;
  seoTitle: string;
  metaDescription: string;
  focusKeyword: string;
  wordCount: number;
  sendNotification?: boolean;
}

export interface BlogPostFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  author: string; // Legacy field
  author_id: string; // New FK to authors table
  status: 'draft' | 'published' | 'scheduled';
  publishedAt: string | null;
  seoTitle: string;
  metaDescription: string;
  focusKeyword: string;
  wordCount: number;
  sendNotification?: boolean;
}

export const defaultBlogPostFormData: BlogPostFormData = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  coverImage: '',
  category: '',
  author: 'Admin',
  author_id: 'da51c3a0-4e84-4fe2-adfe-bd681a2fda2f',
  status: 'draft',
  publishedAt: null,
  seoTitle: '',
  metaDescription: '',
  focusKeyword: '',
  wordCount: 0
};
