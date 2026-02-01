/**
 * DASHBOARD HOOK - SIMPLIFIED
 * State management for the dashboard
 */

import { useState, useCallback, useMemo } from 'react';
import { 
  Folder, 
  DashboardTask, 
  ViewMode, 
  ViewState,
  TaskData 
} from '@/types';
import { 
  DEFAULT_FOLDERS, 
  DEFAULT_TASKS 
} from '@/data/defaultDashboard';

export function useDashboard() {
  const [folders, setFolders] = useState<Folder[]>(DEFAULT_FOLDERS);
  const [tasks, setTasks] = useState<DashboardTask[]>(DEFAULT_TASKS);
  const [viewMode, setViewMode] = useState<ViewMode>('exams');
  const [viewState, setViewState] = useState<ViewState>({ view: 'folders' });

  // Get folders by type
  const examFolders = useMemo(
    () => folders.filter(f => f.type === 'exam'),
    [folders]
  );

  const topicFolders = useMemo(
    () => folders.filter(f => f.type === 'topic'),
    [folders]
  );

  // Get current folders based on view mode
  const currentFolders = useMemo(
    () => viewMode === 'exams' ? examFolders : topicFolders,
    [viewMode, examFolders, topicFolders]
  );

  // Get tasks for a specific folder
  const getTasksForFolder = useCallback((folderId: string) => {
    const folder = folders.find(f => f.id === folderId);
    if (!folder) return [];
    
    return tasks.filter(t => 
      folder.type === 'exam' 
        ? t.examFolderIds.includes(folderId)
        : t.topicFolderIds.includes(folderId)
    );
  }, [folders, tasks]);

  // Get task count for a folder
  const getTaskCount = useCallback((folderId: string) => {
    return getTasksForFolder(folderId).length;
  }, [getTasksForFolder]);

  // Get current folder (when in folder-detail view)
  const currentFolder = useMemo(() => {
    if (viewState.view !== 'folder-detail') return null;
    return folders.find(f => f.id === viewState.folderId) || null;
  }, [viewState, folders]);

  // Get current task (when in task-detail view)
  const currentTask = useMemo(() => {
    if (viewState.view !== 'task-detail') return null;
    return tasks.find(t => t.id === viewState.taskId) || null;
  }, [viewState, tasks]);

  // Navigation
  const navigateToFolders = useCallback(() => {
    setViewState({ view: 'folders' });
  }, []);

  const navigateToFolder = useCallback((folderId: string) => {
    setViewState({ view: 'folder-detail', folderId });
  }, []);

  const navigateToTask = useCallback((taskId: string) => {
    setViewState({ view: 'task-detail', taskId });
  }, []);

  // Add folder
  const addFolder = useCallback((name: string, type: 'exam' | 'topic') => {
    const newFolder: Folder = {
      id: `${type}-${Date.now()}`,
      name,
      type,
      createdAt: new Date().toISOString(),
    };
    setFolders(prev => [...prev, newFolder]);
    return newFolder;
  }, []);

  // Delete folder
  const deleteFolder = useCallback((folderId: string) => {
    setFolders(prev => prev.filter(f => f.id !== folderId));
    // Also remove folder references from tasks
    setTasks(prev => prev.map(t => ({
      ...t,
      examFolderIds: t.examFolderIds.filter(id => id !== folderId),
      topicFolderIds: t.topicFolderIds.filter(id => id !== folderId),
    })));
  }, []);

  // Rename folder
  const renameFolder = useCallback((folderId: string, newName: string) => {
    setFolders(prev => prev.map(f => 
      f.id === folderId ? { ...f, name: newName } : f
    ));
  }, []);

  // Add task
  const addTask = useCallback((
    taskData: TaskData,
    examFolderIds: string[],
    topicFolderIds: string[],
    images: string[] = []
  ) => {
    const newTask: DashboardTask = {
      id: `task-${Date.now()}`,
      taskData,
      examFolderIds,
      topicFolderIds,
      images,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [...prev, newTask]);
    return newTask;
  }, []);

  // Delete task
  const deleteTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    if (viewState.view === 'task-detail' && viewState.taskId === taskId) {
      navigateToFolders();
    }
  }, [viewState, navigateToFolders]);

  // Update task
  const updateTask = useCallback((taskId: string, updates: Partial<DashboardTask>) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, ...updates } : t
    ));
  }, []);

  // Move task to folder
  const moveTaskToFolder = useCallback((taskId: string, folderId: string) => {
    const folder = folders.find(f => f.id === folderId);
    if (!folder) return;

    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      
      if (folder.type === 'exam') {
        return {
          ...t,
          examFolderIds: t.examFolderIds.includes(folderId) 
            ? t.examFolderIds 
            : [...t.examFolderIds, folderId]
        };
      } else {
        return {
          ...t,
          topicFolderIds: t.topicFolderIds.includes(folderId)
            ? t.topicFolderIds
            : [...t.topicFolderIds, folderId]
        };
      }
    }));
  }, [folders]);

  // Remove task from folder
  const removeTaskFromFolder = useCallback((taskId: string, folderId: string) => {
    const folder = folders.find(f => f.id === folderId);
    if (!folder) return;

    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      
      if (folder.type === 'exam') {
        return {
          ...t,
          examFolderIds: t.examFolderIds.filter(id => id !== folderId)
        };
      } else {
        return {
          ...t,
          topicFolderIds: t.topicFolderIds.filter(id => id !== folderId)
        };
      }
    }));
  }, [folders]);

  return {
    // State
    folders,
    tasks,
    viewMode,
    viewState,
    
    // Derived
    examFolders,
    topicFolders,
    currentFolders,
    currentFolder,
    currentTask,
    
    // Getters
    getTasksForFolder,
    getTaskCount,
    
    // Navigation
    setViewMode,
    navigateToFolders,
    navigateToFolder,
    navigateToTask,
    
    // Folder actions
    addFolder,
    deleteFolder,
    renameFolder,
    
    // Task actions
    addTask,
    deleteTask,
    updateTask,
    moveTaskToFolder,
    removeTaskFromFolder,
  };
}

export type DashboardHook = ReturnType<typeof useDashboard>;
