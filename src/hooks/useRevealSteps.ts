/**
 * Step Reveal Hook
 */

import { useState, useCallback } from 'react';

export function useRevealSteps(totalSteps: number) {
  const [revealedSteps, setRevealedSteps] = useState(0);

  const revealNext = useCallback(() => {
    setRevealedSteps(prev => Math.min(prev + 1, totalSteps));
  }, [totalSteps]);

  const reset = useCallback(() => {
    setRevealedSteps(0);
  }, []);

  const revealAll = useCallback(() => {
    setRevealedSteps(totalSteps);
  }, [totalSteps]);

  return {
    revealedSteps,
    revealNext,
    reset,
    revealAll,
    isComplete: revealedSteps === totalSteps,
    hasStarted: revealedSteps > 0,
  };
}
