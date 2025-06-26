
import React from 'react';
import { useCountdown } from '@/hooks/useCountdown';

const CountdownTimer: React.FC = () => {
  const { days, hours, minutes, seconds, isPromoActive } = useCountdown();

  if (!isPromoActive) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-red-500 to-pink-500 p-4 rounded-lg text-white text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        <span className="text-sm font-medium animate-pulse">⏰ Promo Berakhir Dalam:</span>
      </div>
      <div className="flex justify-center gap-2">
        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[50px]">
          <div className="text-lg font-bold">{days}</div>
          <div className="text-xs">Hari</div>
        </div>
        <div className="flex items-center text-xl font-bold">:</div>
        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[50px]">
          <div className="text-lg font-bold">{hours}</div>
          <div className="text-xs">Jam</div>
        </div>
        <div className="flex items-center text-xl font-bold">:</div>
        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[50px]">
          <div className="text-lg font-bold">{minutes}</div>
          <div className="text-xs">Menit</div>
        </div>
        <div className="flex items-center text-xl font-bold">:</div>
        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[50px]">
          <div className="text-lg font-bold">{seconds}</div>
          <div className="text-xs">Detik</div>
        </div>
      </div>
      <div className="text-xs mt-2 opacity-90">
        Harga normal berlaku mulai 1 Agustus 2025
      </div>
    </div>
  );
};

export default CountdownTimer;
