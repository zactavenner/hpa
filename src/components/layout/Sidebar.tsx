'use client';

import { useState } from 'react';
import { useApiKeysStore } from '@/stores/api-keys-store';
import { useBatchStore } from '@/stores/batch-store';
import {
  LayoutDashboard,
  Film,
  Key,
  Layers,
  ChevronLeft,
  ChevronRight,
  Zap,
  ClipboardList,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'editor', label: 'Video Editor', icon: Film },
  { id: 'batch', label: 'Batch Generate', icon: Layers },
  { id: 'review', label: 'Reviews', icon: ClipboardList },
  { id: 'keys', label: 'API Keys', icon: Key },
];

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { getKeyStats } = useApiKeysStore();
  const { getStats: getBatchStats, isProcessing } = useBatchStore();
  const keyStats = getKeyStats();
  const batchStats = getBatchStats();

  return (
    <aside
      className={`flex flex-col bg-white border-r border-surface-200 transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'}`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-surface-200">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <span className="font-bold text-lg text-surface-900">HPA Studio</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 space-y-0.5">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-left relative ${
              activeTab === item.id
                ? 'bg-brand-50 text-brand-700 font-medium'
                : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'
            }`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="text-sm">{item.label}</span>}
            {item.id === 'batch' && isProcessing && (
              <span className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-green-500 animate-pulse-soft" />
            )}
            {item.id === 'batch' && batchStats.queued > 0 && !collapsed && (
              <span className="ml-auto text-xs px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-700 font-medium">
                {batchStats.queued}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Status */}
      {!collapsed && (
        <div className="p-4 mx-3 mb-3 rounded-xl bg-surface-50 border border-surface-100 space-y-2">
          <div>
            <p className="text-xs font-medium text-surface-500 mb-1">API Keys</p>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full ${i < keyStats.active ? 'bg-green-500' : i < keyStats.total ? 'bg-yellow-500' : 'bg-surface-200'}`} />
                ))}
              </div>
              <span className="text-xs text-surface-500">{keyStats.active}/{keyStats.total}</span>
            </div>
          </div>
          {batchStats.total > 0 && (
            <div className="pt-2 border-t border-surface-100">
              <p className="text-xs text-surface-500">
                Batch: {batchStats.complete}/{batchStats.total} done
                {batchStats.ads > 0 && ` (${batchStats.ads} ads)`}
              </p>
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-10 border-t border-surface-200 text-surface-400 hover:text-surface-600 transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
}
