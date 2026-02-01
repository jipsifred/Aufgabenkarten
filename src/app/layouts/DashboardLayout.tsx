/**
 * DASHBOARD LAYOUT
 * Main layout wrapper for dashboard pages
 */

import React from 'react';
import { cn } from '@/utils/cn';
import { theme, fontFamily, selectionStyle } from '@/design-system';

export interface DashboardLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  header,
}) => {
  return (
    <div className={cn('min-h-screen', theme.bg.page, fontFamily, selectionStyle, 'pb-20')}>
      {header}
      <main className={cn(theme.layout.container, 'px-6 py-12')}>{children}</main>
    </div>
  );
};

DashboardLayout.displayName = 'DashboardLayout';
