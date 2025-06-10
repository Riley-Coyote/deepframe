import React from 'react';
import { Tldraw } from '@tldraw/tldraw';
import type { Editor } from '@tldraw/editor';
import { CustomToolbar } from './CustomToolbar';
import { DeepFramePreviewShape } from './DeepFramePreviewShape';

export function TldrawWrapper() {
  const [editor, setEditor] = React.useState<Editor | null>(null);
  return (
    <div className="h-full relative">
      <Tldraw
        licenseKey={process.env.NEXT_PUBLIC_TLDRAW_LICENSE_KEY}
        hideUi
        onMount={setEditor}
      />
      {editor && (
        <div className="absolute top-0 left-0 right-0">
          <CustomToolbar editor={editor} />
        </div>
      )}
    </div>
  );
}
