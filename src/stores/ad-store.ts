'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StaticAdProject, AdLayer, AdFormat, BrandKit, AdVariant, AD_FORMAT_SIZES } from '@/types';
import { DEFAULT_FONT_PRESET, FONT_PRESETS } from '@/lib/ad-templates';

interface AdState {
  project: StaticAdProject | null;
  projects: StaticAdProject[];
  selectedLayerId: string | null;

  createProject: (name: string, format: AdFormat) => void;
  loadProject: (project: StaticAdProject) => void;
  saveProject: () => void;
  setFormat: (format: AdFormat) => void;

  addLayer: (layer: AdLayer) => void;
  updateLayer: (id: string, updates: Partial<AdLayer>) => void;
  removeLayer: (id: string) => void;
  reorderLayer: (id: string, newOrder: number) => void;
  selectLayer: (id: string | null) => void;
  duplicateLayer: (id: string) => void;

  updateBrandKit: (updates: Partial<BrandKit>) => void;

  addVariant: (name: string) => void;
  removeVariant: (id: string) => void;

  clearProject: () => void;
  removeProject: (id: string) => void;
}

export const useAdStore = create<AdState>()(
  persist(
    (set, get) => ({
      project: null,
      projects: [],
      selectedLayerId: null,

      createProject: (name, format) => {
        const size = AD_FORMAT_SIZES[format];
        const fontPreset = FONT_PRESETS[DEFAULT_FONT_PRESET];
        const project: StaticAdProject = {
          id: crypto.randomUUID(),
          name,
          type: 'static-ad',
          status: 'draft',
          tags: [],
          format,
          width: size.width,
          height: size.height,
          layers: [
            {
              id: crypto.randomUUID(),
              type: 'background',
              order: 0,
              visible: true,
              locked: false,
              x: 0, y: 0, width: size.width, height: size.height, rotation: 0, opacity: 1,
              content: { type: 'background', fill: '#ffffff', gradient: null, imageSrc: null },
            },
          ],
          brandKit: {
            primaryColor: '#0f172a',
            secondaryColor: '#2563eb',
            accentColor: '#f59e0b',
            fontHeading: fontPreset.heading,
            fontBody: fontPreset.body,
            logoSrc: null,
          },
          variants: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set({ project, selectedLayerId: null });
      },

      loadProject: (project) => set({ project: { ...project }, selectedLayerId: null }),

      saveProject: () => {
        const { project, projects } = get();
        if (!project) return;
        const updated = { ...project, updatedAt: Date.now() };
        const exists = projects.findIndex((p) => p.id === project.id);
        if (exists >= 0) {
          const next = [...projects];
          next[exists] = updated;
          set({ project: updated, projects: next });
        } else {
          set({ project: updated, projects: [...projects, updated] });
        }
      },

      setFormat: (format) => {
        const p = get().project;
        if (!p) return;
        const size = AD_FORMAT_SIZES[format];
        set({ project: { ...p, format, width: size.width, height: size.height, updatedAt: Date.now() } });
      },

      addLayer: (layer) => {
        const p = get().project;
        if (!p) return;
        set({ project: { ...p, layers: [...p.layers, layer], updatedAt: Date.now() } });
      },

      updateLayer: (id, updates) => {
        const p = get().project;
        if (!p) return;
        set({
          project: {
            ...p,
            layers: p.layers.map((l) => (l.id === id ? { ...l, ...updates } : l)),
            updatedAt: Date.now(),
          },
        });
      },

      removeLayer: (id) => {
        const p = get().project;
        if (!p) return;
        set({
          project: { ...p, layers: p.layers.filter((l) => l.id !== id), updatedAt: Date.now() },
          selectedLayerId: get().selectedLayerId === id ? null : get().selectedLayerId,
        });
      },

      reorderLayer: (id, newOrder) => {
        const p = get().project;
        if (!p) return;
        const layers = p.layers.map((l) =>
          l.id === id ? { ...l, order: newOrder } : l
        ).sort((a, b) => a.order - b.order);
        set({ project: { ...p, layers, updatedAt: Date.now() } });
      },

      selectLayer: (id) => set({ selectedLayerId: id }),

      duplicateLayer: (id) => {
        const p = get().project;
        if (!p) return;
        const layer = p.layers.find((l) => l.id === id);
        if (!layer) return;
        const dup = {
          ...layer,
          id: crypto.randomUUID(),
          order: p.layers.length,
          x: layer.x + 20,
          y: layer.y + 20,
        };
        set({ project: { ...p, layers: [...p.layers, dup], updatedAt: Date.now() } });
      },

      updateBrandKit: (updates) => {
        const p = get().project;
        if (!p) return;
        set({ project: { ...p, brandKit: { ...p.brandKit, ...updates }, updatedAt: Date.now() } });
      },

      addVariant: (name) => {
        const p = get().project;
        if (!p) return;
        const variant: AdVariant = { id: crypto.randomUUID(), name, layerOverrides: {} };
        set({ project: { ...p, variants: [...p.variants, variant], updatedAt: Date.now() } });
      },

      removeVariant: (id) => {
        const p = get().project;
        if (!p) return;
        set({ project: { ...p, variants: p.variants.filter((v) => v.id !== id), updatedAt: Date.now() } });
      },

      clearProject: () => set({ project: null, selectedLayerId: null }),

      removeProject: (id) => {
        const { projects, project } = get();
        set({
          projects: projects.filter((p) => p.id !== id),
          project: project?.id === id ? null : project,
        });
      },
    }),
    { name: 'hpa-ads' }
  )
);
