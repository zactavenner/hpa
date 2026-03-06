'use client';

import { create } from 'zustand';
import { VideoProject, Caption, VideoEffect, MotionGraphic, CaptionStyle } from '@/types';

interface VideoState {
  project: VideoProject | null;
  currentTime: number;
  isPlaying: boolean;
  selectedCaptionId: string | null;
  selectedEffectId: string | null;

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

  setAspectRatio: (ratio: VideoProject['aspectRatio']) => void;
  clearProject: () => void;
}

export const useVideoStore = create<VideoState>()((set, get) => ({
  project: null,
  currentTime: 0,
  isPlaying: false,
  selectedCaptionId: null,
  selectedEffectId: null,

  createProject: (name, aspectRatio) => {
    set({
      project: {
        id: crypto.randomUUID(),
        name,
        aspectRatio,
        duration: 0,
        videoSrc: null,
        captions: [],
        effects: [],
        motionGraphics: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    });
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
    if (p) set({ project: { ...p, captions: [...p.captions, caption], updatedAt: Date.now() } });
  },

  updateCaption: (id, updates) => {
    const p = get().project;
    if (p) {
      set({
        project: {
          ...p,
          captions: p.captions.map((c) => (c.id === id ? { ...c, ...updates } : c)),
          updatedAt: Date.now(),
        },
      });
    }
  },

  removeCaption: (id) => {
    const p = get().project;
    if (p) set({ project: { ...p, captions: p.captions.filter((c) => c.id !== id), updatedAt: Date.now() } });
  },

  setCaptions: (captions) => {
    const p = get().project;
    if (p) set({ project: { ...p, captions, updatedAt: Date.now() } });
  },

  selectCaption: (id) => set({ selectedCaptionId: id }),

  addEffect: (effect) => {
    const p = get().project;
    if (p) set({ project: { ...p, effects: [...p.effects, effect], updatedAt: Date.now() } });
  },

  updateEffect: (id, updates) => {
    const p = get().project;
    if (p) {
      set({
        project: {
          ...p,
          effects: p.effects.map((e) => (e.id === id ? { ...e, ...updates } : e)),
          updatedAt: Date.now(),
        },
      });
    }
  },

  removeEffect: (id) => {
    const p = get().project;
    if (p) set({ project: { ...p, effects: p.effects.filter((e) => e.id !== id), updatedAt: Date.now() } });
  },

  setEffects: (effects) => {
    const p = get().project;
    if (p) set({ project: { ...p, effects, updatedAt: Date.now() } });
  },

  selectEffect: (id) => set({ selectedEffectId: id }),

  addMotionGraphic: (mg) => {
    const p = get().project;
    if (p) set({ project: { ...p, motionGraphics: [...p.motionGraphics, mg], updatedAt: Date.now() } });
  },

  removeMotionGraphic: (id) => {
    const p = get().project;
    if (p) set({ project: { ...p, motionGraphics: p.motionGraphics.filter((m) => m.id !== id), updatedAt: Date.now() } });
  },

  setMotionGraphics: (mgs) => {
    const p = get().project;
    if (p) set({ project: { ...p, motionGraphics: mgs, updatedAt: Date.now() } });
  },

  setAspectRatio: (ratio) => {
    const p = get().project;
    if (p) set({ project: { ...p, aspectRatio: ratio, updatedAt: Date.now() } });
  },

  clearProject: () => set({ project: null, currentTime: 0, isPlaying: false, selectedCaptionId: null, selectedEffectId: null }),
}));
