'use client';

import { useState, useRef } from 'react';
import { useVideoStore } from '@/stores/video-store';
import { useApiKeysStore } from '@/stores/api-keys-store';
import { generateCaptions, generateViralEffects, generateMotionGraphics, generateAutoEdit } from '@/lib/ai-service';
import { VIRAL_TEMPLATES } from '@/lib/viral-templates';
import { CaptionStyle } from '@/types';
import Modal from '@/components/ui/Modal';
import {
  Play,
  Pause,
  SkipBack,
  Upload,
  Type,
  Sparkles,
  Wand2,
  Layers,
  Monitor,
  Smartphone,
  Square,
  Trash2,
  Zap,
} from 'lucide-react';

export default function EditorToolbar() {
  const {
    project,
    isPlaying,
    setPlaying,
    setCurrentTime,
    setVideoSrc,
    setCaptions,
    setEffects,
    setMotionGraphics,
    setAspectRatio,
    createProject,
    selectedCaptionId,
    removeCaption,
    selectedEffectId,
    removeEffect,
  } = useVideoStore();
  const { getActiveKey, markKeyUsed } = useApiKeysStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const [showCaptionGen, setShowCaptionGen] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [captionForm, setCaptionForm] = useState({ text: '', style: 'viral' as CaptionStyle });
  const [generating, setGenerating] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!project) {
      createProject(file.name.replace(/\.[^.]+$/, ''), '9:16');
    }

    const url = URL.createObjectURL(file);
    setVideoSrc(url);
  };

  const handleGenerateCaptions = async () => {
    if (!captionForm.text || !project) return;
    setGenerating(true);
    const key = getActiveKey();
    const captions = await generateCaptions(
      captionForm.text,
      captionForm.style,
      key || ({} as any)
    );
    if (key) markKeyUsed(key.id);
    setCaptions([...project.captions, ...captions]);
    setGenerating(false);
    setShowCaptionGen(false);
  };

  const handleGenerateEffects = async () => {
    if (!project) return;
    setGenerating(true);
    const key = getActiveKey();
    const effects = await generateViralEffects(
      project.duration || 30,
      'high',
      key || ({} as any)
    );
    if (key) markKeyUsed(key.id);
    setEffects([...project.effects, ...effects]);
    setGenerating(false);
  };

  const handleGenerateGraphics = async () => {
    if (!project) return;
    setGenerating(true);
    const key = getActiveKey();
    const graphics = await generateMotionGraphics(
      project.duration || 30,
      project.name,
      key || ({} as any)
    );
    if (key) markKeyUsed(key.id);
    setMotionGraphics([...project.motionGraphics, ...graphics]);
    setGenerating(false);
  };

  const handleApplyTemplate = async (templateId: string) => {
    const template = VIRAL_TEMPLATES.find((t) => t.id === templateId);
    if (!template || !project) return;

    setGenerating(true);
    const key = getActiveKey();

    const { effects, motionGraphics, captions } = await generateAutoEdit(
      project.duration || 30,
      template.captionStyle === 'viral' ? 'viral' : template.captionStyle === 'bold' ? 'cinematic' : 'minimal',
      key || ({} as any)
    );

    if (key) markKeyUsed(key.id);

    setEffects(effects);
    setMotionGraphics(motionGraphics);
    setCaptions(captions);
    setAspectRatio(template.aspectRatio);
    setGenerating(false);
    setShowTemplates(false);
  };

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
          <Upload className="w-8 h-8 text-white" />
        </div>
        <div className="text-center">
          <h3 className="font-semibold text-surface-900 mb-1">Start a New Project</h3>
          <p className="text-sm text-surface-500 mb-4">Upload a video or create an empty project</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => fileRef.current?.click()}
            className="btn-primary flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload Video
          </button>
          <button
            onClick={() => createProject('Untitled Project', '9:16')}
            className="btn-secondary"
          >
            Empty Project
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {/* Playback */}
        <div className="flex items-center gap-1 bg-surface-100 rounded-xl p-1">
          <button
            onClick={() => setCurrentTime(0)}
            className="p-2 rounded-lg hover:bg-white text-surface-600 transition-colors"
            title="Restart"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={() => setPlaying(!isPlaying)}
            className="p-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        </div>

        {/* Aspect ratio */}
        <div className="flex items-center gap-1 bg-surface-100 rounded-xl p-1">
          {[
            { ratio: '9:16' as const, icon: Smartphone, label: '9:16' },
            { ratio: '16:9' as const, icon: Monitor, label: '16:9' },
            { ratio: '1:1' as const, icon: Square, label: '1:1' },
          ].map(({ ratio, icon: Icon, label }) => (
            <button
              key={ratio}
              onClick={() => setAspectRatio(ratio)}
              className={`p-2 rounded-lg transition-colors ${
                project.aspectRatio === ratio
                  ? 'bg-white shadow-sm text-brand-600'
                  : 'text-surface-500 hover:text-surface-700'
              }`}
              title={label}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-surface-200" />

        {/* Upload */}
        <button
          onClick={() => fileRef.current?.click()}
          className="btn-secondary flex items-center gap-2 text-sm py-2"
        >
          <Upload className="w-4 h-4" />
          Upload
        </button>

        {/* AI Tools */}
        <button
          onClick={() => setShowCaptionGen(true)}
          className="btn-secondary flex items-center gap-2 text-sm py-2"
        >
          <Type className="w-4 h-4" />
          Captions
        </button>

        <button
          onClick={handleGenerateEffects}
          disabled={generating}
          className="btn-secondary flex items-center gap-2 text-sm py-2"
        >
          <Sparkles className="w-4 h-4" />
          {generating ? 'Generating...' : 'Effects'}
        </button>

        <button
          onClick={handleGenerateGraphics}
          disabled={generating}
          className="btn-secondary flex items-center gap-2 text-sm py-2"
        >
          <Layers className="w-4 h-4" />
          Graphics
        </button>

        <button
          onClick={() => setShowTemplates(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-sm transition-all"
        >
          <Wand2 className="w-4 h-4" />
          Viral Templates
        </button>

        {/* Delete selected */}
        {(selectedCaptionId || selectedEffectId) && (
          <>
            <div className="w-px h-6 bg-surface-200" />
            <button
              onClick={() => {
                if (selectedCaptionId) removeCaption(selectedCaptionId);
                if (selectedEffectId) removeEffect(selectedEffectId);
              }}
              className="btn-danger flex items-center gap-2 text-sm py-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>

      {/* Caption Generator Modal */}
      <Modal open={showCaptionGen} onClose={() => setShowCaptionGen(false)} title="Generate Captions" size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">
              Script / Transcript
            </label>
            <textarea
              value={captionForm.text}
              onChange={(e) => setCaptionForm({ ...captionForm, text: e.target.value })}
              className="input min-h-[120px] resize-y"
              placeholder="Enter your script or transcript text here..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">Caption Style</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'viral' as const, label: 'Viral', desc: 'Bold yellow, high impact', preview: 'WAIT FOR IT 🔥' },
                { value: 'bold' as const, label: 'Bold Gradient', desc: 'Gradient colors, dramatic', preview: 'MIND BLOWN' },
                { value: 'minimal' as const, label: 'Minimal', desc: 'Clean, elegant white', preview: 'subtle vibes' },
                { value: 'default' as const, label: 'Default', desc: 'Standard white text', preview: 'Standard Caption' },
              ].map((style) => (
                <button
                  key={style.value}
                  onClick={() => setCaptionForm({ ...captionForm, style: style.value })}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    captionForm.style === style.value
                      ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500'
                      : 'border-surface-200 hover:border-surface-300'
                  }`}
                >
                  <p className="font-medium text-sm text-surface-900">{style.label}</p>
                  <p className="text-xs text-surface-500 mt-0.5">{style.desc}</p>
                  <div className="mt-2 px-2 py-1 bg-surface-900 rounded text-center">
                    <span className={`caption-text style-${style.value} text-sm`}>
                      {style.preview}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowCaptionGen(false)} className="btn-secondary flex-1">
              Cancel
            </button>
            <button
              onClick={handleGenerateCaptions}
              disabled={generating || !captionForm.text}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              {generating ? 'Generating...' : 'Generate Captions'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Templates Modal */}
      <Modal open={showTemplates} onClose={() => setShowTemplates(false)} title="Viral Templates" size="lg">
        <div className="grid grid-cols-2 gap-4">
          {VIRAL_TEMPLATES.map((template) => (
            <button
              key={template.id}
              onClick={() => handleApplyTemplate(template.id)}
              disabled={generating}
              className="p-4 rounded-xl border border-surface-200 hover:border-brand-300 hover:bg-brand-50/50 text-left transition-all group"
            >
              <div className="w-full h-24 rounded-lg bg-gradient-to-br from-surface-800 to-surface-950 mb-3 flex items-center justify-center">
                <Wand2 className="w-8 h-8 text-surface-500 group-hover:text-brand-400 transition-colors" />
              </div>
              <h3 className="font-semibold text-sm text-surface-900">{template.name}</h3>
              <p className="text-xs text-surface-500 mt-1">{template.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs px-2 py-0.5 rounded bg-surface-100 text-surface-600">
                  {template.aspectRatio}
                </span>
                <span className="effect-badge text-[10px]">
                  {template.effects.length} effects
                </span>
              </div>
            </button>
          ))}
        </div>
      </Modal>
    </>
  );
}
