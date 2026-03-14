'use client';

import { useVideoStore } from '@/stores/video-store';
import { MotionGraphic } from '@/types';
import { Layers, X, ChevronDown } from 'lucide-react';

const GRAPHIC_TYPES: MotionGraphic['type'][] = [
  'title-card', 'lower-third', 'emoji-burst', 'subscribe-cta', 'countdown',
  'progress-bar', 'particle', 'sticker',
  'price-callout', 'urgency-timer', 'offer-badge', 'testimonial-quote',
];

export default function GraphicEditor() {
  const { project, selectedGraphicId, selectGraphic, removeMotionGraphic } = useVideoStore();

  if (!project || !selectedGraphicId) return null;

  const graphic = project.motionGraphics.find((mg) => mg.id === selectedGraphicId);
  if (!graphic) return null;

  const update = (updates: Partial<MotionGraphic>) => {
    const store = useVideoStore.getState();
    const p = store.project;
    if (!p) return;
    const mgs = p.motionGraphics.map((mg) =>
      mg.id === graphic.id ? { ...mg, ...updates } : mg
    );
    store.setMotionGraphics(mgs);
  };

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-pink-600" />
          <h3 className="font-medium text-surface-900 text-sm">Edit Graphic</h3>
        </div>
        <button
          onClick={() => selectGraphic(null)}
          className="p-1 rounded hover:bg-surface-100 text-surface-400"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div>
        <label className="block text-xs font-medium text-surface-600 mb-1">Type</label>
        <div className="relative">
          <select
            value={graphic.type}
            onChange={(e) => update({ type: e.target.value as MotionGraphic['type'] })}
            className="input text-sm pr-8 appearance-none"
          >
            {GRAPHIC_TYPES.map((t) => (
              <option key={t} value={t}>{t.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-surface-600 mb-1">Content</label>
        <input
          value={graphic.content}
          onChange={(e) => update({ content: e.target.value })}
          className="input text-sm"
          placeholder="Text, emoji, or label..."
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-surface-600 mb-1">Start (s)</label>
          <input
            type="number"
            step={0.1}
            value={graphic.startTime}
            onChange={(e) => update({ startTime: Number(e.target.value) })}
            className="input text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-surface-600 mb-1">End (s)</label>
          <input
            type="number"
            step={0.1}
            value={graphic.endTime}
            onChange={(e) => update({ endTime: Number(e.target.value) })}
            className="input text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-surface-600 mb-1">Font Size</label>
          <input
            type="number"
            min={8}
            max={120}
            value={Number(graphic.style.fontSize) || 24}
            onChange={(e) => update({ style: { ...graphic.style, fontSize: Number(e.target.value) } })}
            className="input text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-surface-600 mb-1">Color</label>
          <input
            value={String(graphic.style.color || '#ffffff')}
            onChange={(e) => update({ style: { ...graphic.style, color: e.target.value } })}
            className="input text-sm"
            placeholder="#ffffff"
          />
        </div>
      </div>

      <button
        onClick={() => { removeMotionGraphic(graphic.id); selectGraphic(null); }}
        className="btn-danger w-full text-sm"
      >
        Delete Graphic
      </button>
    </div>
  );
}
