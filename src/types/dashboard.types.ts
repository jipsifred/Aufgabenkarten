/**
 * DASHBOARD TYPES - SIMPLIFIED
 * Clean, minimal type definitions
 */

import { TaskData } from './task.types';

/**
 * Types of folders
 */
export type FolderType = 'exam' | 'topic';

/**
 * A folder (either exam/Klausur or topic/Thema)
 */
export interface Folder {
  id: string;
  name: string;
  type: FolderType;
  createdAt: string;
}

/**
 * A task/exercise (Aufgabe) that can belong to multiple folders
 */
export interface DashboardTask {
  id: string;
  /** Full task data for Process Card view */
  taskData: TaskData;
  /** IDs of exam folders this task belongs to */
  examFolderIds: string[];
  /** IDs of topic folders this task belongs to */
  topicFolderIds: string[];
  /** Images attached to this task (Base64) */
  images: string[];
  /** Creation timestamp */
  createdAt: string;
}

/**
 * Dashboard view mode
 */
export type ViewMode = 'exams' | 'topics';

/**
 * Navigation state
 */
export type ViewState = 
  | { view: 'folders' }
  | { view: 'folder-detail'; folderId: string }
  | { view: 'task-detail'; taskId: string };

/**
 * Dashboard state
 */
export interface DashboardState {
  tasks: DashboardTask[];
  folders: Folder[];
  viewMode: ViewMode;
  viewState: ViewState;
}
