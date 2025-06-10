import React from 'react';
import type { Editor } from '@tldraw/editor';
import { makeReal } from '../utils/makeReal';

export function CustomToolbar({ editor }: { editor: Editor }) {
  return (
    <div className="df-toolbar p-2 bg-white shadow flex space-x-2">
      <button
        onClick={() => makeReal(editor)}
        className="px-4 py-2 bg-[var(--accent)] text-white rounded shadow hover:opacity-90"
      >
        Make Real ⚡
      </button>
    </div>
  );
}
