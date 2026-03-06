'use client';

import { useState, useCallback } from 'react';
import { useBatchStore } from '@/stores/batch-store';
import { useApiKeysStore } from '@/stores/api-keys-store';
import { VIRAL_TEMPLATES } from '@/lib/viral-templates';
import { ScriptStyle } from '@/types';
import Modal from '@/components/ui/Modal';
import BatchJobCard from './BatchJobCard';
import {
  Plus,
  Play,
  Trash2,
  Settings,
  Zap,
  Layers,
  FileText,
  ChevronDown,
  Sparkles,
  ListPlus,
} from 'lucide-react';

const SCRIPT_STYLES: { value: ScriptStyle; label: string; desc: string }[] = [
  { value: 'viral', label: 'Viral', desc: 'Hook-driven, high engagement' },
  { value: 'educational', label: 'Educational', desc: 'Teach and inform' },
  { value: 'storytelling', label: 'Storytelling', desc: 'Narrative arc, personal' },
  { value: 'promotional', label: 'Promotional', desc: 'Product/brand focused' },
];

export default function BatchVideoGenerator() {
  const {
    jobs,
    config,
    isProcessing,
    addJob,
    addBulkJobs,
    removeJob,
    clearCompleted,
    clearAll,
    updateConfig,
    processQueue,
    getStats,
  } = useBatchStore();
  const { getKeyStats } = useApiKeysStore();
  const keyStats = getKeyStats();
  const stats = getStats();

  const [showAddSingle, setShowAddSingle] = useState(false);
  const [showAddBulk, setShowAddBulk] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [singleForm, setSingleForm] = useState({
    topic: '',
    scriptStyle: config.defaultScriptStyle,
    templateId: config.defaultTemplateId,
    duration: config.defaultDuration,
  });

  const [bulkForm, setBulkForm] = useState({
    topics: '',
    scriptStyle: config.defaultScriptStyle,
    templateId: config.defaultTemplateId,
    duration: config.defaultDuration,
  });

  const handleAddSingle = useCallback(() => {
    if (!singleForm.topic.trim()) return;
    addJob(singleForm.topic.trim(), singleForm.scriptStyle, singleForm.templateId, singleForm.duration);
    setSingleForm({ ...singleForm, topic: '' });
    setShowAddSingle(false);
  }, [singleForm, addJob]);

  const handleAddBulk = useCallback(() => {
    const topics = bulkForm.topics
      .split('\n')
      .map((t) => t.trim())
      .filter(Boolean);
    if (topics.length === 0) return;
    addBulkJobs(topics, bulkForm.scriptStyle, bulkForm.templateId, bulkForm.duration);
    setBulkForm({ ...bulkForm, topics: '' });
    setShowAddBulk(false);
  }, [bulkForm, addBulkJobs]);

  const handleStartProcessing = useCallback(() => {
    processQueue();
  }, [processQueue]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
          <Layers className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-surface-900">Batch Video Generation</h2>
          <p className="text-sm text-surface-500">
            Auto-generate scripts, apply viral templates, and batch produce videos
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Total', value: stats.total, color: 'text-surface-700 bg-surface-50' },
          { label: 'Queued', value: stats.queued, color: 'text-yellow-700 bg-yellow-50' },
          { label: 'Processing', value: stats.processing, color: 'text-blue-700 bg-blue-50' },
          { label: 'Complete', value: stats.complete, color: 'text-green-700 bg-green-50' },
          { label: 'Errors', value: stats.error, color: 'text-red-700 bg-red-50' },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl px-4 py-3 ${s.color}`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs opacity-70">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Action Bar */}
      <div className="card">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowAddSingle(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Video
          </button>
          <button
            onClick={() => setShowAddBulk(true)}
            className="btn-secondary flex items-center gap-2"
          >
            <ListPlus className="w-4 h-4" />
            Bulk Add
          </button>

          <div className="w-px h-6 bg-surface-200" />

          <button
            onClick={handleStartProcessing}
            disabled={isProcessing || stats.queued === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Start Batch ({stats.queued} queued)
              </>
            )}
          </button>

          <div className="flex-1" />

          <button
            onClick={() => setShowSettings(true)}
            className="btn-secondary flex items-center gap-2 text-sm"
          >
            <Settings className="w-4 h-4" />
          </button>
          {stats.complete > 0 && (
            <button
              onClick={clearCompleted}
              className="btn-secondary flex items-center gap-2 text-sm"
            >
              Clear Done
            </button>
          )}
          {stats.total > 0 && (
            <button
              onClick={clearAll}
              className="btn-secondary flex items-center gap-2 text-sm text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Pipeline Visualization */}
      {(isProcessing || stats.processing > 0) && (
        <div className="card bg-gradient-to-r from-brand-50 to-purple-50 border-brand-200">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-brand-600" />
            <span className="font-medium text-brand-900 text-sm">Auto-Build Pipeline Active</span>
          </div>
          <div className="flex items-center gap-2">
            {['Script', 'Captions', 'Effects', 'Graphics', 'Done'].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    i < 4
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-white text-surface-600 border border-surface-200'
                  }`}
                >
                  {step}
                </div>
                {i < 4 && (
                  <div className="w-6 h-0.5 bg-brand-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Job List */}
      <div className="space-y-3">
        {jobs.length === 0 ? (
          <div className="card text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="text-lg font-medium text-surface-700 mb-2">No Batch Jobs</h3>
            <p className="text-sm text-surface-500 mb-6 max-w-md mx-auto">
              Add topics to auto-generate scripts, apply viral templates with captions and effects,
              and batch produce ready-to-edit video projects.
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setShowAddSingle(true)} className="btn-primary flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Video
              </button>
              <button onClick={() => setShowAddBulk(true)} className="btn-secondary flex items-center gap-2">
                <ListPlus className="w-4 h-4" />
                Bulk Add Topics
              </button>
            </div>
          </div>
        ) : (
          jobs.map((job) => (
            <BatchJobCard key={job.id} job={job} onRemove={removeJob} />
          ))
        )}
      </div>

      {/* Add Single Modal */}
      <Modal open={showAddSingle} onClose={() => setShowAddSingle(false)} title="Add Video to Batch">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Topic / Title</label>
            <input
              value={singleForm.topic}
              onChange={(e) => setSingleForm({ ...singleForm, topic: e.target.value })}
              className="input"
              placeholder="e.g., 5 productivity hacks for developers"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">Script Style</label>
            <div className="grid grid-cols-2 gap-2">
              {SCRIPT_STYLES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSingleForm({ ...singleForm, scriptStyle: s.value })}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    singleForm.scriptStyle === s.value
                      ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500'
                      : 'border-surface-200 hover:border-surface-300'
                  }`}
                >
                  <p className="font-medium text-sm text-surface-900">{s.label}</p>
                  <p className="text-xs text-surface-500">{s.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Viral Template</label>
            <div className="relative">
              <select
                value={singleForm.templateId}
                onChange={(e) => setSingleForm({ ...singleForm, templateId: e.target.value })}
                className="input pr-8 appearance-none"
              >
                {VIRAL_TEMPLATES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.aspectRatio})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">
              Duration (seconds)
            </label>
            <input
              type="number"
              min={5}
              max={180}
              value={singleForm.duration}
              onChange={(e) => setSingleForm({ ...singleForm, duration: Number(e.target.value) })}
              className="input"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowAddSingle(false)} className="btn-secondary flex-1">
              Cancel
            </button>
            <button
              onClick={handleAddSingle}
              disabled={!singleForm.topic.trim()}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add to Queue
            </button>
          </div>
        </div>
      </Modal>

      {/* Bulk Add Modal */}
      <Modal open={showAddBulk} onClose={() => setShowAddBulk(false)} title="Bulk Add Videos" size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">
              Topics (one per line)
            </label>
            <textarea
              value={bulkForm.topics}
              onChange={(e) => setBulkForm({ ...bulkForm, topics: e.target.value })}
              className="input min-h-[160px] resize-y font-mono text-sm"
              placeholder={`5 morning routines for success\nHow to learn any skill fast\nThe truth about passive income\nBiggest mistakes beginners make\nWhy most people fail at this`}
            />
            <p className="text-xs text-surface-400 mt-1">
              {bulkForm.topics.split('\n').filter((t) => t.trim()).length} topics entered
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Script Style</label>
              <div className="relative">
                <select
                  value={bulkForm.scriptStyle}
                  onChange={(e) => setBulkForm({ ...bulkForm, scriptStyle: e.target.value as ScriptStyle })}
                  className="input pr-8 appearance-none"
                >
                  {SCRIPT_STYLES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">Template</label>
              <div className="relative">
                <select
                  value={bulkForm.templateId}
                  onChange={(e) => setBulkForm({ ...bulkForm, templateId: e.target.value })}
                  className="input pr-8 appearance-none"
                >
                  {VIRAL_TEMPLATES.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">
              Duration per video (seconds)
            </label>
            <input
              type="number"
              min={5}
              max={180}
              value={bulkForm.duration}
              onChange={(e) => setBulkForm({ ...bulkForm, duration: Number(e.target.value) })}
              className="input"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowAddBulk(false)} className="btn-secondary flex-1">
              Cancel
            </button>
            <button
              onClick={handleAddBulk}
              disabled={!bulkForm.topics.split('\n').some((t) => t.trim())}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <ListPlus className="w-4 h-4" />
              Add {bulkForm.topics.split('\n').filter((t) => t.trim()).length} Videos
            </button>
          </div>
        </div>
      </Modal>

      {/* Settings Modal */}
      <Modal open={showSettings} onClose={() => setShowSettings(false)} title="Batch Settings">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">
              Default Duration (seconds)
            </label>
            <input
              type="number"
              min={5}
              max={180}
              value={config.defaultDuration}
              onChange={(e) => updateConfig({ defaultDuration: Number(e.target.value) })}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">
              Default Script Style
            </label>
            <div className="relative">
              <select
                value={config.defaultScriptStyle}
                onChange={(e) => updateConfig({ defaultScriptStyle: e.target.value as ScriptStyle })}
                className="input pr-8 appearance-none"
              >
                {SCRIPT_STYLES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">
              Default Template
            </label>
            <div className="relative">
              <select
                value={config.defaultTemplateId}
                onChange={(e) => updateConfig({ defaultTemplateId: e.target.value })}
                className="input pr-8 appearance-none"
              >
                {VIRAL_TEMPLATES.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowSettings(false)} className="btn-primary flex-1">
              Save
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
