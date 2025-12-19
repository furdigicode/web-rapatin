export interface ArticleNotification {
  id: string;
  blog_post_id: string;
  title: string;
  excerpt: string | null;
  image_url: string | null;
  target_url: string | null;
  created_at: string;
  read: boolean;
  notification_type: 'new_article' | 'custom' | 'popup';
  category: string | null;
  // Popup-specific fields
  button_text: string | null;
  button_url: string | null;
  display_frequency: 'once' | 'every_visit' | 'every_session';
  show_close_button: boolean;
  is_active: boolean;
  priority: number;
  popup_view_count: number;
  popup_click_count: number;
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

export interface PopupNotification extends ArticleNotification {
  notification_type: 'popup';
}