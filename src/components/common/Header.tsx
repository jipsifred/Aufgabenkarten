/**
 * HEADER COMPONENT
 * Application header with branding and actions
 */

import React from 'react';
import { RefreshCw, Upload } from 'lucide-react';
import { cn } from '@/utils/cn';
import { theme } from '@/design-system';
import { Button } from '@/design-system/primitives';

export interface HeaderProps {
  onReset?: () => void;
  onImport?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset, onImport }) => {
  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className={cn(theme.layout.container, 'px-6 h-16', theme.layout.flexBetween)}>
        {/* Branding */}
        <div className="flex items-center gap-3">
          <div className={cn('w-3 h-3', theme.bg.accent, 'rounded-full')} />
          <h1 className="font-bold text-lg tracking-tight text-neutral-900">
            Process.Card
          </h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {onReset && (
            <button
              onClick={onReset}
              className="text-xs font-medium text-neutral-500 hover:text-neutral-900 uppercase tracking-wider flex items-center gap-2 transition-colors"
            >
              <RefreshCw size={14} />
              Reset
            </button>
          )}

          <div className="h-4 w-px bg-neutral-200" />

          {onImport && (
            <Button
              variant="primary"
              size="md"
              onClick={onImport}
              leftIcon={<Upload size={16} />}
            >
              Import JSON
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

Header.displayName = 'Header';
