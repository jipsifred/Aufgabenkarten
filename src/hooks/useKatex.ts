/**
 * USE KATEX HOOK
 * Manages KaTeX library loading and initialization
 */

import { useState, useEffect } from 'react';
import { KATEX_CONFIG } from '@/constants/config';

// Extend Window interface for KaTeX
declare global {
  interface Window {
    katex?: {
      render: (
        tex: string,
        element: HTMLElement,
        options?: {
          throwOnError?: boolean;
          displayMode?: boolean;
          strict?: boolean;
          trust?: boolean;
        }
      ) => void;
    };
  }
}

interface UseKatexReturn {
  isLoaded: boolean;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook to load and manage KaTeX library
 * @returns Object with loading state
 */
export function useKatex(): UseKatexReturn {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Check if already loaded
    if (window.katex) {
      setIsLoaded(true);
      setIsLoading(false);
      return;
    }

    let link: HTMLLinkElement | null = null;
    let script: HTMLScriptElement | null = null;

    const loadKatex = async () => {
      try {
        // Load CSS
        link = document.createElement('link');
        link.href = KATEX_CONFIG.CSS_URL;
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        // Load JS
        script = document.createElement('script');
        script.src = KATEX_CONFIG.JS_URL;
        script.defer = true;

        const loadPromise = new Promise<void>((resolve, reject) => {
          script!.onload = () => resolve();
          script!.onerror = () => reject(new Error('Failed to load KaTeX'));
        });

        document.body.appendChild(script);
        await loadPromise;

        setIsLoaded(true);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error loading KaTeX'));
        setIsLoading(false);
      }
    };

    loadKatex();

    // Cleanup
    return () => {
      if (link && document.head.contains(link)) {
        document.head.removeChild(link);
      }
      if (script && document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return { isLoaded, isLoading, error };
}
