/**
 * TASK CARD COMPONENT
 * Displays a sub-task (Teilaufgabe) with step-by-step reveal
 */

import React from 'react';
import { ChevronDown, Activity } from 'lucide-react';
import { cn } from '@/utils/cn';
import { theme } from '@/design-system';
import { ParsedText } from '@/components/math';
import { useRevealSteps } from '@/hooks';
import { StepCard } from './StepCard';
import type { Teilaufgabe } from '@/types';

export interface TaskCardProps {
  data: Teilaufgabe;
  index: number;
}

export const TaskCard: React.FC<TaskCardProps> = ({ data, index }) => {
  const { revealedSteps, isComplete, revealNext } = useRevealSteps(data.steps.length);

  // Convert index to letter (0 -> A, 1 -> B, etc.)
  const taskLetter = String.fromCharCode(65 + index);

  return (
    <div className="mb-12 last:mb-0">
      {/* Sticky Header */}
      <div className={cn('sticky top-4 z-10', theme.bg.page, 'pb-4 pt-2')}>
        <div className="flex items-center gap-3 mb-2">
          <span
            className={cn(
              'flex items-center justify-center w-8 h-8 rounded-full',
              'bg-neutral-200 text-neutral-600 font-bold text-sm shrink-0'
            )}
          >
            {taskLetter}
          </span>
          <h2 className={cn('text-2xl font-semibold tracking-tight', theme.text.primary)}>
            <ParsedText text={data.frage} />
          </h2>
        </div>
        <div className="h-px w-full bg-neutral-300" />
      </div>

      {/* Steps Timeline */}
      <div className="mt-8 ml-3">
        {/* Revealed Steps */}
        {data.steps.slice(0, revealedSteps).map((step, i) => (
          <StepCard
            key={i}
            step={step}
            index={i}
            isLast={i === data.steps.length - 1 && isComplete}
          />
        ))}

        {/* Action Button */}
        <div
          className={cn(
            'pl-8 pb-4',
            revealedSteps > 0 && !isComplete && 'border-l border-neutral-200'
          )}
        >
          {!isComplete ? (
            <button
              onClick={revealNext}
              className={cn(
                'group flex items-center gap-3 px-6 py-3 rounded-md',
                theme.text.primary,
                'bg-white border',
                theme.border.default,
                'shadow-sm hover:shadow-md transition-all active:scale-[0.98]'
              )}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-white',
                  theme.bg.accent,
                  'group-hover:brightness-110 transition-colors'
                )}
              >
                <ChevronDown size={18} />
              </div>
              <span className="font-medium">
                {revealedSteps === 0 ? 'Lösungsweg starten' : 'Nächster Schritt'}
              </span>
            </button>
          ) : (
            <div
              className={cn(
                'inline-flex items-center gap-2',
                'text-green-600 bg-green-50 px-4 py-2 rounded-full',
                'text-sm font-medium',
                theme.animation.fadeIn
              )}
            >
              <Activity size={16} />
              Teilaufgabe vollständig gelöst
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

TaskCard.displayName = 'TaskCard';
