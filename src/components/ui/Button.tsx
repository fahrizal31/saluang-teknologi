import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'coral' | 'yellow' | 'teal' | 'outline' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  isExternal?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      href,
      isExternal = false,
      leftIcon,
      rightIcon,
      isLoading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    // Tactile neo-brutalist base with solid shadow and press effect
    const baseStyles =
      'inline-flex items-center justify-center font-bold tracking-tight rounded-xl select-none transition-all duration-150 border-2 border-saluang-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saluang-dark focus-visible:ring-offset-2 active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-50 disabled:pointer-events-none';

    const sizeStyles = {
      sm: 'text-xs px-3.5 py-1.5 gap-1.5 shadow-neo-sm active:shadow-[1px_1px_0px_#3A1F3D]',
      md: 'text-sm px-5 py-2.5 gap-2 shadow-neo active:shadow-neo-sm',
      lg: 'text-base px-6 py-3.5 gap-2.5 shadow-neo-md active:shadow-neo',
    };

    const variantStyles = {
      primary:
        'bg-saluang-coral text-white hover:bg-[#E54A3B]',
      coral:
        'bg-saluang-coral text-white hover:bg-[#E54A3B]',
      yellow:
        'bg-saluang-yellow text-saluang-dark hover:bg-[#E5A315]',
      teal:
        'bg-saluang-teal text-white hover:bg-[#25A788]',
      // Cream / Secondary
      secondary:
        'bg-saluang-cream text-saluang-dark hover:bg-[#F3EFE6]',
      // Dark Deep Aubergine
      glass:
        'bg-saluang-dark text-white hover:bg-[#4E2B52]',
      // Outline
      outline:
        'bg-transparent text-saluang-dark hover:bg-saluang-cream/80',
      // Ghost (No border)
      ghost:
        'border-transparent shadow-none active:translate-x-0 active:translate-y-0 text-saluang-dark hover:bg-saluang-dark/10',
    };

    const content = (
      <>
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && leftIcon}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </>
    );

    if (href) {
      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
            ref={ref as React.Ref<HTMLAnchorElement>}
          >
            {content}
          </a>
        );
      }
      return (
        <Link
          href={href}
          className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
          ref={ref as React.Ref<HTMLAnchorElement>}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        disabled={disabled || isLoading}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';
