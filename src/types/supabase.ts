
// Custom Supabase type definitions
// These complement the auto-generated types from src/integrations/supabase/types.ts

import { Database } from "@/integrations/supabase/types";

// URLs table types
export type Urls = {
  id: string;
  title: string;
  items: UrlItem[];
};

export type UrlItem = {
  label: string;
  description: string;
  url: string;
};

// Brand logos types
export type BrandLogo = {
  id: string;
  name: string;
  svg_content: string;
  width: number;
  height: number;
  active: boolean;
  order_position: number;
  url?: string;
};

// FAQ types
export type FAQItem = {
  id: string;
  question: string;
  answer: string;
  category: string;
  active: boolean;
  order_position: number;
};

// Testimonial types
export type Testimonial = {
  id: string;
  name: string;
  position: string;
  company: string;
  content: string;
  avatar_url?: string;
  rating: number;
  active: boolean;
  order_position: number;
};

// Blog post types
export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  image_url?: string;
  published_at: string;
  is_published: boolean;
  author: string;
  view_count: number;
};

// About page content types
export type AboutSection = {
  id: string;
  section_name: string;
  title: string;
  content: string;
  image_url?: string;
  order_position: number;
};

// Contact info types
export type ContactInfo = {
  id: string;
  type: string;
  value: string;
  icon?: string;
};

// Terms content types
export type TermsContent = {
  id: string;
  version: string;
  content: string;
  updated_at: string;
};

// Privacy content types
export type PrivacyContent = {
  id: string;
  version: string;
  content: string;
  updated_at: string;
};

// Extend the Database type if needed in the future
export type ExtendedDatabase = Database & {
  // Add additional custom types here if needed
};
