'use client';

import { useState, useCallback } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import ReviewDashboard from '@/components/review/ReviewDashboard';
import ApiKeyManager from '@/components/review/ApiKeyManager';
import VideoEditor from '@/components/video/VideoEditor';
import BatchVideoGenerator from '@/components/batch/BatchVideoGenerator';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleNavigate = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6 lg:p-8">
          {activeTab === 'dashboard' && <ReviewDashboard onNavigate={handleNavigate} />}
          {activeTab === 'editor' && <VideoEditor />}
          {activeTab === 'batch' && <BatchVideoGenerator />}
          {activeTab === 'keys' && <ApiKeyManager />}
        </div>
      </main>
    </div>
  );
}
