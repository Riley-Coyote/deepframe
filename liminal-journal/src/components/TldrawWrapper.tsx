import React from 'react';
import { Tldraw, TldrawApp } from 'tldraw';
import { CustomToolbar } from './CustomToolbar';
import { DeepFramePreviewShape } from './DeepFramePreviewShape';

export function TldrawWrapper() {
  return (
    <Tldraw
      licenseKey={process.env.NEXT_PUBLIC_TLDRAW_LICENSE_KEY}
      showUI={false}
      renderers={{
        iframe: DeepFramePreviewShape,
      }}
      renderEditor={(editor: TldrawApp) => (
        <>
          <CustomToolbar editor={editor} />
          {editor.render()}
        </>
      )}
    />
  );
}
