'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BatchJob, BatchConfig, ScriptStyle, VideoProject, BatchJobType, AdFormat } from '@/types';
import { autoBuildVideo, autoBuildStaticAd } from '@/lib/ai-service';
import { VIRAL_TEMPLATES } from '@/lib/viral-templates';

interface BatchState {
  jobs: BatchJob[];
  config: BatchConfig;
  isProcessing: boolean;

  addVideoJob: (topic: string, scriptStyle: ScriptStyle, templateId: string, duration: number) => string;
  addAdJob: (topic: string, templateId: string, format: AdFormat) => string;
  addBulkVideoJobs: (topics: string[], scriptStyle: ScriptStyle, templateId: string, duration: number) => string[];
  addBulkAdJobs: (topics: string[], templateId: string, format: AdFormat) => string[];
  removeJob: (id: string) => void;
  clearCompleted: () => void;
  clearAll: () => void;
  updateConfig: (updates: Partial<BatchConfig>) => void;
  processQueue: () => Promise<void>;
  getStats: () => { total: number; queued: number; processing: number; complete: number; error: number; videos: number; ads: number };
}

export const useBatchStore = create<BatchState>()(
  persist(
    (set, get) => ({
      jobs: [],
      config: {
        maxConcurrent: 1,
        autoApplyTemplate: true,
        defaultDuration: 30,
        defaultScriptStyle: 'viral' as ScriptStyle,
        defaultTemplateId: 'tiktok-storytelling',
        defaultAdTemplateId: 'product-showcase',
        defaultAdFormat: 'instagram-post' as AdFormat,
        defaultFontPreset: 'nano-banana-pro',
      },
      isProcessing: false,

      addVideoJob: (topic, scriptStyle, templateId, duration) => {
        const id = crypto.randomUUID();
        const job: BatchJob = {
          id, jobType: 'video', topic, scriptStyle, templateId, duration,
          adTemplateId: null, adFormat: null, adCopy: null,
          status: 'queued', progress: 0, generatedScript: null, generatedAdCopy: null,
          videoProject: null, adProject: null, error: null,
          createdAt: Date.now(), completedAt: null,
        };
        set({ jobs: [...get().jobs, job] });
        return id;
      },

      addAdJob: (topic, templateId, format) => {
        const id = crypto.randomUUID();
        const job: BatchJob = {
          id, jobType: 'static-ad', topic, scriptStyle: 'viral', templateId: '', duration: 0,
          adTemplateId: templateId, adFormat: format, adCopy: null,
          status: 'queued', progress: 0, generatedScript: null, generatedAdCopy: null,
          videoProject: null, adProject: null, error: null,
          createdAt: Date.now(), completedAt: null,
        };
        set({ jobs: [...get().jobs, job] });
        return id;
      },

      addBulkVideoJobs: (topics, scriptStyle, templateId, duration) => {
        const ids: string[] = [];
        const newJobs: BatchJob[] = topics.map((topic) => {
          const id = crypto.randomUUID();
          ids.push(id);
          return {
            id, jobType: 'video' as const, topic: topic.trim(), scriptStyle, templateId, duration,
            adTemplateId: null, adFormat: null, adCopy: null,
            status: 'queued' as const, progress: 0, generatedScript: null, generatedAdCopy: null,
            videoProject: null, adProject: null, error: null,
            createdAt: Date.now(), completedAt: null,
          };
        });
        set({ jobs: [...get().jobs, ...newJobs] });
        return ids;
      },

      addBulkAdJobs: (topics, templateId, format) => {
        const ids: string[] = [];
        const newJobs: BatchJob[] = topics.map((topic) => {
          const id = crypto.randomUUID();
          ids.push(id);
          return {
            id, jobType: 'static-ad' as const, topic: topic.trim(), scriptStyle: 'viral' as const,
            templateId: '', duration: 0,
            adTemplateId: templateId, adFormat: format, adCopy: null,
            status: 'queued' as const, progress: 0, generatedScript: null, generatedAdCopy: null,
            videoProject: null, adProject: null, error: null,
            createdAt: Date.now(), completedAt: null,
          };
        });
        set({ jobs: [...get().jobs, ...newJobs] });
        return ids;
      },

      removeJob: (id) => set({ jobs: get().jobs.filter((j) => j.id !== id) }),
      clearCompleted: () => set({ jobs: get().jobs.filter((j) => j.status !== 'complete') }),
      clearAll: () => set({ jobs: [], isProcessing: false }),
      updateConfig: (updates) => set({ config: { ...get().config, ...updates } }),

      processQueue: async () => {
        const { jobs, isProcessing } = get();
        if (isProcessing) return;

        const queued = jobs.filter((j) => j.status === 'queued');
        if (queued.length === 0) return;

        set({ isProcessing: true });

        for (const job of queued) {
          try {
            if (job.jobType === 'video') {
              await processVideoJob(job, get, set);
            } else {
              await processAdJob(job, get, set);
            }
          } catch (err) {
            set({
              jobs: get().jobs.map((j) =>
                j.id === job.id ? { ...j, status: 'error' as const, error: err instanceof Error ? err.message : 'Unknown error' } : j
              ),
            });
          }
        }

        set({ isProcessing: false });
      },

      getStats: () => {
        const { jobs } = get();
        const active = ['generating-script', 'generating-copy', 'generating-captions', 'generating-effects', 'generating-graphics', 'composing-ad'];
        return {
          total: jobs.length,
          queued: jobs.filter((j) => j.status === 'queued').length,
          processing: jobs.filter((j) => active.includes(j.status)).length,
          complete: jobs.filter((j) => j.status === 'complete').length,
          error: jobs.filter((j) => j.status === 'error').length,
          videos: jobs.filter((j) => j.jobType === 'video').length,
          ads: jobs.filter((j) => j.jobType === 'static-ad').length,
        };
      },
    }),
    { name: 'hpa-batch' }
  )
);

// ─── Processing helpers ───────────────────────────────────────────────

async function processVideoJob(job: BatchJob, get: () => any, set: (s: any) => void) {
  const template = VIRAL_TEMPLATES.find((t) => t.id === job.templateId) || VIRAL_TEMPLATES[0];

  updateJob(job.id, { status: 'generating-script', progress: 10 }, get, set);
  const result = await autoBuildVideo(job.topic, job.scriptStyle, template, job.duration);

  updateJob(job.id, { status: 'generating-captions', progress: 40, generatedScript: result.script }, get, set);
  await delay(300);

  updateJob(job.id, { status: 'generating-effects', progress: 65 }, get, set);
  await delay(300);

  updateJob(job.id, { status: 'generating-graphics', progress: 85 }, get, set);
  await delay(200);

  const videoProject: VideoProject = {
    id: crypto.randomUUID(), name: job.topic, type: 'video', status: 'draft', tags: [],
    aspectRatio: template.aspectRatio, duration: job.duration, videoSrc: null, audioSrc: null,
    captions: result.captions, effects: result.effects, motionGraphics: result.motionGraphics,
    scenes: [], voiceOver: null, createdAt: Date.now(), updatedAt: Date.now(),
  };

  updateJob(job.id, { status: 'complete', progress: 100, videoProject, completedAt: Date.now() }, get, set);
}

async function processAdJob(job: BatchJob, get: () => any, set: (s: any) => void) {
  updateJob(job.id, { status: 'generating-copy', progress: 20 }, get, set);

  const result = await autoBuildStaticAd(
    job.topic,
    'professional',
    job.adTemplateId || 'product-showcase',
  );

  updateJob(job.id, { status: 'composing-ad', progress: 70, generatedAdCopy: result.copy }, get, set);
  await delay(400);

  updateJob(job.id, { status: 'complete', progress: 100, adProject: result.adProject, completedAt: Date.now() }, get, set);
}

function updateJob(id: string, updates: Partial<BatchJob>, get: () => any, set: (s: any) => void) {
  set({ jobs: get().jobs.map((j: BatchJob) => j.id === id ? { ...j, ...updates } : j) });
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
