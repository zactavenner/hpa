// ─── API Key Management ───────────────────────────────────────────────

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

// ─── Project System ───────────────────────────────────────────────────

export type ProjectType = 'video' | 'static-ad';

export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  status: 'draft' | 'in-progress' | 'review' | 'approved' | 'exported';
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

// ─── Video Projects ───────────────────────────────────────────────────

export interface VideoProject extends Project {
  type: 'video';
  aspectRatio: '9:16' | '16:9' | '1:1' | '4:5';
  duration: number;
  videoSrc: string | null;
  audioSrc: string | null;
  captions: Caption[];
  effects: VideoEffect[];
  motionGraphics: MotionGraphic[];
  scenes: Scene[];
  voiceOver: VoiceOverConfig | null;
}

export interface Scene {
  id: string;
  order: number;
  duration: number;
  mediaSrc: string | null;
  mediaType: 'video' | 'image' | 'color';
  backgroundColor: string;
  transition: TransitionType;
  captions: string[];
}

export type TransitionType = 'cut' | 'fade' | 'slide' | 'zoom' | 'dissolve' | 'wipe';

export interface VoiceOverConfig {
  text: string;
  voice: string;
  speed: number;
  pitch: number;
}

export interface Caption {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  style: CaptionStyle;
  position: { x: number; y: number };
  animation: CaptionAnimation;
  fontSize: number;
  fontFamily: string;
}

export type CaptionStyle = 'default' | 'viral' | 'minimal' | 'bold' | 'neon' | 'outline';
export type CaptionAnimation = 'none' | 'fade' | 'typewriter' | 'bounce' | 'slide-up' | 'pop' | 'karaoke' | 'word-by-word';

export interface VideoEffect {
  id: string;
  type: 'zoom' | 'shake' | 'glitch' | 'flash' | 'speed-ramp' | 'beat-sync' | 'blur' | 'color-shift' | 'film-grain';
  startTime: number;
  endTime: number;
  intensity: number;
  params: Record<string, number | string>;
}

export interface MotionGraphic {
  id: string;
  type: 'lower-third' | 'title-card' | 'emoji-burst' | 'particle' | 'progress-bar' | 'subscribe-cta' | 'sticker' | 'countdown' | 'price-callout' | 'urgency-timer' | 'offer-badge' | 'testimonial-quote';
  startTime: number;
  endTime: number;
  content: string;
  style: Record<string, string | number>;
  animation: 'slide-in' | 'pop' | 'fade' | 'bounce' | 'spin';
}

// ─── Static Ad Projects ───────────────────────────────────────────────

export interface StaticAdProject extends Project {
  type: 'static-ad';
  format: AdFormat;
  width: number;
  height: number;
  layers: AdLayer[];
  brandKit: BrandKit;
  variants: AdVariant[];
}

export type AdFormat =
  | 'instagram-post'     // 1080x1080
  | 'instagram-story'    // 1080x1920
  | 'facebook-post'      // 1200x630
  | 'facebook-ad'        // 1080x1080
  | 'twitter-post'       // 1600x900
  | 'linkedin-post'      // 1200x627
  | 'youtube-thumbnail'  // 1280x720
  | 'pinterest-pin'      // 1000x1500
  | 'tiktok-cover'       // 1080x1920
  | 'google-display'     // 300x250
  | 'custom';

export const AD_FORMAT_SIZES: Record<AdFormat, { width: number; height: number; label: string }> = {
  'instagram-post':    { width: 1080, height: 1080, label: 'Instagram Post' },
  'instagram-story':   { width: 1080, height: 1920, label: 'Instagram Story' },
  'facebook-post':     { width: 1200, height: 630,  label: 'Facebook Post' },
  'facebook-ad':       { width: 1080, height: 1080, label: 'Facebook Ad' },
  'twitter-post':      { width: 1600, height: 900,  label: 'Twitter Post' },
  'linkedin-post':     { width: 1200, height: 627,  label: 'LinkedIn Post' },
  'youtube-thumbnail': { width: 1280, height: 720,  label: 'YouTube Thumbnail' },
  'pinterest-pin':     { width: 1000, height: 1500, label: 'Pinterest Pin' },
  'tiktok-cover':      { width: 1080, height: 1920, label: 'TikTok Cover' },
  'google-display':    { width: 300,  height: 250,  label: 'Google Display' },
  'custom':            { width: 1080, height: 1080, label: 'Custom' },
};

export interface AdLayer {
  id: string;
  type: 'text' | 'image' | 'shape' | 'logo' | 'background' | 'cta-button';
  order: number;
  visible: boolean;
  locked: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  content: AdLayerContent;
}

export type AdLayerContent =
  | { type: 'text'; text: string; fontFamily: string; fontSize: number; fontWeight: number; color: string; align: 'left' | 'center' | 'right'; lineHeight: number; letterSpacing: number; textTransform: 'none' | 'uppercase' | 'lowercase'; shadow: string | null; stroke: string | null; strokeWidth: number }
  | { type: 'image'; src: string; fit: 'cover' | 'contain' | 'fill'; borderRadius: number; filter: string | null }
  | { type: 'shape'; shape: 'rect' | 'circle' | 'rounded-rect'; fill: string; stroke: string | null; strokeWidth: number; borderRadius: number }
  | { type: 'logo'; src: string; fit: 'contain' }
  | { type: 'background'; fill: string; gradient: string | null; imageSrc: string | null }
  | { type: 'cta-button'; text: string; fontFamily: string; fontSize: number; fontWeight: number; color: string; bgColor: string; borderRadius: number; paddingX: number; paddingY: number };

export interface BrandKit {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontHeading: string;
  fontBody: string;
  logoSrc: string | null;
}

export interface AdVariant {
  id: string;
  name: string;
  layerOverrides: Record<string, Partial<AdLayer>>;
}

// ─── Ad Templates ─────────────────────────────────────────────────────

export interface AdTemplate {
  id: string;
  name: string;
  category: 'product' | 'promo' | 'testimonial' | 'announcement' | 'social-proof' | 'minimal';
  description: string;
  format: AdFormat;
  fontPreset: string; // e.g., 'nano-banana-pro'
  layers: Omit<AdLayer, 'id'>[];
  brandKit: BrandKit;
  thumbnail: string;
}

// ─── Asset Library ────────────────────────────────────────────────────

export interface Asset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'font' | 'logo' | 'template';
  src: string;
  thumbnail: string;
  width?: number;
  height?: number;
  duration?: number;
  fileSize: number;
  tags: string[];
  createdAt: number;
}

// ─── Viral Templates ──────────────────────────────────────────────────

export interface ViralTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  aspectRatio: '9:16' | '16:9' | '1:1' | '4:5';
  captionStyle: CaptionStyle;
  effects: Omit<VideoEffect, 'id'>[];
  motionGraphics: Omit<MotionGraphic, 'id'>[];
}

// ─── Batch System ─────────────────────────────────────────────────────

export type ScriptStyle = 'viral' | 'educational' | 'storytelling' | 'promotional' | 'direct-response';

export type BatchJobType = 'video' | 'static-ad';

export interface BatchJob {
  id: string;
  jobType: BatchJobType;
  topic: string;
  // Video-specific
  scriptStyle: ScriptStyle;
  templateId: string;
  duration: number;
  // Ad-specific
  adTemplateId: string | null;
  adFormat: AdFormat | null;
  adCopy: { headline: string; body: string; cta: string } | null;
  // State
  status: 'queued' | 'generating-script' | 'generating-copy' | 'generating-captions' | 'generating-effects' | 'generating-graphics' | 'composing-ad' | 'complete' | 'error';
  progress: number;
  generatedScript: string | null;
  generatedAdCopy: { headline: string; body: string; cta: string } | null;
  videoProject: VideoProject | null;
  adProject: StaticAdProject | null;
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
  defaultAdTemplateId: string;
  defaultAdFormat: AdFormat;
  defaultFontPreset: string; // 'nano-banana-pro'
}

// ─── Export ───────────────────────────────────────────────────────────

export interface ExportConfig {
  format: 'mp4' | 'mov' | 'webm' | 'gif' | 'png' | 'jpg' | 'pdf';
  quality: 'draft' | 'standard' | 'high' | 'max';
  resolution: '720p' | '1080p' | '4k' | 'original';
  fps: 24 | 30 | 60;
  watermark: boolean;
  platform: 'tiktok' | 'youtube' | 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'generic';
}

// ─── Review ───────────────────────────────────────────────────────────

export interface ReviewItem {
  id: string;
  title: string;
  description: string;
  projectId: string | null;
  projectType: ProjectType | null;
  status: 'pending' | 'in-progress' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee: string | null;
  tags: string[];
  aiSummary: string | null;
  comments: ReviewComment[];
  createdAt: number;
  updatedAt: number;
}

export interface ReviewComment {
  id: string;
  author: string;
  text: string;
  timestamp: number;
}
