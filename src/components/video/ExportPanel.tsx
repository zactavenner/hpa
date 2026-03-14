'use client';

import { useState, useCallback } from 'react';
import { useVideoStore } from '@/stores/video-store';
import { ExportConfig } from '@/types';
import { Download, ChevronDown } from 'lucide-react';

const PLATFORM_PRESETS: { value: ExportConfig['platform']; label: string; ratio: string }[] = [
  { value: 'tiktok', label: 'TikTok', ratio: '9:16' },
  { value: 'youtube', label: 'YouTube', ratio: '16:9' },
  { value: 'instagram', label: 'Instagram Reels', ratio: '9:16' },
  { value: 'facebook', label: 'Facebook', ratio: '16:9' },
  { value: 'twitter', label: 'Twitter/X', ratio: '16:9' },
  { value: 'linkedin', label: 'LinkedIn', ratio: '16:9' },
  { value: 'generic', label: 'Custom', ratio: 'current' },
];

const QUALITY_OPTIONS: { value: ExportConfig['quality']; label: string; desc: string }[] = [
  { value: 'draft', label: 'Draft', desc: 'Fast preview' },
  { value: 'standard', label: 'Standard', desc: '720p' },
  { value: 'high', label: 'High', desc: '1080p' },
  { value: 'max', label: 'Max', desc: '4K' },
];

export default function ExportPanel() {
  const { project } = useVideoStore();
  const [config, setConfig] = useState<ExportConfig>({
    format: 'mp4',
    quality: 'high',
    resolution: '1080p',
    fps: 30,
    watermark: false,
    platform: 'tiktok',
  });
  const [exporting, setExporting] = useState(false);

  const handleExportFrame = useCallback(() => {
    setExporting(true);

    // Capture current video frame to canvas and download as PNG
    const video = document.querySelector('.video-canvas video') as HTMLVideoElement;
    if (video && video.videoWidth) {
      const c = document.createElement('canvas');
      c.width = video.videoWidth || 1080;
      c.height = video.videoHeight || 1920;
      const ctx = c.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, c.width, c.height);
        const link = document.createElement('a');
        link.download = `${project?.name || 'frame'}-export.png`;
        link.href = c.toDataURL('image/png');
        link.click();
      }
    }
    setExporting(false);
  }, [project]);

  if (!project) return null;

  return (
    <div id="export-panel" className="card space-y-4">
      <div className="flex items-center gap-2">
        <Download className="w-4 h-4 text-green-600" />
        <h3 className="font-medium text-surface-900 text-sm">Export</h3>
      </div>

      {/* Platform */}
      <div>
        <label className="block text-xs font-medium text-surface-600 mb-1">Platform</label>
        <div className="relative">
          <select
            value={config.platform}
            onChange={(e) => setConfig({ ...config, platform: e.target.value as ExportConfig['platform'] })}
            className="input text-sm pr-8 appearance-none"
          >
            {PLATFORM_PRESETS.map((p) => (
              <option key={p.value} value={p.value}>{p.label} ({p.ratio})</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
        </div>
      </div>

      {/* Quality */}
      <div>
        <label className="block text-xs font-medium text-surface-600 mb-1.5">Quality</label>
        <div className="grid grid-cols-4 gap-1">
          {QUALITY_OPTIONS.map((q) => (
            <button
              key={q.value}
              onClick={() => setConfig({ ...config, quality: q.value })}
              className={`py-1.5 rounded-lg text-xs font-medium transition-all ${
                config.quality === q.value
                  ? 'bg-green-600 text-white'
                  : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
              }`}
            >
              {q.label}
            </button>
          ))}
        </div>
      </div>

      {/* Format */}
      <div>
        <label className="block text-xs font-medium text-surface-600 mb-1">Format</label>
        <div className="grid grid-cols-3 gap-1">
          {(['mp4', 'mov', 'webm'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setConfig({ ...config, format: f })}
              className={`py-1.5 rounded-lg text-xs font-medium transition-all ${
                config.format === f
                  ? 'bg-green-600 text-white'
                  : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* FPS */}
      <div>
        <label className="block text-xs font-medium text-surface-600 mb-1">Frame Rate</label>
        <div className="grid grid-cols-3 gap-1">
          {([24, 30, 60] as const).map((fps) => (
            <button
              key={fps}
              onClick={() => setConfig({ ...config, fps })}
              className={`py-1.5 rounded-lg text-xs font-medium transition-all ${
                config.fps === fps
                  ? 'bg-green-600 text-white'
                  : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
              }`}
            >
              {fps}fps
            </button>
          ))}
        </div>
      </div>

      {/* Export Buttons */}
      <div className="space-y-2 pt-1">
        <button
          onClick={handleExportFrame}
          disabled={exporting}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-sm transition-all disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {exporting ? 'Exporting...' : 'Export Current Frame'}
        </button>
        <p className="text-[10px] text-surface-400 text-center">
          Full video export coming soon — captures current frame as PNG
        </p>
      </div>
    </div>
  );
}
