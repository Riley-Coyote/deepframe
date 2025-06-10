import React from 'react';
import type { TLShape } from '@tldraw/editor';

export function DeepFramePreviewShape({ shape, meta }: { shape: any; meta: { bounds: { x: number; y: number; width: number; height: number } } }) {
  const html = shape.props.html;
  return (
    <div
      className="df-iframe-container"
      style={{
        position: 'absolute',
        top: meta.bounds.y,
        left: meta.bounds.x,
        width: meta.bounds.width,
        height: meta.bounds.height,
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      }}
    >
      <iframe srcDoc={html} style={{ width: '100%', height: '100%', border: 'none' }} />
    </div>
  );
}
