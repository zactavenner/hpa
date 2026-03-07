import {
  ApiKey, Caption, VideoEffect, MotionGraphic, CaptionStyle,
  ViralTemplate, StaticAdProject, AdLayer, AdFormat, BrandKit,
  AdTemplate, ScriptStyle,
} from '@/types';
import { AD_FORMAT_SIZES } from '@/types';
import { AD_TEMPLATES, DEFAULT_FONT_PRESET, FONT_PRESETS, AdStylePreset } from '@/lib/ad-templates';

// ─── Script Generation ────────────────────────────────────────────────

export async function generateScript(
  topic: string,
  style: ScriptStyle,
  durationSeconds: number,
): Promise<string> {
  const targetWords = Math.round(durationSeconds * 2.5);

  const hooks: Record<string, string[]> = {
    viral: [
      'You won\'t believe what happens next.',
      'This changed everything I thought I knew.',
      'Stop scrolling. You need to see this.',
      'Nobody is talking about this and it\'s insane.',
    ],
    educational: [
      'Here\'s something most people get wrong.',
      'Let me break this down in 60 seconds.',
      'The truth about this might surprise you.',
      'Three things you need to know right now.',
    ],
    storytelling: [
      'It all started when I least expected it.',
      'This is the story nobody tells you.',
      'I never thought this would happen to me.',
    ],
    promotional: [
      'We just launched something incredible.',
      'This is the future and it\'s here now.',
      'Imagine if you could do this in seconds.',
    ],
  };

  const bodies: Record<string, string[]> = {
    viral: [
      `So here's the thing about ${topic}. Most people completely miss the point. They think it's one thing but it's actually something way bigger. The crazy part is it's been hiding in plain sight this whole time.`,
      `First you need to understand the context. ${topic} isn't just trending for no reason. There's real substance behind this and once you see it you can't unsee it.`,
    ],
    educational: [
      `Let's talk about ${topic}. The first thing to understand is the fundamentals. Most beginners skip this step and that's exactly where they fail. Here's my proven framework.`,
      `When it comes to ${topic}, there are three levels. The basics everyone knows. The intermediate concepts. And the advanced techniques that separate the pros from everyone else.`,
    ],
    storytelling: [
      `So there I was, completely clueless about ${topic}. I had no idea what I was getting into. But something told me to keep going and that persistence changed everything.`,
      `The journey with ${topic} started small. Really small. But every day I showed up and put in the work. That consistency changed everything.`,
    ],
    promotional: [
      `We spent months perfecting ${topic}. Every detail was intentional. Every feature was tested with real users. And the result speaks for itself.`,
      `What makes ${topic} different is the approach. We didn't just build another solution. We reimagined the entire experience from scratch.`,
    ],
  };

  const closers: Record<string, string[]> = {
    viral: ['Share this with someone who needs to hear it. Follow for more.', 'If this blew your mind, wait until you see what\'s coming next.'],
    educational: ['Save this for later. You\'ll want to come back to it.', 'Practice these steps and let me know how it goes.'],
    storytelling: ['And that\'s the story. But it\'s really just the beginning.', 'If you\'re on a similar journey, keep going. It\'s worth it.'],
    promotional: ['Check the link to see it in action.', 'Try it yourself and see the difference.'],
  };

  const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
  let script = pick(hooks[style]) + ' ' + pick(bodies[style]) + ' ' + pick(closers[style]);

  const words = script.split(/\s+/);
  if (words.length > targetWords) {
    script = words.slice(0, targetWords).join(' ') + '.';
  }
  return script;
}

// ─── Ad Copy Generation ───────────────────────────────────────────────

export async function generateAdCopy(
  topic: string,
  tone: 'professional' | 'casual' | 'urgent' | 'luxury' | 'playful',
  format: AdFormat,
): Promise<{ headline: string; body: string; cta: string }> {
  const headlines: Record<string, string[]> = {
    professional: [
      `Transform Your ${topic} Strategy`,
      `The Smarter Way to ${topic}`,
      `${topic}: Built for Scale`,
      `Elevate Your ${topic}`,
    ],
    casual: [
      `${topic} Just Got Way Easier`,
      `Your New Favorite ${topic} Tool`,
      `${topic}? We Got You`,
      `Say Hello to Better ${topic}`,
    ],
    urgent: [
      `Don't Miss Out on ${topic}`,
      `Last Chance: ${topic} Deal Ends Soon`,
      `Act Now: ${topic} at 50% Off`,
      `Limited Time ${topic} Offer`,
    ],
    luxury: [
      `The Art of ${topic}`,
      `Premium ${topic} Experience`,
      `${topic}, Redefined`,
      `Exclusive ${topic} Collection`,
    ],
    playful: [
      `${topic} But Make It Fun`,
      `Level Up Your ${topic} Game`,
      `${topic} That Hits Different`,
      `${topic}? Yes Please`,
    ],
  };

  const bodies: Record<string, string[]> = {
    professional: [
      `Streamline your workflow with our enterprise-grade ${topic.toLowerCase()} solution. Trusted by industry leaders.`,
      `Join thousands of professionals who use our ${topic.toLowerCase()} platform to drive measurable results.`,
    ],
    casual: [
      `We made ${topic.toLowerCase()} simple, fast, and actually enjoyable. Give it a try.`,
      `No more headaches with ${topic.toLowerCase()}. Just smooth sailing from start to finish.`,
    ],
    urgent: [
      `This offer won't last. Get premium ${topic.toLowerCase()} features at an unbeatable price before time runs out.`,
      `Hurry — only a few spots left for early access to our ${topic.toLowerCase()} platform.`,
    ],
    luxury: [
      `Crafted with precision for those who demand excellence in ${topic.toLowerCase()}.`,
      `Experience ${topic.toLowerCase()} the way it was meant to be — elegant, refined, exceptional.`,
    ],
    playful: [
      `${topic} doesn't have to be boring. We made it cool, easy, and a little bit magical.`,
      `Warning: our ${topic.toLowerCase()} might cause extreme productivity and happiness.`,
    ],
  };

  const ctas: Record<string, string[]> = {
    professional: ['Get Started', 'Request a Demo', 'Learn More', 'See Pricing'],
    casual: ['Try It Free', 'Check It Out', 'Get Started', 'See How It Works'],
    urgent: ['Shop Now', 'Claim Your Spot', 'Get the Deal', 'Act Now'],
    luxury: ['Discover More', 'Explore Collection', 'Experience Now', 'View Exclusive'],
    playful: ['Let\'s Go!', 'Start Creating', 'Join the Fun', 'Dive In'],
  };

  const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  return {
    headline: pick(headlines[tone]),
    body: pick(bodies[tone]),
    cta: pick(ctas[tone]),
  };
}

// ─── Caption Generation ───────────────────────────────────────────────

export async function generateCaptions(
  transcript: string,
  style: CaptionStyle,
): Promise<Caption[]> {
  const words = transcript.split(/\s+/).filter(Boolean);
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
      animation: style === 'viral' ? 'pop' : style === 'bold' ? 'bounce' : style === 'neon' ? 'karaoke' : 'fade',
      fontSize: style === 'viral' ? 48 : style === 'bold' ? 56 : 32,
      fontFamily: 'Nano Banana Pro',
    });
    currentTime += duration + 0.1;
  }

  return captions;
}

// ─── Video Effects ────────────────────────────────────────────────────

export async function generateViralEffects(
  duration: number,
  intensity: 'low' | 'medium' | 'high',
): Promise<VideoEffect[]> {
  const effects: VideoEffect[] = [];
  const effectTypes: VideoEffect['type'][] = ['zoom', 'shake', 'glitch', 'flash', 'speed-ramp', 'blur', 'color-shift'];
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

// ─── Motion Graphics ──────────────────────────────────────────────────

export async function generateMotionGraphics(
  duration: number,
  title: string,
): Promise<MotionGraphic[]> {
  const graphics: MotionGraphic[] = [];

  graphics.push({
    id: crypto.randomUUID(), type: 'title-card', startTime: 0, endTime: 3,
    content: title || 'Your Title Here', style: { fontSize: 48, color: '#ffffff' }, animation: 'pop',
  });

  if (duration > 10) {
    graphics.push({
      id: crypto.randomUUID(), type: 'subscribe-cta', startTime: duration - 5, endTime: duration - 1,
      content: 'Subscribe for more!', style: { fontSize: 24, color: '#ef4444' }, animation: 'bounce',
    });
  }

  for (let t = 3; t < duration - 5; t += 8) {
    graphics.push({
      id: crypto.randomUUID(), type: 'emoji-burst', startTime: t, endTime: t + 1.5,
      content: ['🔥', '💯', '😱', '🎯', '⚡'][Math.floor(Math.random() * 5)],
      style: { fontSize: 64 }, animation: 'pop',
    });
  }

  return graphics;
}

// ─── Review Summary ───────────────────────────────────────────────────

export async function generateReviewSummary(content: string): Promise<string> {
  const sentences = content.split(/[.!?]+/).filter(Boolean);
  if (sentences.length <= 2) return content;
  return sentences.slice(0, 2).join('. ') + '.';
}

// ─── Template Application ─────────────────────────────────────────────

export async function applyViralTemplate(
  template: ViralTemplate,
  duration: number,
  script: string,
): Promise<{ effects: VideoEffect[]; motionGraphics: MotionGraphic[]; captions: Caption[] }> {
  const timeScale = duration / 15;

  const effects: VideoEffect[] = template.effects.map((e) => ({
    ...e, id: crypto.randomUUID(),
    startTime: e.startTime * timeScale, endTime: e.endTime * timeScale,
  }));

  const motionGraphics: MotionGraphic[] = template.motionGraphics.map((mg) => ({
    ...mg, id: crypto.randomUUID(),
    startTime: mg.startTime * timeScale, endTime: mg.endTime * timeScale,
  }));

  const captions = await generateCaptions(script, template.captionStyle);
  return { effects, motionGraphics, captions };
}

// ─── Static Ad Composition ────────────────────────────────────────────

export async function composeStaticAd(
  templateId: string,
  copy: { headline: string; body: string; cta: string },
  brandKit?: Partial<BrandKit>,
  stylePreset?: AdStylePreset,
  referenceImages?: string[],
): Promise<StaticAdProject> {
  const template = AD_TEMPLATES.find((t) => t.id === templateId) || AD_TEMPLATES[0];
  const fontPreset = FONT_PRESETS[template.fontPreset] || FONT_PRESETS[DEFAULT_FONT_PRESET];
  const size = AD_FORMAT_SIZES[template.format];

  // Merge brand kit with style preset overrides
  const mergedBrandKit: BrandKit = {
    ...template.brandKit,
    ...brandKit,
    fontHeading: fontPreset.heading,
    fontBody: fontPreset.body,
  };

  if (stylePreset) {
    mergedBrandKit.primaryColor = stylePreset.colors.primary;
    mergedBrandKit.secondaryColor = stylePreset.colors.secondary;
    mergedBrandKit.accentColor = stylePreset.colors.accent;
  }

  // Map template layers, replacing placeholder text with generated copy
  const layers: AdLayer[] = template.layers.map((layer, i) => {
    const base = { ...layer, id: crypto.randomUUID() };

    // Apply style preset to background
    if (layer.content.type === 'background' && stylePreset) {
      const bgContent = { ...layer.content };
      bgContent.fill = stylePreset.colors.bg;
      // Clear gradient if style changes the bg to keep it clean
      if (stylePreset.vibe === 'clean' || stylePreset.vibe === 'organic') {
        bgContent.gradient = null;
      } else if (stylePreset.vibe === 'gradient') {
        bgContent.gradient = `linear-gradient(135deg, ${stylePreset.colors.bg} 0%, ${stylePreset.colors.secondary} 100%)`;
      }
      return { ...base, content: bgContent };
    }

    if (layer.content.type === 'text') {
      const content = { ...layer.content };
      // Replace headline/body text with generated copy
      if (layer.order <= 2 && content.fontSize >= 40) {
        content.text = copy.headline;
      } else if (content.fontSize >= 18 && content.fontSize < 40 && content.text.length > 20) {
        content.text = copy.body;
      }
      content.fontFamily = content.fontSize >= 40 ? fontPreset.heading : fontPreset.body;

      // Apply style preset colors and typography
      if (stylePreset) {
        content.color = content.fontSize >= 40 ? stylePreset.colors.primary : stylePreset.colors.text;
        content.letterSpacing = stylePreset.typography.letterSpacing;
        content.textTransform = stylePreset.typography.transform;
        content.fontWeight = stylePreset.typography.weight === 'black' ? 900
          : stylePreset.typography.weight === 'bold' ? 700
          : stylePreset.typography.weight === 'regular' ? 400 : 300;
      }

      return { ...base, content };
    }

    if (layer.content.type === 'cta-button') {
      const ctaContent = { ...layer.content, text: copy.cta, fontFamily: fontPreset.heading };
      if (stylePreset) {
        ctaContent.bgColor = stylePreset.colors.accent;
        ctaContent.color = stylePreset.colors.bg;
      }
      return { ...base, content: ctaContent };
    }

    // Apply accent color to shapes
    if (layer.content.type === 'shape' && stylePreset) {
      const shapeContent = { ...layer.content };
      shapeContent.fill = stylePreset.colors.accent;
      return { ...base, content: shapeContent };
    }

    return base;
  });

  // Add reference images as image layers if provided
  if (referenceImages && referenceImages.length > 0) {
    referenceImages.forEach((src, i) => {
      layers.push({
        id: crypto.randomUUID(),
        type: 'image',
        order: layers.length,
        visible: true,
        locked: false,
        x: 60 + i * 40,
        y: Math.round(size.height * 0.25),
        width: Math.round(size.width * 0.45),
        height: Math.round(size.height * 0.4),
        rotation: 0,
        opacity: 1,
        content: { type: 'image', src, fit: 'contain', borderRadius: 16, filter: null },
      });
    });
  }

  return {
    id: crypto.randomUUID(),
    name: copy.headline,
    type: 'static-ad',
    status: 'draft',
    tags: [template.category],
    format: template.format,
    width: size.width,
    height: size.height,
    layers,
    brandKit: mergedBrandKit,
    variants: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

// ─── Full Auto-Build ──────────────────────────────────────────────────

export async function autoBuildVideo(
  topic: string,
  scriptStyle: ScriptStyle,
  template: ViralTemplate,
  duration: number,
): Promise<{ script: string; captions: Caption[]; effects: VideoEffect[]; motionGraphics: MotionGraphic[] }> {
  const script = await generateScript(topic, scriptStyle, duration);
  const { effects, motionGraphics, captions } = await applyViralTemplate(template, duration, script);
  return { script, captions, effects, motionGraphics };
}

export async function autoBuildStaticAd(
  topic: string,
  tone: 'professional' | 'casual' | 'urgent' | 'luxury' | 'playful',
  templateId: string,
): Promise<{ copy: { headline: string; body: string; cta: string }; adProject: StaticAdProject }> {
  const template = AD_TEMPLATES.find((t) => t.id === templateId) || AD_TEMPLATES[0];
  const copy = await generateAdCopy(topic, tone, template.format);
  const adProject = await composeStaticAd(templateId, copy);
  return { copy, adProject };
}
