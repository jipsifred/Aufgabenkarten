/**
 * ============================================
 * API Client für Process.Card Backend
 * ============================================
 */

const API_BASE = '/api';

// ============================================
// Types
// ============================================

export interface Folder {
  id: string;
  type: 'exam' | 'topic';
  name: string;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface TaskImage {
  id: string;
  url: string;
  originalName: string;
}

export interface Task {
  id: string;
  title: string;
  data: TaskData | null;
  exam_folder_id: string | null;
  topic_folder_id: string | null;
  position: number;
  created_at: string;
  updated_at: string;
  images: TaskImage[];
}

export interface TaskData {
  titel?: string;
  description?: string;
  teilaufgaben?: Teilaufgabe[];
}

export interface Teilaufgabe {
  frage: string;
  steps: Step[];
}

export interface Step {
  title: string;
  origin: string;
  application?: string;
  explanation: string;
}

// ============================================
// Error Handling
// ============================================

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new ApiError(response.status, error.error || 'Request failed');
  }
  
  if (response.status === 204) {
    return undefined as T;
  }
  
  return response.json();
}

// ============================================
// Folders API
// ============================================

export const foldersApi = {
  getAll: async (type?: 'exam' | 'topic'): Promise<Folder[]> => {
    const url = type ? `${API_BASE}/folders?type=${type}` : `${API_BASE}/folders`;
    const response = await fetch(url);
    return handleResponse<Folder[]>(response);
  },

  create: async (type: 'exam' | 'topic', name: string): Promise<Folder> => {
    const response = await fetch(`${API_BASE}/folders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, name })
    });
    return handleResponse<Folder>(response);
  },

  update: async (id: string, data: Partial<Pick<Folder, 'name' | 'position'>>): Promise<Folder> => {
    const response = await fetch(`${API_BASE}/folders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<Folder>(response);
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/folders/${id}`, {
      method: 'DELETE'
    });
    return handleResponse<void>(response);
  }
};

// ============================================
// Tasks API
// ============================================

export const tasksApi = {
  getAll: async (folderId?: string, folderType?: 'exam' | 'topic'): Promise<Task[]> => {
    let url = `${API_BASE}/tasks`;
    if (folderId && folderType) {
      url += `?folderId=${folderId}&folderType=${folderType}`;
    }
    const response = await fetch(url);
    return handleResponse<Task[]>(response);
  },

  getById: async (id: string): Promise<Task> => {
    const response = await fetch(`${API_BASE}/tasks/${id}`);
    return handleResponse<Task>(response);
  },

  create: async (data: {
    title: string;
    data?: TaskData;
    examFolderId?: string;
    topicFolderId?: string;
  }): Promise<Task> => {
    const response = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<Task>(response);
  },

  update: async (id: string, data: {
    title?: string;
    data?: TaskData;
    examFolderId?: string | null;
    topicFolderId?: string | null;
    position?: number;
  }): Promise<Task> => {
    const response = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<Task>(response);
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE'
    });
    return handleResponse<void>(response);
  },

  uploadImages: async (taskId: string, files: File[]): Promise<TaskImage[]> => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    
    const response = await fetch(`${API_BASE}/tasks/${taskId}/images`, {
      method: 'POST',
      body: formData
    });
    return handleResponse<TaskImage[]>(response);
  }
};

// ============================================
// Images API
// ============================================

export const imagesApi = {
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/images/${id}`, {
      method: 'DELETE'
    });
    return handleResponse<void>(response);
  }
};
