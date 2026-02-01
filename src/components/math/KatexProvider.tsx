/**
 * KATEX PROVIDER COMPONENT
 * Ensures KaTeX is loaded before rendering children
 */

import React from 'react';
import { useKatex } from '@/hooks';

export interface KatexProviderProps {
  children: React.ReactNode;
  /** Custom loading component */
  loader?: React.ReactNode;
  /** Custom error component */
  errorComponent?: React.ReactNode;
}

/**
 * Provider component that handles KaTeX loading
 * Children are only rendered once KaTeX is ready
 */
export const KatexProvider: React.FC<KatexProviderProps> = ({
  children,
  loader,
  errorComponent,
}) => {
  const { isLoaded, isLoading, error } = useKatex();

  if (error) {
    return (
      <>
        {errorComponent || (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-red-500">Failed to load math renderer</div>
          </div>
        )}
      </>
    );
  }

  if (isLoading || !isLoaded) {
    return (
      <>
        {loader || (
          <div className="flex items-center justify-center min-h-screen bg-[#f4f4f4]">
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-2 border-neutral-300 border-t-[#ea5b25] rounded-full animate-spin" />
              <span className="text-neutral-500 text-sm">Laden...</span>
            </div>
          </div>
        )}
      </>
    );
  }

  // Key forces remount when KaTeX loads, ensuring all components init properly
  return <React.Fragment key={isLoaded ? 'loaded' : 'loading'}>{children}</React.Fragment>;
};

KatexProvider.displayName = 'KatexProvider';
