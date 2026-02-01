/**
 * FOLDER ITEM - Minimal Design
 * Simple folder display with title and task count
 */

import React from 'react';
import { Folder as FolderIcon, ChevronRight, Trash2 } from 'lucide-react';
import { Folder } from '@/types';

interface FolderItemProps {
  folder: Folder;
  taskCount: number;
  onClick: () => void;
  onDelete: () => void;
  isDragOver?: boolean;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}

export function FolderItem({
  folder,
  taskCount,
  onClick,
  onDelete,
  isDragOver = false,
  onDragOver,
  onDragLeave,
  onDrop,
}: FolderItemProps) {
  return (
    <div
      className={`
        group flex items-center justify-between p-4 bg-white border rounded-lg
        cursor-pointer transition-all duration-150
        ${isDragOver 
          ? 'border-[#ea5b25] bg-orange-50 shadow-md' 
          : 'border-neutral-200 hover:border-neutral-300 hover:shadow-sm'
        }
      `}
      onClick={onClick}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center">
          <FolderIcon size={20} className="text-neutral-500" />
        </div>
        <div>
          <h3 className="font-medium text-neutral-900">{folder.name}</h3>
          <p className="text-sm text-neutral-500">
            {taskCount} {taskCount === 1 ? 'Aufgabe' : 'Aufgaben'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-2 opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-red-500 transition-all"
          title="Löschen"
        >
          <Trash2 size={16} />
        </button>
        <ChevronRight size={20} className="text-neutral-400" />
      </div>
    </div>
  );
}
