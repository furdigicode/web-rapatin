import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ArticleNotification } from '@/types/NotificationTypes';

interface UseNotificationsProps {
  limit?: number;
  categories?: string[];
}

export const useNotifications = ({ limit = 10, categories = [] }: UseNotificationsProps = {}) => {
  const [notifications, setNotifications] = useState<ArticleNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Generate or get user ID for tracking
  const getUserId = useCallback(() => {
    let userId = localStorage.getItem('notification_user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('notification_user_id', userId);
    }
    return userId;
  }, []);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const userId = getUserId();
      const params = new URLSearchParams({
        limit: limit.toString(),
        userId: userId,
      });

      if (categories.length > 0) {
        params.append('categories', categories.join(','));
      }

      const { data, error } = await supabase.functions.invoke('get-notifications', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (error) throw error;

      setNotifications(data || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [limit, categories, getUserId]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const userId = getUserId();
      
      const { error } = await supabase.functions.invoke('mark-notification-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          userId: userId
        }
      });

      if (error) throw error;

      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  }, [getUserId]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      const userId = getUserId();
      
      const { error } = await supabase.functions.invoke('mark-all-notifications-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          userId: userId,
          categories: categories.length > 0 ? categories : undefined
        }
      });

      if (error) throw error;

      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  }, [getUserId, categories]);

  // Set up real-time subscription
  useEffect(() => {
    fetchNotifications();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'article_notifications'
        },
        (payload) => {
          const newNotification = payload.new as ArticleNotification;
          
          // Check if notification matches category filter
          if (categories.length > 0 && newNotification.category && !categories.includes(newNotification.category)) {
            return;
          }

          setNotifications(prev => {
            // Avoid duplicates and maintain limit
            const filtered = prev.filter(n => n.id !== newNotification.id);
            const updated = [newNotification, ...filtered];
            return updated.slice(0, limit);
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'article_notifications'
        },
        (payload) => {
          const updatedNotification = payload.new as ArticleNotification;
          
          setNotifications(prev => 
            prev.map(notification => 
              notification.id === updatedNotification.id 
                ? updatedNotification 
                : notification
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchNotifications, categories, limit]);

  return {
    notifications,
    loading,
    error,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications
  };
};