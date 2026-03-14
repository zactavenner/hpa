'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { VideoProject, Caption, VideoEffect, MotionGraphic } from '@/types';

const MAX_HISTORY = 30;

interface VideoState {
  project: VideoProject | null;
  currentTime: number;
  isPlaying: boolean;
  selectedCaptionId: string | null;
  selectedEffectId: string | null;
  selectedGraphicId: string | null;
  history: VideoProject[];
  historyIndex: number;

  createProject: (name: string, aspectRatio: VideoProject['aspectRatio']) => void;
  setVideoSrc: (src: string) => void;
  setDuration: (d: number) => void;
  setCurrentTime: (t: number) => void;
  setPlaying: (p: boolean) => void;

  addCaption: (caption: Caption) => void;
  updateCaption: (id: string, updates: Partial<Caption>) => void;
  removeCaption: (id: string) => void;
  setCaptions: (captions: Caption[]) => void;
  selectCaption: (id: string | null) => void;

  addEffect: (effect: VideoEffect) => void;
  updateEffect: (id: string, updates: Partial<VideoEffect>) => void;
  removeEffect: (id: string) => void;
  setEffects: (effects: VideoEffect[]) => void;
  selectEffect: (id: string | null) => void;

  addMotionGraphic: (mg: MotionGraphic) => void;
  removeMotionGraphic: (id: string) => void;
  setMotionGraphics: (mgs: MotionGraphic[]) => void;
  selectGraphic: (id: string | null) => void;

  setAspectRatio: (ratio: VideoProject['aspectRatio']) => void;
  clearProject: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

// Helper to push current project to history before mutations
function pushHistory(get: () => VideoState): { history: VideoProject[]; historyIndex: number } {
  const { project, history, historyIndex } = get();
  if (!project) return { history, historyIndex };
  // Trim any redo states after current index
  const trimmed = history.slice(0, historyIndex + 1);
  const next = [...trimmed, JSON.parse(JSON.stringify(project)) as VideoProject];
  // Cap at MAX_HISTORY
  if (next.length > MAX_HISTORY) next.shift();
  return { history: next, historyIndex: next.length - 1 };
}

export const useVideoStore = create<VideoState>()(persist((set, get) => ({
  project: null,
  currentTime: 0,
  isPlaying: false,
  selectedCaptionId: null,
  selectedEffectId: null,
  selectedGraphicId: null,
  history: [],
  historyIndex: -1,

  createProject: (name, aspectRatio) => {
    const newProject: VideoProject = {
      id: crypto.randomUUID(),
      name,
      type: 'video',
      status: 'draft',
      tags: [],
      aspectRatio,
      duration: 0,
      videoSrc: null,
      audioSrc: null,
      captions: [],
      effects: [],
      motionGraphics: [],
      scenes: [],
      voiceOver: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    set({ project: newProject, history: [], historyIndex: -1 });
  },

  setVideoSrc: (src) => {
    const p = get().project;
    if (p) set({ project: { ...p, videoSrc: src, updatedAt: Date.now() } });
  },

  setDuration: (d) => {
    const p = get().project;
    if (p) set({ project: { ...p, duration: d, updatedAt: Date.now() } });
  },

  setCurrentTime: (t) => set({ currentTime: t }),
  setPlaying: (p) => set({ isPlaying: p }),

  addCaption: (caption) => {
    const p = get().project;
    if (p) set({ ...pushHistory(get), project: { ...p, captions: [...p.captions, caption], updatedAt: Date.now() } });
  },

  updateCaption: (id, updates) => {
    const p = get().project;
    if (p) set({ ...pushHistory(get), project: { ...p, captions: p.captions.map((c) => (c.id === id ? { ...c, ...updates } : c)), updatedAt: Date.now() } });
  },

  removeCaption: (id) => {
    const p = get().project;
    if (p) set({ ...pushHistory(get), project: { ...p, captions: p.captions.filter((c) => c.id !== id), updatedAt: Date.now() } });
  },

  setCaptions: (captions) => {
    const p = get().project;
    if (p) set({ ...pushHistory(get), project: { ...p, captions, updatedAt: Date.now() } });
  },

  selectCaption: (id) => set({ selectedCaptionId: id }),

  addEffect: (effect) => {
    const p = get().project;
    if (p) set({ ...pushHistory(get), project: { ...p, effects: [...p.effects, effect], updatedAt: Date.now() } });
  },

  updateEffect: (id, updates) => {
    const p = get().project;
    if (p) set({ ...pushHistory(get), project: { ...p, effects: p.effects.map((e) => (e.id === id ? { ...e, ...updates } : e)), updatedAt: Date.now() } });
  },

  removeEffect: (id) => {
    const p = get().project;
    if (p) set({ ...pushHistory(get), project: { ...p, effects: p.effects.filter((e) => e.id !== id), updatedAt: Date.now() } });
  },

  setEffects: (effects) => {
    const p = get().project;
    if (p) set({ ...pushHistory(get), project: { ...p, effects, updatedAt: Date.now() } });
  },

  selectEffect: (id) => set({ selectedEffectId: id }),

  addMotionGraphic: (mg) => {
    const p = get().project;
    if (p) set({ ...pushHistory(get), project: { ...p, motionGraphics: [...p.motionGraphics, mg], updatedAt: Date.now() } });
  },

  removeMotionGraphic: (id) => {
    const p = get().project;
    if (p) set({ ...pushHistory(get), project: { ...p, motionGraphics: p.motionGraphics.filter((m) => m.id !== id), updatedAt: Date.now() } });
  },

  setMotionGraphics: (mgs) => {
    const p = get().project;
    if (p) set({ ...pushHistory(get), project: { ...p, motionGraphics: mgs, updatedAt: Date.now() } });
  },

  selectGraphic: (id) => set({ selectedGraphicId: id }),

  setAspectRatio: (ratio) => {
    const p = get().project;
    if (p) set({ ...pushHistory(get), project: { ...p, aspectRatio: ratio, updatedAt: Date.now() } });
  },

  clearProject: () => set({ project: null, currentTime: 0, isPlaying: false, selectedCaptionId: null, selectedEffectId: null, selectedGraphicId: null, history: [], historyIndex: -1 }),

  undo: () => {
    const { history, historyIndex, project } = get();
    if (historyIndex < 0 || !project) return;
    // Save current state for redo
    const currentCopy = JSON.parse(JSON.stringify(project)) as VideoProject;
    const newHistory = [...history];
    // If we're at the end, append current for redo
    if (historyIndex === history.length - 1) {
      newHistory.push(currentCopy);
    } else {
      newHistory[historyIndex + 1] = currentCopy;
    }
    set({
      project: JSON.parse(JSON.stringify(history[historyIndex])) as VideoProject,
      history: newHistory,
      historyIndex: historyIndex - 1,
    });
  },

  redo: () => {
    const { history, historyIndex } = get();
    const nextIndex = historyIndex + 2; // +1 for current, +1 for next
    if (nextIndex >= history.length) return;
    set({
      project: JSON.parse(JSON.stringify(history[nextIndex])) as VideoProject,
      historyIndex: historyIndex + 1,
    });
  },

  canUndo: () => get().historyIndex >= 0,
  canRedo: () => {
    const { history, historyIndex } = get();
    return historyIndex + 2 < history.length;
  },
}), {
  name: 'hpa-video',
  partialize: (state) => ({ project: state.project }),
}));
