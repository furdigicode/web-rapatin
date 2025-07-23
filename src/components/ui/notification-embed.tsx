import React from 'react';
import { createRoot } from 'react-dom/client';
import { NotificationWidget } from './notification-widget';
import { EmbedConfig } from '@/types/NotificationTypes';

// Global embed function that can be called from external scripts
declare global {
  interface Window {
    BlogNotificationWidget: {
      init: (config: EmbedConfig) => void;
      destroy: () => void;
    };
  }
}

class NotificationEmbedManager {
  private container: HTMLDivElement | null = null;
  private root: any = null;

  init(config: EmbedConfig = {}) {
    // Parse configuration
    const widgetConfig = {
      limit: config.limit || 5,
      showCategories: config.categories ? config.categories.split(',').map(c => c.trim()) : [],
      position: (config.position as any) || 'top-right',
      theme: (config.theme as any) || 'auto',
      autoHide: config.autoHide || false,
      autoHideDelay: config.autoHideDelay || 5000
    };

    // Create container
    this.container = document.createElement('div');
    this.container.id = 'blog-notification-widget';
    this.container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
    `;

    // Append to body
    document.body.appendChild(this.container);

    // Create React root and render
    if (this.container) {
      this.root = createRoot(this.container);
      this.root.render(
        <div style={{ pointerEvents: 'auto' }}>
          <NotificationWidget {...widgetConfig} />
        </div>
      );
    }
  }

  destroy() {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
    
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
      this.container = null;
    }
  }
}

// Create global instance
const embedManager = new NotificationEmbedManager();

// Expose global API
window.BlogNotificationWidget = {
  init: (config: EmbedConfig) => embedManager.init(config),
  destroy: () => embedManager.destroy()
};

// Auto-initialize if script has data attributes
const initFromScript = () => {
  const scripts = document.querySelectorAll('script[data-blog-notifications]');
  const script = scripts[scripts.length - 1] as HTMLScriptElement;
  
  if (script) {
    const config: EmbedConfig = {
      limit: parseInt(script.dataset.limit || '5'),
      categories: script.dataset.categories || '',
      position: script.dataset.position || 'top-right',
      theme: script.dataset.theme || 'auto',
      autoHide: script.dataset.autoHide === 'true',
      autoHideDelay: parseInt(script.dataset.autoHideDelay || '5000')
    };

    embedManager.init(config);
  }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFromScript);
} else {
  initFromScript();
}

export { NotificationEmbedManager };