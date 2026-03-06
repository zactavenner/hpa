'use client';

import { useAdStore } from '@/stores/ad-store';
import { AdLayer, AdLayerContent } from '@/types';
import { FONT_PRESETS, DEFAULT_FONT_PRESET } from '@/lib/ad-templates';
import {
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  Copy,
  Type,
  Image,
  Square,
  MousePointer2,
  ChevronDown,
} from 'lucide-react';

const LAYER_ICONS: Record<string, typeof Type> = {
  text: Type,
  image: Image,
  shape: Square,
  logo: Image,
  background: Square,
  'cta-button': MousePointer2,
};

export default function AdLayerPanel() {
  const { project, selectedLayerId, selectLayer, updateLayer, removeLayer, duplicateLayer } = useAdStore();

  if (!project) return null;

  const layers = [...project.layers].sort((a, b) => b.order - a.order);
  const selectedLayer = project.layers.find((l) => l.id === selectedLayerId);

  return (
    <div className="space-y-4">
      {/* Layer List */}
      <div className="card space-y-1">
        <h3 className="text-sm font-semibold text-surface-900 mb-2">Layers</h3>
        {layers.map((layer) => {
          const Icon = LAYER_ICONS[layer.content.type] || Square;
          const label = getLayerLabel(layer);
          return (
            <div
              key={layer.id}
              onClick={() => selectLayer(layer.id)}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer text-xs transition-colors ${
                selectedLayerId === layer.id
                  ? 'bg-brand-50 text-brand-700'
                  : 'hover:bg-surface-50 text-surface-600'
              }`}
            >
              <Icon className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="flex-1 truncate">{label}</span>
              <button
                onClick={(e) => { e.stopPropagation(); updateLayer(layer.id, { visible: !layer.visible }); }}
                className="p-0.5 rounded hover:bg-surface-100"
              >
                {layer.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3 text-surface-300" />}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); updateLayer(layer.id, { locked: !layer.locked }); }}
                className="p-0.5 rounded hover:bg-surface-100"
              >
                {layer.locked ? <Lock className="w-3 h-3 text-orange-500" /> : <Unlock className="w-3 h-3" />}
              </button>
            </div>
          );
        })}
      </div>

      {/* Layer Properties */}
      {selectedLayer && (
        <div className="card space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-surface-900">Properties</h3>
            <div className="flex gap-1">
              <button onClick={() => duplicateLayer(selectedLayer.id)} className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-400" title="Duplicate">
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => removeLayer(selectedLayer.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-surface-400 hover:text-red-600" title="Delete">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Position/Size */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-medium text-surface-500 mb-0.5">X</label>
              <input type="number" value={selectedLayer.x} onChange={(e) => updateLayer(selectedLayer.id, { x: Number(e.target.value) })} className="input text-xs py-1.5" />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-surface-500 mb-0.5">Y</label>
              <input type="number" value={selectedLayer.y} onChange={(e) => updateLayer(selectedLayer.id, { y: Number(e.target.value) })} className="input text-xs py-1.5" />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-surface-500 mb-0.5">Width</label>
              <input type="number" value={selectedLayer.width} onChange={(e) => updateLayer(selectedLayer.id, { width: Number(e.target.value) })} className="input text-xs py-1.5" />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-surface-500 mb-0.5">Height</label>
              <input type="number" value={selectedLayer.height} onChange={(e) => updateLayer(selectedLayer.id, { height: Number(e.target.value) })} className="input text-xs py-1.5" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-medium text-surface-500 mb-0.5">Opacity</label>
            <input type="range" min={0} max={1} step={0.05} value={selectedLayer.opacity}
              onChange={(e) => updateLayer(selectedLayer.id, { opacity: Number(e.target.value) })}
              className="w-full h-1.5 rounded-full appearance-none bg-surface-200 cursor-pointer"
            />
          </div>

          {/* Content-specific editors */}
          {selectedLayer.content.type === 'text' && (
            <TextLayerEditor layer={selectedLayer} onUpdate={(content) => updateLayer(selectedLayer.id, { content: content as any })} />
          )}
          {selectedLayer.content.type === 'cta-button' && (
            <CtaLayerEditor layer={selectedLayer} onUpdate={(content) => updateLayer(selectedLayer.id, { content: content as any })} />
          )}
          {selectedLayer.content.type === 'background' && (
            <BackgroundEditor layer={selectedLayer} onUpdate={(content) => updateLayer(selectedLayer.id, { content: content as any })} />
          )}
        </div>
      )}
    </div>
  );
}

function TextLayerEditor({ layer, onUpdate }: { layer: AdLayer; onUpdate: (c: AdLayerContent) => void }) {
  if (layer.content.type !== 'text') return null;
  const c = layer.content;

  const update = (updates: Partial<typeof c>) => onUpdate({ ...c, ...updates });

  return (
    <div className="space-y-2 pt-2 border-t border-surface-100">
      <div>
        <label className="block text-[10px] font-medium text-surface-500 mb-0.5">Text</label>
        <textarea value={c.text} onChange={(e) => update({ text: e.target.value })} className="input text-xs py-1.5 min-h-[48px] resize-y" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[10px] font-medium text-surface-500 mb-0.5">Font</label>
          <div className="relative">
            <select value={c.fontFamily} onChange={(e) => update({ fontFamily: e.target.value })} className="input text-xs py-1.5 pr-6 appearance-none">
              {Object.entries(FONT_PRESETS).map(([key, preset]) => (
                <option key={key} value={preset.heading}>{preset.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-surface-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-medium text-surface-500 mb-0.5">Size</label>
          <input type="number" value={c.fontSize} onChange={(e) => update({ fontSize: Number(e.target.value) })} className="input text-xs py-1.5" />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-surface-500 mb-0.5">Weight</label>
          <div className="relative">
            <select value={c.fontWeight} onChange={(e) => update({ fontWeight: Number(e.target.value) })} className="input text-xs py-1.5 pr-6 appearance-none">
              {[300, 400, 500, 600, 700, 800, 900].map((w) => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-surface-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-medium text-surface-500 mb-0.5">Color</label>
          <input type="color" value={c.color} onChange={(e) => update({ color: e.target.value })} className="w-full h-8 rounded-lg cursor-pointer border border-surface-200" />
        </div>
      </div>
      <div className="flex gap-1">
        {(['left', 'center', 'right'] as const).map((a) => (
          <button key={a} onClick={() => update({ align: a })}
            className={`flex-1 py-1 rounded text-[10px] font-medium ${c.align === a ? 'bg-brand-50 text-brand-700' : 'bg-surface-50 text-surface-500'}`}
          >
            {a}
          </button>
        ))}
      </div>
      <div className="flex gap-1">
        {(['none', 'uppercase', 'lowercase'] as const).map((t) => (
          <button key={t} onClick={() => update({ textTransform: t })}
            className={`flex-1 py-1 rounded text-[10px] font-medium ${c.textTransform === t ? 'bg-brand-50 text-brand-700' : 'bg-surface-50 text-surface-500'}`}
          >
            {t === 'none' ? 'Aa' : t === 'uppercase' ? 'AA' : 'aa'}
          </button>
        ))}
      </div>
    </div>
  );
}

function CtaLayerEditor({ layer, onUpdate }: { layer: AdLayer; onUpdate: (c: AdLayerContent) => void }) {
  if (layer.content.type !== 'cta-button') return null;
  const c = layer.content;
  const update = (updates: Partial<typeof c>) => onUpdate({ ...c, ...updates });

  return (
    <div className="space-y-2 pt-2 border-t border-surface-100">
      <div>
        <label className="block text-[10px] font-medium text-surface-500 mb-0.5">Button Text</label>
        <input value={c.text} onChange={(e) => update({ text: e.target.value })} className="input text-xs py-1.5" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[10px] font-medium text-surface-500 mb-0.5">Text Color</label>
          <input type="color" value={c.color} onChange={(e) => update({ color: e.target.value })} className="w-full h-8 rounded-lg cursor-pointer border border-surface-200" />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-surface-500 mb-0.5">BG Color</label>
          <input type="color" value={c.bgColor} onChange={(e) => update({ bgColor: e.target.value })} className="w-full h-8 rounded-lg cursor-pointer border border-surface-200" />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-surface-500 mb-0.5">Radius</label>
          <input type="number" value={c.borderRadius} onChange={(e) => update({ borderRadius: Number(e.target.value) })} className="input text-xs py-1.5" />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-surface-500 mb-0.5">Font Size</label>
          <input type="number" value={c.fontSize} onChange={(e) => update({ fontSize: Number(e.target.value) })} className="input text-xs py-1.5" />
        </div>
      </div>
    </div>
  );
}

function BackgroundEditor({ layer, onUpdate }: { layer: AdLayer; onUpdate: (c: AdLayerContent) => void }) {
  if (layer.content.type !== 'background') return null;
  const c = layer.content;
  const update = (updates: Partial<typeof c>) => onUpdate({ ...c, ...updates });

  return (
    <div className="space-y-2 pt-2 border-t border-surface-100">
      <div>
        <label className="block text-[10px] font-medium text-surface-500 mb-0.5">Fill Color</label>
        <input type="color" value={c.fill} onChange={(e) => update({ fill: e.target.value })} className="w-full h-8 rounded-lg cursor-pointer border border-surface-200" />
      </div>
      <div>
        <label className="block text-[10px] font-medium text-surface-500 mb-0.5">Gradient (CSS)</label>
        <input value={c.gradient || ''} onChange={(e) => update({ gradient: e.target.value || null })} className="input text-xs py-1.5" placeholder="linear-gradient(135deg, #000, #333)" />
      </div>
    </div>
  );
}

function getLayerLabel(layer: AdLayer): string {
  switch (layer.content.type) {
    case 'text': return layer.content.text.slice(0, 24) || 'Text';
    case 'cta-button': return `CTA: ${layer.content.text}`;
    case 'image': return 'Image';
    case 'logo': return 'Logo';
    case 'shape': return `Shape (${layer.content.shape})`;
    case 'background': return 'Background';
    default: return 'Layer';
  }
}
