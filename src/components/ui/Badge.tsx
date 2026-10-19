import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'brand' | 'accent' | 'neutral' | 'success' | 'coral' | 'yellow' | 'pink' | 'teal' | 'outline';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'brand',
  size = 'md',
  ...props
}) => {
  const variantStyles = {
    brand: 'bg-saluang-teal text-white border-saluang-dark',
    teal: 'bg-saluang-teal text-white border-saluang-dark',
    accent: 'bg-saluang-mint text-saluang-dark border-saluang-dark',
    coral: 'bg-saluang-coral text-white border-saluang-dark',
    yellow: 'bg-saluang-yellow text-saluang-dark border-saluang-dark',
    pink: 'bg-saluang-pink text-saluang-dark border-saluang-dark',
    neutral: 'bg-saluang-cream text-saluang-dark border-saluang-dark',
    success: 'bg-emerald-400 text-slate-900 border-saluang-dark',
    outline: 'bg-transparent text-saluang-dark border-saluang-dark',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5 rounded-full font-bold tracking-tight shadow-[1.5px_1.5px_0px_#3A1F3D]',
    md: 'text-xs px-3.5 py-1 rounded-full font-bold tracking-tight shadow-neo-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center border-2 font-sans select-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
