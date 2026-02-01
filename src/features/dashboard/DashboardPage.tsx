/**
 * ============================================
 * DASHBOARD PAGE - Server API Version
 * Klausuren & Themen Ordner mit SQLite Backend
 * ============================================
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, Plus, Folder, FileText, Upload, X, Check, Trash2, GripVertical, Image } from 'lucide-react';
import { foldersApi, tasksApi, imagesApi } from '../../lib/api';
import type { Folder as FolderType, Task, TaskData } from '../../lib/api';

// ============================================
// Types
// ============================================

type View = 
  | { type: 'root' }
  | { type: 'folder'; folder: FolderType; folderType: 'exam' | 'topic' }
  | { type: 'task'; task: Task };

// ============================================
// Main Component
// ============================================

export function DashboardPage() {
  // Navigation State
  const [view, setView] = useState<View>({ type: 'root' });
  const [activeTab, setActiveTab] = useState<'exam' | 'topic'>('exam');
  
  // Data State
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal State
  const [showAddFolder, setShowAddFolder] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskJson, setNewTaskJson] = useState('');
  const [newTaskImages, setNewTaskImages] = useState<File[]>([]);
  const [jsonError, setJsonError] = useState<string | null>(null);
  
  // Drag State
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  // ============================================
  // Data Loading
  // ============================================

  const loadFolders = useCallback(async () => {
    try {
      const data = await foldersApi.getAll(activeTab);
      setFolders(data);
    } catch (err) {
      setError('Fehler beim Laden der Ordner');
      console.error(err);
    }
  }, [activeTab]);

  const loadTasks = useCallback(async (folderId: string, folderType: 'exam' | 'topic') => {
    try {
      const data = await tasksApi.getAll(folderId, folderType);
      setTasks(data);
    } catch (err) {
      setError('Fehler beim Laden der Aufgaben');
      console.error(err);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    loadFolders().finally(() => setLoading(false));
  }, [loadFolders]);

  useEffect(() => {
    if (view.type === 'folder') {
      loadTasks(view.folder.id, view.folderType);
    }
  }, [view, loadTasks]);

  // ============================================
  // Folder Actions
  // ============================================

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    
    try {
      await foldersApi.create(activeTab, newFolderName.trim());
      setNewFolderName('');
      setShowAddFolder(false);
      loadFolders();
    } catch (err) {
      setError('Fehler beim Erstellen des Ordners');
    }
  };

  const handleDeleteFolder = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Ordner wirklich löschen?')) return;
    
    try {
      await foldersApi.delete(id);
      loadFolders();
    } catch (err) {
      setError('Fehler beim Löschen');
    }
  };

  // ============================================
  // Task Actions
  // ============================================

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) return;
    
    let taskData: TaskData | undefined;
    
    if (newTaskJson.trim()) {
      try {
        taskData = JSON.parse(newTaskJson);
      } catch {
        setJsonError('Ungültiges JSON Format');
        return;
      }
    }
    
    try {
      if (view.type !== 'folder') return;
      
      const task = await tasksApi.create({
        title: newTaskTitle.trim(),
        data: taskData,
        examFolderId: view.folderType === 'exam' ? view.folder.id : undefined,
        topicFolderId: view.folderType === 'topic' ? view.folder.id : undefined,
      });
      
      // Upload images if any
      if (newTaskImages.length > 0) {
        await tasksApi.uploadImages(task.id, newTaskImages);
      }
      
      // Reset & reload
      setNewTaskTitle('');
      setNewTaskJson('');
      setNewTaskImages([]);
      setJsonError(null);
      setShowAddTask(false);
      loadTasks(view.folder.id, view.folderType);
    } catch (err) {
      setError('Fehler beim Erstellen der Aufgabe');
    }
  };

  const handleDeleteTask = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Aufgabe wirklich löschen?')) return;
    
    try {
      await tasksApi.delete(id);
      if (view.type === 'folder') {
        loadTasks(view.folder.id, view.folderType);
      }
    } catch (err) {
      setError('Fehler beim Löschen');
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      await imagesApi.delete(imageId);
      // Reload current task
      if (view.type === 'task') {
        const updated = await tasksApi.getById(view.task.id);
        setView({ type: 'task', task: updated });
      }
    } catch (err) {
      setError('Fehler beim Löschen des Bildes');
    }
  };

  // ============================================
  // Drag & Drop
  // ============================================

  const handleDrop = async (targetFolder: FolderType) => {
    if (!draggedTask) return;
    
    try {
      await tasksApi.update(draggedTask.id, {
        examFolderId: targetFolder.type === 'exam' ? targetFolder.id : draggedTask.exam_folder_id,
        topicFolderId: targetFolder.type === 'topic' ? targetFolder.id : draggedTask.topic_folder_id,
      });
      
      if (view.type === 'folder') {
        loadTasks(view.folder.id, view.folderType);
      }
    } catch (err) {
      setError('Fehler beim Verschieben');
    }
    
    setDraggedTask(null);
  };

  // ============================================
  // Render: Root View (Folder List)
  // ============================================

  const renderRootView = () => (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-neutral-100 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('exam')}
          className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'exam' 
              ? 'bg-white text-neutral-900 shadow-sm' 
              : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          Klausuren
        </button>
        <button
          onClick={() => setActiveTab('topic')}
          className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'topic' 
              ? 'bg-white text-neutral-900 shadow-sm' 
              : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          Themen
        </button>
      </div>

      {/* Folder Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {folders.map((folder) => (
            <div
              key={folder.id}
              onClick={() => setView({ type: 'folder', folder, folderType: folder.type })}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(folder)}
              className={`group relative bg-white border border-neutral-200 rounded-lg p-5 cursor-pointer 
                hover:border-neutral-300 hover:shadow-sm transition-all
                ${draggedTask ? 'ring-2 ring-orange-200 ring-offset-2' : ''}`}
            >
              <Folder className="w-8 h-8 text-neutral-400 mb-3" />
              <h3 className="font-medium text-neutral-900 truncate">{folder.name}</h3>
              <p className="text-sm text-neutral-400 mt-1">Ordner öffnen →</p>
              
              {/* Delete Button */}
              <button
                onClick={(e) => handleDeleteFolder(folder.id, e)}
                className="absolute top-3 right-3 p-1.5 rounded-md opacity-0 group-hover:opacity-100 
                  hover:bg-red-50 text-neutral-400 hover:text-red-500 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )
        )}
        
        {/* Add Folder Button */}
        <button
          onClick={() => setShowAddFolder(true)}
          className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-200 
            rounded-lg p-5 text-neutral-400 hover:text-neutral-600 hover:border-neutral-300 transition-all"
        >
          <Plus className="w-8 h-8 mb-2" />
          <span className="text-sm font-medium">Neuer Ordner</span>
        </button>
      </div>
    </div>
  );

  // ============================================
  // Render: Folder View (Task List)
  // ============================================

  const renderFolderView = () => {
    if (view.type !== 'folder') return null;
    
    return (
      <div className="space-y-6">
        {/* Back Button */}
        <button
          onClick={() => setView({ type: 'root' })}
          className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <ChevronLeft size={20} />
          <span>Zurück</span>
        </button>

        {/* Folder Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Folder className="w-6 h-6 text-neutral-400" />
            <h1 className="text-2xl font-semibold text-neutral-900">{view.folder.name}</h1>
          </div>
          <span className="text-sm text-neutral-400">{tasks.length} Aufgaben</span>
        </div>

        {/* Task List */}
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              draggable
              onDragStart={() => setDraggedTask(task)}
              onDragEnd={() => setDraggedTask(null)}
              onClick={() => setView({ type: 'task', task })}
              className="group flex items-center gap-4 bg-white border border-neutral-200 rounded-lg p-4 
                cursor-pointer hover:border-neutral-300 hover:shadow-sm transition-all"
            >
              <GripVertical className="w-4 h-4 text-neutral-300 cursor-grab" />
              <FileText className="w-5 h-5 text-neutral-400" />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-neutral-900 truncate">{task.title}</h3>
                {task.data?.teilaufgaben && (
                  <p className="text-sm text-neutral-400">
                    {task.data.teilaufgaben.length} Teilaufgaben
                  </p>
                )}
              </div>
              {task.images && task.images.length > 0 && (
                <div className="flex items-center gap-1 text-neutral-400">
                  <Image size={14} />
                  <span className="text-xs">{task.images.length}</span>
                </div>
              )}
              <button
                onClick={(e) => handleDeleteTask(task.id, e)}
                className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 
                  hover:bg-red-50 text-neutral-400 hover:text-red-500 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          
          {tasks.length === 0 && (
            <div className="text-center py-12 text-neutral-400">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Keine Aufgaben in diesem Ordner</p>
            </div>
          )}
        </div>

        {/* Add Task Button */}
        <button
          onClick={() => setShowAddTask(true)}
          className="flex items-center gap-2 px-4 py-3 bg-[#ea5b25] text-white rounded-lg 
            hover:bg-[#d14b1e] transition-colors font-medium"
        >
          <Plus size={18} />
          Neue Aufgabe
        </button>
      </div>
    );
  };

  // ============================================
  // Render: Task View (Process Card)
  // ============================================

  const renderTaskView = () => {
    if (view.type !== 'task') return null;
    const { task } = view;
    
    return (
      <div className="space-y-6">
        {/* Back Button */}
        <button
          onClick={() => {
            // Find the folder this task belongs to and go back
            const folderId = activeTab === 'exam' ? task.exam_folder_id : task.topic_folder_id;
            const folder = folders.find(f => f.id === folderId);
            if (folder) {
              setView({ type: 'folder', folder, folderType: activeTab });
            } else {
              setView({ type: 'root' });
            }
          }}
          className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <ChevronLeft size={20} />
          <span>Zurück</span>
        </button>

        {/* Task Content */}
        <ProcessCardView task={task} onDeleteImage={handleDeleteImage} />
      </div>
    );
  };

  // ============================================
  // Main Render
  // ============================================

  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-[#ea5b25] rounded-full" />
            <h1 className="font-semibold text-neutral-900">Process.Card</h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Server verbunden
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {view.type === 'root' && renderRootView()}
            {view.type === 'folder' && renderFolderView()}
            {view.type === 'task' && renderTaskView()}
          </>
        )}
      </main>

      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="hover:bg-red-600 p-1 rounded">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Add Folder Modal */}
      {showAddFolder && (
        <Modal onClose={() => setShowAddFolder(false)}>
          <h2 className="text-lg font-semibold mb-4">Neuer Ordner</h2>
          <input
            type="text"
            placeholder={activeTab === 'exam' ? 'z.B. Klausur WS 24/25' : 'z.B. Thermodynamik'}
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
            className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-400"
            autoFocus
          />
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setShowAddFolder(false)}
              className="px-4 py-2 text-neutral-600 hover:text-neutral-900"
            >
              Abbrechen
            </button>
            <button
              onClick={handleCreateFolder}
              disabled={!newFolderName.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-[#ea5b25] text-white rounded-lg 
                hover:bg-[#d14b1e] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check size={16} />
              Erstellen
            </button>
          </div>
        </Modal>
      )}

      {/* Add Task Modal */}
      {showAddTask && (
        <Modal onClose={() => { setShowAddTask(false); setJsonError(null); }}>
          <h2 className="text-lg font-semibold mb-4">Neue Aufgabe</h2>
          
          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700 mb-1">Titel</label>
            <input
              type="text"
              placeholder="z.B. Aufgabe 4: Reaktion & Phasentrennung"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-400"
              autoFocus
            />
          </div>
          
          {/* JSON Import */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              <div className="flex items-center gap-2">
                <Upload size={14} />
                JSON Import (optional)
              </div>
            </label>
            <textarea
              placeholder='{"titel": "...", "teilaufgaben": [...]}'
              value={newTaskJson}
              onChange={(e) => { setNewTaskJson(e.target.value); setJsonError(null); }}
              className="w-full h-32 px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none 
                focus:border-neutral-400 font-mono text-sm resize-none"
            />
            {jsonError && (
              <p className="text-red-500 text-sm mt-1">{jsonError}</p>
            )}
          </div>
          
          {/* Image Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              <div className="flex items-center gap-2">
                <Image size={14} />
                Bilder (optional)
              </div>
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setNewTaskImages(Array.from(e.target.files || []))}
              className="w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 
                file:rounded-lg file:border-0 file:bg-neutral-100 file:text-neutral-700 
                hover:file:bg-neutral-200"
            />
            {newTaskImages.length > 0 && (
              <p className="text-sm text-neutral-500 mt-1">{newTaskImages.length} Bilder ausgewählt</p>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => { setShowAddTask(false); setJsonError(null); }}
              className="px-4 py-2 text-neutral-600 hover:text-neutral-900"
            >
              Abbrechen
            </button>
            <button
              onClick={handleCreateTask}
              disabled={!newTaskTitle.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-[#ea5b25] text-white rounded-lg 
                hover:bg-[#d14b1e] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check size={16} />
              Erstellen
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ============================================
// Modal Component
// ============================================

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
        {children}
      </div>
    </div>
  );
}

// ============================================
// Process Card View Component
// ============================================

function ProcessCardView({ task, onDeleteImage }: { task: Task; onDeleteImage: (id: string) => void }) {
  const [revealedSteps, setRevealedSteps] = useState<Record<number, number>>({});
  
  const data = task.data;
  if (!data || !data.teilaufgaben) {
    return (
      <div className="bg-white rounded-lg border border-neutral-200 p-8">
        <h1 className="text-2xl font-semibold mb-4">{task.title}</h1>
        <p className="text-neutral-500">Keine Aufgabendaten vorhanden.</p>
        
        {/* Images */}
        {task.images && task.images.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-neutral-700 mb-3">Bilder</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {task.images.map((img) => (
                <div key={img.id} className="relative group">
                  <img src={img.url} alt={img.originalName} className="rounded-lg border" />
                  <button
                    onClick={() => onDeleteImage(img.id)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded opacity-0 
                      group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  const handleRevealStep = (taskIndex: number) => {
    setRevealedSteps(prev => ({
      ...prev,
      [taskIndex]: (prev[taskIndex] || 0) + 1
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg border border-neutral-200 p-8">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-2">
          {data.titel || task.title}
        </h1>
        {data.description && (
          <p className="text-neutral-500">{data.description}</p>
        )}
        
        {/* Images */}
        {task.images && task.images.length > 0 && (
          <div className="mt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {task.images.map((img) => (
                <div key={img.id} className="relative group">
                  <img src={img.url} alt={img.originalName} className="rounded-lg border" />
                  <button
                    onClick={() => onDeleteImage(img.id)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-md opacity-0 
                      group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Teilaufgaben */}
      {data.teilaufgaben.map((teilaufgabe, tIdx) => {
        const revealed = revealedSteps[tIdx] || 0;
        const isComplete = revealed >= teilaufgabe.steps.length;

        return (
          <div key={tIdx} className="bg-white rounded-lg border border-neutral-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-100 
                text-neutral-600 font-semibold text-sm">
                {String.fromCharCode(65 + tIdx)}
              </span>
              <h2 className="text-xl font-semibold text-neutral-900">{teilaufgabe.frage}</h2>
            </div>

            {/* Steps */}
            <div className="space-y-4 ml-4 border-l-2 border-neutral-100 pl-6">
              {teilaufgabe.steps.slice(0, revealed).map((step, sIdx) => (
                <div 
                  key={sIdx} 
                  className="relative pb-4"
                >
                  <div className="absolute -left-[29px] top-0 w-3 h-3 rounded-full bg-[#ea5b25]" />
                  <div className="bg-neutral-50 rounded-lg p-5">
                    <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                      Schritt {sIdx + 1}
                    </h4>
                    <h3 className="font-medium text-neutral-900 mb-3">{step.title}</h3>
                    
                    <div className="bg-white rounded border border-neutral-200 p-4 mb-3 font-mono text-sm">
                      <div className="text-neutral-600">{step.origin}</div>
                      {step.application && (
                        <div className="mt-2 pt-2 border-t border-dashed border-neutral-200 text-neutral-900">
                          {step.application}
                        </div>
                      )}
                    </div>
                    
                    <p className="text-neutral-600 text-sm leading-relaxed">{step.explanation}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Reveal Button */}
            {!isComplete ? (
              <button
                onClick={() => handleRevealStep(tIdx)}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 
                  rounded-lg text-neutral-700 hover:border-neutral-300 hover:shadow-sm transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-[#ea5b25] flex items-center justify-center">
                  <Plus size={14} className="text-white" />
                </div>
                {revealed === 0 ? 'Lösungsweg starten' : 'Nächster Schritt'}
              </button>
            ) : (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 
                rounded-lg text-sm font-medium">
                <Check size={16} />
                Vollständig gelöst
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default DashboardPage;
