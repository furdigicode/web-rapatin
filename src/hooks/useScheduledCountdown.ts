import { useState, useEffect } from 'react';

export function useScheduledCountdown(publishedAt: string | null) {
  const [countdown, setCountdown] = useState<string | null>(null);

  useEffect(() => {
    if (!publishedAt) {
      setCountdown(null);
      return;
    }

    const targetDate = new Date(publishedAt);
    
    const updateCountdown = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown('Segera dipublikasikan');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setCountdown(`${days}h ${hours}j lagi`);
      } else if (hours > 0) {
        setCountdown(`${hours}j ${minutes}m lagi`);
      } else {
        setCountdown(`${minutes}m lagi`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [publishedAt]);

  return countdown;
}

export function formatScheduledDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Convert ISO string to datetime-local format
export function toDatetimeLocalFormat(isoString: string | null): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  // Format: YYYY-MM-DDTHH:mm
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Convert datetime-local format to ISO string
export function fromDatetimeLocalFormat(datetimeLocal: string): string {
  if (!datetimeLocal) return '';
  return new Date(datetimeLocal).toISOString();
}
