import React from 'react';
import { cn } from '@/lib/utils';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'subtle' | 'interactive';
  intensity?: 'low' | 'medium' | 'high';
  hasGlow?: boolean;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      children,
      className,
      variant = 'default',
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      default:
        'bg-saluang-cream border-2 border-saluang-dark rounded-3xl shadow-neo-md transition-all duration-200',
      elevated:
        'bg-saluang-cream border-2 border-saluang-dark rounded-3xl shadow-neo-lg transition-all duration-200',
      subtle:
        'bg-saluang-cream/90 border border-saluang-dark/40 rounded-2xl shadow-neo-sm',
      interactive:
        'bg-saluang-cream border-2 border-saluang-dark rounded-3xl shadow-neo-md hover:-translate-y-1 hover:shadow-neo-lg transition-all duration-200 cursor-pointer',
    };

    return (
      <div
        ref={ref}
        className={cn(variantStyles[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = 'GlassCard';
