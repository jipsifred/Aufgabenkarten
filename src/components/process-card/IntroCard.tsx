/**
 * INTRO CARD COMPONENT
 * Hero section displaying task title and description
 */

import React from 'react';
import { BookOpen, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/utils/cn';
import { theme } from '@/design-system';
import { ParsedText } from '@/components/math';
import type { TaskData } from '@/types';

export interface IntroCardProps {
  data: TaskData;
  images?: string[];
}

export const IntroCard: React.FC<IntroCardProps> = ({ data, images }) => {
  const teilaufgabenCount = data.teilaufgaben?.length || 0;
  const hasImages = images && images.length > 0;

  const defaultDescription =
    'Diese Übung behandelt die Bilanzierung eines gekoppelten Systems aus Reaktor und Phasentrenner. Der Fokus liegt auf der Berechnung von Gleichgewichtszuständen und Energiebilanzen unter Berücksichtigung von Rückführströmen (Recycle).';

  return (
    <div className={cn('mb-16', theme.animation.slideUpLarge)}>
      <div
        className={cn(
          'bg-white rounded-lg shadow-sm border',
          theme.border.default,
          'overflow-hidden'
        )}
      >
        {/* Image or Placeholder */}
        <div className="h-64 bg-neutral-100 relative group overflow-hidden">
          {hasImages ? (
            <img 
              src={images[0]} 
              alt="Aufgabenbild" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-neutral-800 flex items-center justify-center overflow-hidden">
              {/* Grid Pattern */}
              <svg
                className="absolute inset-0 w-full h-full opacity-20"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 20 L100 20 M0 40 L100 40 M0 60 L100 60 M0 80 L100 80"
                  stroke="white"
                  strokeWidth="0.5"
                />
                <path
                  d="M20 0 L20 100 M40 0 L40 100 M60 0 L60 100 M80 0 L80 100"
                  stroke="white"
                  strokeWidth="0.5"
                />
                <circle cx="50" cy="50" r="15" stroke="white" strokeWidth="1" fill="none" />
                <rect x="30" y="30" width="40" height="40" stroke="white" strokeWidth="1" fill="none" />
              </svg>

              <span className="text-white/40 font-mono text-sm tracking-widest uppercase border border-white/40 px-3 py-1 rounded">
                Systemdiagramm
              </span>
            </div>
          )}
          
          {/* Image count badge if multiple images */}
          {hasImages && images.length > 1 && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/60 text-white text-xs rounded">
              <ImageIcon size={12} />
              <span>{images.length} Bilder</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Title */}
          <h1
            className={cn(
              'text-3xl font-bold text-neutral-900 mb-4 tracking-tight'
            )}
          >
            <ParsedText text={data.titel || 'Unbenannte Aufgabe'} />
          </h1>

          {/* Description */}
          <p className="text-neutral-500 max-w-2xl leading-relaxed">
            <ParsedText text={data.description || defaultDescription} />
          </p>

          {/* Meta Info */}
          <div className="mt-6 flex items-center gap-4 text-sm text-neutral-400">
            <div className="flex items-center gap-1">
              <BookOpen size={16} />
              <span>{teilaufgabenCount} Teilaufgaben</span>
            </div>
          </div>

          {/* Additional Images Gallery */}
          {hasImages && images.length > 1 && (
            <div className="mt-6 pt-6 border-t border-neutral-100">
              <p className="text-sm text-neutral-500 mb-3">Weitere Bilder</p>
              <div className="grid grid-cols-4 gap-2">
                {images.slice(1).map((img, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden bg-neutral-100">
                    <img 
                      src={img} 
                      alt={`Bild ${index + 2}`} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

IntroCard.displayName = 'IntroCard';
