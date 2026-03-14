'use client';

import { useState, useRef } from 'react';
import { useVideoStore } from '@/stores/video-store';
import { useApiKeysStore } from '@/stores/api-keys-store';
import { generateCaptions, generateViralEffects, generateMotionGraphics, applyViralTemplate, generateScript } from '@/lib/ai-service';
import { VIRAL_TEMPLATES } from '@/lib/viral-templates';
import { CaptionStyle, ScriptStyle } from '@/types';
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
  FileText,
  ChevronDown,
  Undo2,
  Redo2,
  Download,
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
    undo,
    redo,
    canUndo,
    canRedo,
  } = useVideoStore();
  const { getActiveKey, markKeyUsed } = useApiKeysStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const [showCaptionGen, setShowCaptionGen] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showScriptGen, setShowScriptGen] = useState(false);
  const [captionForm, setCaptionForm] = useState({ text: '', style: 'viral' as CaptionStyle });
  const [scriptForm, setScriptForm] = useState({ topic: '', style: 'viral' as ScriptStyle });
  const [generating, setGenerating] = useState(false);

  const useKey = () => {
    const key = getActiveKey();
    if (key) markKeyUsed(key.id);
    return key;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!project) createProject(file.name.replace(/\.[^.]+$/, ''), '9:16');
    setVideoSrc(URL.createObjectURL(file));
  };

  const handleGenerateScript = async () => {
    if (!scriptForm.topic || !project) return;
    setGenerating(true);
    const script = await generateScript(scriptForm.topic, scriptForm.style, project.duration || 30);
    useKey();
    setCaptionForm({ ...captionForm, text: script });
    setGenerating(false);
    setShowScriptGen(false);
    setShowCaptionGen(true);
  };

  const handleGenerateCaptions = async () => {
    if (!captionForm.text || !project) return;
    setGenerating(true);
    const captions = await generateCaptions(captionForm.text, captionForm.style);
    useKey();
    setCaptions([...project.captions, ...captions]);
    setGenerating(false);
    setShowCaptionGen(false);
  };

  const handleGenerateEffects = async () => {
    if (!project) return;
    setGenerating(true);
    const effects = await generateViralEffects(project.duration || 30, 'high');
    useKey();
    setEffects([...project.effects, ...effects]);
    setGenerating(false);
  };

  const handleGenerateGraphics = async () => {
    if (!project) return;
    setGenerating(true);
    const graphics = await generateMotionGraphics(project.duration || 30, project.name);
    useKey();
    setMotionGraphics([...project.motionGraphics, ...graphics]);
    setGenerating(false);
  };

  const handleApplyTemplate = async (templateId: string) => {
    const template = VIRAL_TEMPLATES.find((t) => t.id === templateId);
    if (!template || !project) return;

    setGenerating(true);

    // Use template's actual effects/graphics, generate captions from existing text or placeholder
    const scriptText = captionForm.text || `Amazing content about ${project.name}. This is going to blow up. You need to see this right now.`;
    const { effects, motionGraphics, captions } = await applyViralTemplate(
      template,
      project.duration || 30,
      scriptText,
    );
    useKey();

    setEffects(effects);
    setMotionGraphics(motionGraphics);
    setCaptions(captions);
    setAspectRatio(template.aspectRatio);
    setGenerating(false);
    setShowTemplates(false);
  };

  const handleAutoBuild = async (templateId: string) => {
    const template = VIRAL_TEMPLATES.find((t) => t.id === templateId);
    if (!template || !project) return;

    setGenerating(true);

    // Full pipeline: generate script -> apply template
    const script = await generateScript(
      project.name || 'viral content',
      'viral',
      project.duration || 30,
    );

    const { effects, motionGraphics, captions } = await applyViralTemplate(
      template,
      project.duration || 30,
      script,
    );
    useKey();

    setCaptions(captions);
    setEffects(effects);
    setMotionGraphics(motionGraphics);
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
          <button onClick={() => fileRef.current?.click()} className="btn-primary flex items-center gap-2">
            <Upload className="w-4 h-4" /> Upload Video
          </button>
          <button onClick={() => createProject('Untitled Project', '9:16')} className="btn-secondary">
            Empty Project
          </button>
        </div>
        <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={handleFileUpload} />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {/* Playback + Undo/Redo */}
        <div className="flex items-center gap-1 bg-surface-100 rounded-xl p-1">
          <button onClick={() => undo()} disabled={!canUndo()} className="p-2 rounded-lg hover:bg-white text-surface-600 transition-colors disabled:opacity-30" title="Undo">
            <Undo2 className="w-4 h-4" />
          </button>
          <button onClick={() => redo()} disabled={!canRedo()} className="p-2 rounded-lg hover:bg-white text-surface-600 transition-colors disabled:opacity-30" title="Redo">
            <Redo2 className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-surface-300" />
          <button onClick={() => setCurrentTime(0)} className="p-2 rounded-lg hover:bg-white text-surface-600 transition-colors" title="Restart">
            <SkipBack className="w-4 h-4" />
          </button>
          <button onClick={() => setPlaying(!isPlaying)} className="p-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors">
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        </div>

        {/* Aspect ratio */}
        <div className="flex items-center gap-1 bg-surface-100 rounded-xl p-1">
          {([
            { ratio: '9:16' as const, icon: Smartphone, label: '9:16' },
            { ratio: '16:9' as const, icon: Monitor, label: '16:9' },
            { ratio: '1:1' as const, icon: Square, label: '1:1' },
          ]).map(({ ratio, icon: Icon, label }) => (
            <button
              key={ratio}
              onClick={() => setAspectRatio(ratio)}
              className={`p-2 rounded-lg transition-colors ${
                project.aspectRatio === ratio ? 'bg-white shadow-sm text-brand-600' : 'text-surface-500 hover:text-surface-700'
              }`}
              title={label}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-surface-200" />

        <button onClick={() => fileRef.current?.click()} className="btn-secondary flex items-center gap-2 text-sm py-2">
          <Upload className="w-4 h-4" /> Upload
        </button>

        {/* AI Tools */}
        <button onClick={() => setShowScriptGen(true)} className="btn-secondary flex items-center gap-2 text-sm py-2">
          <FileText className="w-4 h-4" /> Script
        </button>
        <button onClick={() => setShowCaptionGen(true)} className="btn-secondary flex items-center gap-2 text-sm py-2">
          <Type className="w-4 h-4" /> Captions
        </button>
        <button onClick={handleGenerateEffects} disabled={generating} className="btn-secondary flex items-center gap-2 text-sm py-2">
          <Sparkles className="w-4 h-4" /> {generating ? '...' : 'Effects'}
        </button>
        <button onClick={handleGenerateGraphics} disabled={generating} className="btn-secondary flex items-center gap-2 text-sm py-2">
          <Layers className="w-4 h-4" /> {generating ? '...' : 'Graphics'}
        </button>
        <button
          onClick={() => setShowTemplates(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-sm transition-all"
        >
          <Wand2 className="w-4 h-4" /> Templates
        </button>
        <button
          onClick={() => document.getElementById('export-panel')?.scrollIntoView({ behavior: 'smooth' })}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-sm transition-all"
        >
          <Download className="w-4 h-4" /> Export
        </button>

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
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </>
        )}

        <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={handleFileUpload} />
      </div>

      {/* Script Generator Modal */}
      <Modal open={showScriptGen} onClose={() => setShowScriptGen(false)} title="Generate Script">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Topic</label>
            <input
              value={scriptForm.topic}
              onChange={(e) => setScriptForm({ ...scriptForm, topic: e.target.value })}
              className="input"
              placeholder="e.g., 5 productivity hacks for developers"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">Style</label>
            <div className="grid grid-cols-2 gap-2">
              {([
                { value: 'viral' as const, label: 'Viral', desc: 'Hook-driven, high engagement' },
                { value: 'educational' as const, label: 'Educational', desc: 'Teach and inform' },
                { value: 'storytelling' as const, label: 'Storytelling', desc: 'Narrative arc' },
                { value: 'promotional' as const, label: 'Promotional', desc: 'Brand focused' },
                { value: 'direct-response' as const, label: 'Direct Response', desc: 'Pain → solution → urgency CTA' },
              ]).map((s) => (
                <button
                  key={s.value}
                  onClick={() => setScriptForm({ ...scriptForm, style: s.value })}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    scriptForm.style === s.value
                      ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500'
                      : 'border-surface-200 hover:border-surface-300'
                  }`}
                >
                  <p className="font-medium text-sm">{s.label}</p>
                  <p className="text-xs text-surface-500">{s.desc}</p>
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowScriptGen(false)} className="btn-secondary flex-1">Cancel</button>
            <button
              onClick={handleGenerateScript}
              disabled={generating || !scriptForm.topic}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              {generating ? 'Generating...' : 'Generate Script'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Caption Generator Modal */}
      <Modal open={showCaptionGen} onClose={() => setShowCaptionGen(false)} title="Generate Captions" size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Script / Transcript</label>
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
              {([
                { value: 'viral' as const, label: 'Viral', desc: 'Bold yellow, high impact', preview: 'WAIT FOR IT' },
                { value: 'bold' as const, label: 'Bold Gradient', desc: 'Gradient colors, dramatic', preview: 'MIND BLOWN' },
                { value: 'minimal' as const, label: 'Minimal', desc: 'Clean, elegant white', preview: 'subtle vibes' },
                { value: 'default' as const, label: 'Default', desc: 'Standard white text', preview: 'Standard Caption' },
              ]).map((style) => (
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
                    <span className={`caption-text style-${style.value} text-sm`}>{style.preview}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowCaptionGen(false)} className="btn-secondary flex-1">Cancel</button>
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
            <div key={template.id} className="p-4 rounded-xl border border-surface-200 hover:border-brand-300 transition-all group">
              <div className="w-full h-20 rounded-lg bg-gradient-to-br from-surface-800 to-surface-950 mb-3 flex items-center justify-center">
                <Wand2 className="w-6 h-6 text-surface-500 group-hover:text-brand-400 transition-colors" />
              </div>
              <h3 className="font-semibold text-sm text-surface-900">{template.name}</h3>
              <p className="text-xs text-surface-500 mt-1 mb-3">{template.description}</p>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs px-2 py-0.5 rounded bg-surface-100 text-surface-600">{template.aspectRatio}</span>
                <span className="effect-badge text-[10px]">{template.effects.length} effects</span>
                <span className="effect-badge text-[10px]">{template.motionGraphics.length} graphics</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleApplyTemplate(template.id)}
                  disabled={generating}
                  className="btn-secondary flex-1 text-xs py-1.5"
                >
                  Apply Template
                </button>
                <button
                  onClick={() => handleAutoBuild(template.id)}
                  disabled={generating}
                  className="btn-primary flex-1 text-xs py-1.5 flex items-center justify-center gap-1"
                >
                  <Zap className="w-3 h-3" />
                  Auto Build
                </button>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}
