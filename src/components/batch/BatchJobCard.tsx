'use client';

import { BatchJob, AD_FORMAT_SIZES } from '@/types';
import { VIRAL_TEMPLATES } from '@/lib/viral-templates';
import { AD_TEMPLATES } from '@/lib/ad-templates';
import {
  FileText, Type, Sparkles, Layers, CheckCircle2, AlertCircle, Clock,
  Trash2, ChevronDown, ChevronUp, Film, PenTool, MessageSquare,
} from 'lucide-react';
import { useState } from 'react';

interface BatchJobCardProps {
  job: BatchJob;
  onRemove: (id: string) => void;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  queued: { label: 'Queued', color: 'text-surface-500 bg-surface-100', icon: Clock },
  'generating-script': { label: 'Writing Script', color: 'text-blue-700 bg-blue-50', icon: FileText },
  'generating-copy': { label: 'Writing Copy', color: 'text-blue-700 bg-blue-50', icon: MessageSquare },
  'generating-captions': { label: 'Captions', color: 'text-purple-700 bg-purple-50', icon: Type },
  'generating-effects': { label: 'Effects', color: 'text-orange-700 bg-orange-50', icon: Sparkles },
  'generating-graphics': { label: 'Graphics', color: 'text-pink-700 bg-pink-50', icon: Layers },
  'composing-ad': { label: 'Composing Ad', color: 'text-emerald-700 bg-emerald-50', icon: PenTool },
  complete: { label: 'Complete', color: 'text-green-700 bg-green-50', icon: CheckCircle2 },
  error: { label: 'Error', color: 'text-red-700 bg-red-50', icon: AlertCircle },
};

export default function BatchJobCard({ job, onRemove }: BatchJobCardProps) {
  const [expanded, setExpanded] = useState(false);
  const statusCfg = STATUS_CONFIG[job.status] || STATUS_CONFIG.queued;
  const StatusIcon = statusCfg.icon;
  const isActive = !['queued', 'complete', 'error'].includes(job.status);

  const templateName = job.jobType === 'video'
    ? VIRAL_TEMPLATES.find((t) => t.id === job.templateId)?.name || 'Video'
    : AD_TEMPLATES.find((t) => t.id === job.adTemplateId)?.name || 'Ad';

  const formatLabel = job.adFormat ? AD_FORMAT_SIZES[job.adFormat]?.label : null;

  return (
    <div className={`card transition-all ${isActive ? 'ring-2 ring-brand-400/50 shadow-md' : ''}`}>
      <div className="flex items-center gap-4">
        {/* Progress */}
        <div className="relative w-10 h-10 flex-shrink-0">
          <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeWidth="3" className="text-surface-100" />
            <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeWidth="3"
              strokeDasharray={`${job.progress * 0.94} 100`} strokeLinecap="round"
              className={job.status === 'error' ? 'text-red-500' : job.status === 'complete' ? 'text-green-500' : 'text-brand-500'}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10px] font-bold text-surface-600">{job.progress}%</span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {job.jobType === 'video' ? (
              <Film className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
            ) : (
              <PenTool className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
            )}
            <h3 className="font-medium text-surface-900 truncate">{job.topic}</h3>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusCfg.color}`}>
              <StatusIcon className="w-3 h-3" />
              {statusCfg.label}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-surface-500">
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${job.jobType === 'video' ? 'bg-purple-50 text-purple-600' : 'bg-emerald-50 text-emerald-600'}`}>
              {job.jobType === 'video' ? 'Video' : 'Static Ad'}
            </span>
            <span>{templateName}</span>
            {job.jobType === 'video' && <span>{job.duration}s</span>}
            {formatLabel && <span>{formatLabel}</span>}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button onClick={() => setExpanded(!expanded)} className="p-2 rounded-lg hover:bg-surface-100 text-surface-400 transition-colors">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button onClick={() => onRemove(job.id)} disabled={isActive}
            className="p-2 rounded-lg hover:bg-red-50 text-surface-400 hover:text-red-600 transition-colors disabled:opacity-30">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isActive && (
        <div className="mt-3 h-1.5 bg-surface-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-brand-500 to-purple-500 rounded-full transition-all duration-500" style={{ width: `${job.progress}%` }} />
        </div>
      )}

      {expanded && (
        <div className="mt-4 pt-4 border-t border-surface-100 space-y-3">
          {job.generatedScript && (
            <div>
              <p className="text-xs font-medium text-surface-600 mb-1 flex items-center gap-1"><FileText className="w-3 h-3" /> Script</p>
              <p className="text-sm text-surface-700 bg-surface-50 rounded-lg p-3 leading-relaxed">{job.generatedScript}</p>
            </div>
          )}
          {job.generatedAdCopy && (
            <div>
              <p className="text-xs font-medium text-surface-600 mb-1 flex items-center gap-1"><MessageSquare className="w-3 h-3" /> Ad Copy</p>
              <div className="bg-surface-50 rounded-lg p-3 space-y-1">
                <p className="text-sm font-semibold text-surface-900">{job.generatedAdCopy.headline}</p>
                <p className="text-xs text-surface-600">{job.generatedAdCopy.body}</p>
                <p className="text-xs font-medium text-brand-600">{job.generatedAdCopy.cta}</p>
              </div>
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
          {job.adProject && (
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-surface-50 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-emerald-600">{job.adProject.layers.length}</p>
                <p className="text-xs text-surface-500">Layers</p>
              </div>
              <div className="bg-surface-50 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-surface-700">{job.adProject.width}x{job.adProject.height}</p>
                <p className="text-xs text-surface-500">Size</p>
              </div>
              <div className="bg-surface-50 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-teal-600">{job.adProject.variants.length + 1}</p>
                <p className="text-xs text-surface-500">Variants</p>
              </div>
            </div>
          )}
          {job.error && (
            <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" /> {job.error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
