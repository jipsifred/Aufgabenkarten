/**
 * JSON Import Hook - Simplified
 */

import { useState, useCallback } from 'react';
import { TaskData } from '@/types';

export function useJsonImport() {
  const [error, setError] = useState<string | null>(null);

  const parseJson = useCallback((jsonString: string): TaskData | null => {
    setError(null);
    
    if (!jsonString.trim()) {
      return null;
    }

    try {
      const parsed = JSON.parse(jsonString);
      
      // Validate structure
      if (!parsed.titel && !parsed.title) {
        throw new Error("JSON muss ein 'titel' Feld enthalten.");
      }
      
      if (!parsed.teilaufgaben || !Array.isArray(parsed.teilaufgaben)) {
        throw new Error("JSON muss ein 'teilaufgaben' Array enthalten.");
      }

      // Normalize
      const taskData: TaskData = {
        titel: parsed.titel || parsed.title,
        description: parsed.description,
        teilaufgaben: parsed.teilaufgaben,
      };

      return taskData;
    } catch (e) {
      if (e instanceof SyntaxError) {
        setError("Ungültiges JSON Format. Bitte überprüfen Sie die Syntax.");
      } else if (e instanceof Error) {
        setError(e.message);
      }
      return null;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    parseJson,
    clearError,
  };
}
