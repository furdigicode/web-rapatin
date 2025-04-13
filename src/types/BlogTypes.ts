
export interface BlogPost {
  id: number;
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

export type BlogPostFormData = Omit<BlogPost, 'id'>;

export const defaultBlogPostFormData: BlogPostFormData = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  category: "",
  author: "Admin",
  date: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
  status: "draft",
  publishedAt: "",
  seoTitle: "",
  metaDescription: "",
  focusKeyword: ""
};
