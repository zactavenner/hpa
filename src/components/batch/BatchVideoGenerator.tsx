'use client';

import { useState, useCallback } from 'react';
import { useBatchStore } from '@/stores/batch-store';
import { VIRAL_TEMPLATES } from '@/lib/viral-templates';
import { AD_TEMPLATES } from '@/lib/ad-templates';
import { ScriptStyle, AdFormat, AD_FORMAT_SIZES, BatchJobType } from '@/types';
import Modal from '@/components/ui/Modal';
import BatchJobCard from './BatchJobCard';
import {
  Plus, Play, Trash2, Settings, Zap, Layers, FileText,
  ChevronDown, Sparkles, ListPlus, Film, PenTool,
} from 'lucide-react';

const SCRIPT_STYLES: { value: ScriptStyle; label: string }[] = [
  { value: 'viral', label: 'Viral' },
  { value: 'educational', label: 'Educational' },
  { value: 'storytelling', label: 'Storytelling' },
  { value: 'promotional', label: 'Promotional' },
  { value: 'direct-response', label: 'Direct Response' },
];

export default function BatchVideoGenerator() {
  const {
    jobs, config, isProcessing,
    addVideoJob, addAdJob, addBulkVideoJobs, addBulkAdJobs,
    removeJob, clearCompleted, clearAll, updateConfig, processQueue, getStats,
  } = useBatchStore();
  const stats = getStats();

  const [showAdd, setShowAdd] = useState(false);
  const [showBulk, setShowBulk] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [jobType, setJobType] = useState<BatchJobType>('video');

  const [videoForm, setVideoForm] = useState({ topic: '', scriptStyle: config.defaultScriptStyle, templateId: config.defaultTemplateId, duration: config.defaultDuration });
  const [adForm, setAdForm] = useState({ topic: '', templateId: config.defaultAdTemplateId, format: config.defaultAdFormat });
  const [bulkTopics, setBulkTopics] = useState('');

  const handleAddSingle = useCallback(() => {
    if (jobType === 'video') {
      if (!videoForm.topic.trim()) return;
      addVideoJob(videoForm.topic.trim(), videoForm.scriptStyle, videoForm.templateId, videoForm.duration);
      setVideoForm({ ...videoForm, topic: '' });
    } else {
      if (!adForm.topic.trim()) return;
      addAdJob(adForm.topic.trim(), adForm.templateId, adForm.format);
      setAdForm({ ...adForm, topic: '' });
    }
    setShowAdd(false);
  }, [jobType, videoForm, adForm, addVideoJob, addAdJob]);

  const handleAddBulk = useCallback(() => {
    const topics = bulkTopics.split('\n').map((t) => t.trim()).filter(Boolean);
    if (topics.length === 0) return;
    if (jobType === 'video') {
      addBulkVideoJobs(topics, videoForm.scriptStyle, videoForm.templateId, videoForm.duration);
    } else {
      addBulkAdJobs(topics, adForm.templateId, adForm.format);
    }
    setBulkTopics('');
    setShowBulk(false);
  }, [jobType, bulkTopics, videoForm, adForm, addBulkVideoJobs, addBulkAdJobs]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
          <Layers className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-surface-900">Batch Generation</h2>
          <p className="text-sm text-surface-500">Scale video and static ad production with AI</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Total', value: stats.total, color: 'text-surface-700 bg-surface-50' },
          { label: 'Videos', value: stats.videos, color: 'text-purple-700 bg-purple-50' },
          { label: 'Ads', value: stats.ads, color: 'text-emerald-700 bg-emerald-50' },
          { label: 'Complete', value: stats.complete, color: 'text-green-700 bg-green-50' },
          { label: 'Queued', value: stats.queued, color: 'text-yellow-700 bg-yellow-50' },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl px-4 py-3 ${s.color}`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs opacity-70">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="card">
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => { setJobType('video'); setShowAdd(true); }} className="btn-primary flex items-center gap-2">
            <Film className="w-4 h-4" /> Add Video
          </button>
          <button onClick={() => { setJobType('static-ad'); setShowAdd(true); }} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-sm transition-all">
            <PenTool className="w-4 h-4" /> Add Static Ad
          </button>
          <button onClick={() => setShowBulk(true)} className="btn-secondary flex items-center gap-2">
            <ListPlus className="w-4 h-4" /> Bulk Add
          </button>

          <div className="w-px h-6 bg-surface-200" />

          <button onClick={processQueue} disabled={isProcessing || stats.queued === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            {isProcessing ? <><Sparkles className="w-4 h-4 animate-spin" /> Processing...</> : <><Play className="w-4 h-4" /> Start ({stats.queued})</>}
          </button>

          <div className="flex-1" />

          <button onClick={() => setShowSettings(true)} className="btn-secondary text-sm"><Settings className="w-4 h-4" /></button>
          {stats.complete > 0 && <button onClick={clearCompleted} className="btn-secondary text-sm">Clear Done</button>}
          {stats.total > 0 && <button onClick={clearAll} className="btn-secondary text-sm text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>}
        </div>
      </div>

      {/* Pipeline Visual */}
      {isProcessing && (
        <div className="card bg-gradient-to-r from-brand-50 to-purple-50 border-brand-200">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-brand-600" />
            <span className="font-medium text-brand-900 text-sm">Pipeline Active</span>
          </div>
          <div className="flex items-center gap-2">
            {['Input', 'Script/Copy', 'Assets', 'Compose', 'Done'].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div className={`px-3 py-1.5 rounded-lg text-xs font-medium ${i < 4 ? 'bg-brand-600 text-white' : 'bg-white text-surface-600 border'}`}>
                  {step}
                </div>
                {i < 4 && <div className="w-6 h-0.5 bg-brand-300" />}
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
              Add topics to auto-generate videos with viral templates or static ads with Nano Banana Pro.
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => { setJobType('video'); setShowAdd(true); }} className="btn-primary flex items-center gap-2"><Film className="w-4 h-4" /> Add Video</button>
              <button onClick={() => { setJobType('static-ad'); setShowAdd(true); }} className="btn-secondary flex items-center gap-2"><PenTool className="w-4 h-4" /> Add Static Ad</button>
            </div>
          </div>
        ) : (
          jobs.map((job) => <BatchJobCard key={job.id} job={job} onRemove={removeJob} />)
        )}
      </div>

      {/* Add Single Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title={jobType === 'video' ? 'Add Video' : 'Add Static Ad'}>
        <div className="space-y-4">
          {/* Type Toggle */}
          <div className="flex gap-2 p-1 bg-surface-100 rounded-xl">
            <button onClick={() => setJobType('video')} className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${jobType === 'video' ? 'bg-white shadow-sm text-brand-700' : 'text-surface-500'}`}>
              <Film className="w-4 h-4" /> Video
            </button>
            <button onClick={() => setJobType('static-ad')} className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${jobType === 'static-ad' ? 'bg-white shadow-sm text-emerald-700' : 'text-surface-500'}`}>
              <PenTool className="w-4 h-4" /> Static Ad
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Topic / Product</label>
            <input
              value={jobType === 'video' ? videoForm.topic : adForm.topic}
              onChange={(e) => jobType === 'video' ? setVideoForm({ ...videoForm, topic: e.target.value }) : setAdForm({ ...adForm, topic: e.target.value })}
              className="input" placeholder={jobType === 'video' ? 'e.g., 5 productivity hacks' : 'e.g., AI Video Editor Pro'}
            />
          </div>

          {jobType === 'video' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Script Style</label>
                <div className="flex gap-2">
                  {SCRIPT_STYLES.map((s) => (
                    <button key={s.value} onClick={() => setVideoForm({ ...videoForm, scriptStyle: s.value })}
                      className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${videoForm.scriptStyle === s.value ? 'bg-brand-600 text-white' : 'bg-surface-100 text-surface-600'}`}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1.5">Template</label>
                  <div className="relative">
                    <select value={videoForm.templateId} onChange={(e) => setVideoForm({ ...videoForm, templateId: e.target.value })} className="input pr-8 appearance-none text-sm">
                      {VIRAL_TEMPLATES.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1.5">Duration (s)</label>
                  <input type="number" min={5} max={180} value={videoForm.duration} onChange={(e) => setVideoForm({ ...videoForm, duration: Number(e.target.value) })} className="input text-sm" />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Ad Template</label>
                <div className="relative">
                  <select value={adForm.templateId} onChange={(e) => setAdForm({ ...adForm, templateId: e.target.value })} className="input pr-8 appearance-none text-sm">
                    {AD_TEMPLATES.map((t) => <option key={t.id} value={t.id}>{t.name} (Nano Banana Pro)</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Format</label>
                <div className="relative">
                  <select value={adForm.format} onChange={(e) => setAdForm({ ...adForm, format: e.target.value as AdFormat })} className="input pr-8 appearance-none text-sm">
                    {Object.entries(AD_FORMAT_SIZES).map(([k, v]) => <option key={k} value={k}>{v.label} ({v.width}x{v.height})</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
                </div>
              </div>
            </>
          )}

          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowAdd(false)} className="btn-secondary flex-1">Cancel</button>
            <button onClick={handleAddSingle} disabled={!(jobType === 'video' ? videoForm.topic : adForm.topic).trim()} className="btn-primary flex-1 flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add to Queue
            </button>
          </div>
        </div>
      </Modal>

      {/* Bulk Add Modal */}
      <Modal open={showBulk} onClose={() => setShowBulk(false)} title="Bulk Add" size="lg">
        <div className="space-y-4">
          <div className="flex gap-2 p-1 bg-surface-100 rounded-xl">
            <button onClick={() => setJobType('video')} className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 ${jobType === 'video' ? 'bg-white shadow-sm text-brand-700' : 'text-surface-500'}`}>
              <Film className="w-4 h-4" /> Videos
            </button>
            <button onClick={() => setJobType('static-ad')} className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 ${jobType === 'static-ad' ? 'bg-white shadow-sm text-emerald-700' : 'text-surface-500'}`}>
              <PenTool className="w-4 h-4" /> Static Ads
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Topics (one per line)</label>
            <textarea value={bulkTopics} onChange={(e) => setBulkTopics(e.target.value)} className="input min-h-[160px] resize-y font-mono text-sm"
              placeholder={jobType === 'video' ? '5 morning routines\nHow to learn fast\nTruth about passive income' : 'AI Video Editor Pro\nSocial Media Scheduler\nEmail Marketing Platform'} />
            <p className="text-xs text-surface-400 mt-1">{bulkTopics.split('\n').filter((t) => t.trim()).length} items</p>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowBulk(false)} className="btn-secondary flex-1">Cancel</button>
            <button onClick={handleAddBulk} disabled={!bulkTopics.split('\n').some((t) => t.trim())} className="btn-primary flex-1 flex items-center justify-center gap-2">
              <ListPlus className="w-4 h-4" /> Add {bulkTopics.split('\n').filter((t) => t.trim()).length} Items
            </button>
          </div>
        </div>
      </Modal>

      {/* Settings Modal */}
      <Modal open={showSettings} onClose={() => setShowSettings(false)} title="Batch Settings">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Default Video Duration</label>
            <input type="number" value={config.defaultDuration} onChange={(e) => updateConfig({ defaultDuration: Number(e.target.value) })} className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Default Script Style</label>
            <div className="relative">
              <select value={config.defaultScriptStyle} onChange={(e) => updateConfig({ defaultScriptStyle: e.target.value as ScriptStyle })} className="input pr-8 appearance-none">
                {SCRIPT_STYLES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Default Ad Font</label>
            <div className="px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium">
              Nano Banana Pro (Default for all static ads)
            </div>
          </div>
          <button onClick={() => setShowSettings(false)} className="btn-primary w-full">Save</button>
        </div>
      </Modal>
    </div>
  );
}
