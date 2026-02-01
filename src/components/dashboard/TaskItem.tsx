/**
 * TASK ITEM - Minimal Design
 * Simple task display with title only
 */

import React from 'react';
import { FileText, Trash2, Image as ImageIcon } from 'lucide-react';
import { DashboardTask } from '@/types';

interface TaskItemProps {
  task: DashboardTask;
  onClick: () => void;
  onDelete: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}

export function TaskItem({
  task,
  onClick,
  onDelete,
  onDragStart,
  onDragEnd,
}: TaskItemProps) {
  const hasImages = task.images && task.images.length > 0;
  const teilaufgabenCount = task.taskData.teilaufgaben?.length || 0;

  return (
    <div
      className="group flex items-center justify-between p-4 bg-white border border-neutral-200 rounded-lg cursor-pointer hover:border-neutral-300 hover:shadow-sm transition-all duration-150"
      onClick={onClick}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="w-10 h-10 rounded-lg bg-neutral-50 flex items-center justify-center shrink-0">
          <FileText size={20} className="text-neutral-400" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-medium text-neutral-900 truncate">
            {task.taskData.titel}
          </h3>
          <p className="text-sm text-neutral-500">
            {teilaufgabenCount} {teilaufgabenCount === 1 ? 'Teilaufgabe' : 'Teilaufgaben'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {hasImages && (
          <div className="flex items-center gap-1 text-neutral-400 text-sm">
            <ImageIcon size={14} />
            <span>{task.images.length}</span>
          </div>
        )}
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
      </div>
    </div>
  );
}
