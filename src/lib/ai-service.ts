import { ApiKey, Caption, VideoEffect, MotionGraphic, CaptionStyle } from '@/types';

export async function generateCaptions(
  transcript: string,
  style: CaptionStyle,
  apiKey: ApiKey
): Promise<Caption[]> {
  // AI-powered caption generation
  // In production, this calls the AI API with the key
  const words = transcript.split(/\s+/);
  const captions: Caption[] = [];
  const wordsPerCaption = 4;
  let currentTime = 0;

  for (let i = 0; i < words.length; i += wordsPerCaption) {
    const chunk = words.slice(i, i + wordsPerCaption).join(' ');
    const duration = 0.8 + chunk.length * 0.03;
    captions.push({
      id: crypto.randomUUID(),
      text: chunk,
      startTime: currentTime,
      endTime: currentTime + duration,
      style,
      position: { x: 50, y: 80 },
      animation: style === 'viral' ? 'pop' : style === 'bold' ? 'bounce' : 'fade',
    });
    currentTime += duration + 0.1;
  }

  return captions;
}

export async function generateViralEffects(
  duration: number,
  intensity: 'low' | 'medium' | 'high',
  _apiKey: ApiKey
): Promise<VideoEffect[]> {
  const effects: VideoEffect[] = [];
  const effectTypes: VideoEffect['type'][] = ['zoom', 'shake', 'glitch', 'flash', 'speed-ramp'];
  const intensityMultiplier = intensity === 'high' ? 1.5 : intensity === 'medium' ? 1 : 0.5;
  const interval = intensity === 'high' ? 2 : intensity === 'medium' ? 4 : 6;

  for (let t = 1; t < duration; t += interval) {
    const type = effectTypes[Math.floor(Math.random() * effectTypes.length)];
    const effectDuration = type === 'flash' ? 0.15 : type === 'glitch' ? 0.3 : 0.5;
    effects.push({
      id: crypto.randomUUID(),
      type,
      startTime: t + Math.random() * 0.5,
      endTime: t + effectDuration,
      intensity: intensityMultiplier * (0.5 + Math.random() * 0.5),
      params: {},
    });
  }

  return effects;
}

export async function generateMotionGraphics(
  duration: number,
  template: string,
  _apiKey: ApiKey
): Promise<MotionGraphic[]> {
  const graphics: MotionGraphic[] = [];

  // Title card at start
  graphics.push({
    id: crypto.randomUUID(),
    type: 'title-card',
    startTime: 0,
    endTime: 3,
    content: template || 'Your Title Here',
    style: { fontSize: 48, color: '#ffffff' },
    animation: 'pop',
  });

  // Subscribe CTA near end
  if (duration > 10) {
    graphics.push({
      id: crypto.randomUUID(),
      type: 'subscribe-cta',
      startTime: duration - 5,
      endTime: duration - 1,
      content: 'Subscribe for more!',
      style: { fontSize: 24, color: '#ef4444' },
      animation: 'bounce',
    });
  }

  // Emoji bursts at intervals
  for (let t = 3; t < duration - 5; t += 8) {
    graphics.push({
      id: crypto.randomUUID(),
      type: 'emoji-burst',
      startTime: t,
      endTime: t + 1.5,
      content: ['🔥', '💯', '😱', '🎯', '⚡'][Math.floor(Math.random() * 5)],
      style: { fontSize: 64 },
      animation: 'pop',
    });
  }

  return graphics;
}

export async function generateReviewSummary(
  content: string,
  _apiKey: ApiKey
): Promise<string> {
  // In production, calls AI API
  const sentences = content.split(/[.!?]+/).filter(Boolean);
  if (sentences.length <= 2) return content;
  return sentences.slice(0, 2).join('. ') + '.';
}

export async function generateAutoEdit(
  duration: number,
  style: 'viral' | 'cinematic' | 'minimal',
  _apiKey: ApiKey
): Promise<{ effects: VideoEffect[]; motionGraphics: MotionGraphic[]; captions: Caption[] }> {
  const intensityMap = { viral: 'high', cinematic: 'medium', minimal: 'low' } as const;
  const captionStyleMap: Record<string, CaptionStyle> = {
    viral: 'viral',
    cinematic: 'bold',
    minimal: 'minimal',
  };

  const [effects, motionGraphics] = await Promise.all([
    generateViralEffects(duration, intensityMap[style], {} as ApiKey),
    generateMotionGraphics(duration, '', {} as ApiKey),
  ]);

  const sampleText = 'This is your viral content ready to go live and blow up on social media';
  const captions = await generateCaptions(sampleText, captionStyleMap[style], {} as ApiKey);

  return { effects, motionGraphics, captions };
}
