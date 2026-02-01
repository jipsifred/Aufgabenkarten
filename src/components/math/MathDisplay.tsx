/**
 * MATH DISPLAY COMPONENT
 * Renders LaTeX math expressions using KaTeX
 */

import React, { useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { KATEX_CONFIG } from '@/constants/config';

export interface MathDisplayProps {
  /** LaTeX string to render */
  tex: string;
  /** Whether to render in display mode (block) or inline */
  block?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export const MathDisplay: React.FC<MathDisplayProps> = ({
  tex,
  block = false,
  className,
}) => {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.katex && containerRef.current) {
      try {
        window.katex.render(tex, containerRef.current, {
          ...KATEX_CONFIG.OPTIONS,
          displayMode: block,
        });
      } catch (e) {
        // Fallback to plain text on error
        containerRef.current.innerText = tex;
      }
    } else if (containerRef.current) {
      // Fallback if KaTeX not loaded
      containerRef.current.innerText = tex;
    }
  }, [tex, block]);

  return (
    <span
      ref={containerRef}
      className={cn(
        block
          ? 'block my-3 text-lg overflow-x-auto overflow-y-hidden'
          : 'inline-block mx-0.5 align-baseline',
        className
      )}
    />
  );
};

MathDisplay.displayName = 'MathDisplay';
