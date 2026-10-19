import React from 'react';
import { cn } from '@/lib/utils';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  id?: string;
  hasGlow?: boolean;
}

export const Section: React.FC<SectionProps> = ({
  children,
  className,
  id,
  hasGlow = false,
  ...props
}) => {
  return (
    <section
      id={id}
      className={cn(
        'relative py-16 sm:py-24 overflow-hidden',
        hasGlow && 'before:absolute before:inset-0 before:bg-hero-glow before:pointer-events-none',
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
};
