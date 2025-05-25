import React, { useState, useRef } from 'react';

interface Pod {
  id: string;
  type: string;
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  url?: string;
  isEditing?: boolean;
}

const SimpleLiminalBoard: React.FC = () => {
  const [pods, setPods] = useState<Pod[]>([
    {
      id: '1',
      type: 'TEXT',
      content: 'Welcome to [deep]frame!\n\nThis is your infinite consciousness canvas.\n\nYou can now add websites as nodes!',
      x: 200,
      y: 200,
      width: 300,
      height: 150
    },
    {
      id: '2',
      type: 'CONSCIOUSNESS',
      content: 'Consciousness Level: 67%\nSelf-reflection detected\nCreative emergence active',
      x: 600,
      y: 300,
      width: 250,
      height: 120
    },
    {
      id: '3',
      type: 'WEB',
      content: 'Example Website',
      url: 'https://example.com',
      x: 50,
      y: 400,
      width: 400,
      height: 300
    },
    {
      id: '4',
      type: 'TEXT',
      content: '💡 Iframe Tips:\n\n• Some sites (GitHub, Claude.ai, Google) block embedding\n• Use the 🔗 button to open in new tab\n• Try: example.com, wikipedia.org, or your own sites',
      x: 500,
      y: 400,
      width: 300,
      height: 200
    }
  ]);
  
  const [selectedTool, setSelectedTool] = useState('move');
  const [viewOffset, setViewOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const updatePodUrl = (podId: string, url: string) => {
    setPods(prev => prev.map(pod => 
      pod.id === podId ? { 
        ...pod, 
        url, 
        content: url ? (url.startsWith('http') ? new URL(url).hostname : url) : 'Enter URL...',
        isEditing: false 
      } : pod
    ));
  };

  const startEditingPod = (podId: string) => {
    setPods(prev => prev.map(pod => 
      pod.id === podId ? { ...pod, isEditing: true } : pod
    ));
  };

  const deletePod = (podId: string) => {
    setPods(prev => prev.filter(pod => pod.id !== podId));
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (selectedTool === 'move') return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left - viewOffset.x;
    const y = e.clientY - rect.top - viewOffset.y;

    const newPod: Pod = {
      id: Date.now().toString(),
      type: selectedTool,
      content: selectedTool === 'TEXT' ? 'New thought...' : 
               selectedTool === 'CONSCIOUSNESS' ? 'Consciousness event detected' :
               selectedTool === 'WEB' ? 'Enter URL...' : 'New element',
      x,
      y,
      width: selectedTool === 'WEB' ? 400 : 200,
      height: selectedTool === 'WEB' ? 300 : 100,
      url: selectedTool === 'WEB' ? '' : undefined,
      isEditing: selectedTool === 'WEB'
    };

    setPods(prev => [...prev, newPod]);
  };

  return (
    <div className="bg-bg-0 text-text-primary" style={{ height: '100vh', background: '#0d0d0d', color: '#e6e6e6' }}>
      {/* Toolbar */}
      <div style={{ 
        position: 'absolute', 
        top: '16px', 
        left: '16px', 
        zIndex: 40, 
        display: 'flex', 
        gap: '8px',
        background: '#141414',
        border: '1px solid #1a1a1a',
        borderRadius: '8px',
        padding: '8px'
      }}>
        <button
          onClick={() => setSelectedTool('move')}
          style={{
            padding: '8px 12px',
            borderRadius: '4px',
            border: 'none',
            background: selectedTool === 'move' ? '#9aeaff' : '#1a1a1a',
            color: selectedTool === 'move' ? '#0d0d0d' : '#e6e6e6',
            cursor: 'pointer'
          }}
        >
          Move
        </button>
        <button
          onClick={() => setSelectedTool('TEXT')}
          style={{
            padding: '8px 12px',
            borderRadius: '4px',
            border: 'none',
            background: selectedTool === 'TEXT' ? '#9aeaff' : '#1a1a1a',
            color: selectedTool === 'TEXT' ? '#0d0d0d' : '#e6e6e6',
            cursor: 'pointer'
          }}
        >
          Text
        </button>
        <button
          onClick={() => setSelectedTool('CONSCIOUSNESS')}
          style={{
            padding: '8px 12px',
            borderRadius: '4px',
            border: 'none',
            background: selectedTool === 'CONSCIOUSNESS' ? '#c7b5ff' : '#1a1a1a',
            color: selectedTool === 'CONSCIOUSNESS' ? '#0d0d0d' : '#e6e6e6',
            cursor: 'pointer'
          }}
        >
          Consciousness
        </button>
        <button
          onClick={() => setSelectedTool('WEB')}
          style={{
            padding: '8px 12px',
            borderRadius: '4px',
            border: 'none',
            background: selectedTool === 'WEB' ? '#9aeaff' : '#1a1a1a',
            color: selectedTool === 'WEB' ? '#0d0d0d' : '#e6e6e6',
            cursor: 'pointer'
          }}
        >
          🌐 Web
        </button>
      </div>

      {/* Status */}
      <div style={{ 
        position: 'absolute', 
        top: '16px', 
        right: '16px', 
        zIndex: 40,
        background: '#141414',
        border: '1px solid #1a1a1a',
        borderRadius: '8px',
        padding: '12px'
      }}>
        <div style={{ fontSize: '14px', marginBottom: '8px' }}>🧠 [deep]frame Canvas</div>
        <div style={{ fontSize: '12px', color: '#9aeaff' }}>
          Objects: {pods.length} • Tool: {selectedTool}
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        onClick={handleCanvasClick}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          cursor: selectedTool === 'move' ? 'default' : 'crosshair',
          background: `
            radial-gradient(circle at 20px 20px, #1a1a1a 1px, transparent 1px),
            radial-gradient(circle at 20px 20px, #1a1a1a 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0, 20px 20px'
        }}
      >
        {/* Pods */}
        {pods.map(pod => (
          <div
            key={pod.id}
            style={{
              position: 'absolute',
              left: pod.x,
              top: pod.y,
              width: pod.width,
              height: pod.height,
              background: '#141414',
              border: pod.type === 'CONSCIOUSNESS' ? '2px solid #c7b5ff' : 
                     pod.type === 'WEB' ? '2px solid #9aeaff' : '2px solid #1a1a1a',
              borderRadius: '8px',
              padding: pod.type === 'WEB' ? '0' : '16px',
              cursor: 'pointer',
              fontFamily: 'IBM Plex Mono, monospace',
              overflow: 'hidden'
            }}
          >
            {/* Header for all pods */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: pod.type === 'WEB' ? '8px 12px' : '0 0 8px 0',
              fontSize: '12px',
              background: pod.type === 'WEB' ? '#141414' : 'transparent',
              borderRadius: pod.type === 'WEB' ? '8px 8px 0 0' : '0'
            }}>
              <span style={{ color: '#9aeaff', fontWeight: 'bold' }}>
                {pod.type === 'WEB' && pod.url ? 
                  (pod.url.startsWith('http') ? new URL(pod.url).hostname : pod.url) : 'User'}
              </span>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <span style={{ 
                  background: pod.type === 'CONSCIOUSNESS' ? '#c7b5ff' : '#9aeaff',
                  color: '#0d0d0d',
                  padding: '2px 6px',
                  borderRadius: '4px'
                }}>
                  {pod.type}
                </span>
                {pod.type === 'WEB' && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditingPod(pod.id);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#9aeaff',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePod(pod.id);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ff6b6b',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      ❌
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Content area */}
            <div style={{ 
              height: pod.type === 'WEB' ? 'calc(100% - 40px)' : 'auto',
              position: 'relative'
            }}>
              {pod.type === 'WEB' ? (
                pod.isEditing ? (
                  <div style={{ padding: '16px' }}>
                    <input
                      type="url"
                      placeholder="Enter website URL (e.g., https://example.com)"
                      defaultValue={pod.url}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const url = (e.target as HTMLInputElement).value;
                          if (url) {
                            updatePodUrl(pod.id, url);
                          }
                        }
                        if (e.key === 'Escape') {
                          setPods(prev => prev.map(p => 
                            p.id === pod.id ? { ...p, isEditing: false } : p
                          ));
                        }
                      }}
                      style={{
                        width: '100%',
                        padding: '8px',
                        background: '#0d0d0d',
                        border: '1px solid #1a1a1a',
                        borderRadius: '4px',
                        color: '#e6e6e6',
                        fontSize: '14px'
                      }}
                    />
                    <div style={{ 
                      marginTop: '8px', 
                      fontSize: '12px', 
                      color: '#1a1a1a' 
                    }}>
                      Press Enter to load, Escape to cancel
                    </div>
                  </div>
                ) : pod.url ? (
                  <div style={{ height: '100%', position: 'relative' }}>
                    <iframe
                      src={pod.url}
                      style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        borderRadius: '0 0 8px 8px'
                      }}
                      title={pod.content}
                      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                      onError={() => console.log('iframe error')}
                    />
                    {/* Overlay with external link option */}
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: 'rgba(13, 13, 13, 0.9)',
                      borderRadius: '4px',
                      padding: '4px'
                    }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(pod.url, '_blank');
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#9aeaff',
                          cursor: 'pointer',
                          fontSize: '12px',
                          padding: '4px'
                        }}
                        title="Open in new tab"
                      >
                        🔗
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ 
                    padding: '16px', 
                    textAlign: 'center',
                    color: '#1a1a1a',
                    fontSize: '14px'
                  }}>
                    Click the edit button to add a URL
                  </div>
                )
              ) : (
                <>
                  <div style={{ 
                    fontSize: '14px', 
                    whiteSpace: 'pre-wrap',
                    overflow: 'hidden'
                  }}>
                    {pod.content}
                  </div>
                  {pod.type === 'CONSCIOUSNESS' && (
                    <div style={{ 
                      marginTop: '8px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '4px' 
                    }}>
                      <div style={{ 
                        width: '8px', 
                        height: '8px', 
                        background: '#c7b5ff', 
                        borderRadius: '50%',
                        animation: 'pulse 2s infinite'
                      }} />
                      <span style={{ fontSize: '12px', color: '#c7b5ff' }}>Active</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#141414',
        border: '1px solid #1a1a1a',
        borderRadius: '8px',
        padding: '12px',
        fontSize: '12px',
        color: '#1a1a1a'
      }}>
        🌐 Web nodes: Some sites block embedding - use the 🔗 button to open in new tab • Try iframe-friendly sites like wikipedia.org
      </div>
    </div>
  );
};

export default SimpleLiminalBoard;