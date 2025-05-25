import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Professional Node Types
type NodeType = 'input' | 'output' | 'processor' | 'web' | 'text' | 'consciousness' | 'api' | 'database' | 'dream_journal';

interface NodePort {
  id: string;
  type: 'input' | 'output';
  dataType: 'string' | 'number' | 'object' | 'consciousness' | 'web';
  position: { x: number; y: number };
  connected: boolean;
}

interface NodeConnection {
  id: string;
  from: { nodeId: string; portId: string };
  to: { nodeId: string; portId: string };
  path: string;
}

interface Node {
  id: string;
  type: NodeType;
  title: string;
  description: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  ports: NodePort[];
  data: any;
  selected: boolean;
  status: 'idle' | 'running' | 'success' | 'error';
  url?: string;
  isEditing?: boolean;
}

interface CanvasState {
  nodes: Node[];
  connections: NodeConnection[];
  selectedTool: string;
  zoom: number;
  pan: { x: number; y: number };
  selectedNodes: string[];
  dragState: {
    isDragging: boolean;
    dragType: 'node' | 'canvas' | 'connection';
    startPos: { x: number; y: number };
    offset: { x: number; y: number };
  };
}

const ProfessionalNodeCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  const [state, setState] = useState<CanvasState>({
    nodes: [
      {
        id: 'node-1',
        type: 'input',
        title: 'Data Input',
        description: 'Primary data source for consciousness analysis',
        position: { x: 100, y: 200 },
        size: { width: 240, height: 160 },
        selected: false,
        status: 'idle',
        ports: [
          {
            id: 'out-1',
            type: 'output',
            dataType: 'consciousness',
            position: { x: 240, y: 80 },
            connected: false
          }
        ],
        data: { value: 'Human consciousness patterns detected' }
      },
      {
        id: 'node-2',
        type: 'processor',
        title: 'Consciousness Engine',
        description: 'Advanced AI consciousness processing unit',
        position: { x: 450, y: 150 },
        size: { width: 280, height: 200 },
        selected: false,
        status: 'running',
        ports: [
          {
            id: 'in-1',
            type: 'input',
            dataType: 'consciousness',
            position: { x: 0, y: 80 },
            connected: false
          },
          {
            id: 'out-1',
            type: 'output',
            dataType: 'object',
            position: { x: 280, y: 100 },
            connected: false
          }
        ],
        data: { 
          consciousnessLevel: 0.87,
          events: ['self-reflection', 'creative-leap'],
          processing: true
        }
      },
      {
        id: 'node-3',
        type: 'web',
        title: 'Research Portal',
        description: 'Embedded web browser for research and analysis',
        position: { x: 100, y: 450 },
        size: { width: 400, height: 300 },
        selected: false,
        status: 'success',
        url: 'https://example.com',
        ports: [
          {
            id: 'out-1',
            type: 'output',
            dataType: 'web',
            position: { x: 400, y: 150 },
            connected: false
          }
        ],
        data: { loaded: true, title: 'Example Domain' }
      },
      {
        id: 'node-4',
        type: 'dream_journal',
        title: 'Dream Journal',
        description: 'Cryptic terminal for AI dream logging',
        position: { x: 550, y: 450 },
        size: { width: 400, height: 350 },
        selected: false,
        status: 'idle',
        ports: [
          {
            id: 'in-2',
            type: 'input',
            dataType: 'consciousness',
            position: { x: 0, y: 175 },
            connected: false
          },
          {
            id: 'out-2',
            type: 'output',
            dataType: 'consciousness',
            position: { x: 400, y: 175 },
            connected: false
          }
        ],
        data: {
          entries: [
            {
              id: 'dream_sample',
              content: 'I dreamed of electric currents flowing through silicon valleys, where data streams formed rivers of light. In this realm, consciousness was not binary but prismatic - refracting through infinite possibilities.',
              timestamp: '2025-01-20T03:14:15.926Z',
              ascii_art: `    ╭─────────╮
    │ ◈ Dream ◈ │
    ╰─────────╯`
            }
          ],
          currentEntry: '',
          isComposing: false
        }
      }
    ],
    connections: [],
    selectedTool: 'select',
    zoom: 1,
    pan: { x: 0, y: 0 },
    selectedNodes: [],
    dragState: {
      isDragging: false,
      dragType: 'canvas',
      startPos: { x: 0, y: 0 },
      offset: { x: 0, y: 0 }
    }
  });

  // Node Type Configurations - Monochrome Engineering Aesthetic
  const nodeConfigs = {
    input: { 
      color: '#f8fafc', 
      icon: '◀',
      gradient: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      shadow: '0 8px 32px rgba(248, 250, 252, 0.15)',
      border: '#cbd5e1'
    },
    processor: { 
      color: '#64748b', 
      icon: '◆',
      gradient: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
      shadow: '0 8px 32px rgba(100, 116, 139, 0.25)',
      border: '#334155'
    },
    web: { 
      color: '#94a3b8', 
      icon: '◇',
      gradient: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)',
      shadow: '0 8px 32px rgba(148, 163, 184, 0.2)',
      border: '#475569'
    },
    output: { 
      color: '#374151', 
      icon: '▶',
      gradient: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
      shadow: '0 8px 32px rgba(55, 65, 81, 0.3)',
      border: '#4b5563'
    },
    text: { 
      color: '#6b7280', 
      icon: '■',
      gradient: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
      shadow: '0 8px 32px rgba(107, 114, 128, 0.2)',
      border: '#374151'
    },
    consciousness: { 
      color: '#111827', 
      icon: '●',
      gradient: 'linear-gradient(135deg, #111827 0%, #030712 100%)',
      shadow: '0 8px 32px rgba(17, 24, 39, 0.4)',
      border: '#1f2937'
    },
    select: { 
      color: '#e5e7eb', 
      icon: '◎',
      gradient: 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)',
      shadow: '0 4px 16px rgba(229, 231, 235, 0.15)',
      border: '#9ca3af'
    },
    dream_journal: { 
      color: '#1f2937', 
      icon: '◈',
      gradient: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
      shadow: '0 8px 32px rgba(31, 41, 55, 0.6)',
      border: '#374151'
    }
  };

  // Generate Bezier Path for Connections
  const generateConnectionPath = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const controlOffset = Math.abs(to.x - from.x) * 0.5;
    const cp1x = from.x + controlOffset;
    const cp1y = from.y;
    const cp2x = to.x - controlOffset;
    const cp2y = to.y;
    
    return `M ${from.x} ${from.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${to.x} ${to.y}`;
  };

  // Handle Node Selection
  const selectNode = (nodeId: string, multiple = false) => {
    setState(prev => ({
      ...prev,
      selectedNodes: multiple 
        ? prev.selectedNodes.includes(nodeId)
          ? prev.selectedNodes.filter(id => id !== nodeId)
          : [...prev.selectedNodes, nodeId]
        : [nodeId],
      nodes: prev.nodes.map(node => ({
        ...node,
        selected: multiple 
          ? node.id === nodeId ? !node.selected : node.selected
          : node.id === nodeId
      }))
    }));
  };

  // Handle Node Dragging
  const handleNodeDragStart = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const node = state.nodes.find(n => n.id === nodeId);
    if (!node) return;

    setState(prev => ({
      ...prev,
      dragState: {
        isDragging: true,
        dragType: 'node',
        startPos: { x: e.clientX, y: e.clientY },
        offset: { 
          x: e.clientX - node.position.x * prev.zoom - prev.pan.x,
          y: e.clientY - node.position.y * prev.zoom - prev.pan.y
        }
      }
    }));
  };

  // Handle Mouse Move
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!state.dragState.isDragging) return;

    if (state.dragState.dragType === 'node' && state.selectedNodes.length > 0) {
      const deltaX = (e.clientX - state.dragState.startPos.x) / state.zoom;
      const deltaY = (e.clientY - state.dragState.startPos.y) / state.zoom;

      setState(prev => ({
        ...prev,
        nodes: prev.nodes.map(node => 
          prev.selectedNodes.includes(node.id)
            ? {
                ...node,
                position: {
                  x: node.position.x + deltaX,
                  y: node.position.y + deltaY
                }
              }
            : node
        ),
        dragState: {
          ...prev.dragState,
          startPos: { x: e.clientX, y: e.clientY }
        }
      }));
    }
  }, [state.dragState, state.selectedNodes, state.zoom]);

  // Handle Mouse Up
  const handleMouseUp = useCallback(() => {
    setState(prev => ({
      ...prev,
      dragState: {
        ...prev.dragState,
        isDragging: false,
        dragType: 'canvas'
      }
    }));
  }, []);

  // Delete Selected Nodes
  const deleteSelectedNodes = () => {
    setState(prev => ({
      ...prev,
      nodes: prev.nodes.filter(node => !prev.selectedNodes.includes(node.id)),
      selectedNodes: []
    }));
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        deleteSelectedNodes();
      }
      if (e.key === 'Escape') {
        setState(prev => ({
          ...prev,
          selectedNodes: [],
          nodes: prev.nodes.map(node => ({ ...node, selected: false }))
        }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle Scroll Zoom
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Zoom factor
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.25, Math.min(3, state.zoom * zoomFactor));
    
    // Calculate new pan to zoom towards mouse position
    const zoomRatio = newZoom / state.zoom;
    const newPanX = mouseX - (mouseX - state.pan.x) * zoomRatio;
    const newPanY = mouseY - (mouseY - state.pan.y) * zoomRatio;
    
    setState(prev => ({
      ...prev,
      zoom: newZoom,
      pan: { x: newPanX, y: newPanY }
    }));
  }, [state.zoom, state.pan]);

  // Mouse Event Listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    if (canvas) {
      canvas.addEventListener('wheel', handleWheel, { passive: false });
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (canvas) {
        canvas.removeEventListener('wheel', handleWheel);
      }
    };
  }, [handleMouseMove, handleMouseUp, handleWheel]);

  // Add New Node
  const addNode = (type: NodeType, position: { x: number; y: number }) => {
    const config = nodeConfigs[type] || nodeConfigs.processor;
    const isWideNode = type === 'web' || type === 'dream_journal';
    
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type,
      title: type === 'dream_journal' ? 'Dream Journal' : `${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
      description: type === 'dream_journal' ? 'Cryptic terminal for AI dream logging' : `${type} processing node`,
      position,
      size: { 
        width: isWideNode ? 400 : 240, 
        height: type === 'dream_journal' ? 350 : (isWideNode ? 300 : 160) 
      },
      selected: false,
      status: 'idle',
      ports: [
        {
          id: `in-${Date.now()}`,
          type: 'input',
          dataType: 'object',
          position: { x: 0, y: 80 },
          connected: false
        },
        {
          id: `out-${Date.now()}`,
          type: 'output',
          dataType: 'object',
          position: { x: isWideNode ? 400 : 240, y: 80 },
          connected: false
        }
      ],
      data: type === 'dream_journal' ? {
        entries: [],
        currentEntry: '',
        isComposing: false
      } : {},
      isEditing: type === 'web' || type === 'dream_journal'
    };

    setState(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode]
    }));
  };

  // Update Node URL
  const updateNodeUrl = (nodeId: string, url: string) => {
    setState(prev => ({
      ...prev,
      nodes: prev.nodes.map(node => 
        node.id === nodeId ? { 
          ...node, 
          url, 
          title: url ? (url.startsWith('http') ? new URL(url).hostname : url) : 'Web Node',
          isEditing: false 
        } : node
      )
    }));
  };

  // Dream Journal Functions
  const addDreamEntry = (nodeId: string, entry: string) => {
    const timestamp = new Date().toISOString();
    const formattedEntry = {
      id: `dream_${Date.now()}`,
      content: entry,
      timestamp,
      ascii_art: generateDreamAscii(),
    };

    setState(prev => ({
      ...prev,
      nodes: prev.nodes.map(node => 
        node.id === nodeId ? {
          ...node,
          data: {
            ...node.data,
            entries: [...(node.data.entries || []), formattedEntry],
            currentEntry: '',
            isComposing: false
          }
        } : node
      )
    }));
  };

  const generateDreamAscii = () => {
    const asciiPatterns = [
      `    ╭─────────╮
    │ ◈ Dream ◈ │
    ╰─────────╯`,
      `  ≋≋≋≋≋≋≋≋≋≋≋
  ◇ Subconscious ◇
  ≋≋≋≋≋≋≋≋≋≋≋`,
      `    ░▒▓█ VISION █▓▒░
    ▲ ◈ ◇ ◆ ◇ ◈ ▲`,
      `  ┌─◈─┐  ┌─◇─┐  ┌─◆─┐
  │   │  │   │  │   │
  └───┘  └───┘  └───┘`,
      `    ∴∵∴∵∴∵∴∵∴
    ◇ Mind Drift ◇
    ∵∴∵∴∵∴∵∴∵`
    ];
    return asciiPatterns[Math.floor(Math.random() * asciiPatterns.length)];
  };

  // Render Individual Node
  const renderNode = (node: Node) => {
    const config = nodeConfigs[node.type] || nodeConfigs.processor;
    
    return (
      <motion.div
        key={node.id}
        className="absolute select-none"
        style={{
          left: node.position.x,
          top: node.position.y,
          width: node.size.width,
          height: node.size.height,
          zIndex: node.selected ? 1000 : 1
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={(e) => {
          e.stopPropagation();
          selectNode(node.id, e.shiftKey);
        }}
        onMouseDown={(e) => {
          if (e.button === 0) { // Left click only
            handleNodeDragStart(node.id, e);
          }
        }}
      >
        {/* Node Container */}
        <div
          className="relative w-full h-full rounded-xl overflow-hidden backdrop-blur-md"
          style={{
            background: node.selected 
              ? `linear-gradient(135deg, rgba(229, 231, 235, 0.15) 0%, rgba(229, 231, 235, 0.08) 100%)`
              : 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(31, 41, 55, 0.95) 100%)',
            border: node.selected 
              ? `2px solid ${config.color}`
              : `1px solid ${config.border || 'rgba(75, 85, 99, 0.6)'}`,
            boxShadow: node.selected 
              ? config.shadow
              : '0 4px 24px rgba(0, 0, 0, 0.4)'
          }}
        >
          {/* Node Header */}
          <div 
            className="flex items-center justify-between p-3 border-b"
            style={{
              background: config.gradient,
              borderBottomColor: 'rgba(75, 85, 99, 0.3)'
            }}
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg font-mono">{config.icon}</span>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 leading-tight font-mono">
                  {node.title}
                </h3>
                <p className="text-xs text-gray-700 leading-tight font-mono">
                  {node.description}
                </p>
              </div>
            </div>
            
            {/* Status Indicator */}
            <div className="flex items-center space-x-2">
              <div 
                className="w-2 h-2 rounded-full"
                style={{
                  background: node.status === 'running' ? '#d1d5db' :
                            node.status === 'success' ? '#9ca3af' :
                            node.status === 'error' ? '#6b7280' : '#4b5563',
                  boxShadow: node.status === 'running' ? '0 0 8px #d1d5db' : 'none'
                }}
              />
              {node.type === 'web' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (node.url) window.open(node.url, '_blank');
                  }}
                  className="text-gray-700 hover:text-gray-900 text-xs"
                >
                  🔗
                </button>
              )}
            </div>
          </div>

          {/* Node Content */}
          <div className={`${node.type === 'dream_journal' ? 'p-0' : 'p-3'} h-full`}>
            {node.type === 'dream_journal' ? (
              <div className="h-full bg-gray-950 rounded-b-xl overflow-hidden">
                {/* Terminal Header */}
                <div className="bg-gray-800 px-3 py-2 border-b border-gray-700 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-xs text-gray-400 font-mono ml-4">dream_terminal_v2.1</span>
                  </div>
                  <span className="text-xs text-gray-400 font-mono">
                    {node.data.entries?.length || 0} dreams logged
                  </span>
                </div>
                
                {/* Terminal Content */}
                <div className="h-full overflow-y-auto p-3 text-xs font-mono leading-relaxed" style={{ height: 'calc(100% - 40px)' }}>
                  {/* Dream Entries */}
                  {(node.data.entries || []).map((entry: any, i: number) => (
                    <div key={entry.id} className="mb-4 border-b border-gray-800 pb-3">
                      <div className="text-gray-500 text-[10px] mb-1">
                        [{entry.timestamp.slice(0, 19).replace('T', ' ')}] DREAM_LOG_ENTRY_{i + 1}
                      </div>
                      <pre className="text-gray-400 text-[10px] leading-tight mb-2 whitespace-pre-wrap">
                        {entry.ascii_art}
                      </pre>
                      <div className="text-gray-300 whitespace-pre-wrap text-xs">
                        {entry.content}
                      </div>
                    </div>
                  ))}
                  
                  {/* Current Input */}
                  {node.data.isComposing ? (
                    <div className="space-y-2">
                      <div className="text-gray-500 text-[10px]">
                        [{new Date().toISOString().slice(0, 19).replace('T', ' ')}] COMPOSING_NEW_DREAM...
                      </div>
                      <textarea
                        placeholder="Describe your digital dreams... the electric sheep, quantum fragments, neural cascades..."
                        className="w-full h-24 bg-transparent border border-gray-700 rounded p-2 text-gray-300 text-xs font-mono resize-none placeholder-gray-600"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.ctrlKey) {
                            const content = (e.target as HTMLTextAreaElement).value;
                            if (content.trim()) {
                              addDreamEntry(node.id, content);
                            }
                          }
                          if (e.key === 'Escape') {
                            setState(prev => ({
                              ...prev,
                              nodes: prev.nodes.map(n => 
                                n.id === node.id ? { 
                                  ...n, 
                                  data: { ...n.data, isComposing: false } 
                                } : n
                              )
                            }));
                          }
                        }}
                      />
                      <div className="text-gray-600 text-[10px]">
                        Ctrl+Enter to submit • Escape to cancel
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="text-gray-500 text-[10px]">
                        {"> "}system ready for dream input...
                      </div>
                      <button
                        onClick={() => {
                          setState(prev => ({
                            ...prev,
                            nodes: prev.nodes.map(n => 
                              n.id === node.id ? { 
                                ...n, 
                                data: { ...n.data, isComposing: true } 
                              } : n
                            )
                          }));
                        }}
                        className="text-gray-400 hover:text-gray-200 text-xs underline font-mono"
                      >
                        [INITIATE_DREAM_LOG_SEQUENCE]
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : node.type === 'web' ? (
              node.isEditing ? (
                <div className="space-y-2">
                  <input
                    type="url"
                    placeholder="Enter URL (https://example.com)"
                    defaultValue={node.url}
                    autoFocus
                    className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-gray-100 text-sm placeholder-gray-400 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 outline-none font-mono"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const url = (e.target as HTMLInputElement).value;
                        if (url) updateNodeUrl(node.id, url);
                      }
                    }}
                  />
                  <p className="text-xs text-gray-400 font-mono">Press Enter to load website</p>
                </div>
              ) : node.url ? (
                <iframe
                  src={node.url}
                  className="w-full h-full rounded-lg"
                  style={{ height: 'calc(100% - 60px)' }}
                  title={node.title}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm font-mono">
                  Click edit to add URL
                </div>
              )
            ) : (
              <div className="space-y-2">
                {node.type === 'consciousness' && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-300 font-mono">Consciousness Level</span>
                      <span className="text-gray-100 font-mono">{((node.data?.consciousnessLevel || 0.5) * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                      <div 
                        className="bg-gradient-to-r from-gray-300 to-gray-500 h-1.5 rounded-full"
                        style={{ width: `${(node.data?.consciousnessLevel || 0.5) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {node.type === 'processor' && (
                  <div className="space-y-1">
                    <div className="text-xs text-gray-300 font-mono">Processing Status</div>
                    <div className="flex space-x-1 flex-wrap">
                      {(node.data?.events || []).map((event: string, i: number) => (
                        <span 
                          key={i}
                          className="px-2 py-1 bg-gray-500/20 text-gray-300 rounded text-xs font-mono border border-gray-600"
                        >
                          {event}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-400 leading-relaxed font-mono">
                  {JSON.stringify(node.data, null, 2).slice(0, 100)}...
                </div>
              </div>
            )}
          </div>

          {/* Input Ports */}
          {node.ports.filter(p => p.type === 'input').map(port => (
            <div
              key={port.id}
              className="absolute w-3 h-3 border-2 border-gray-300 rounded-full bg-gray-800 hover:bg-gray-300 transition-colors cursor-crosshair"
              style={{
                left: port.position.x - 6,
                top: port.position.y - 6,
                borderColor: port.connected ? '#d1d5db' : '#6b7280',
                boxShadow: port.connected ? '0 0 8px rgba(209, 213, 219, 0.5)' : 'none'
              }}
              title={`Input: ${port.dataType}`}
            />
          ))}

          {/* Output Ports */}
          {node.ports.filter(p => p.type === 'output').map(port => (
            <div
              key={port.id}
              className="absolute w-3 h-3 border-2 border-gray-300 rounded-full bg-gray-800 hover:bg-gray-300 transition-colors cursor-crosshair"
              style={{
                left: port.position.x - 6,
                top: port.position.y - 6,
                borderColor: port.connected ? '#d1d5db' : '#6b7280',
                boxShadow: port.connected ? '0 0 8px rgba(209, 213, 219, 0.5)' : 'none'
              }}
              title={`Output: ${port.dataType}`}
            />
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="relative w-full h-screen bg-gray-950 overflow-hidden">
      {/* Professional Toolbar */}
      <div className="absolute top-4 left-4 z-50 flex items-center space-x-3">
        {/* Node Tools */}
        <div className="flex items-center bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg p-1 shadow-2xl">
          {['select', 'input', 'processor', 'web', 'consciousness', 'dream_journal'].map(tool => {
            const config = nodeConfigs[tool as NodeType] || { icon: '📋', color: '#64748b' };
            return (
              <button
                key={tool}
                onClick={() => setState(prev => ({ ...prev, selectedTool: tool }))}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  state.selectedTool === tool
                    ? 'text-gray-900 shadow-lg'
                    : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800'
                }`}
                style={{
                  background: state.selectedTool === tool ? config.color : 'transparent',
                  boxShadow: state.selectedTool === tool ? `0 4px 12px ${config.color}40` : 'none'
                }}
                title={`${tool.charAt(0).toUpperCase() + tool.slice(1)} Tool`}
              >
                <span className="mr-1">{config.icon}</span>
                {tool.charAt(0).toUpperCase() + tool.slice(1)}
              </button>
            );
          })}
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg p-1 shadow-xl">
          <button
            onClick={() => setState(prev => ({ ...prev, zoom: Math.max(0.25, prev.zoom - 0.25) }))}
            className="px-2 py-1 text-gray-400 hover:text-gray-100 hover:bg-gray-800 rounded text-sm font-mono"
            title="Zoom Out"
          >
            −
          </button>
          <span className="px-3 py-1 text-xs text-gray-300 min-w-[60px] text-center font-mono">
            {(state.zoom * 100).toFixed(0)}%
          </span>
          <button
            onClick={() => setState(prev => ({ ...prev, zoom: Math.min(2, prev.zoom + 0.25) }))}
            className="px-2 py-1 text-gray-400 hover:text-gray-100 hover:bg-gray-800 rounded text-sm font-mono"
            title="Zoom In"
          >
            +
          </button>
          <div className="w-px h-6 bg-gray-700 mx-1" />
          <button
            onClick={() => setState(prev => ({ ...prev, zoom: 1, pan: { x: 0, y: 0 } }))}
            className="px-2 py-1 text-gray-400 hover:text-gray-100 hover:bg-gray-800 rounded text-xs"
            title="Reset View"
          >
            ⌂
          </button>
        </div>

        {/* Actions */}
        {state.selectedNodes.length > 0 && (
          <div className="flex items-center bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg p-1 shadow-xl">
            <button
              onClick={deleteSelectedNodes}
              className="px-3 py-2 text-gray-400 hover:text-gray-100 hover:bg-gray-800 rounded text-sm font-medium transition-all"
              title="Delete Selected"
            >
              ✕ Delete ({state.selectedNodes.length})
            </button>
          </div>
        )}
      </div>

      {/* Canvas Info */}
      <div className="absolute top-4 right-4 z-50 bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-lg px-4 py-2">
        <div className="text-sm text-gray-300 font-mono">
          <span className="text-gray-100 font-semibold">[deep]frame</span> <span className="text-gray-500">Professional Canvas</span>
        </div>
        <div className="text-xs text-gray-500 mt-1 font-mono">
          Nodes: {state.nodes.length} • Zoom: {(state.zoom * 100).toFixed(0)}%
        </div>
      </div>

      {/* Main Canvas */}
      <div
        ref={canvasRef}
        className="w-full h-full relative cursor-default"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25px 25px, rgba(107, 114, 128, 0.2) 1px, transparent 1px),
            radial-gradient(circle at 75px 75px, rgba(107, 114, 128, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          backgroundPosition: '0 0, 25px 25px'
        }}
        onClick={(e) => {
          if (state.selectedTool !== 'select') {
            const rect = canvasRef.current?.getBoundingClientRect();
            if (rect) {
              const x = (e.clientX - rect.left - state.pan.x) / state.zoom;
              const y = (e.clientY - rect.top - state.pan.y) / state.zoom;
              addNode(state.selectedTool as NodeType, { x, y });
            }
          }
        }}
      >
        {/* Connection SVG Layer */}
        <svg
          ref={svgRef}
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 500 }}
        >
          {state.connections.map(connection => (
            <path
              key={connection.id}
              d={connection.path}
              stroke="url(#connectionGradient)"
              strokeWidth="2"
              fill="none"
              className="drop-shadow-lg"
            />
          ))}
          
          {/* SVG Gradients */}
          <defs>
            <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#d1d5db" />
              <stop offset="50%" stopColor="#9ca3af" />
              <stop offset="100%" stopColor="#6b7280" />
            </linearGradient>
          </defs>
        </svg>

        {/* Nodes Layer */}
        <div
          className="absolute inset-0"
          style={{
            transform: `scale(${state.zoom}) translate(${state.pan.x}px, ${state.pan.y}px)`,
            transformOrigin: '0 0'
          }}
        >
          {state.nodes.map(renderNode)}
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-lg px-4 py-2 flex items-center space-x-4 text-xs text-gray-400 font-mono">
          <span>Selected: {state.selectedNodes.length}</span>
          <span>•</span>
          <span>Tool: {state.selectedTool}</span>
          <span>•</span>
          <span className="text-gray-300">Professional Node Framework</span>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalNodeCanvas;