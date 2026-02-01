/**
 * TASK TYPES
 * Type definitions for the Process Card feature
 */

/**
 * A single step in a solution path
 */
export interface Step {
  /** The title of this step */
  title: string;
  /** The original formula/equation (LaTeX) */
  origin: string;
  /** How the formula is applied to this problem (LaTeX) - optional */
  application?: string;
  /** Explanation of the step - supports markdown and inline math */
  explanation: string;
}

/**
 * A sub-task (Teilaufgabe) containing multiple steps
 */
export interface Teilaufgabe {
  /** The question/problem statement - supports markdown and inline math */
  frage: string;
  /** Array of solution steps */
  steps: Step[];
}

/**
 * The main task data structure
 */
export interface TaskData {
  /** Main title of the task - supports markdown and inline math */
  titel: string;
  /** Optional description - supports markdown and inline math */
  description?: string;
  /** Array of sub-tasks */
  teilaufgaben: Teilaufgabe[];
  /** Optional metadata */
  meta?: TaskMeta;
}

/**
 * Optional metadata for tasks
 */
export interface TaskMeta {
  /** Subject tags */
  tags?: string[];
  /** Difficulty level */
  difficulty?: 'easy' | 'medium' | 'hard';
  /** Estimated time in minutes */
  estimatedTime?: number;
  /** Author name */
  author?: string;
  /** Creation date */
  createdAt?: string;
}

/**
 * State for step reveal functionality
 */
export interface StepRevealState {
  /** Number of revealed steps */
  revealedSteps: number;
  /** Whether all steps are revealed */
  isComplete: boolean;
  /** Reveal next step */
  revealNext: () => void;
  /** Reset to beginning */
  reset: () => void;
}

/**
 * JSON Import result
 */
export interface JsonImportResult {
  success: boolean;
  data?: TaskData;
  error?: string;
}
