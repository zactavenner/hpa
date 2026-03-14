'use client';

import { useVideoStore } from '@/stores/video-store';
import { VideoEffect } from '@/types';
import { Sparkles, X, ChevronDown } from 'lucide-react';

const EFFECT_TYPES: VideoEffect['type'][] = [
  'zoom', 'shake', 'glitch', 'flash', 'speed-ramp', 'beat-sync', 'blur', 'color-shift', 'film-grain',
];

export default function EffectEditor() {
  const { project, selectedEffectId, selectEffect, updateEffect, removeEffect } = useVideoStore();

  if (!project || !selectedEffectId) return null;

  const effect = project.effects.find((e) => e.id === selectedEffectId);
  if (!effect) return null;

  const update = (updates: Partial<VideoEffect>) => updateEffect(effect.id, updates);

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <h3 className="font-medium text-surface-900 text-sm">Edit Effect</h3>
        </div>
        <button
          onClick={() => selectEffect(null)}
          className="p-1 rounded hover:bg-surface-100 text-surface-400"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div>
        <label className="block text-xs font-medium text-surface-600 mb-1">Type</label>
        <div className="relative">
          <select
            value={effect.type}
            onChange={(e) => update({ type: e.target.value as VideoEffect['type'] })}
            className="input text-sm pr-8 appearance-none"
          >
            {EFFECT_TYPES.map((t) => (
              <option key={t} value={t}>{t.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-surface-600 mb-1">
          Intensity ({effect.intensity.toFixed(2)})
        </label>
        <input
          type="range"
          min={0}
          max={1.5}
          step={0.05}
          value={effect.intensity}
          onChange={(e) => update({ intensity: Number(e.target.value) })}
          className="w-full accent-purple-600"
        />
        <div className="flex justify-between text-[10px] text-surface-400 mt-0.5">
          <span>Subtle</span>
          <span>Intense</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-surface-600 mb-1">Start (s)</label>
          <input
            type="number"
            step={0.1}
            value={effect.startTime}
            onChange={(e) => update({ startTime: Number(e.target.value) })}
            className="input text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-surface-600 mb-1">End (s)</label>
          <input
            type="number"
            step={0.1}
            value={effect.endTime}
            onChange={(e) => update({ endTime: Number(e.target.value) })}
            className="input text-sm"
          />
        </div>
      </div>

      <button
        onClick={() => { removeEffect(effect.id); selectEffect(null); }}
        className="btn-danger w-full text-sm"
      >
        Delete Effect
      </button>
    </div>
  );
}
