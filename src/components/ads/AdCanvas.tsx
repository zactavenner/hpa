'use client';

import { useAdStore } from '@/stores/ad-store';
import { AdLayer } from '@/types';

export default function AdCanvas() {
  const { project, selectedLayerId, selectLayer } = useAdStore();

  if (!project) return null;

  const scale = Math.min(500 / project.width, 600 / project.height);

  return (
    <div className="flex justify-center">
      <div
        className="relative border border-surface-200 shadow-lg rounded-lg overflow-hidden"
        style={{
          width: project.width * scale,
          height: project.height * scale,
          backgroundColor: '#ffffff',
        }}
      >
        {[...project.layers]
          .sort((a, b) => a.order - b.order)
          .filter((l) => l.visible)
          .map((layer) => (
            <AdLayerRenderer
              key={layer.id}
              layer={layer}
              scale={scale}
              selected={layer.id === selectedLayerId}
              onSelect={() => selectLayer(layer.id)}
            />
          ))}
      </div>
    </div>
  );
}

function AdLayerRenderer({
  layer,
  scale,
  selected,
  onSelect,
}: {
  layer: AdLayer;
  scale: number;
  selected: boolean;
  onSelect: () => void;
}) {
  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    left: layer.x * scale,
    top: layer.y * scale,
    width: layer.width * scale,
    height: layer.height * scale,
    opacity: layer.opacity,
    transform: layer.rotation ? `rotate(${layer.rotation}deg)` : undefined,
    cursor: layer.locked ? 'default' : 'pointer',
    outline: selected ? '2px solid #2563eb' : undefined,
    outlineOffset: selected ? 1 : undefined,
    zIndex: layer.order + 1,
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!layer.locked) onSelect();
  };

  switch (layer.content.type) {
    case 'background': {
      const c = layer.content;
      return (
        <div
          style={{
            ...baseStyle,
            background: c.gradient || c.fill,
            zIndex: 0,
          }}
          onClick={handleClick}
        />
      );
    }

    case 'text': {
      const c = layer.content;
      return (
        <div
          style={{
            ...baseStyle,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: c.align === 'center' ? 'center' : c.align === 'right' ? 'flex-end' : 'flex-start',
            padding: 4 * scale,
          }}
          onClick={handleClick}
        >
          <span
            style={{
              fontFamily: c.fontFamily + ', sans-serif',
              fontSize: c.fontSize * scale,
              fontWeight: c.fontWeight,
              color: c.color,
              textAlign: c.align,
              lineHeight: c.lineHeight,
              letterSpacing: c.letterSpacing * scale,
              textTransform: c.textTransform,
              textShadow: c.shadow || undefined,
              WebkitTextStroke: c.stroke ? `${c.strokeWidth * scale}px ${c.stroke}` : undefined,
              whiteSpace: 'pre-wrap',
              width: '100%',
            }}
          >
            {c.text}
          </span>
        </div>
      );
    }

    case 'shape': {
      const c = layer.content;
      return (
        <div
          style={{
            ...baseStyle,
            background: c.fill,
            borderRadius: c.shape === 'circle' ? '50%' : c.borderRadius * scale,
            border: c.stroke ? `${c.strokeWidth * scale}px solid ${c.stroke}` : undefined,
          }}
          onClick={handleClick}
        />
      );
    }

    case 'image': {
      const c = layer.content;
      if (!c.src) {
        return (
          <div
            style={{
              ...baseStyle,
              background: '#e2e8f0',
              borderRadius: c.borderRadius * scale,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={handleClick}
          >
            <span style={{ fontSize: 12 * scale, color: '#94a3b8' }}>Image</span>
          </div>
        );
      }
      return (
        <img
          src={c.src}
          alt=""
          style={{
            ...baseStyle,
            objectFit: c.fit,
            borderRadius: c.borderRadius * scale,
            filter: c.filter || undefined,
          }}
          onClick={handleClick}
        />
      );
    }

    case 'logo': {
      const c = layer.content;
      if (!c.src) {
        return (
          <div
            style={{ ...baseStyle, background: '#f1f5f9', borderRadius: 8 * scale, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={handleClick}
          >
            <span style={{ fontSize: 10 * scale, color: '#94a3b8' }}>Logo</span>
          </div>
        );
      }
      return (
        <img src={c.src} alt="Logo" style={{ ...baseStyle, objectFit: 'contain' }} onClick={handleClick} />
      );
    }

    case 'cta-button': {
      const c = layer.content;
      return (
        <div style={{ ...baseStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={handleClick}>
          <div
            style={{
              background: c.bgColor,
              color: c.color,
              fontFamily: c.fontFamily + ', sans-serif',
              fontSize: c.fontSize * scale,
              fontWeight: c.fontWeight,
              borderRadius: c.borderRadius * scale,
              paddingLeft: c.paddingX * scale,
              paddingRight: c.paddingX * scale,
              paddingTop: c.paddingY * scale,
              paddingBottom: c.paddingY * scale,
              whiteSpace: 'nowrap',
            }}
          >
            {c.text}
          </div>
        </div>
      );
    }

    default:
      return null;
  }
}
