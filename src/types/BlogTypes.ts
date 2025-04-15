
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

export interface SupabaseBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  cover_image?: string | null;
  category?: string | null;
  author?: string | null;
  created_at: string;
  status: 'draft' | 'published' | 'scheduled';
  published_at?: string | null;
  seo_title?: string | null;
  meta_description?: string | null;
  focus_keyword?: string | null;
}

export type BlogPostFormData = Omit<BlogPost, 'id' | 'date'>;

export const defaultBlogPostFormData: BlogPostFormData = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  category: "",
  author: "Admin",
  status: "draft",
  publishedAt: "",
  seoTitle: "",
  metaDescription: "",
  focusKeyword: ""
};
