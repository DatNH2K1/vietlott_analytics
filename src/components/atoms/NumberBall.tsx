import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NumberBallProps {
  number: number | string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  isSpecial?: boolean;
  className?: string;
}

export const NumberBall: React.FC<NumberBallProps> = ({
  number,
  color = '#3b82f6',
  size = 'md',
  isSpecial = false,
  className,
}) => {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-full font-bold shadow-lg text-white border-2 border-white/20',
        sizeClasses[size],
        isSpecial && 'border-yellow-400 ring-2 ring-yellow-400/30',
        className,
      )}
      style={{
        background: `radial-gradient(circle at 30% 30%, ${color}, ${darkenColor(color, 20)})`,
      }}
    >
      {number}
    </div>
  );
};

function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) - amt;
  const G = ((num >> 8) & 0x00ff) - amt;
  const B = (num & 0x0000ff) - amt;
  return (
    '#' +
    (
      0x1000000 +
      (R < 255 ? (R < 0 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 0 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 0 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
}
