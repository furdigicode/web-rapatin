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

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('article_notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      // Filter by categories if provided
      if (categories.length > 0) {
        query = query.in('category', categories);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      setNotifications(data || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [limit, categories]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('article_notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) {
        throw error;
      }

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
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
      
      if (unreadIds.length === 0) return;

      const { error } = await supabase
        .from('article_notifications')
        .update({ read: true })
        .in('id', unreadIds);

      if (error) {
        throw error;
      }

      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  }, [notifications]);

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