
import React from 'react';
import { useCountdown } from '@/hooks/useCountdown';

interface CountdownTimerProps {
  targetDate: Date;
  className?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, className = '' }) => {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(targetDate);

  if (isExpired) {
    return null;
  }

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <div className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded text-sm font-mono">
        <span className="font-bold">{days.toString().padStart(2, '0')}</span>
        <span className="text-xs">hari</span>
      </div>
      <span className="text-red-500">:</span>
      <div className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded text-sm font-mono">
        <span className="font-bold">{hours.toString().padStart(2, '0')}</span>
        <span className="text-xs">jam</span>
      </div>
      <span className="text-red-500">:</span>
      <div className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded text-sm font-mono">
        <span className="font-bold">{minutes.toString().padStart(2, '0')}</span>
        <span className="text-xs">mnt</span>
      </div>
      <span className="text-red-500">:</span>
      <div className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded text-sm font-mono">
        <span className="font-bold">{seconds.toString().padStart(2, '0')}</span>
        <span className="text-xs">dtk</span>
      </div>
    </div>
  );
};

export default CountdownTimer;
