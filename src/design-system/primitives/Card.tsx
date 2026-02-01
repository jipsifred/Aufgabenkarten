/**
 * CARD PRIMITIVE
 * Container component with consistent styling
 */

import React from 'react';
import { cn } from '@/utils/cn';
import { theme } from '../theme';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const variants = {
  default: cn(theme.bg.surface, 'border', theme.border.default, theme.shadow.sm),
  elevated: cn(theme.bg.surface, 'border', theme.border.default, theme.shadow.md),
  outlined: cn(theme.bg.surface, 'border', theme.border.default),
};

const paddings = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', padding = 'md', children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(theme.radius.lg, variants[variant], paddings[padding], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Sub-component for card sections
export interface CardSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardHeader: React.FC<CardSectionProps> = ({ children, className, ...props }) => (
  <div className={cn('mb-4', className)} {...props}>
    {children}
  </div>
);

export const CardContent: React.FC<CardSectionProps> = ({ children, className, ...props }) => (
  <div className={cn(className)} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<CardSectionProps> = ({ children, className, ...props }) => (
  <div className={cn('mt-6 pt-4 border-t', theme.border.light, className)} {...props}>
    {children}
  </div>
);
