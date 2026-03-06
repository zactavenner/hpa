'use client';

import VideoCanvas from './VideoCanvas';
import Timeline from './Timeline';
import EditorToolbar from './EditorToolbar';
import CaptionEditor from './CaptionEditor';
import { useVideoStore } from '@/stores/video-store';
import { Film } from 'lucide-react';

export default function VideoEditor() {
  const { project } = useVideoStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
          <Film className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-surface-900">
            {project ? project.name : 'Video Editor'}
          </h2>
          <p className="text-sm text-surface-500">
            AI-powered editing with captions, effects, and motion graphics
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="card">
        <EditorToolbar />
      </div>

      {project && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Canvas */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-center">
              <VideoCanvas />
            </div>

            {/* Timeline */}
            <div className="card">
              <Timeline />
            </div>
          </div>

          {/* Properties Panel */}
          <div className="space-y-4">
            <CaptionEditor />

            {/* Project Info */}
            <div className="card space-y-3">
              <h3 className="font-medium text-surface-900 text-sm">Project Info</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-surface-500">Aspect Ratio</span>
                  <span className="font-medium text-surface-700">{project.aspectRatio}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-500">Duration</span>
                  <span className="font-medium text-surface-700">
                    {project.duration ? `${project.duration.toFixed(1)}s` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-500">Captions</span>
                  <span className="font-medium text-surface-700">{project.captions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-500">Effects</span>
                  <span className="font-medium text-surface-700">{project.effects.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-500">Graphics</span>
                  <span className="font-medium text-surface-700">{project.motionGraphics.length}</span>
                </div>
              </div>
            </div>

            {/* Caption List */}
            {project.captions.length > 0 && (
              <div className="card space-y-2">
                <h3 className="font-medium text-surface-900 text-sm">All Captions</h3>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {project.captions.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => useVideoStore.getState().selectCaption(c.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                        useVideoStore.getState().selectedCaptionId === c.id
                          ? 'bg-brand-50 text-brand-700'
                          : 'hover:bg-surface-50 text-surface-600'
                      }`}
                    >
                      <span className="block truncate font-medium">{c.text}</span>
                      <span className="text-[10px] text-surface-400">
                        {c.startTime.toFixed(1)}s — {c.endTime.toFixed(1)}s
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
