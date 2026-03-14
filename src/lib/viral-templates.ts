import { ViralTemplate } from '@/types';

export const VIRAL_TEMPLATES: ViralTemplate[] = [
  {
    id: 'tiktok-storytelling',
    name: 'TikTok Storytelling',
    description: 'Fast-paced cuts with bold captions and emoji reactions',
    thumbnail: '/templates/tiktok.svg',
    aspectRatio: '9:16',
    captionStyle: 'viral',
    effects: [
      { type: 'zoom', startTime: 0.5, endTime: 1, intensity: 1.2, params: {} },
      { type: 'shake', startTime: 3, endTime: 3.3, intensity: 0.8, params: {} },
      { type: 'speed-ramp', startTime: 5, endTime: 6, intensity: 1.5, params: { speed: 1.5 } },
      { type: 'flash', startTime: 8, endTime: 8.15, intensity: 1, params: {} },
    ],
    motionGraphics: [
      { type: 'emoji-burst', startTime: 1, endTime: 2, content: '🔥', style: { fontSize: 64 }, animation: 'pop' },
      { type: 'lower-third', startTime: 0, endTime: 3, content: '@yourusername', style: { fontSize: 16, color: '#fff' }, animation: 'slide-in' },
      { type: 'subscribe-cta', startTime: 12, endTime: 15, content: 'Follow for Part 2!', style: { fontSize: 20, color: '#ef4444' }, animation: 'bounce' },
    ],
  },
  {
    id: 'youtube-shorts',
    name: 'YouTube Shorts Hype',
    description: 'High energy with beat syncs, glitch transitions, and bold text',
    thumbnail: '/templates/youtube.svg',
    aspectRatio: '9:16',
    captionStyle: 'bold',
    effects: [
      { type: 'beat-sync', startTime: 0, endTime: 15, intensity: 1, params: { bpm: 130 } },
      { type: 'glitch', startTime: 2, endTime: 2.3, intensity: 1, params: {} },
      { type: 'zoom', startTime: 4, endTime: 4.5, intensity: 1.3, params: {} },
      { type: 'shake', startTime: 7, endTime: 7.5, intensity: 1, params: {} },
      { type: 'glitch', startTime: 10, endTime: 10.2, intensity: 0.8, params: {} },
    ],
    motionGraphics: [
      { type: 'title-card', startTime: 0, endTime: 2, content: 'WAIT FOR IT...', style: { fontSize: 48, color: '#fff' }, animation: 'pop' },
      { type: 'emoji-burst', startTime: 5, endTime: 6, content: '💯', style: { fontSize: 72 }, animation: 'pop' },
      { type: 'progress-bar', startTime: 0, endTime: 15, content: '', style: { color: '#ef4444' }, animation: 'slide-in' },
    ],
  },
  {
    id: 'reels-aesthetic',
    name: 'Instagram Reels Aesthetic',
    description: 'Clean, minimal with smooth transitions and elegant text',
    thumbnail: '/templates/reels.svg',
    aspectRatio: '9:16',
    captionStyle: 'minimal',
    effects: [
      { type: 'zoom', startTime: 1, endTime: 3, intensity: 0.3, params: {} },
      { type: 'speed-ramp', startTime: 5, endTime: 7, intensity: 0.8, params: { speed: 0.5 } },
    ],
    motionGraphics: [
      { type: 'lower-third', startTime: 0, endTime: 4, content: 'aesthetic vibes', style: { fontSize: 14, color: '#fff' }, animation: 'fade' },
    ],
  },
  {
    id: 'cinematic-widescreen',
    name: 'Cinematic Widescreen',
    description: 'Letterbox bars, dramatic zooms, and cinematic color grading',
    thumbnail: '/templates/cinematic.svg',
    aspectRatio: '16:9',
    captionStyle: 'minimal',
    effects: [
      { type: 'zoom', startTime: 2, endTime: 5, intensity: 0.4, params: {} },
      { type: 'speed-ramp', startTime: 8, endTime: 10, intensity: 1, params: { speed: 0.3 } },
    ],
    motionGraphics: [
      { type: 'title-card', startTime: 0, endTime: 4, content: '', style: { fontSize: 56, color: '#fff' }, animation: 'fade' },
      { type: 'lower-third', startTime: 5, endTime: 10, content: '', style: { fontSize: 18, color: '#e2e8f0' }, animation: 'slide-in' },
    ],
  },
  {
    id: 'direct-response-ad',
    name: 'Direct Response Ad',
    description: 'High-converting DR ad with price callouts, urgency timer, offer badge, and strong CTAs',
    thumbnail: '/templates/dr-ad.svg',
    aspectRatio: '9:16',
    captionStyle: 'viral',
    effects: [
      { type: 'zoom', startTime: 0.3, endTime: 0.8, intensity: 1.3, params: {} },
      { type: 'flash', startTime: 5, endTime: 5.15, intensity: 1, params: {} },
      { type: 'shake', startTime: 8, endTime: 8.4, intensity: 0.9, params: {} },
      { type: 'zoom', startTime: 12, endTime: 12.5, intensity: 1.2, params: {} },
    ],
    motionGraphics: [
      { type: 'title-card', startTime: 0, endTime: 3, content: 'STOP SCROLLING.', style: { fontSize: 48, color: '#fff' }, animation: 'pop' },
      { type: 'offer-badge', startTime: 2, endTime: 14, content: '50% OFF', style: { fontSize: 18, color: '#fff', bgColor: '#ef4444' }, animation: 'bounce' },
      { type: 'testimonial-quote', startTime: 4, endTime: 7, content: '"This changed everything for my business" — Sarah K.', style: { fontSize: 14, color: '#fff' }, animation: 'fade' },
      { type: 'price-callout', startTime: 7, endTime: 10, content: '$97→$47', style: { fontSize: 36, color: '#fff', oldPrice: '$97', newPrice: '$47' }, animation: 'pop' },
      { type: 'urgency-timer', startTime: 10, endTime: 14, content: 'OFFER ENDS IN', style: { fontSize: 16, color: '#ef4444' }, animation: 'slide-in' },
      { type: 'subscribe-cta', startTime: 12, endTime: 15, content: 'GET YOURS NOW ↓', style: { fontSize: 22, color: '#ef4444' }, animation: 'bounce' },
    ],
  },
];
