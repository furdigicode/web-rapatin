
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  author: string;
  date: string;
  status: 'draft' | 'published' | 'scheduled';
  publishedAt: string;
  seoTitle: string;
  metaDescription: string;
  focusKeyword: string;
}

export interface BlogPostFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  author: string;
  status: 'draft' | 'published' | 'scheduled';
  publishedAt: string;
  seoTitle: string;
  metaDescription: string;
  focusKeyword: string;
}

export const defaultBlogPostFormData: BlogPostFormData = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  coverImage: '',
  category: '',
  author: 'Admin',
  status: 'draft',
  publishedAt: '',
  seoTitle: '',
  metaDescription: '',
  focusKeyword: ''
};
