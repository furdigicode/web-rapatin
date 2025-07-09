export interface Author {
  id: string;
  name: string;
  slug: string;
  email?: string;
  bio?: string;
  avatar_url?: string;
  social_links?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    website?: string;
  };
  specialization?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthorFormData {
  name: string;
  slug: string;
  email: string;
  bio: string;
  avatar_url: string;
  social_links: {
    twitter: string;
    linkedin: string;
    instagram: string;
    website: string;
  };
  specialization: string;
  is_active: boolean;
}

export const defaultAuthorFormData: AuthorFormData = {
  name: '',
  slug: '',
  email: '',
  bio: '',
  avatar_url: '',
  social_links: {
    twitter: '',
    linkedin: '',
    instagram: '',
    website: ''
  },
  specialization: '',
  is_active: true
};