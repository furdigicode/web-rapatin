/**
 * Blog Notification Widget Embed Script
 * Version: 2.0.0 - Added Popup Support
 * 
 * Usage:
 * <script src="https://yoursite.com/notification-widget.js" 
 *   data-blog-notifications="true"
 *   data-limit="5"
 *   data-position="top-right"
 *   data-theme="auto"
 *   data-popup="true">
 * </script>
 */

(function() {
  'use strict';

  // Configuration
  const WIDGET_ID = 'blog-notification-widget-container';
  const POPUP_ID = 'blog-notification-popup-container';
  const BASE_URL = 'https://mepznzrijuoyvjcmkspf.supabase.co/functions/v1';
  const SUPABASE_URL = 'https://mepznzrijuoyvjcmkspf.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lcHpuenJpanVveXZqY21rc3BmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczNzU5NDcsImV4cCI6MjA2Mjk1MTk0N30.mIGM28Ztelp6enqg36m03SB7v_Vlsruyd79Rj9mRUuA';
  
  // Global variables for real-time functionality
  let supabaseClient = null;
  let realtimeChannel = null;
  let currentNotifications = [];
  let widgetConfig = null;
  
  // Get script configuration
  function getConfig() {
    const scripts = document.querySelectorAll('script[data-blog-notifications]');
    const script = scripts[scripts.length - 1];
    
    return {
      limit: parseInt(script.dataset.limit || '5'),
      categories: script.dataset.categories || '',
      position: script.dataset.position || 'top-right',
      theme: script.dataset.theme || 'auto',
      autoHide: script.dataset.autoHide === 'true',
      autoHideDelay: parseInt(script.dataset.autoHideDelay || '5000'),
      realtime: script.dataset.realtime !== 'false', // enabled by default
      popup: script.dataset.popup !== 'false' // popup enabled by default
    };
  }

  // Create widget container
  function createContainer(config) {
    // Remove existing widget if present
    const existing = document.getElementById(WIDGET_ID);
    if (existing) {
      existing.remove();
    }

    const container = document.createElement('div');
    container.id = WIDGET_ID;
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
      font-family: system-ui, -apple-system, sans-serif;
    `;

    document.body.appendChild(container);
    return container;
  }

  // Load CSS styles
  function loadStyles() {
    const styleId = 'blog-notification-widget-styles';
    if (document.getElementById(styleId)) return;

    const link = document.createElement('link');
    link.id = styleId;
    link.rel = 'stylesheet';
    link.href = BASE_URL + '/assets/notification-widget.css';
    document.head.appendChild(link);
  }

  // Create notification widget HTML
  function createWidgetHTML(config) {
    const positionClasses = {
      'top-right': 'top: 20px; right: 20px;',
      'top-left': 'top: 20px; left: 20px;',
      'bottom-right': 'bottom: 20px; right: 20px;',
      'bottom-left': 'bottom: 20px; left: 20px;'
    };

    const themeClasses = {
      light: 'background: white; color: #1a1a1a; border: 1px solid #e5e5e5;',
      dark: 'background: #1a1a1a; color: white; border: 1px solid #404040;',
      auto: 'background: white; color: #1a1a1a; border: 1px solid #e5e5e5;'
    };

    return `
      <div id="notification-widget" style="
        position: fixed;
        ${positionClasses[config.position]}
        pointer-events: auto;
        z-index: 10000;
      ">
        <div id="notification-button" style="
          ${themeClasses[config.theme]}
          border-radius: 10px;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          transition: all 0.2s ease;
          position: relative;
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="hsl(196, 80%, 45%)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bell-icon lucide-bell">
            <path d="M10.268 21a2 2 0 0 0 3.464 0"/>
            <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>
          </svg>
          <div id="notification-badge" style="
            position: absolute;
            top: -5px;
            right: -5px;
            background: #ef4444;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            font-size: 12px;
            display: none;
            align-items: center;
            justify-content: center;
            font-weight: bold;
          "></div>
        </div>
        
        <div id="notification-panel" style="
          ${themeClasses[config.theme]}
          position: absolute;
          ${config.position.includes('right') ? 'right: 0;' : 'left: 0;'}
          ${config.position.includes('top') ? 'top: 70px;' : 'bottom: 70px;'}
          width: 320px;
          max-height: 400px;
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          display: none;
          flex-direction: column;
          overflow: hidden;
        ">
          <div style="
            padding: 16px;
            border-bottom: 1px solid ${config.theme === 'dark' ? '#404040' : '#e5e5e5'};
            display: flex;
            justify-content: space-between;
            align-items: center;
          ">
            <h3 style="margin: 0; font-size: 16px; font-weight: 600;">Informations</h3>
            <div style="display: flex; align-items: center; gap: 8px;">
              <button id="mark-all-read" style="
                background: none;
                border: none;
                cursor: pointer;
                color: #3b82f6;
                font-size: 12px;
                font-weight: 500;
                padding: 4px 8px;
                border-radius: 4px;
                transition: background-color 0.2s;
              " onmouseover="this.style.backgroundColor='#f1f5f9'" onmouseout="this.style.backgroundColor='transparent'">Tandai Semua Dibaca</button>
              <button id="close-notifications" style="
                background: none;
                border: none;
                cursor: pointer;
                color: inherit;
                font-size: 18px;
                line-height: 1;
                padding: 4px;
              ">&times;</button>
            </div>
          </div>
          <div id="notifications-list" style="
            flex: 1;
            overflow-y: auto;
            max-height: 320px;
          ">
            <div style="padding: 16px; text-align: center; color: #666;">
              Memuat notifikasi...
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Generate or get user ID for tracking
  function getUserId() {
    let userId = localStorage.getItem('notification_user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('notification_user_id', userId);
    }
    return userId;
  }

  // Check if popup was already shown based on display frequency
  function shouldShowPopup(popup) {
    const popupKey = `popup_shown_${popup.id}`;
    
    if (popup.display_frequency === 'once') {
      return !localStorage.getItem(popupKey);
    } else if (popup.display_frequency === 'every_session') {
      return !sessionStorage.getItem(popupKey);
    }
    // 'every_visit' - always show
    return true;
  }

  // Mark popup as shown
  function markPopupAsShown(popup) {
    const popupKey = `popup_shown_${popup.id}`;
    
    if (popup.display_frequency === 'once') {
      localStorage.setItem(popupKey, 'true');
    } else if (popup.display_frequency === 'every_session') {
      sessionStorage.setItem(popupKey, 'true');
    }
  }

  // Track popup interaction
  async function trackPopupInteraction(popupId, interactionType) {
    try {
      await fetch(`${BASE_URL}/track-popup-interaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ popupId, interactionType })
      });
    } catch (error) {
      console.error('Error tracking popup interaction:', error);
    }
  }

  // Fetch popup notifications
  async function fetchPopupNotifications() {
    try {
      const response = await fetch(`${BASE_URL}/get-notifications?type=popup&limit=10`);
      if (!response.ok) throw new Error('Failed to fetch popup notifications');
      
      const popups = await response.json();
      // Filter based on display frequency and sort by priority
      return popups
        .filter(popup => popup.is_active && shouldShowPopup(popup))
        .sort((a, b) => (b.priority || 0) - (a.priority || 0));
    } catch (error) {
      console.error('Error fetching popup notifications:', error);
      return [];
    }
  }

  // Create popup HTML
  function createPopupHTML(popup, config) {
    const themeStyles = config.theme === 'dark' 
      ? 'background: #1f2937; color: white; border: 1px solid #374151;'
      : 'background: white; color: #1a1a1a; border: 1px solid #e5e5e5;';

    const closeButtonHtml = popup.show_close_button !== false ? `
      <button id="popup-close-btn" style="
        position: absolute;
        top: 12px;
        right: 12px;
        background: none;
        border: none;
        cursor: pointer;
        color: ${config.theme === 'dark' ? '#9ca3af' : '#6b7280'};
        font-size: 24px;
        line-height: 1;
        padding: 4px;
        border-radius: 4px;
        transition: all 0.2s;
      " onmouseover="this.style.backgroundColor='${config.theme === 'dark' ? '#374151' : '#f3f4f6'}'" onmouseout="this.style.backgroundColor='transparent'">&times;</button>
    ` : '';

    const imageHtml = popup.image_url ? `
      <div style="
        width: 100%;
        max-height: 200px;
        overflow: hidden;
        border-radius: 8px;
        margin-bottom: 16px;
      ">
        <img src="${popup.image_url}" alt="${popup.title}" style="
          width: 100%;
          height: 100%;
          object-fit: cover;
        " />
      </div>
    ` : '';

    const buttonHtml = popup.button_text ? `
      <button id="popup-cta-btn" style="
        background: linear-gradient(135deg, hsl(196, 80%, 45%), hsl(196, 80%, 35%));
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        width: 100%;
        transition: all 0.2s;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(0,0,0,0.2)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'">${popup.button_text}</button>
    ` : '';

    return `
      <div id="popup-overlay" style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
        animation: fadeIn 0.3s ease;
        padding: 20px;
      ">
        <div id="popup-content" style="
          ${themeStyles}
          max-width: 420px;
          width: 100%;
          padding: 24px;
          border-radius: 16px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          position: relative;
          animation: slideUp 0.3s ease;
          max-height: 90vh;
          overflow-y: auto;
        ">
          ${closeButtonHtml}
          ${imageHtml}
          <h2 style="
            margin: 0 0 12px 0;
            font-size: 20px;
            font-weight: 700;
            line-height: 1.3;
            padding-right: ${popup.show_close_button !== false ? '32px' : '0'};
          ">${popup.title}</h2>
          ${popup.excerpt ? `
            <p style="
              margin: 0 0 20px 0;
              font-size: 15px;
              line-height: 1.6;
              color: ${config.theme === 'dark' ? '#d1d5db' : '#4b5563'};
            ">${popup.excerpt}</p>
          ` : ''}
          ${buttonHtml}
        </div>
      </div>
      <style>
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      </style>
    `;
  }

  // Show popup notification
  async function showPopup(popup, config) {
    // Create popup container
    let popupContainer = document.getElementById(POPUP_ID);
    if (popupContainer) {
      popupContainer.remove();
    }

    popupContainer = document.createElement('div');
    popupContainer.id = POPUP_ID;
    popupContainer.innerHTML = createPopupHTML(popup, config);
    document.body.appendChild(popupContainer);

    // Track view
    trackPopupInteraction(popup.id, 'view');

    // Mark as shown
    markPopupAsShown(popup);

    // Setup event listeners
    const overlay = document.getElementById('popup-overlay');
    const closeBtn = document.getElementById('popup-close-btn');
    const ctaBtn = document.getElementById('popup-cta-btn');

    const closePopup = () => {
      overlay.style.animation = 'fadeOut 0.2s ease';
      setTimeout(() => {
        popupContainer.remove();
      }, 200);
    };

    if (closeBtn) {
      closeBtn.addEventListener('click', closePopup);
    }

    // Close on overlay click (outside popup content)
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closePopup();
      }
    });

    // CTA button click
    if (ctaBtn && popup.button_url) {
      ctaBtn.addEventListener('click', () => {
        trackPopupInteraction(popup.id, 'click');
        if (popup.button_url.startsWith('http')) {
          window.open(popup.button_url, '_blank');
        } else {
          window.location.href = popup.button_url;
        }
        closePopup();
      });
    }

    // Close on Escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closePopup();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  }

  // Initialize popup notifications
  async function initPopups(config) {
    if (!config.popup) return;

    const popups = await fetchPopupNotifications();
    if (popups.length > 0) {
      // Show highest priority popup
      showPopup(popups[0], config);
    }
  }

  // Fetch notifications from API
  async function fetchNotifications(config) {
    try {
      const userId = getUserId();
      const params = new URLSearchParams({
        limit: config.limit.toString(),
        userId: userId,
        type: 'widget'
      });
      
      if (config.categories) {
        params.append('categories', config.categories);
      }

      const response = await fetch(`${BASE_URL}/get-notifications?${params}`);
      if (!response.ok) throw new Error('Failed to fetch notifications');
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  // Render notifications
  function renderNotifications(notifications, config) {
    const listElement = document.getElementById('notifications-list');
    const badgeElement = document.getElementById('notification-badge');
    
    const unreadCount = notifications.filter(n => !n.read).length;
    
    // Update badge
    if (unreadCount > 0) {
      badgeElement.textContent = unreadCount > 99 ? '99+' : unreadCount.toString();
      badgeElement.style.display = 'flex';
    } else {
      badgeElement.style.display = 'none';
    }

    // Render notification list
    if (notifications.length === 0) {
      listElement.innerHTML = `
        <div style="padding: 16px; text-align: center; color: #666;">
          Tidak ada notifikasi
        </div>
      `;
      return;
    }

    listElement.innerHTML = notifications.map(notification => {
      const timeAgo = formatTimeAgo(notification.created_at);
      
      return `
        <div class="notification-item" data-id="${notification.id}" style="
          padding: 16px;
          border-bottom: 1px solid ${config.theme === 'dark' ? '#333' : '#f0f0f0'};
          cursor: pointer;
          transition: all 0.2s ease;
          ${!notification.read ? 'background-color: rgba(59, 130, 246, 0.05); border-left: 4px solid hsl(196, 80%, 45%);' : ''}
        ">
          <div style="display: flex; gap: 12px;">
            <div style="flex: 1; min-width: 0;">
              <div style="display: flex; align-items: start; gap: 8px;">
                <h4 style="
                  margin: 0 0 4px 0;
                  font-size: 14px;
                  font-weight: ${!notification.read ? '600' : '500'};
                  line-height: 1.3;
                  overflow: hidden;
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical;
                  color: inherit;
                ">${notification.title}</h4>
                ${!notification.read ? '<div style="width: 8px; height: 8px; background: hsl(196, 80%, 45%); border-radius: 50%; flex-shrink: 0; margin-top: 2px;"></div>' : ''}
              </div>
              ${notification.excerpt ? `
                <p style="
                  margin: 4px 0;
                  font-size: 12px;
                  color: #666;
                  line-height: 1.4;
                  overflow: hidden;
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical;
                ">${notification.excerpt}</p>
              ` : ''}
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
                <span style="font-size: 11px; color: #888;">${timeAgo}</span>
                ${notification.category ? `
                  <span style="
                    background: ${config.theme === 'dark' ? '#333' : '#f3f4f6'};
                    color: ${config.theme === 'dark' ? '#ccc' : '#666'};
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 10px;
                    font-weight: 500;
                  ">${notification.category}</span>
                ` : ''}
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Add click handlers
    listElement.querySelectorAll('.notification-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = item.dataset.id;
        const notification = notifications.find(n => n.id === id);
        if (notification) {
          handleNotificationClick(notification, config);
        }
      });
      
      item.addEventListener('mouseenter', () => {
        item.style.backgroundColor = config.theme === 'dark' ? '#2a2a2a' : '#f9f9f9';
      });
      
      item.addEventListener('mouseleave', () => {
        const notification = notifications.find(n => n.id === item.dataset.id);
        item.style.backgroundColor = notification && !notification.read ? 
          (config.theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)') : 
          'transparent';
      });
    });
  }

  // Handle notification click
  function handleNotificationClick(notification, config) {
    // Mark as read for all notification types
    if (!notification.read) {
      markAsRead(notification.id);
    }

    // Navigate using target_url if available, fallback to relative path
    if (notification.target_url) {
      if (notification.target_url.startsWith('http')) {
        window.open(notification.target_url, '_blank');
      } else {
        window.location.href = notification.target_url;
      }
    } else {
      // Fallback for older notifications without target_url
      const slug = notification.blog_posts?.slug || notification.blog_post_id;
      window.open(`/blog/${slug}`, '_blank');
    }
  }

  // Mark notification as read
  async function markAsRead(notificationId) {
    try {
      const userId = getUserId();
      const response = await fetch(`${BASE_URL}/mark-notification-read/${notificationId}/read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
      });

      if (response.ok) {
        // Update local state
        const notification = currentNotifications.find(n => n.id === notificationId);
        if (notification) {
          notification.read = true;
          updateBadge();
          renderNotifications(currentNotifications, widgetConfig);
        }
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  // Format time ago
  function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Baru saja';
    if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} hari yang lalu`;
    return date.toLocaleDateString('id-ID');
  }

  // Load Supabase client
  async function loadSupabaseClient() {
    if (supabaseClient) return supabaseClient;
    
    try {
      // Load Supabase JS library
      if (!window.supabase) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js';
        document.head.appendChild(script);
        
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });
      }
      
      // Create Supabase client
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      console.log('Supabase client loaded for widget');
      return supabaseClient;
    } catch (error) {
      console.error('Failed to load Supabase client:', error);
      return null;
    }
  }

  // Setup real-time subscription
  function setupRealtimeSubscription(config) {
    if (!config.realtime || !supabaseClient) return;
    
    console.log('Setting up real-time subscription for notifications');
    
    // Create channel for real-time updates
    realtimeChannel = supabaseClient
      .channel('notification-updates')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'article_notifications'
      }, (payload) => {
        console.log('New notification received:', payload);
        handleNewNotification(payload.new, config);
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'article_notifications'
      }, (payload) => {
        console.log('Notification updated:', payload);
        handleUpdatedNotification(payload.new, config);
      })
      .subscribe((status) => {
        console.log('Real-time subscription status:', status);
      });
  }

  // Handle new notification from real-time
  function handleNewNotification(notification, config) {
    // Check if it's a popup notification
    if (notification.notification_type === 'popup' && notification.is_active && config.popup) {
      if (shouldShowPopup(notification)) {
        showPopup(notification, config);
      }
      return;
    }

    // Check if notification matches category filter
    if (config.categories && notification.category) {
      const allowedCategories = config.categories.split(',').map(c => c.trim());
      if (!allowedCategories.includes(notification.category)) {
        return; // Skip if not in allowed categories
      }
    }
    
    // Add to current notifications array (keeping limit)
    currentNotifications.unshift(notification);
    if (currentNotifications.length > config.limit) {
      currentNotifications = currentNotifications.slice(0, config.limit);
    }
    
    // Update badge immediately
    updateBadge();
    
    // Update panel if it's open
    const panel = document.getElementById('notification-panel');
    if (panel && panel.style.display === 'flex') {
      renderNotifications(currentNotifications, config);
    }
    
    // Show brief visual indicator for new notification
    showNewNotificationIndicator();
  }

  // Handle updated notification from real-time
  function handleUpdatedNotification(updatedNotification, config) {
    // Find and update notification in current array
    const index = currentNotifications.findIndex(n => n.id === updatedNotification.id);
    if (index !== -1) {
      currentNotifications[index] = updatedNotification;
      
      // Update badge
      updateBadge();
      
      // Update panel if it's open
      const panel = document.getElementById('notification-panel');
      if (panel && panel.style.display === 'flex') {
        renderNotifications(currentNotifications, config);
      }
    }
  }

  // Update badge based on current notifications
  function updateBadge() {
    const badgeElement = document.getElementById('notification-badge');
    const markAllReadBtn = document.getElementById('mark-all-read');
    if (!badgeElement) return;
    
    const unreadCount = currentNotifications.filter(n => !n.read).length;
    
    if (unreadCount > 0) {
      badgeElement.textContent = unreadCount > 99 ? '99+' : unreadCount.toString();
      badgeElement.style.display = 'flex';
      if (markAllReadBtn) markAllReadBtn.style.display = 'block';
    } else {
      badgeElement.style.display = 'none';
      if (markAllReadBtn) markAllReadBtn.style.display = 'none';
    }
  }

  // Show visual indicator for new notification
  function showNewNotificationIndicator() {
    const button = document.getElementById('notification-button');
    if (!button) return;
    
    // Add a subtle animation to indicate new notification
    button.style.transform = 'scale(1.1)';
    button.style.transition = 'transform 0.2s ease';
    
    setTimeout(() => {
      button.style.transform = 'scale(1)';
    }, 200);
  }

  // Cleanup real-time subscription
  function cleanupRealtime() {
    if (realtimeChannel) {
      console.log('Cleaning up real-time subscription');
      supabaseClient?.removeChannel(realtimeChannel);
      realtimeChannel = null;
    }
  }

  // Initialize widget
  async function init() {
    const config = getConfig();
    widgetConfig = config;
    const container = createContainer(config);
    
    // Load styles
    loadStyles();
    
    // Create widget HTML
    container.innerHTML = createWidgetHTML(config);
    
    // Load Supabase client and setup real-time if enabled
    if (config.realtime) {
      try {
        await loadSupabaseClient();
        setupRealtimeSubscription(config);
      } catch (error) {
        console.warn('Failed to setup real-time functionality:', error);
      }
    }
    
    // Initialize popup notifications
    initPopups(config);
    
    // Get DOM elements
    const button = document.getElementById('notification-button');
    const panel = document.getElementById('notification-panel');
    const closeBtn = document.getElementById('close-notifications');
    const markAllReadBtn = document.getElementById('mark-all-read');
    
    let isOpen = false;
    
    // Toggle panel
    function togglePanel() {
      isOpen = !isOpen;
      panel.style.display = isOpen ? 'flex' : 'none';
      
      if (isOpen) {
        // Use current notifications if available, otherwise fetch
        if (currentNotifications.length > 0) {
          renderNotifications(currentNotifications, config);
        } else {
          fetchNotifications(config).then(notifications => {
            currentNotifications = notifications;
            renderNotifications(notifications, config);
          });
        }
      }
    }
    
    // Mark all as read functionality
    async function markAllAsRead() {
      try {
        const unreadNotifications = currentNotifications.filter(n => !n.read);
        if (unreadNotifications.length === 0) return;

        const userId = getUserId();
        const response = await fetch(`${BASE_URL}/mark-all-notifications-read`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            userId,
            categories: config.categories ? config.categories.split(',') : undefined
          })
        });

        if (response.ok) {
          // Update local state
          currentNotifications = currentNotifications.map(n => ({ ...n, read: true }));
          
          // Update UI
          renderNotifications(currentNotifications, config);
          updateBadge();
          
          console.log('All notifications marked as read');
        }
      } catch (error) {
        console.error('Error marking all as read:', error);
      }
    }

    // Event listeners
    button.addEventListener('click', togglePanel);
    closeBtn.addEventListener('click', () => {
      isOpen = false;
      panel.style.display = 'none';
    });
    markAllReadBtn.addEventListener('click', markAllAsRead);
    
    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (isOpen && !container.contains(e.target)) {
        isOpen = false;
        panel.style.display = 'none';
      }
    });
    
    // Initial load to show badge and store notifications
    fetchNotifications(config).then(notifications => {
      currentNotifications = notifications;
      updateBadge();
    });

    // Auto-hide functionality
    if (config.autoHide) {
      setTimeout(() => {
        container.style.display = 'none';
      }, config.autoHideDelay);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose global API
  window.BlogNotificationWidget = {
    init: init,
    destroy: function() {
      // Cleanup real-time subscription
      cleanupRealtime();
      
      // Remove containers
      const widgetContainer = document.getElementById(WIDGET_ID);
      if (widgetContainer) {
        widgetContainer.remove();
      }
      
      const popupContainer = document.getElementById(POPUP_ID);
      if (popupContainer) {
        popupContainer.remove();
      }
      
      // Reset global state
      currentNotifications = [];
      widgetConfig = null;
    },
    showPopup: async function(popupId) {
      // Manually show a specific popup
      const response = await fetch(`${BASE_URL}/get-notifications?type=popup&limit=100`);
      const popups = await response.json();
      const popup = popups.find(p => p.id === popupId);
      if (popup) {
        showPopup(popup, widgetConfig || getConfig());
      }
    }
  };

})();
