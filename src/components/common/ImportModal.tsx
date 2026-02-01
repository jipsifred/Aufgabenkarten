/**
 * IMPORT MODAL COMPONENT
 * Modal for importing JSON task data
 */

import React, { useState } from 'react';
import { Check, Activity } from 'lucide-react';
import { Modal, Button } from '@/design-system/primitives';
import { useJsonImport } from '@/hooks';
import type { TaskData } from '@/types';

export interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: TaskData) => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  const [jsonInput, setJsonInput] = useState('');
  const { parseJson, error, clearError } = useJsonImport();

  const handleClose = () => {
    setJsonInput('');
    clearError();
    onClose();
  };

  const handleImport = () => {
    if (!jsonInput.trim()) {
      handleClose();
      return;
    }

    const result = parseJson(jsonInput);
    if (result) {
      onImport(result);
      handleClose();
    }
  };

  const placeholder = `{
  "titel": "Aufgabe **1**",
  "teilaufgaben": [
    {
       "frage": "Berechne **$x_{2A}$** jetzt",
       "steps": [
         {
           "title": "Ansatz",
           "origin": "x = \\\\frac{a}{b}",
           "explanation": "Erklärung hier..."
         }
       ]
    }
  ]
}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="JSON Importieren"
      size="xl"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>
            Abbrechen
          </Button>
          <Button
            variant="primary"
            onClick={handleImport}
            leftIcon={<Check size={16} />}
          >
            Daten Laden
          </Button>
        </>
      }
    >
      <p className="text-sm text-neutral-500 mb-3">
        Fügen Sie Ihr JSON ein. Sie können <code className="bg-neutral-100 px-1 rounded">**fett**</code>,{' '}
        <code className="bg-neutral-100 px-1 rounded">*kursiv*</code> und Mathe wie{' '}
        <code className="bg-neutral-100 px-1 rounded">p_4</code> oder{' '}
        <code className="bg-neutral-100 px-1 rounded">$x$</code> mischen.
      </p>

      <textarea
        className="w-full h-64 p-4 font-mono text-sm bg-neutral-50 border border-neutral-200 rounded focus:border-neutral-400 focus:ring-0 outline-none resize-none text-neutral-800"
        placeholder={placeholder}
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        autoFocus
      />

      {error && (
        <div className="mt-3 flex items-center gap-2 text-red-600 text-sm bg-red-50 p-2 rounded">
          <Activity size={14} className="animate-pulse" />
          {error}
        </div>
      )}
    </Modal>
  );
};

ImportModal.displayName = 'ImportModal';
