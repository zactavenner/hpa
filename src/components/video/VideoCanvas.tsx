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
      default:
        return {};
    }
  })();

  return (
    <div
      className="caption-overlay"
      style={{
        bottom: `${caption.position.y > 50 ? 100 - caption.position.y : caption.position.y}%`,
        ...animationStyle,
      }}
    >
      <span className={`caption-text style-${caption.style}`}>{caption.text}</span>
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

    default:
      return null;
  }
}
