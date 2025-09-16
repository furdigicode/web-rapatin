import React, { useState, useEffect } from 'react';
import { Bell, X, Eye, EyeOff } from 'lucide-react';
import { Button } from './button';
import { Badge } from './badge';
import { Card, CardContent } from './card';
import { ScrollArea } from './scroll-area';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationWidgetProps } from '@/types/NotificationTypes';
import { cn } from '@/lib/utils';

export const NotificationWidget: React.FC<NotificationWidgetProps> = ({
  limit = 5,
  showCategories = [],
  position = 'top-right',
  theme = 'auto',
  autoHide = false,
  autoHideDelay = 5000
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hideWidget, setHideWidget] = useState(false);
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications({ limit, categories: showCategories });

  // Auto-hide functionality
  useEffect(() => {
    if (autoHide && unreadCount > 0) {
      const timer = setTimeout(() => {
        setHideWidget(true);
      }, autoHideDelay);

      return () => clearTimeout(timer);
    }
  }, [autoHide, autoHideDelay, unreadCount]);

  // Position classes
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  };

  // Theme classes
  const themeClasses = {
    light: 'bg-background text-foreground border-border',
    dark: 'bg-slate-900 text-white border-slate-700',
    auto: 'bg-background text-foreground border-border'
  };

  if (hideWidget) {
    return null;
  }

  return (
    <div className={cn('fixed z-50', positionClasses[position])}>
      {/* Notification Bell Button */}
      <div className="relative">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'relative shadow-lg transition-all duration-200 hover:scale-105',
            themeClasses[theme]
          )}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>

        {/* Auto-hide toggle */}
        {autoHide && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setHideWidget(true)}
            className="absolute -top-8 right-0 text-xs opacity-70 hover:opacity-100"
          >
            <EyeOff className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Notification Panel */}
      {isOpen && (
        <Card className={cn(
          'absolute w-80 shadow-xl animate-in duration-200',
          position.includes('bottom') 
            ? 'bottom-full mb-2 slide-in-from-bottom-2' 
            : 'top-full mt-2 slide-in-from-top-2',
          position.includes('right') ? 'right-0' : 'left-0',
          themeClasses[theme]
        )}>
          <CardContent className="p-0">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold text-sm">Informations</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    Tandai Semua Dibaca
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-6 w-6"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Notifications List */}
            <ScrollArea className="max-h-96">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  Tidak ada notifikasi
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={markAsRead}
                      theme={theme}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Notification Item Component
interface NotificationItemProps {
  notification: any;
  onMarkAsRead: (id: string) => void;
  theme: string;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  theme
}) => {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Baru saja';
    if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} hari yang lalu`;
    return date.toLocaleDateString('id-ID');
  };

  return (
    <div
      className={cn(
        'p-4 hover:bg-muted/50 transition-all duration-200 cursor-pointer',
        !notification.read ? 'bg-primary/5 border-l-4 border-l-primary' : 'opacity-60 bg-muted/20'
      )}
      onClick={() => {
        // Mark as read for all notification types
        if (!notification.read) {
          onMarkAsRead(notification.id);
        }
        // Navigate based on notification type
        if (notification.notification_type === 'custom' && notification.target_url) {
          window.open(notification.target_url, '_blank');
        } else if (notification.blog_post_id) {
          window.open(`/blog/${notification.blog_post_id}`, '_blank');
        }
      }}
    >
      <div>
        {/* Content */}
        <div className="w-full">
          <div className="flex items-start justify-between gap-2">
            <h4 className={cn(
              'text-sm font-medium line-clamp-2',
              !notification.read ? 'font-semibold' : 'text-muted-foreground'
            )}>
              {notification.title}
            </h4>
            {!notification.read && (
              <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />
            )}
          </div>

          {notification.excerpt && (
            <p className={cn(
              'text-xs mt-1 line-clamp-2',
              notification.read ? 'text-muted-foreground/70' : 'text-muted-foreground'
            )}>
              {notification.excerpt}
            </p>
          )}

          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground">
              {formatTimeAgo(notification.created_at)}
            </span>
            {notification.category && (
              <Badge variant="secondary" className="text-xs">
                {notification.category}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};