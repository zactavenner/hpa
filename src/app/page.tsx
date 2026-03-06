'use client';

import { useState, useCallback } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import ReviewDashboard from '@/components/review/ReviewDashboard';
import ApiKeyManager from '@/components/review/ApiKeyManager';
import VideoEditor from '@/components/video/VideoEditor';
import StaticAdStudio from '@/components/ads/StaticAdStudio';
import BatchVideoGenerator from '@/components/batch/BatchVideoGenerator';
import DashboardHome from '@/components/layout/DashboardHome';

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
          {activeTab === 'dashboard' && <DashboardHome onNavigate={handleNavigate} />}
          {activeTab === 'editor' && <VideoEditor />}
          {activeTab === 'ads' && <StaticAdStudio />}
          {activeTab === 'batch' && <BatchVideoGenerator />}
          {activeTab === 'review' && <ReviewDashboard onNavigate={handleNavigate} />}
          {activeTab === 'keys' && <ApiKeyManager />}
        </div>
      </main>
    </div>
  );
}
