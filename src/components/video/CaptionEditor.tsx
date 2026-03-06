'use client';

import { useVideoStore } from '@/stores/video-store';
import { Caption, CaptionStyle, CaptionAnimation } from '@/types';
import { Type, X, ChevronDown } from 'lucide-react';

export default function CaptionEditor() {
  const { project, selectedCaptionId, selectCaption, updateCaption, removeCaption } = useVideoStore();

  if (!project || !selectedCaptionId) return null;

  const caption = project.captions.find((c) => c.id === selectedCaptionId);
  if (!caption) return null;

  const update = (updates: Partial<Caption>) => updateCaption(caption.id, updates);

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4 text-brand-600" />
          <h3 className="font-medium text-surface-900 text-sm">Edit Caption</h3>
        </div>
        <button
          onClick={() => selectCaption(null)}
          className="p-1 rounded hover:bg-surface-100 text-surface-400"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div>
        <label className="block text-xs font-medium text-surface-600 mb-1">Text</label>
        <textarea
          value={caption.text}
          onChange={(e) => update({ text: e.target.value })}
          className="input text-sm min-h-[60px]"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-surface-600 mb-1">Start (s)</label>
          <input
            type="number"
            step={0.1}
            value={caption.startTime}
            onChange={(e) => update({ startTime: Number(e.target.value) })}
            className="input text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-surface-600 mb-1">End (s)</label>
          <input
            type="number"
            step={0.1}
            value={caption.endTime}
            onChange={(e) => update({ endTime: Number(e.target.value) })}
            className="input text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-surface-600 mb-1">Style</label>
        <div className="relative">
          <select
            value={caption.style}
            onChange={(e) => update({ style: e.target.value as CaptionStyle })}
            className="input text-sm pr-8 appearance-none"
          >
            <option value="default">Default</option>
            <option value="viral">Viral</option>
            <option value="minimal">Minimal</option>
            <option value="bold">Bold Gradient</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-surface-600 mb-1">Animation</label>
        <div className="relative">
          <select
            value={caption.animation}
            onChange={(e) => update({ animation: e.target.value as Caption['animation'] })}
            className="input text-sm pr-8 appearance-none"
          >
            <option value="none">None</option>
            <option value="fade">Fade</option>
            <option value="typewriter">Typewriter</option>
            <option value="bounce">Bounce</option>
            <option value="slide-up">Slide Up</option>
            <option value="pop">Pop</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
        </div>
      </div>

      <button
        onClick={() => { removeCaption(caption.id); selectCaption(null); }}
        className="btn-danger w-full text-sm"
      >
        Delete Caption
      </button>
    </div>
  );
}
