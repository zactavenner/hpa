import { ApiKey, Caption, VideoEffect, MotionGraphic, CaptionStyle, ViralTemplate } from '@/types';

export async function generateScript(
  topic: string,
  style: 'viral' | 'educational' | 'storytelling' | 'promotional',
  durationSeconds: number,
): Promise<string> {
  const wordsPerSecond = 2.5;
  const targetWords = Math.round(durationSeconds * wordsPerSecond);

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
      'What I\'m about to tell you changed my life.',
    ],
    promotional: [
      'We just launched something incredible.',
      'This is the future and it\'s here now.',
      'Imagine if you could do this in seconds.',
      'Here\'s what everyone has been waiting for.',
    ],
  };

  const bodies: Record<string, string[]> = {
    viral: [
      `So here's the thing about ${topic}. Most people completely miss the point. They think it's one thing but it's actually something way bigger.`,
      `The crazy part is that ${topic} has been hiding in plain sight. Once you see it you can't unsee it. Let me show you exactly what I mean.`,
      `First you need to understand the context. ${topic} isn't just trending for no reason. There's real substance behind this and it matters.`,
    ],
    educational: [
      `Let's talk about ${topic}. The first thing to understand is the fundamentals. Most beginners skip this and that's where they fail.`,
      `When it comes to ${topic}, there are three levels. The basics that everyone knows. The intermediate concepts. And the advanced techniques that separate the pros.`,
      `Here's my framework for ${topic}. Step one: understand the core principle. Step two: practice deliberately. Step three: iterate and improve.`,
    ],
    storytelling: [
      `So there I was, completely clueless about ${topic}. I had no idea what I was getting into. But something told me to keep going.`,
      `The journey with ${topic} started small. Really small. But every day I showed up and put in the work. That consistency changed everything.`,
      `People asked me why I was so obsessed with ${topic}. I couldn't explain it at first. But now looking back, it all makes sense.`,
    ],
    promotional: [
      `We spent months perfecting ${topic}. Every detail was intentional. Every feature was tested. And the result speaks for itself.`,
      `What makes ${topic} different is the approach. We didn't just build another solution. We reimagined the entire experience from scratch.`,
      `The response to ${topic} has been incredible. People are already seeing results and we're just getting started.`,
    ],
  };

  const closers: Record<string, string[]> = {
    viral: [
      'Share this with someone who needs to hear it. Follow for more.',
      'If this blew your mind, wait until you see what\'s coming next.',
      'Drop a comment if you agree. This is just the beginning.',
    ],
    educational: [
      'Save this for later. You\'ll want to come back to it.',
      'If you found this helpful, there\'s a lot more where this came from.',
      'Practice these steps and let me know how it goes.',
    ],
    storytelling: [
      'And that\'s the story. But it\'s really just the beginning of something bigger.',
      'Looking back, I wouldn\'t change a thing. Every step led here.',
      'If you\'re on a similar journey, keep going. It\'s worth it.',
    ],
    promotional: [
      'Check the link to see it in action. You won\'t be disappointed.',
      'Early access is available now. Don\'t miss out on this one.',
      'Try it yourself and see the difference. The results speak for themselves.',
    ],
  };

  const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  let script = pick(hooks[style]) + ' ' + pick(bodies[style]) + ' ' + pick(closers[style]);

  const words = script.split(/\s+/);
  if (words.length > targetWords) {
    script = words.slice(0, targetWords).join(' ') + '.';
  }

  return script;
}

export async function generateCaptions(
  transcript: string,
  style: CaptionStyle,
  _apiKey?: ApiKey | null,
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
      animation: style === 'viral' ? 'pop' : style === 'bold' ? 'bounce' : 'fade',
    });
    currentTime += duration + 0.1;
  }

  return captions;
}

export async function generateViralEffects(
  duration: number,
  intensity: 'low' | 'medium' | 'high',
  _apiKey?: ApiKey | null,
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
  title: string,
  _apiKey?: ApiKey | null,
): Promise<MotionGraphic[]> {
  const graphics: MotionGraphic[] = [];

  graphics.push({
    id: crypto.randomUUID(),
    type: 'title-card',
    startTime: 0,
    endTime: 3,
    content: title || 'Your Title Here',
    style: { fontSize: 48, color: '#ffffff' },
    animation: 'pop',
  });

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
  _apiKey?: ApiKey | null,
): Promise<string> {
  const sentences = content.split(/[.!?]+/).filter(Boolean);
  if (sentences.length <= 2) return content;
  return sentences.slice(0, 2).join('. ') + '.';
}

/**
 * Apply a viral template's specific effects and graphics, plus generate captions from script
 */
export async function applyViralTemplate(
  template: ViralTemplate,
  duration: number,
  script: string,
): Promise<{ effects: VideoEffect[]; motionGraphics: MotionGraphic[]; captions: Caption[] }> {
  const timeScale = duration / 15; // templates designed for ~15s, scale to actual

  const effects: VideoEffect[] = template.effects.map((e) => ({
    ...e,
    id: crypto.randomUUID(),
    startTime: e.startTime * timeScale,
    endTime: e.endTime * timeScale,
  }));

  const motionGraphics: MotionGraphic[] = template.motionGraphics.map((mg) => ({
    ...mg,
    id: crypto.randomUUID(),
    startTime: mg.startTime * timeScale,
    endTime: mg.endTime * timeScale,
  }));

  const captions = await generateCaptions(script, template.captionStyle);

  return { effects, motionGraphics, captions };
}

/**
 * Full auto-build pipeline: generate script -> captions -> effects -> graphics
 */
export async function autoBuildVideo(
  topic: string,
  scriptStyle: 'viral' | 'educational' | 'storytelling' | 'promotional',
  template: ViralTemplate,
  duration: number,
): Promise<{
  script: string;
  captions: Caption[];
  effects: VideoEffect[];
  motionGraphics: MotionGraphic[];
}> {
  const script = await generateScript(topic, scriptStyle, duration);
  const { effects, motionGraphics, captions } = await applyViralTemplate(template, duration, script);
  return { script, captions, effects, motionGraphics };
}
