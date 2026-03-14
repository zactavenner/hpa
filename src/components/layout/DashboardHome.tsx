'use client';

import { useReviewStore } from '@/stores/review-store';
import { useBatchStore } from '@/stores/batch-store';
import { useAdStore } from '@/stores/ad-store';
import { useApiKeysStore } from '@/stores/api-keys-store';
import {
  Film, PenTool, Layers, ClipboardList, Key, Zap, TrendingUp,
  ArrowRight, Sparkles, BarChart3, CheckCircle2,
} from 'lucide-react';

interface DashboardHomeProps {
  onNavigate: (tab: string) => void;
}

export default function DashboardHome({ onNavigate }: DashboardHomeProps) {
  const reviewStats = useReviewStore((s) => s.getStats());
  const batchStats = useBatchStore((s) => s.getStats());
  const adProjects = useAdStore((s) => s.projects);
  const keyStats = useApiKeysStore((s) => s.getKeyStats());

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-br from-surface-900 via-brand-900 to-purple-900 p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
            <Zap className="w-5 h-5 text-yellow-300" />
          </div>
          <h1 className="text-2xl font-bold">HPA Studio</h1>
        </div>
        <p className="text-white/70 max-w-xl mb-6">
          Direct response video & ad production at scale. AI-powered scripts with urgency hooks,
          price callouts, testimonial overlays, and conversion-optimized CTAs — powered by Nano Banana Pro.
        </p>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => onNavigate('editor')} className="flex items-center gap-2 px-5 py-2.5 bg-white text-surface-900 rounded-xl text-sm font-semibold hover:bg-white/90 transition-colors">
            <Film className="w-4 h-4" /> Video Editor
          </button>
          <button onClick={() => onNavigate('ads')} className="flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur text-white border border-white/20 rounded-xl text-sm font-semibold hover:bg-white/20 transition-colors">
            <PenTool className="w-4 h-4" /> Client Ads
          </button>
          <button onClick={() => onNavigate('batch')} className="flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur text-white border border-white/20 rounded-xl text-sm font-semibold hover:bg-white/20 transition-colors">
            <Layers className="w-4 h-4" /> Batch Generate
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-surface-900">{batchStats.videos}</p>
            <p className="text-xs text-surface-500">Video Jobs</p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <PenTool className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-surface-900">{batchStats.ads + adProjects.length}</p>
            <p className="text-xs text-surface-500">Client Ads</p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-surface-900">{batchStats.complete}</p>
            <p className="text-xs text-surface-500">Completed</p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-surface-900">{keyStats.active}/{keyStats.total}</p>
            <p className="text-xs text-surface-500">API Keys</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold text-surface-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button onClick={() => onNavigate('batch')} className="card hover:border-brand-300 hover:shadow-md text-left group transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <ArrowRight className="w-4 h-4 text-surface-300 group-hover:text-brand-500 transition-colors" />
            </div>
            <h3 className="font-semibold text-surface-900 mb-1">Batch Generate</h3>
            <p className="text-xs text-surface-500">Bulk create DR video ads and static ads. Auto scripts with urgency hooks + conversion CTAs.</p>
          </button>

          <button onClick={() => onNavigate('ads')} className="card hover:border-emerald-300 hover:shadow-md text-left group transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <PenTool className="w-5 h-5 text-white" />
              </div>
              <ArrowRight className="w-4 h-4 text-surface-300 group-hover:text-emerald-500 transition-colors" />
            </div>
            <h3 className="font-semibold text-surface-900 mb-1">Client Ad Studio</h3>
            <p className="text-xs text-surface-500">Style presets, reference images, AI copy. Recreate client branding with Nano Banana Pro.</p>
          </button>

          <button onClick={() => onNavigate('editor')} className="card hover:border-purple-300 hover:shadow-md text-left group transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <Film className="w-5 h-5 text-white" />
              </div>
              <ArrowRight className="w-4 h-4 text-surface-300 group-hover:text-purple-500 transition-colors" />
            </div>
            <h3 className="font-semibold text-surface-900 mb-1">Video Editor</h3>
            <p className="text-xs text-surface-500">DR overlays, price callouts, urgency timers, AI captions, undo/redo, and frame export.</p>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      {(batchStats.total > 0 || reviewStats.total > 0) && (
        <div>
          <h2 className="text-lg font-bold text-surface-900 mb-4">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {batchStats.total > 0 && (
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-surface-900">Batch Pipeline</h3>
                  <button onClick={() => onNavigate('batch')} className="text-xs text-brand-600 hover:text-brand-700 font-medium">View All</button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-yellow-50 rounded-xl">
                    <p className="text-xl font-bold text-yellow-700">{batchStats.queued}</p>
                    <p className="text-[10px] text-yellow-600">Queued</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-xl">
                    <p className="text-xl font-bold text-blue-700">{batchStats.processing}</p>
                    <p className="text-[10px] text-blue-600">Processing</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-xl">
                    <p className="text-xl font-bold text-green-700">{batchStats.complete}</p>
                    <p className="text-[10px] text-green-600">Done</p>
                  </div>
                </div>
              </div>
            )}

            {reviewStats.total > 0 && (
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-surface-900">Review Queue</h3>
                  <button onClick={() => onNavigate('review')} className="text-xs text-brand-600 hover:text-brand-700 font-medium">View All</button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-yellow-50 rounded-xl">
                    <p className="text-xl font-bold text-yellow-700">{reviewStats.pending}</p>
                    <p className="text-[10px] text-yellow-600">Pending</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-xl">
                    <p className="text-xl font-bold text-blue-700">{reviewStats['in-progress']}</p>
                    <p className="text-[10px] text-blue-600">In Progress</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-xl">
                    <p className="text-xl font-bold text-green-700">{reviewStats.approved}</p>
                    <p className="text-[10px] text-green-600">Approved</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
