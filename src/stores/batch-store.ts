'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BatchJob, BatchConfig, ScriptStyle, VideoProject } from '@/types';
import { autoBuildVideo } from '@/lib/ai-service';
import { VIRAL_TEMPLATES } from '@/lib/viral-templates';

interface BatchState {
  jobs: BatchJob[];
  config: BatchConfig;
  isProcessing: boolean;

  addJob: (topic: string, scriptStyle: ScriptStyle, templateId: string, duration: number) => string;
  addBulkJobs: (topics: string[], scriptStyle: ScriptStyle, templateId: string, duration: number) => string[];
  removeJob: (id: string) => void;
  clearCompleted: () => void;
  clearAll: () => void;
  updateConfig: (updates: Partial<BatchConfig>) => void;
  processQueue: () => Promise<void>;
  getStats: () => { total: number; queued: number; processing: number; complete: number; error: number };
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
      },
      isProcessing: false,

      addJob: (topic, scriptStyle, templateId, duration) => {
        const id = crypto.randomUUID();
        const job: BatchJob = {
          id,
          topic,
          scriptStyle,
          templateId,
          duration,
          status: 'queued',
          progress: 0,
          generatedScript: null,
          videoProject: null,
          error: null,
          createdAt: Date.now(),
          completedAt: null,
        };
        set({ jobs: [...get().jobs, job] });
        return id;
      },

      addBulkJobs: (topics, scriptStyle, templateId, duration) => {
        const ids: string[] = [];
        const newJobs: BatchJob[] = topics.map((topic) => {
          const id = crypto.randomUUID();
          ids.push(id);
          return {
            id,
            topic: topic.trim(),
            scriptStyle,
            templateId,
            duration,
            status: 'queued' as const,
            progress: 0,
            generatedScript: null,
            videoProject: null,
            error: null,
            createdAt: Date.now(),
            completedAt: null,
          };
        });
        set({ jobs: [...get().jobs, ...newJobs] });
        return ids;
      },

      removeJob: (id) => {
        set({ jobs: get().jobs.filter((j) => j.id !== id) });
      },

      clearCompleted: () => {
        set({ jobs: get().jobs.filter((j) => j.status !== 'complete') });
      },

      clearAll: () => {
        set({ jobs: [], isProcessing: false });
      },

      updateConfig: (updates) => {
        set({ config: { ...get().config, ...updates } });
      },

      processQueue: async () => {
        const { jobs, isProcessing } = get();
        if (isProcessing) return;

        const queued = jobs.filter((j) => j.status === 'queued');
        if (queued.length === 0) return;

        set({ isProcessing: true });

        for (const job of queued) {
          try {
            const template = VIRAL_TEMPLATES.find((t) => t.id === job.templateId) || VIRAL_TEMPLATES[0];

            // Step 1: Generating script
            set({
              jobs: get().jobs.map((j) =>
                j.id === job.id ? { ...j, status: 'generating-script' as const, progress: 10 } : j
              ),
            });

            const result = await autoBuildVideo(
              job.topic,
              job.scriptStyle,
              template,
              job.duration,
            );

            // Step 2: Captions
            set({
              jobs: get().jobs.map((j) =>
                j.id === job.id
                  ? { ...j, status: 'generating-captions' as const, progress: 40, generatedScript: result.script }
                  : j
              ),
            });

            // Small delay to show progress
            await new Promise((r) => setTimeout(r, 300));

            // Step 3: Effects
            set({
              jobs: get().jobs.map((j) =>
                j.id === job.id ? { ...j, status: 'generating-effects' as const, progress: 65 } : j
              ),
            });

            await new Promise((r) => setTimeout(r, 300));

            // Step 4: Graphics
            set({
              jobs: get().jobs.map((j) =>
                j.id === job.id ? { ...j, status: 'generating-graphics' as const, progress: 85 } : j
              ),
            });

            await new Promise((r) => setTimeout(r, 200));

            // Complete — assemble video project
            const videoProject: VideoProject = {
              id: crypto.randomUUID(),
              name: job.topic,
              aspectRatio: template.aspectRatio,
              duration: job.duration,
              videoSrc: null,
              captions: result.captions,
              effects: result.effects,
              motionGraphics: result.motionGraphics,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            };

            set({
              jobs: get().jobs.map((j) =>
                j.id === job.id
                  ? {
                      ...j,
                      status: 'complete' as const,
                      progress: 100,
                      videoProject,
                      completedAt: Date.now(),
                    }
                  : j
              ),
            });
          } catch (err) {
            set({
              jobs: get().jobs.map((j) =>
                j.id === job.id
                  ? {
                      ...j,
                      status: 'error' as const,
                      error: err instanceof Error ? err.message : 'Unknown error',
                    }
                  : j
              ),
            });
          }
        }

        set({ isProcessing: false });
      },

      getStats: () => {
        const { jobs } = get();
        return {
          total: jobs.length,
          queued: jobs.filter((j) => j.status === 'queued').length,
          processing: jobs.filter((j) =>
            ['generating-script', 'generating-captions', 'generating-effects', 'generating-graphics'].includes(j.status)
          ).length,
          complete: jobs.filter((j) => j.status === 'complete').length,
          error: jobs.filter((j) => j.status === 'error').length,
        };
      },
    }),
    { name: 'hpa-batch' }
  )
);
