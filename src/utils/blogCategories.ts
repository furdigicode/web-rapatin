
import { supabase } from '@/integrations/supabase/client';

// Default categories to use if none exist
export const DEFAULT_BLOG_CATEGORIES = [
  'General',
  'Tutorial',
  'News',
  'Tips & Tricks'
];

// Function to retrieve all unique categories from blog posts
export const getAllCategories = async (): Promise<string[]> => {
  try {
    // Get all unique categories from blog_posts
    const { data, error } = await supabase
      .from('blog_posts')
      .select('category')
      .not('category', 'is', null) as { data: any[], error: any };
    
    if (error) {
      console.error('Error fetching categories:', error);
      return DEFAULT_BLOG_CATEGORIES;
    }
    
    // Extract unique categories
    const uniqueCategories = Array.from(new Set(data.map(item => item.category)))
      .filter(Boolean)
      .sort();
      
    // Return default categories if there aren't any yet
    if (uniqueCategories.length === 0) {
      return DEFAULT_BLOG_CATEGORIES;
    }
    
    return uniqueCategories as string[];
  } catch (err) {
    console.error('Error in categories fetch:', err);
    return DEFAULT_BLOG_CATEGORIES;
  }
};

// Function to create a slug from a text
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};
