'use client';

import { useState } from 'react';
import { useAdStore } from '@/stores/ad-store';
import { useApiKeysStore } from '@/stores/api-keys-store';
import { generateAdCopy, composeStaticAd } from '@/lib/ai-service';
import { AD_TEMPLATES, FONT_PRESETS, DEFAULT_FONT_PRESET, AD_STYLE_PRESETS, AdStylePreset } from '@/lib/ad-templates';
import { AdFormat, AdLayer, AD_FORMAT_SIZES } from '@/types';
import AdCanvas from './AdCanvas';
import AdLayerPanel from './AdLayerPanel';
import Modal from '@/components/ui/Modal';
import {
  Plus,
  Wand2,
  Image as ImageIcon,
  Type,
  Square,
  MousePointer2,
  Download,
  ChevronDown,
  Zap,
  Save,
  FolderOpen,
  LayoutGrid,
  Sparkles,
  PenTool,
  Palette,
  Upload,
  X,
} from 'lucide-react';

const AD_TONES = [
  { value: 'professional' as const, label: 'Professional' },
  { value: 'casual' as const, label: 'Casual' },
  { value: 'urgent' as const, label: 'Urgent' },
  { value: 'luxury' as const, label: 'Luxury' },
  { value: 'playful' as const, label: 'Playful' },
];

export default function StaticAdStudio() {
  const {
    project,
    projects,
    createProject,
    loadProject,
    saveProject,
    addLayer,
    setFormat,
    updateBrandKit,
  } = useAdStore();
  const { getActiveKey, markKeyUsed } = useApiKeysStore();

  const [showTemplates, setShowTemplates] = useState(false);
  const [showAiCopy, setShowAiCopy] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [aiForm, setAiForm] = useState<{ topic: string; tone: 'professional' | 'casual' | 'urgent' | 'luxury' | 'playful' }>({ topic: '', tone: 'professional' });
  const [generating, setGenerating] = useState(false);
  const [showBrandKit, setShowBrandKit] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<AdStylePreset | null>(null);
  const [referenceImages, setReferenceImages] = useState<string[]>([]);

  const handleAddReferenceImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      setReferenceImages((prev) => [...prev, url]);
    });
    e.target.value = '';
  };

  const handleRemoveReferenceImage = (index: number) => {
    setReferenceImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateFromTemplate = async (templateId: string) => {
    setGenerating(true);
    const template = AD_TEMPLATES.find((t) => t.id === templateId)!;
    const copy = await generateAdCopy(aiForm.topic || 'Your Product', aiForm.tone, template.format);
    const adProject = await composeStaticAd(templateId, copy, undefined, selectedStyle || undefined, referenceImages.length > 0 ? referenceImages : undefined);
    const key = getActiveKey();
    if (key) markKeyUsed(key.id);
    loadProject(adProject);
    setGenerating(false);
    setShowTemplates(false);
  };

  const handleAiGenerate = async () => {
    if (!aiForm.topic || !project) return;
    setGenerating(true);
    const copy = await generateAdCopy(aiForm.topic, aiForm.tone, project.format);
    const adProject = await composeStaticAd(
      AD_TEMPLATES.find((t) => t.format === project.format)?.id || AD_TEMPLATES[0].id,
      copy,
      project.brandKit,
      selectedStyle || undefined,
      referenceImages.length > 0 ? referenceImages : undefined,
    );
    const key = getActiveKey();
    if (key) markKeyUsed(key.id);
    loadProject(adProject);
    setGenerating(false);
    setShowAiCopy(false);
  };

  const addTextLayer = () => {
    if (!project) return;
    const fontPreset = FONT_PRESETS[DEFAULT_FONT_PRESET];
    const layer: AdLayer = {
      id: crypto.randomUUID(),
      type: 'text',
      order: project.layers.length,
      visible: true,
      locked: false,
      x: 100, y: 100, width: 400, height: 80, rotation: 0, opacity: 1,
      content: {
        type: 'text', text: 'New Text', fontFamily: fontPreset.heading, fontSize: 32,
        fontWeight: 700, color: '#0f172a', align: 'center', lineHeight: 1.2, letterSpacing: 0,
        textTransform: 'none', shadow: null, stroke: null, strokeWidth: 0,
      },
    };
    addLayer(layer);
  };

  const addShapeLayer = () => {
    if (!project) return;
    const layer: AdLayer = {
      id: crypto.randomUUID(),
      type: 'shape',
      order: project.layers.length,
      visible: true,
      locked: false,
      x: 100, y: 100, width: 200, height: 200, rotation: 0, opacity: 1,
      content: { type: 'shape', shape: 'rounded-rect', fill: '#2563eb', stroke: null, strokeWidth: 0, borderRadius: 16 },
    };
    addLayer(layer);
  };

  const addCtaLayer = () => {
    if (!project) return;
    const fontPreset = FONT_PRESETS[DEFAULT_FONT_PRESET];
    const layer: AdLayer = {
      id: crypto.randomUUID(),
      type: 'cta-button',
      order: project.layers.length,
      visible: true,
      locked: false,
      x: 200, y: 400, width: 300, height: 60, rotation: 0, opacity: 1,
      content: {
        type: 'cta-button', text: 'Shop Now', fontFamily: fontPreset.heading, fontSize: 20,
        fontWeight: 700, color: '#ffffff', bgColor: '#2563eb', borderRadius: 12, paddingX: 32, paddingY: 14,
      },
    };
    addLayer(layer);
  };

  // ─── No Project View ──────────────────────────────────────────────
  if (!project) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <PenTool className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-surface-900">Static Ad Studio</h2>
            <p className="text-sm text-surface-500">
              Design and scale static ads with AI • Nano Banana Pro font
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setShowTemplates(true)}
            className="card hover:border-brand-300 hover:shadow-md text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center mb-3">
              <Wand2 className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-surface-900 mb-1">From Template</h3>
            <p className="text-xs text-surface-500">Start with a pre-built template using Nano Banana Pro</p>
          </button>

          <button
            onClick={() => createProject('Untitled Ad', 'instagram-post')}
            className="card hover:border-brand-300 hover:shadow-md text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-3">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-surface-900 mb-1">Blank Canvas</h3>
            <p className="text-xs text-surface-500">Start from scratch with a blank ad canvas</p>
          </button>

          {projects.length > 0 && (
            <button
              onClick={() => setShowProjects(true)}
              className="card hover:border-brand-300 hover:shadow-md text-left group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mb-3">
                <FolderOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-surface-900 mb-1">Recent Projects</h3>
              <p className="text-xs text-surface-500">{projects.length} saved ad projects</p>
            </button>
          )}
        </div>

        {/* Template Gallery */}
        <div>
          <h3 className="font-semibold text-surface-900 mb-3">Ad Templates</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {AD_TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => handleCreateFromTemplate(template.id)}
                disabled={generating}
                className="group p-4 rounded-xl border border-surface-200 hover:border-brand-300 hover:shadow-md text-left transition-all"
              >
                <div className="w-full h-32 rounded-lg bg-gradient-to-br from-surface-100 to-surface-200 mb-3 flex items-center justify-center">
                  <LayoutGrid className="w-8 h-8 text-surface-400 group-hover:text-brand-500 transition-colors" />
                </div>
                <p className="font-medium text-sm text-surface-900">{template.name}</p>
                <p className="text-xs text-surface-500 mt-0.5">{template.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-surface-100 text-surface-600">
                    {AD_FORMAT_SIZES[template.format].label}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                    Nano Banana Pro
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Templates Modal */}
        <Modal open={showTemplates} onClose={() => setShowTemplates(false)} title="Choose Template" size="lg">
          <div className="grid grid-cols-2 gap-4">
            {AD_TEMPLATES.map((t) => (
              <button key={t.id} onClick={() => handleCreateFromTemplate(t.id)} disabled={generating}
                className="p-4 rounded-xl border border-surface-200 hover:border-brand-300 text-left transition-all">
                <p className="font-semibold text-sm">{t.name}</p>
                <p className="text-xs text-surface-500 mt-1">{t.description}</p>
                <span className="text-[10px] mt-2 inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">Nano Banana Pro</span>
              </button>
            ))}
          </div>
        </Modal>

        {/* Projects Modal */}
        <Modal open={showProjects} onClose={() => setShowProjects(false)} title="Saved Projects">
          <div className="space-y-2">
            {projects.map((p) => (
              <button key={p.id} onClick={() => { loadProject(p); setShowProjects(false); }}
                className="w-full p-3 rounded-xl border border-surface-200 hover:border-brand-300 text-left transition-all">
                <p className="font-medium text-sm">{p.name}</p>
                <p className="text-xs text-surface-500">{AD_FORMAT_SIZES[p.format].label} • {p.layers.length} layers • {new Date(p.updatedAt).toLocaleDateString()}</p>
              </button>
            ))}
          </div>
        </Modal>
      </div>
    );
  }

  // ─── Active Project View ────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
          <PenTool className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-surface-900 truncate">{project.name}</h2>
          <p className="text-xs text-surface-500">{AD_FORMAT_SIZES[project.format].label} • {project.width}x{project.height} • Nano Banana Pro</p>
        </div>
        <button onClick={saveProject} className="btn-secondary flex items-center gap-2 text-sm">
          <Save className="w-4 h-4" /> Save
        </button>
      </div>

      {/* Toolbar */}
      <div className="card">
        <div className="flex flex-wrap items-center gap-2">
          {/* Format selector */}
          <div className="relative">
            <select value={project.format} onChange={(e) => setFormat(e.target.value as AdFormat)} className="input text-sm py-2 pr-8 appearance-none">
              {Object.entries(AD_FORMAT_SIZES).map(([key, val]) => (
                <option key={key} value={key}>{val.label} ({val.width}x{val.height})</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
          </div>

          <div className="w-px h-6 bg-surface-200" />

          {/* Add layers */}
          <button onClick={addTextLayer} className="btn-secondary flex items-center gap-1.5 text-sm py-2">
            <Type className="w-4 h-4" /> Text
          </button>
          <button onClick={addShapeLayer} className="btn-secondary flex items-center gap-1.5 text-sm py-2">
            <Square className="w-4 h-4" /> Shape
          </button>
          <button onClick={addCtaLayer} className="btn-secondary flex items-center gap-1.5 text-sm py-2">
            <MousePointer2 className="w-4 h-4" /> CTA Button
          </button>

          <div className="w-px h-6 bg-surface-200" />

          {/* AI tools */}
          <button onClick={() => setShowAiCopy(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-sm transition-all">
            <Sparkles className="w-4 h-4" /> AI Copy
          </button>
          <button onClick={() => setShowTemplates(true)} className="btn-secondary flex items-center gap-1.5 text-sm py-2">
            <Wand2 className="w-4 h-4" /> Templates
          </button>
          <button onClick={() => setShowBrandKit(true)} className="btn-secondary flex items-center gap-1.5 text-sm py-2">
            <Palette className="w-4 h-4" /> Brand Kit
          </button>
        </div>
      </div>

      {/* Style Selector */}
      <div className="card space-y-3">
        <h3 className="font-medium text-surface-900 text-sm">Style</h3>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {AD_STYLE_PRESETS.map((style) => (
            <button
              key={style.id}
              onClick={() => setSelectedStyle(selectedStyle?.id === style.id ? null : style)}
              className={`flex-shrink-0 rounded-xl border-2 p-2 transition-all ${
                selectedStyle?.id === style.id
                  ? 'border-brand-500 ring-2 ring-brand-200 shadow-md'
                  : 'border-surface-200 hover:border-surface-300'
              }`}
              style={{ width: 100 }}
            >
              {/* Color swatch preview */}
              <div className="flex gap-0.5 mb-1.5 rounded-lg overflow-hidden h-8">
                <div className="flex-1" style={{ background: style.colors.bg }} />
                <div className="flex-1" style={{ background: style.colors.primary }} />
                <div className="flex-1" style={{ background: style.colors.accent }} />
                <div className="flex-1" style={{ background: style.colors.secondary }} />
              </div>
              <p className="text-[10px] font-semibold text-surface-900 truncate">{style.name}</p>
              <p className="text-[9px] text-surface-500 truncate">{style.description}</p>
            </button>
          ))}
        </div>
        {selectedStyle && (
          <div className="flex items-center gap-2 text-xs text-brand-700 bg-brand-50 px-3 py-1.5 rounded-lg">
            <span className="font-medium">Active: {selectedStyle.name}</span>
            <span className="text-brand-400">|</span>
            <span>{selectedStyle.vibe} vibe</span>
            <button onClick={() => setSelectedStyle(null)} className="ml-auto text-brand-500 hover:text-brand-700">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Reference Images */}
      <div className="card space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-surface-900 text-sm">Reference Images</h3>
            <p className="text-[11px] text-surface-500">Upload client branding or ad references to recreate</p>
          </div>
          <label className="btn-secondary flex items-center gap-1.5 text-sm py-2 cursor-pointer">
            <Upload className="w-4 h-4" /> Upload
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleAddReferenceImage}
              className="hidden"
            />
          </label>
        </div>
        {referenceImages.length > 0 && (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {referenceImages.map((src, i) => (
              <div key={i} className="relative flex-shrink-0 group">
                <img
                  src={src}
                  alt={`Reference ${i + 1}`}
                  className="h-24 w-24 object-cover rounded-xl border-2 border-surface-200 group-hover:border-brand-300 transition-colors"
                />
                <button
                  onClick={() => handleRemoveReferenceImage(i)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
                <span className="absolute bottom-1 left-1 text-[9px] bg-black/60 text-white px-1.5 py-0.5 rounded">
                  Ref {i + 1}
                </span>
              </div>
            ))}
            <label className="flex-shrink-0 h-24 w-24 rounded-xl border-2 border-dashed border-surface-300 hover:border-brand-400 flex flex-col items-center justify-center cursor-pointer transition-colors">
              <Plus className="w-5 h-5 text-surface-400" />
              <span className="text-[9px] text-surface-400 mt-1">Add more</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleAddReferenceImage}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>

      {/* Canvas + Properties */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AdCanvas />
        </div>
        <AdLayerPanel />
      </div>

      {/* AI Copy Modal */}
      <Modal open={showAiCopy} onClose={() => setShowAiCopy(false)} title="Generate Ad Copy with AI">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Product / Topic</label>
            <input value={aiForm.topic} onChange={(e) => setAiForm({ ...aiForm, topic: e.target.value })} className="input" placeholder="e.g., AI Video Editor" />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">Tone</label>
            <div className="flex flex-wrap gap-2">
              {AD_TONES.map((t) => (
                <button key={t.value} onClick={() => setAiForm({ ...aiForm, tone: t.value })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    aiForm.tone === t.value ? 'bg-brand-600 text-white' : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                  }`}
                >{t.label}</button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowAiCopy(false)} className="btn-secondary flex-1">Cancel</button>
            <button onClick={handleAiGenerate} disabled={generating || !aiForm.topic} className="btn-primary flex-1 flex items-center justify-center gap-2">
              <Zap className="w-4 h-4" /> {generating ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Templates Modal */}
      <Modal open={showTemplates} onClose={() => setShowTemplates(false)} title="Apply Template" size="lg">
        <div className="grid grid-cols-2 gap-4">
          {AD_TEMPLATES.map((t) => (
            <button key={t.id} onClick={() => handleCreateFromTemplate(t.id)} disabled={generating}
              className="p-4 rounded-xl border border-surface-200 hover:border-brand-300 text-left transition-all">
              <p className="font-semibold text-sm">{t.name}</p>
              <p className="text-xs text-surface-500 mt-1">{t.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] px-2 py-0.5 rounded bg-surface-100 text-surface-600">{AD_FORMAT_SIZES[t.format].label}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">Nano Banana Pro</span>
              </div>
            </button>
          ))}
        </div>
      </Modal>

      {/* Brand Kit Modal */}
      <Modal open={showBrandKit} onClose={() => setShowBrandKit(false)} title="Brand Kit">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Primary Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={project.brandKit.primaryColor}
                onChange={(e) => updateBrandKit({ primaryColor: e.target.value })}
                className="w-10 h-10 rounded-lg border border-surface-200 cursor-pointer"
              />
              <input
                value={project.brandKit.primaryColor}
                onChange={(e) => updateBrandKit({ primaryColor: e.target.value })}
                className="input text-sm font-mono flex-1"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Secondary Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={project.brandKit.secondaryColor}
                onChange={(e) => updateBrandKit({ secondaryColor: e.target.value })}
                className="w-10 h-10 rounded-lg border border-surface-200 cursor-pointer"
              />
              <input
                value={project.brandKit.secondaryColor}
                onChange={(e) => updateBrandKit({ secondaryColor: e.target.value })}
                className="input text-sm font-mono flex-1"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Accent Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={project.brandKit.accentColor}
                onChange={(e) => updateBrandKit({ accentColor: e.target.value })}
                className="w-10 h-10 rounded-lg border border-surface-200 cursor-pointer"
              />
              <input
                value={project.brandKit.accentColor}
                onChange={(e) => updateBrandKit({ accentColor: e.target.value })}
                className="input text-sm font-mono flex-1"
              />
            </div>
          </div>
          <div className="border-t border-surface-100 pt-4">
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Heading Font</label>
            <input
              value={project.brandKit.fontHeading}
              onChange={(e) => updateBrandKit({ fontHeading: e.target.value })}
              className="input text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Body Font</label>
            <input
              value={project.brandKit.fontBody}
              onChange={(e) => updateBrandKit({ fontBody: e.target.value })}
              className="input text-sm"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowBrandKit(false)} className="btn-primary flex-1">Done</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
