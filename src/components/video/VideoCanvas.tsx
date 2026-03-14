'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useVideoStore } from '@/stores/video-store';
import { Caption, MotionGraphic } from '@/types';

export default function VideoCanvas() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { project, currentTime, isPlaying, setCurrentTime, setPlaying, setDuration } = useVideoStore();

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  }, [setCurrentTime]);

  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  }, [setDuration]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) {
      v.play().catch(() => setPlaying(false));
    } else {
      v.pause();
    }
  }, [isPlaying, setPlaying]);

  if (!project) return null;

  const aspectClass =
    project.aspectRatio === '16:9' ? 'landscape' :
    project.aspectRatio === '1:1' ? 'square' : '';

  const activeCaptions = project.captions.filter(
    (c) => currentTime >= c.startTime && currentTime <= c.endTime
  );

  const activeGraphics = project.motionGraphics.filter(
    (mg) => currentTime >= mg.startTime && currentTime <= mg.endTime
  );

  const activeEffects = project.effects.filter(
    (e) => currentTime >= e.startTime && currentTime <= e.endTime
  );

  const effectClass = activeEffects.map((e) => `effect-${e.type}`).join(' ');

  return (
    <div className={`video-canvas ${aspectClass} ${effectClass}`}>
      {project.videoSrc ? (
        <video
          ref={videoRef}
          src={project.videoSrc}
          className="w-full h-full object-cover"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setPlaying(false)}
          playsInline
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface-800 to-surface-950">
          <p className="text-surface-400 text-sm">Upload a video to begin editing</p>
        </div>
      )}

      {/* Caption Overlays */}
      {activeCaptions.map((caption) => (
        <CaptionOverlay key={caption.id} caption={caption} currentTime={currentTime} />
      ))}

      {/* Motion Graphics */}
      {activeGraphics.map((mg) => (
        <MotionGraphicOverlay key={mg.id} graphic={mg} currentTime={currentTime} />
      ))}
    </div>
  );
}

function CaptionOverlay({ caption, currentTime }: { caption: Caption; currentTime: number }) {
  const progress = (currentTime - caption.startTime) / (caption.endTime - caption.startTime);

  const animationStyle = (() => {
    switch (caption.animation) {
      case 'fade':
        return { opacity: progress < 0.1 ? progress * 10 : progress > 0.9 ? (1 - progress) * 10 : 1 };
      case 'typewriter': {
        const chars = Math.floor(caption.text.length * Math.min(progress * 2, 1));
        return { clipPath: `inset(0 ${100 - (chars / caption.text.length) * 100}% 0 0)` };
      }
      case 'bounce':
        return { transform: `translateX(-50%) scale(${1 + Math.sin(progress * Math.PI) * 0.1})` };
      case 'slide-up':
        return { transform: `translateX(-50%) translateY(${(1 - Math.min(progress * 5, 1)) * 20}px)`, opacity: Math.min(progress * 5, 1) };
      case 'pop':
        return { transform: `translateX(-50%) scale(${progress < 0.1 ? progress * 12 : progress < 0.2 ? 1.2 - (progress - 0.1) * 2 : 1})` };
      case 'karaoke':
        return {};
      case 'word-by-word':
        return {};
      default:
        return {};
    }
  })();

  const renderText = () => {
    if (caption.animation === 'karaoke') {
      const highlightPos = progress * caption.text.length;
      return (
        <span className={`caption-text style-${caption.style}`}>
          <span style={{ color: '#facc15' }}>{caption.text.slice(0, Math.floor(highlightPos))}</span>
          <span>{caption.text.slice(Math.floor(highlightPos))}</span>
        </span>
      );
    }
    if (caption.animation === 'word-by-word') {
      const words = caption.text.split(' ');
      const visibleCount = Math.ceil(words.length * Math.min(progress * 1.5, 1));
      return (
        <span className={`caption-text style-${caption.style}`}>
          {words.map((word, i) => (
            <span key={i} style={{ opacity: i < visibleCount ? 1 : 0.15, transition: 'opacity 0.15s' }}>
              {word}{i < words.length - 1 ? ' ' : ''}
            </span>
          ))}
        </span>
      );
    }
    return <span className={`caption-text style-${caption.style}`}>{caption.text}</span>;
  };

  return (
    <div
      className="caption-overlay"
      style={{
        bottom: `${caption.position.y > 50 ? 100 - caption.position.y : caption.position.y}%`,
        ...animationStyle,
      }}
    >
      {renderText()}
    </div>
  );
}

function MotionGraphicOverlay({ graphic, currentTime }: { graphic: MotionGraphic; currentTime: number }) {
  const progress = (currentTime - graphic.startTime) / (graphic.endTime - graphic.startTime);
  const enterProgress = Math.min(progress * 5, 1);
  const exitProgress = progress > 0.8 ? (1 - progress) * 5 : 1;
  const visibility = Math.min(enterProgress, exitProgress);

  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    opacity: visibility,
    transition: 'none',
  };

  switch (graphic.type) {
    case 'title-card':
      return (
        <div
          style={{
            ...baseStyle,
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) scale(${0.8 + enterProgress * 0.2})`,
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontSize: Number(graphic.style.fontSize) || 48,
              fontWeight: 900,
              color: String(graphic.style.color) || '#fff',
              textShadow: '2px 2px 16px rgba(0,0,0,0.5)',
              letterSpacing: '0.05em',
            }}
          >
            {graphic.content}
          </span>
        </div>
      );

    case 'emoji-burst':
      return (
        <div
          style={{
            ...baseStyle,
            top: '40%',
            left: '50%',
            transform: `translate(-50%, -50%) scale(${enterProgress * 1.5})`,
            fontSize: Number(graphic.style.fontSize) || 64,
            filter: `drop-shadow(0 4px 8px rgba(0,0,0,0.3))`,
            textAlign: 'center',
          }}
        >
          {graphic.content}
        </div>
      );

    case 'subscribe-cta':
      return (
        <div
          style={{
            ...baseStyle,
            bottom: '10%',
            left: '50%',
            transform: `translateX(-50%) translateY(${(1 - enterProgress) * 30}px)`,
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: '#fff',
              padding: '10px 24px',
              borderRadius: 12,
              fontWeight: 700,
              fontSize: Number(graphic.style.fontSize) || 18,
              boxShadow: '0 4px 24px rgba(239, 68, 68, 0.4)',
              whiteSpace: 'nowrap',
            }}
          >
            {graphic.content}
          </div>
        </div>
      );

    case 'lower-third':
      return (
        <div
          style={{
            ...baseStyle,
            bottom: '8%',
            left: '5%',
            transform: `translateX(${(1 - enterProgress) * -40}px)`,
          }}
        >
          <div
            style={{
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(8px)',
              color: String(graphic.style.color) || '#fff',
              padding: '6px 16px',
              borderRadius: 8,
              fontSize: Number(graphic.style.fontSize) || 14,
              fontWeight: 500,
              borderLeft: '3px solid #2563eb',
            }}
          >
            {graphic.content}
          </div>
        </div>
      );

    case 'progress-bar':
      return (
        <div
          style={{
            ...baseStyle,
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: 'rgba(255,255,255,0.2)',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress * 100}%`,
              background: `linear-gradient(90deg, ${String(graphic.style.color) || '#ef4444'}, #f97316)`,
              transition: 'width 0.1s linear',
            }}
          />
        </div>
      );

    case 'particle': {
      const particles = Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const dist = enterProgress * 60;
        return {
          x: 50 + Math.cos(angle + progress * 2) * dist,
          y: 50 + Math.sin(angle + progress * 2) * dist,
          size: 4 + Math.sin(progress * Math.PI * 3 + i) * 2,
        };
      });
      return (
        <div style={{ ...baseStyle, inset: 0, pointerEvents: 'none' }}>
          {particles.map((p, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
                borderRadius: '50%',
                background: String(graphic.style.color) || '#facc15',
                boxShadow: `0 0 6px ${String(graphic.style.color) || '#facc15'}`,
              }}
            />
          ))}
        </div>
      );
    }

    case 'sticker':
      return (
        <div
          style={{
            ...baseStyle,
            top: '20%',
            right: '10%',
            transform: `rotate(${Math.sin(progress * Math.PI * 4) * 8}deg) scale(${0.8 + enterProgress * 0.2})`,
            fontSize: Number(graphic.style.fontSize) || 56,
            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))',
          }}
        >
          {graphic.content}
        </div>
      );

    case 'countdown': {
      const total = graphic.endTime - graphic.startTime;
      const remaining = Math.max(0, Math.ceil(total - (total * progress)));
      const pulse = 1 + Math.sin(progress * Math.PI * (total * 2)) * 0.05;
      return (
        <div
          style={{
            ...baseStyle,
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) scale(${pulse})`,
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontSize: Number(graphic.style.fontSize) || 72,
              fontWeight: 900,
              color: String(graphic.style.color) || '#fff',
              textShadow: '0 4px 24px rgba(0,0,0,0.5)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {remaining}
          </span>
        </div>
      );
    }

    case 'price-callout': {
      const parts = graphic.content.split('→');
      const oldPrice = parts[0] || String(graphic.style.oldPrice) || '$99';
      const newPrice = parts[1] || String(graphic.style.newPrice) || '$49';
      return (
        <div
          style={{
            ...baseStyle,
            bottom: '15%',
            right: '5%',
            transform: `scale(${0.8 + enterProgress * 0.2})`,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(8px)',
              padding: '12px 20px',
              borderRadius: 16,
              border: '2px solid #22c55e',
            }}
          >
            <span
              style={{
                fontSize: (Number(graphic.style.fontSize) || 28) * 0.7,
                color: '#94a3b8',
                textDecoration: 'line-through',
                marginRight: 8,
              }}
            >
              {oldPrice}
            </span>
            <span
              style={{
                fontSize: Number(graphic.style.fontSize) || 36,
                fontWeight: 900,
                color: '#22c55e',
                textShadow: '0 2px 8px rgba(34,197,94,0.3)',
              }}
            >
              {newPrice}
            </span>
          </div>
        </div>
      );
    }

    case 'urgency-timer': {
      const total = graphic.endTime - graphic.startTime;
      const remaining = Math.max(0, total - (total * progress));
      const mins = Math.floor(remaining / 60);
      const secs = Math.floor(remaining % 60);
      const flash = Math.sin(progress * Math.PI * 8) > 0;
      return (
        <div
          style={{
            ...baseStyle,
            top: 0,
            left: 0,
            right: 0,
            transform: `translateY(${(1 - enterProgress) * -40}px)`,
          }}
        >
          <div
            style={{
              background: flash ? 'rgba(239,68,68,0.95)' : 'rgba(220,38,38,0.9)',
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'background 0.15s',
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>
              {graphic.content || 'OFFER ENDS IN'}
            </span>
            <span style={{ fontSize: 20, fontWeight: 900, color: '#fff', fontVariantNumeric: 'tabular-nums', fontFamily: 'monospace' }}>
              {mins}:{secs.toString().padStart(2, '0')}
            </span>
          </div>
        </div>
      );
    }

    case 'offer-badge':
      return (
        <div
          style={{
            ...baseStyle,
            top: '8%',
            right: '5%',
            transform: `rotate(12deg) scale(${0.6 + enterProgress * 0.4})`,
          }}
        >
          <div
            style={{
              background: String(graphic.style.bgColor) || '#ef4444',
              color: String(graphic.style.color) || '#fff',
              padding: '10px 16px',
              borderRadius: 12,
              fontWeight: 900,
              fontSize: Number(graphic.style.fontSize) || 18,
              boxShadow: '0 4px 20px rgba(239,68,68,0.4)',
              textTransform: 'uppercase' as const,
              letterSpacing: '0.05em',
              whiteSpace: 'nowrap' as const,
            }}
          >
            {graphic.content || '50% OFF'}
          </div>
        </div>
      );

    case 'testimonial-quote':
      return (
        <div
          style={{
            ...baseStyle,
            bottom: '20%',
            left: '5%',
            right: '5%',
            transform: `translateY(${(1 - enterProgress) * 20}px)`,
          }}
        >
          <div
            style={{
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(8px)',
              padding: '12px 16px',
              borderRadius: 12,
              borderLeft: '3px solid #facc15',
            }}
          >
            <p style={{ fontSize: Number(graphic.style.fontSize) || 14, color: '#fff', fontStyle: 'italic', lineHeight: 1.4, margin: 0 }}>
              {graphic.content || '"This product changed everything." — Customer'}
            </p>
          </div>
        </div>
      );

    default:
      return null;
  }
}
