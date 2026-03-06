export interface ApiKey {
  id: string;
  name: string;
  key: string;
  provider: 'openai' | 'anthropic' | 'google' | 'custom';
  isActive: boolean;
  usageCount: number;
  lastUsed: number | null;
  rateLimit: number;
  rateLimitRemaining: number;
  rateLimitReset: number | null;
  createdAt: number;
}

export interface ApiKeyRotationConfig {
  strategy: 'round-robin' | 'least-used' | 'random';
  maxKeys: 5;
  cooldownMs: number;
  retryOnRateLimit: boolean;
}

export interface VideoProject {
  id: string;
  name: string;
  aspectRatio: '9:16' | '16:9' | '1:1';
  duration: number;
  videoSrc: string | null;
  captions: Caption[];
  effects: VideoEffect[];
  motionGraphics: MotionGraphic[];
  createdAt: number;
  updatedAt: number;
}

export interface Caption {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  style: CaptionStyle;
  position: { x: number; y: number };
  animation: 'none' | 'fade' | 'typewriter' | 'bounce' | 'slide-up' | 'pop';
}

export type CaptionStyle = 'default' | 'viral' | 'minimal' | 'bold';

export interface VideoEffect {
  id: string;
  type: 'zoom' | 'shake' | 'glitch' | 'flash' | 'speed-ramp' | 'beat-sync';
  startTime: number;
  endTime: number;
  intensity: number;
  params: Record<string, number | string>;
}

export interface MotionGraphic {
  id: string;
  type: 'lower-third' | 'title-card' | 'emoji-burst' | 'particle' | 'progress-bar' | 'subscribe-cta';
  startTime: number;
  endTime: number;
  content: string;
  style: Record<string, string | number>;
  animation: 'slide-in' | 'pop' | 'fade' | 'bounce';
}

export interface ViralTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  aspectRatio: '9:16' | '16:9' | '1:1';
  captionStyle: CaptionStyle;
  effects: Omit<VideoEffect, 'id'>[];
  motionGraphics: Omit<MotionGraphic, 'id'>[];
}

export interface ReviewItem {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee: string | null;
  tags: string[];
  aiSummary: string | null;
  videoProjectId: string | null;
  createdAt: number;
  updatedAt: number;
}

export type ScriptStyle = 'viral' | 'educational' | 'storytelling' | 'promotional';

export interface BatchJob {
  id: string;
  topic: string;
  scriptStyle: ScriptStyle;
  templateId: string;
  duration: number;
  status: 'queued' | 'generating-script' | 'generating-captions' | 'generating-effects' | 'generating-graphics' | 'complete' | 'error';
  progress: number;
  generatedScript: string | null;
  videoProject: VideoProject | null;
  error: string | null;
  createdAt: number;
  completedAt: number | null;
}

export interface BatchConfig {
  maxConcurrent: number;
  autoApplyTemplate: boolean;
  defaultDuration: number;
  defaultScriptStyle: ScriptStyle;
  defaultTemplateId: string;
}
