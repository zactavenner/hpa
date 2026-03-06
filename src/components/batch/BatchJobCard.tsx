'use client';

import { BatchJob } from '@/types';
import { VIRAL_TEMPLATES } from '@/lib/viral-templates';
import {
  FileText,
  Type,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertCircle,
  Clock,
  Trash2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useState } from 'react';

interface BatchJobCardProps {
  job: BatchJob;
  onRemove: (id: string) => void;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  queued: { label: 'Queued', color: 'text-surface-500 bg-surface-100', icon: Clock },
  'generating-script': { label: 'Writing Script', color: 'text-blue-700 bg-blue-50', icon: FileText },
  'generating-captions': { label: 'Creating Captions', color: 'text-purple-700 bg-purple-50', icon: Type },
  'generating-effects': { label: 'Adding Effects', color: 'text-orange-700 bg-orange-50', icon: Sparkles },
  'generating-graphics': { label: 'Motion Graphics', color: 'text-pink-700 bg-pink-50', icon: Layers },
  complete: { label: 'Complete', color: 'text-green-700 bg-green-50', icon: CheckCircle2 },
  error: { label: 'Error', color: 'text-red-700 bg-red-50', icon: AlertCircle },
};

export default function BatchJobCard({ job, onRemove }: BatchJobCardProps) {
  const [expanded, setExpanded] = useState(false);
  const template = VIRAL_TEMPLATES.find((t) => t.id === job.templateId);
  const statusCfg = STATUS_CONFIG[job.status] || STATUS_CONFIG.queued;
  const StatusIcon = statusCfg.icon;
  const isActive = !['queued', 'complete', 'error'].includes(job.status);

  return (
    <div className={`card transition-all ${isActive ? 'ring-2 ring-brand-400/50 shadow-md' : ''}`}>
      <div className="flex items-center gap-4">
        {/* Progress indicator */}
        <div className="relative w-10 h-10 flex-shrink-0">
          <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
            <circle
              cx="18" cy="18" r="15"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-surface-100"
            />
            <circle
              cx="18" cy="18" r="15"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={`${job.progress * 0.94} 100`}
              strokeLinecap="round"
              className={job.status === 'error' ? 'text-red-500' : job.status === 'complete' ? 'text-green-500' : 'text-brand-500'}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10px] font-bold text-surface-600">{job.progress}%</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-surface-900 truncate">{job.topic}</h3>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusCfg.color}`}>
              <StatusIcon className="w-3 h-3" />
              {statusCfg.label}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-surface-500">
            <span>{template?.name || 'Unknown'}</span>
            <span>{job.scriptStyle}</span>
            <span>{job.duration}s</span>
            {job.completedAt && (
              <span>Completed {new Date(job.completedAt).toLocaleTimeString()}</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 rounded-lg hover:bg-surface-100 text-surface-400 transition-colors"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onRemove(job.id)}
            disabled={isActive}
            className="p-2 rounded-lg hover:bg-red-50 text-surface-400 hover:text-red-600 transition-colors disabled:opacity-30"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      {isActive && (
        <div className="mt-3 h-1.5 bg-surface-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${job.progress}%` }}
          />
        </div>
      )}

      {/* Expanded Details */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-surface-100 space-y-3">
          {job.generatedScript && (
            <div>
              <p className="text-xs font-medium text-surface-600 mb-1 flex items-center gap-1">
                <FileText className="w-3 h-3" /> Generated Script
              </p>
              <p className="text-sm text-surface-700 bg-surface-50 rounded-lg p-3 leading-relaxed">
                {job.generatedScript}
              </p>
            </div>
          )}

          {job.videoProject && (
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-surface-50 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-brand-600">{job.videoProject.captions.length}</p>
                <p className="text-xs text-surface-500">Captions</p>
              </div>
              <div className="bg-surface-50 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-purple-600">{job.videoProject.effects.length}</p>
                <p className="text-xs text-surface-500">Effects</p>
              </div>
              <div className="bg-surface-50 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-pink-600">{job.videoProject.motionGraphics.length}</p>
                <p className="text-xs text-surface-500">Graphics</p>
              </div>
            </div>
          )}

          {job.error && (
            <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {job.error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
