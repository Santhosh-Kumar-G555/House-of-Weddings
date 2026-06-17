'use client';

import React, { useState, useEffect } from 'react';

export default function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const interval = setInterval(() => {
      const distance = new Date(targetDate).getTime() - new Date().getTime();
      
      if (distance < 0) {
        setTimeLeft('Started');
        clearInterval(interval);
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${days > 0 ? days + 'd ' : ''}${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (!timeLeft) return null;

  return (
    <span className="px-2 py-1 text-[10px] font-bold tracking-wider rounded uppercase border bg-primary/10 text-primary border-primary/20 flex items-center gap-1 animate-pulse">
      <span className="material-symbols-outlined text-[12px]">timer</span>
      In {timeLeft}
    </span>
  );
}
