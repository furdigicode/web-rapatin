import React from 'react';
import { Clock } from 'lucide-react';
import { useScheduledCountdown, formatScheduledDate } from '@/hooks/useScheduledCountdown';

interface ScheduledBadgeProps {
  publishedAt: string;
}

export function ScheduledBadge({ publishedAt }: ScheduledBadgeProps) {
  const countdown = useScheduledCountdown(publishedAt);
  const formattedDate = formatScheduledDate(publishedAt);

  return (
    <div className="flex flex-col gap-1">
      <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800 inline-flex items-center gap-1">
        <Clock size={10} />
        Scheduled
      </span>
      <span className="text-xs text-blue-600 font-medium">
        {countdown}
      </span>
      <span className="text-xs text-muted-foreground">
        {formattedDate}
      </span>
    </div>
  );
}
