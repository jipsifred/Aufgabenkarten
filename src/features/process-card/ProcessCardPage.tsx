/**
 * PROCESS CARD PAGE
 * Main page component for the Process Card feature
 */

import React, { useState } from 'react';
import { DashboardLayout } from '@/app/layouts';
import { Header, Footer, ImportModal } from '@/components/common';
import { KatexProvider } from '@/components/math';
import { IntroCard, TaskCard } from '@/components/process-card';
import { DEFAULT_TASK_DATA } from '@/data/defaultTask';
import type { TaskData } from '@/types';

export const ProcessCardPage: React.FC = () => {
  const [data, setData] = useState<TaskData>(DEFAULT_TASK_DATA);
  const [showImportModal, setShowImportModal] = useState(false);

  const handleReset = () => {
    setData(DEFAULT_TASK_DATA);
  };

  const handleImport = (importedData: TaskData) => {
    setData(importedData);
  };

  const headerElement = (
    <Header
      onReset={handleReset}
      onImport={() => setShowImportModal(true)}
    />
  );

  return (
    <KatexProvider>
      <DashboardLayout header={headerElement}>
        {/* Intro Card */}
        <IntroCard data={data} />

        {/* Teilaufgaben */}
        <div className="space-y-20">
          {data.teilaufgaben?.map((task, index) => (
            <TaskCard key={index} data={task} index={index} />
          ))}
        </div>

        {/* Footer */}
        <Footer />

        {/* Import Modal */}
        <ImportModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          onImport={handleImport}
        />
      </DashboardLayout>
    </KatexProvider>
  );
};

ProcessCardPage.displayName = 'ProcessCardPage';
