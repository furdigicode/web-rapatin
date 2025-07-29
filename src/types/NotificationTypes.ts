export interface ArticleNotification {
  id: string;
  blog_post_id: string;
  title: string;
  excerpt: string | null;
  image_url: string | null;
  target_url: string | null;
  created_at: string;
  read: boolean;
  notification_type: string;
  category: string | null;
}

export interface NotificationWidgetProps {
  limit?: number;
  showCategories?: string[];
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  theme?: 'light' | 'dark' | 'auto';
  autoHide?: boolean;
  autoHideDelay?: number;
}

export interface EmbedConfig {
  apiKey?: string;
  limit?: number;
  categories?: string;
  position?: string;
  theme?: string;
  autoHide?: boolean;
  autoHideDelay?: number;
}