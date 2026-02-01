/**
 * FOOTER COMPONENT
 * Application footer with Dieter Rams quote
 */

import React from 'react';
import { cn } from '@/utils/cn';
import { theme } from '@/design-system';
import { APP_CONFIG } from '@/constants/config';

export const Footer: React.FC = () => {
  return (
    <footer
      className={cn(
        'mt-32 pt-12 border-t',
        theme.border.medium,
        'text-center',
        theme.text.muted,
        'text-sm'
      )}
    >
      <p className="mb-2">„{APP_CONFIG.tagline}"</p>
      <p className="opacity-50">{APP_CONFIG.author}</p>
    </footer>
  );
};

Footer.displayName = 'Footer';
