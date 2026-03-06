import { AdTemplate, BrandKit } from '@/types';

// ─── Font Presets ─────────────────────────────────────────────────────
// "Nano Banana Pro" is the default for all static ads

export const FONT_PRESETS: Record<string, { heading: string; body: string; label: string }> = {
  'nano-banana-pro': {
    heading: 'Nano Banana Pro',
    body: 'Nano Banana Pro',
    label: 'Nano Banana Pro (Default)',
  },
  'inter-system': {
    heading: 'Inter',
    body: 'Inter',
    label: 'Inter',
  },
  'editorial-mix': {
    heading: 'Playfair Display',
    body: 'Source Sans 3',
    label: 'Editorial Mix',
  },
  'tech-modern': {
    heading: 'Space Grotesk',
    body: 'DM Sans',
    label: 'Tech Modern',
  },
  'bold-impact': {
    heading: 'Oswald',
    body: 'Roboto',
    label: 'Bold Impact',
  },
};

export const DEFAULT_FONT_PRESET = 'nano-banana-pro';

const DEFAULT_BRAND_KIT: BrandKit = {
  primaryColor: '#0f172a',
  secondaryColor: '#2563eb',
  accentColor: '#f59e0b',
  fontHeading: 'Nano Banana Pro',
  fontBody: 'Nano Banana Pro',
  logoSrc: null,
};

// ─── Static Ad Templates ──────────────────────────────────────────────

export const AD_TEMPLATES: AdTemplate[] = [
  {
    id: 'product-showcase',
    name: 'Product Showcase',
    category: 'product',
    description: 'Clean product-focused layout with bold headline and CTA',
    format: 'instagram-post',
    fontPreset: 'nano-banana-pro',
    thumbnail: '/ad-templates/product-showcase.svg',
    brandKit: DEFAULT_BRAND_KIT,
    layers: [
      {
        type: 'background',
        order: 0,
        visible: true,
        locked: false,
        x: 0, y: 0, width: 1080, height: 1080, rotation: 0, opacity: 1,
        content: { type: 'background', fill: '#f8fafc', gradient: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', imageSrc: null },
      },
      {
        type: 'shape',
        order: 1,
        visible: true,
        locked: false,
        x: 80, y: 200, width: 920, height: 500, rotation: 0, opacity: 1,
        content: { type: 'shape', shape: 'rounded-rect', fill: '#ffffff', stroke: null, strokeWidth: 0, borderRadius: 24 },
      },
      {
        type: 'image',
        order: 2,
        visible: true,
        locked: false,
        x: 140, y: 240, width: 800, height: 420, rotation: 0, opacity: 1,
        content: { type: 'image', src: '', fit: 'contain', borderRadius: 16, filter: null },
      },
      {
        type: 'text',
        order: 3,
        visible: true,
        locked: false,
        x: 80, y: 60, width: 920, height: 120, rotation: 0, opacity: 1,
        content: {
          type: 'text', text: 'YOUR HEADLINE HERE', fontFamily: 'Nano Banana Pro', fontSize: 56,
          fontWeight: 800, color: '#0f172a', align: 'center', lineHeight: 1.1, letterSpacing: -0.5,
          textTransform: 'uppercase', shadow: null, stroke: null, strokeWidth: 0,
        },
      },
      {
        type: 'text',
        order: 4,
        visible: true,
        locked: false,
        x: 140, y: 750, width: 800, height: 80, rotation: 0, opacity: 1,
        content: {
          type: 'text', text: 'Subheadline goes here with a description', fontFamily: 'Nano Banana Pro', fontSize: 24,
          fontWeight: 400, color: '#64748b', align: 'center', lineHeight: 1.4, letterSpacing: 0,
          textTransform: 'none', shadow: null, stroke: null, strokeWidth: 0,
        },
      },
      {
        type: 'cta-button',
        order: 5,
        visible: true,
        locked: false,
        x: 340, y: 880, width: 400, height: 70, rotation: 0, opacity: 1,
        content: {
          type: 'cta-button', text: 'Shop Now', fontFamily: 'Nano Banana Pro', fontSize: 22,
          fontWeight: 700, color: '#ffffff', bgColor: '#2563eb', borderRadius: 16, paddingX: 40, paddingY: 16,
        },
      },
    ],
  },
  {
    id: 'promo-sale',
    name: 'Promo Sale',
    category: 'promo',
    description: 'Eye-catching sale banner with bold pricing and urgency',
    format: 'instagram-story',
    fontPreset: 'nano-banana-pro',
    thumbnail: '/ad-templates/promo-sale.svg',
    brandKit: { ...DEFAULT_BRAND_KIT, primaryColor: '#dc2626', secondaryColor: '#fbbf24' },
    layers: [
      {
        type: 'background',
        order: 0,
        visible: true,
        locked: false,
        x: 0, y: 0, width: 1080, height: 1920, rotation: 0, opacity: 1,
        content: { type: 'background', fill: '#dc2626', gradient: 'linear-gradient(180deg, #dc2626 0%, #991b1b 100%)', imageSrc: null },
      },
      {
        type: 'text',
        order: 1,
        visible: true,
        locked: false,
        x: 80, y: 200, width: 920, height: 160, rotation: 0, opacity: 1,
        content: {
          type: 'text', text: 'MEGA\nSALE', fontFamily: 'Nano Banana Pro', fontSize: 96,
          fontWeight: 900, color: '#fbbf24', align: 'center', lineHeight: 1, letterSpacing: -1,
          textTransform: 'uppercase', shadow: '4px 4px 0px rgba(0,0,0,0.2)', stroke: null, strokeWidth: 0,
        },
      },
      {
        type: 'text',
        order: 2,
        visible: true,
        locked: false,
        x: 200, y: 450, width: 680, height: 200, rotation: -5, opacity: 1,
        content: {
          type: 'text', text: '50% OFF', fontFamily: 'Nano Banana Pro', fontSize: 120,
          fontWeight: 900, color: '#ffffff', align: 'center', lineHeight: 1, letterSpacing: -2,
          textTransform: 'uppercase', shadow: null, stroke: '#fbbf24', strokeWidth: 4,
        },
      },
      {
        type: 'image',
        order: 3,
        visible: true,
        locked: false,
        x: 140, y: 700, width: 800, height: 700, rotation: 0, opacity: 1,
        content: { type: 'image', src: '', fit: 'contain', borderRadius: 24, filter: null },
      },
      {
        type: 'cta-button',
        order: 4,
        visible: true,
        locked: false,
        x: 240, y: 1500, width: 600, height: 80, rotation: 0, opacity: 1,
        content: {
          type: 'cta-button', text: 'SHOP THE SALE', fontFamily: 'Nano Banana Pro', fontSize: 26,
          fontWeight: 800, color: '#dc2626', bgColor: '#fbbf24', borderRadius: 20, paddingX: 48, paddingY: 20,
        },
      },
      {
        type: 'text',
        order: 5,
        visible: true,
        locked: false,
        x: 200, y: 1640, width: 680, height: 40, rotation: 0, opacity: 0.7,
        content: {
          type: 'text', text: 'Limited time only. While supplies last.', fontFamily: 'Nano Banana Pro', fontSize: 16,
          fontWeight: 400, color: '#ffffff', align: 'center', lineHeight: 1.4, letterSpacing: 0.5,
          textTransform: 'none', shadow: null, stroke: null, strokeWidth: 0,
        },
      },
    ],
  },
  {
    id: 'testimonial-card',
    name: 'Testimonial Card',
    category: 'testimonial',
    description: 'Customer quote with avatar and star rating',
    format: 'facebook-post',
    fontPreset: 'nano-banana-pro',
    thumbnail: '/ad-templates/testimonial.svg',
    brandKit: DEFAULT_BRAND_KIT,
    layers: [
      {
        type: 'background',
        order: 0,
        visible: true,
        locked: false,
        x: 0, y: 0, width: 1200, height: 630, rotation: 0, opacity: 1,
        content: { type: 'background', fill: '#0f172a', gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', imageSrc: null },
      },
      {
        type: 'text',
        order: 1,
        visible: true,
        locked: false,
        x: 80, y: 60, width: 100, height: 80, rotation: 0, opacity: 0.3,
        content: {
          type: 'text', text: '\u201C', fontFamily: 'Nano Banana Pro', fontSize: 120,
          fontWeight: 900, color: '#2563eb', align: 'left', lineHeight: 1, letterSpacing: 0,
          textTransform: 'none', shadow: null, stroke: null, strokeWidth: 0,
        },
      },
      {
        type: 'text',
        order: 2,
        visible: true,
        locked: false,
        x: 100, y: 140, width: 750, height: 200, rotation: 0, opacity: 1,
        content: {
          type: 'text', text: 'This product completely transformed how we work. Highly recommended!', fontFamily: 'Nano Banana Pro', fontSize: 32,
          fontWeight: 500, color: '#e2e8f0', align: 'left', lineHeight: 1.5, letterSpacing: 0,
          textTransform: 'none', shadow: null, stroke: null, strokeWidth: 0,
        },
      },
      {
        type: 'text',
        order: 3,
        visible: true,
        locked: false,
        x: 100, y: 400, width: 400, height: 30, rotation: 0, opacity: 1,
        content: {
          type: 'text', text: '\u2B50\u2B50\u2B50\u2B50\u2B50', fontFamily: 'Nano Banana Pro', fontSize: 24,
          fontWeight: 400, color: '#fbbf24', align: 'left', lineHeight: 1, letterSpacing: 4,
          textTransform: 'none', shadow: null, stroke: null, strokeWidth: 0,
        },
      },
      {
        type: 'text',
        order: 4,
        visible: true,
        locked: false,
        x: 100, y: 460, width: 600, height: 60, rotation: 0, opacity: 1,
        content: {
          type: 'text', text: 'Sarah Johnson, Marketing Director', fontFamily: 'Nano Banana Pro', fontSize: 18,
          fontWeight: 600, color: '#94a3b8', align: 'left', lineHeight: 1.4, letterSpacing: 0,
          textTransform: 'none', shadow: null, stroke: null, strokeWidth: 0,
        },
      },
      {
        type: 'shape',
        order: 5,
        visible: true,
        locked: false,
        x: 100, y: 540, width: 80, height: 4, rotation: 0, opacity: 1,
        content: { type: 'shape', shape: 'rect', fill: '#2563eb', stroke: null, strokeWidth: 0, borderRadius: 2 },
      },
    ],
  },
  {
    id: 'announcement-launch',
    name: 'Product Launch',
    category: 'announcement',
    description: 'Clean announcement with gradient accent',
    format: 'linkedin-post',
    fontPreset: 'nano-banana-pro',
    thumbnail: '/ad-templates/launch.svg',
    brandKit: DEFAULT_BRAND_KIT,
    layers: [
      {
        type: 'background',
        order: 0,
        visible: true,
        locked: false,
        x: 0, y: 0, width: 1200, height: 627, rotation: 0, opacity: 1,
        content: { type: 'background', fill: '#ffffff', gradient: null, imageSrc: null },
      },
      {
        type: 'shape',
        order: 1,
        visible: true,
        locked: false,
        x: 0, y: 0, width: 1200, height: 8, rotation: 0, opacity: 1,
        content: { type: 'shape', shape: 'rect', fill: 'linear-gradient(90deg, #2563eb, #7c3aed, #db2777)', stroke: null, strokeWidth: 0, borderRadius: 0 },
      },
      {
        type: 'text',
        order: 2,
        visible: true,
        locked: false,
        x: 80, y: 80, width: 400, height: 40, rotation: 0, opacity: 1,
        content: {
          type: 'text', text: 'NOW AVAILABLE', fontFamily: 'Nano Banana Pro', fontSize: 16,
          fontWeight: 700, color: '#2563eb', align: 'left', lineHeight: 1, letterSpacing: 3,
          textTransform: 'uppercase', shadow: null, stroke: null, strokeWidth: 0,
        },
      },
      {
        type: 'text',
        order: 3,
        visible: true,
        locked: false,
        x: 80, y: 140, width: 600, height: 180, rotation: 0, opacity: 1,
        content: {
          type: 'text', text: 'Introducing\nSomething New', fontFamily: 'Nano Banana Pro', fontSize: 56,
          fontWeight: 800, color: '#0f172a', align: 'left', lineHeight: 1.15, letterSpacing: -1,
          textTransform: 'none', shadow: null, stroke: null, strokeWidth: 0,
        },
      },
      {
        type: 'text',
        order: 4,
        visible: true,
        locked: false,
        x: 80, y: 360, width: 500, height: 80, rotation: 0, opacity: 1,
        content: {
          type: 'text', text: 'A brief description of what makes this special and why people should care about it.', fontFamily: 'Nano Banana Pro', fontSize: 18,
          fontWeight: 400, color: '#64748b', align: 'left', lineHeight: 1.6, letterSpacing: 0,
          textTransform: 'none', shadow: null, stroke: null, strokeWidth: 0,
        },
      },
      {
        type: 'cta-button',
        order: 5,
        visible: true,
        locked: false,
        x: 80, y: 490, width: 220, height: 56, rotation: 0, opacity: 1,
        content: {
          type: 'cta-button', text: 'Learn More', fontFamily: 'Nano Banana Pro', fontSize: 18,
          fontWeight: 700, color: '#ffffff', bgColor: '#0f172a', borderRadius: 12, paddingX: 32, paddingY: 14,
        },
      },
    ],
  },
  {
    id: 'social-proof-stats',
    name: 'Social Proof Stats',
    category: 'social-proof',
    description: 'Bold number stats for credibility and trust',
    format: 'twitter-post',
    fontPreset: 'nano-banana-pro',
    thumbnail: '/ad-templates/social-proof.svg',
    brandKit: DEFAULT_BRAND_KIT,
    layers: [
      {
        type: 'background',
        order: 0,
        visible: true,
        locked: false,
        x: 0, y: 0, width: 1600, height: 900, rotation: 0, opacity: 1,
        content: { type: 'background', fill: '#0f172a', gradient: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)', imageSrc: null },
      },
      {
        type: 'text',
        order: 1,
        visible: true,
        locked: false,
        x: 100, y: 120, width: 600, height: 60, rotation: 0, opacity: 1,
        content: {
          type: 'text', text: 'TRUSTED BY THOUSANDS', fontFamily: 'Nano Banana Pro', fontSize: 20,
          fontWeight: 700, color: '#60a5fa', align: 'left', lineHeight: 1, letterSpacing: 4,
          textTransform: 'uppercase', shadow: null, stroke: null, strokeWidth: 0,
        },
      },
      {
        type: 'text',
        order: 2,
        visible: true,
        locked: false,
        x: 100, y: 250, width: 400, height: 120, rotation: 0, opacity: 1,
        content: {
          type: 'text', text: '10M+', fontFamily: 'Nano Banana Pro', fontSize: 96,
          fontWeight: 900, color: '#ffffff', align: 'left', lineHeight: 1, letterSpacing: -2,
          textTransform: 'none', shadow: null, stroke: null, strokeWidth: 0,
        },
      },
      {
        type: 'text',
        order: 3,
        visible: true,
        locked: false,
        x: 100, y: 380, width: 400, height: 40, rotation: 0, opacity: 0.6,
        content: {
          type: 'text', text: 'Videos created', fontFamily: 'Nano Banana Pro', fontSize: 22,
          fontWeight: 400, color: '#e2e8f0', align: 'left', lineHeight: 1, letterSpacing: 0,
          textTransform: 'none', shadow: null, stroke: null, strokeWidth: 0,
        },
      },
      {
        type: 'text',
        order: 4,
        visible: true,
        locked: false,
        x: 600, y: 250, width: 400, height: 120, rotation: 0, opacity: 1,
        content: {
          type: 'text', text: '98%', fontFamily: 'Nano Banana Pro', fontSize: 96,
          fontWeight: 900, color: '#34d399', align: 'left', lineHeight: 1, letterSpacing: -2,
          textTransform: 'none', shadow: null, stroke: null, strokeWidth: 0,
        },
      },
      {
        type: 'text',
        order: 5,
        visible: true,
        locked: false,
        x: 600, y: 380, width: 400, height: 40, rotation: 0, opacity: 0.6,
        content: {
          type: 'text', text: 'Customer satisfaction', fontFamily: 'Nano Banana Pro', fontSize: 22,
          fontWeight: 400, color: '#e2e8f0', align: 'left', lineHeight: 1, letterSpacing: 0,
          textTransform: 'none', shadow: null, stroke: null, strokeWidth: 0,
        },
      },
    ],
  },
  {
    id: 'minimal-brand',
    name: 'Minimal Brand',
    category: 'minimal',
    description: 'Ultra-clean minimal layout with strong typography',
    format: 'instagram-post',
    fontPreset: 'nano-banana-pro',
    thumbnail: '/ad-templates/minimal.svg',
    brandKit: DEFAULT_BRAND_KIT,
    layers: [
      {
        type: 'background',
        order: 0,
        visible: true,
        locked: false,
        x: 0, y: 0, width: 1080, height: 1080, rotation: 0, opacity: 1,
        content: { type: 'background', fill: '#fafaf9', gradient: null, imageSrc: null },
      },
      {
        type: 'text',
        order: 1,
        visible: true,
        locked: false,
        x: 100, y: 320, width: 880, height: 200, rotation: 0, opacity: 1,
        content: {
          type: 'text', text: 'Less is\nmore.', fontFamily: 'Nano Banana Pro', fontSize: 80,
          fontWeight: 800, color: '#0f172a', align: 'left', lineHeight: 1.1, letterSpacing: -2,
          textTransform: 'none', shadow: null, stroke: null, strokeWidth: 0,
        },
      },
      {
        type: 'shape',
        order: 2,
        visible: true,
        locked: false,
        x: 100, y: 560, width: 60, height: 4, rotation: 0, opacity: 1,
        content: { type: 'shape', shape: 'rect', fill: '#0f172a', stroke: null, strokeWidth: 0, borderRadius: 2 },
      },
      {
        type: 'text',
        order: 3,
        visible: true,
        locked: false,
        x: 100, y: 600, width: 600, height: 60, rotation: 0, opacity: 1,
        content: {
          type: 'text', text: 'Your tagline goes right here', fontFamily: 'Nano Banana Pro', fontSize: 20,
          fontWeight: 400, color: '#78716c', align: 'left', lineHeight: 1.5, letterSpacing: 0.5,
          textTransform: 'none', shadow: null, stroke: null, strokeWidth: 0,
        },
      },
    ],
  },
];

export function getAdTemplate(id: string): AdTemplate | undefined {
  return AD_TEMPLATES.find((t) => t.id === id);
}

export function getTemplatesByCategory(category: AdTemplate['category']): AdTemplate[] {
  return AD_TEMPLATES.filter((t) => t.category === category);
}
