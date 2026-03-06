'use client';

import { useRef, useCallback, MouseEvent } from 'react';
import { useVideoStore } from '@/stores/video-store';
import { Clock, Type, Sparkles, Layers } from 'lucide-react';

export default function Timeline() {
  const trackRef = useRef<HTMLDivElement>(null);
  const {
    project,
    currentTime,
    setCurrentTime,
    selectedCaptionId,
    selectCaption,
    selectedEffectId,
    selectEffect,
  } = useVideoStore();

  const handleTrackClick = useCallback(
    (e: MouseEvent) => {
      if (!trackRef.current || !project) return;
      const rect = trackRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      setCurrentTime(x * project.duration);
    },
    [project, setCurrentTime]
  );

  if (!project) return null;

  const duration = project.duration || 30;
  const toPercent = (t: number) => (t / duration) * 100;

  return (
    <div className="space-y-3">
      {/* Time display */}
      <div className="flex items-center justify-between text-xs text-surface-500">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          {formatTime(currentTime)}
        </div>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Captions track */}
      <div>
        <div className="flex items-center gap-1.5 mb-1.5">
          <Type className="w-3 h-3 text-brand-500" />
          <span className="text-xs font-medium text-surface-600">Captions</span>
        </div>
        <div ref={trackRef} className="timeline-track" onClick={handleTrackClick}>
          {/* Playhead */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white z-20 shadow-sm"
            style={{ left: `${toPercent(currentTime)}%` }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-white shadow -ml-1 -mt-1" />
          </div>

          {project.captions.map((c) => (
            <div
              key={c.id}
              className={`caption-block ${selectedCaptionId === c.id ? 'ring-2 ring-brand-400 bg-brand-500/50' : ''}`}
              style={{
                left: `${toPercent(c.startTime)}%`,
                width: `${toPercent(c.endTime - c.startTime)}%`,
              }}
              onClick={(e) => { e.stopPropagation(); selectCaption(c.id); }}
              title={c.text}
            >
              <span className="text-[10px] text-white px-1 truncate block leading-[3.5rem]">
                {c.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Effects track */}
      <div>
        <div className="flex items-center gap-1.5 mb-1.5">
          <Sparkles className="w-3 h-3 text-purple-500" />
          <span className="text-xs font-medium text-surface-600">Effects</span>
        </div>
        <div className="timeline-track h-10" onClick={handleTrackClick}>
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white z-20"
            style={{ left: `${toPercent(currentTime)}%` }}
          />
          {project.effects.map((e) => (
            <div
              key={e.id}
              className={`absolute top-1 bottom-1 rounded cursor-pointer transition-colors ${
                selectedEffectId === e.id
                  ? 'bg-purple-500/50 border border-purple-400 ring-1 ring-purple-400'
                  : 'bg-purple-500/20 border border-purple-400/30 hover:bg-purple-500/30'
              }`}
              style={{
                left: `${toPercent(e.startTime)}%`,
                width: `${Math.max(toPercent(e.endTime - e.startTime), 1)}%`,
              }}
              onClick={(ev) => { ev.stopPropagation(); selectEffect(e.id); }}
              title={e.type}
            >
              <span className="text-[9px] text-purple-300 px-0.5">{e.type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Motion Graphics track */}
      <div>
        <div className="flex items-center gap-1.5 mb-1.5">
          <Layers className="w-3 h-3 text-pink-500" />
          <span className="text-xs font-medium text-surface-600">Graphics</span>
        </div>
        <div className="timeline-track h-10" onClick={handleTrackClick}>
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white z-20"
            style={{ left: `${toPercent(currentTime)}%` }}
          />
          {project.motionGraphics.map((mg) => (
            <div
              key={mg.id}
              className="absolute top-1 bottom-1 bg-pink-500/20 border border-pink-400/30 rounded hover:bg-pink-500/30 cursor-pointer transition-colors"
              style={{
                left: `${toPercent(mg.startTime)}%`,
                width: `${Math.max(toPercent(mg.endTime - mg.startTime), 1)}%`,
              }}
              title={`${mg.type}: ${mg.content}`}
            >
              <span className="text-[9px] text-pink-300 px-0.5">{mg.type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
