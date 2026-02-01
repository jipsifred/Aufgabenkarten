/**
 * STEP CARD COMPONENT
 * Displays a single step in the solution timeline
 */

import React from 'react';
import { cn } from '@/utils/cn';
import { theme } from '@/design-system';
import { MathDisplay, ParsedText } from '@/components/math';
import type { Step } from '@/types';

export interface StepCardProps {
  step: Step;
  index: number;
  isLast: boolean;
}

export const StepCard: React.FC<StepCardProps> = ({ step, index, isLast }) => {
  return (
    <div className={cn('relative pl-8 pb-8', !isLast && 'border-l border-neutral-200')}>
      {/* Timeline Dot */}
      <div
        className={cn(
          'absolute left-[-5px] top-0 w-[10px] h-[10px] rounded-full',
          theme.bg.accent
        )}
      />

      {/* Card Content */}
      <div
        className={cn(
          'bg-white border',
          theme.border.default,
          'p-6 rounded-lg shadow-sm',
          theme.animation.slideUp
        )}
      >
        {/* Header */}
        <div className="flex items-baseline justify-between mb-4 flex-wrap gap-2">
          <h4
            className={cn(
              'text-sm font-bold uppercase tracking-widest',
              theme.text.muted,
              'shrink-0'
            )}
          >
            Schritt {index + 1}
          </h4>
          <h3 className={cn('text-lg font-medium', theme.text.primary)}>
            <ParsedText text={step.title} />
          </h3>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Math/Derivation */}
          <div
            className={cn(
              'bg-[#fafafa] p-4 rounded border border-neutral-100',
              'flex flex-col justify-center'
            )}
          >
            <div className="mb-3">
              <span className="text-xs font-semibold text-neutral-400 block mb-1">
                Ansatz / Herkunft
              </span>
              <MathDisplay tex={step.origin} block={true} />
            </div>

            {step.application && (
              <div className="pt-3 border-t border-dashed border-neutral-200">
                <span className="text-xs font-semibold text-neutral-400 block mb-1">
                  Anwendung
                </span>
                <MathDisplay tex={step.application} block={true} />
              </div>
            )}
          </div>

          {/* Right: Explanation */}
          <div className="flex flex-col justify-center">
            <p className={cn(theme.text.primary, 'leading-relaxed text-sm md:text-base')}>
              <ParsedText text={step.explanation} />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

StepCard.displayName = 'StepCard';
