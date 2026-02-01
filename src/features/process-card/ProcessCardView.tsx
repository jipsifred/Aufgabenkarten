/**
 * PROCESS CARD VIEW - Embeddable version
 * Used when viewing a task from the dashboard
 */

import { TaskData } from '@/types';
import { KatexProvider } from '@/components/math';
import { TaskCard, IntroCard } from '@/components/process-card';

interface ProcessCardViewProps {
  data: TaskData;
  images?: string[];
}

export function ProcessCardView({ data, images }: ProcessCardViewProps) {
  return (
    <KatexProvider>
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Intro Card */}
        <div className="mb-16">
          <IntroCard data={data} images={images} />
        </div>

        {/* Teilaufgaben */}
        <div className="space-y-20">
          {data.teilaufgaben?.map((task, index) => (
            <TaskCard key={index} data={task} index={index} />
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-32 pt-12 border-t border-neutral-200 text-center text-neutral-400 text-sm">
          <p className="mb-2">„Gutes Design ist so wenig Design wie möglich."</p>
          <p className="opacity-50">Inspiriert von Dieter Rams</p>
        </footer>
      </main>
    </KatexProvider>
  );
}
