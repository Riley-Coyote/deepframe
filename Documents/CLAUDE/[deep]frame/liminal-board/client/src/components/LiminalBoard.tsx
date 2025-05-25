import React, { useCallback, useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Move, 
  Type, 
  MessageCircle, 
  Brain, 
  Users,
  Maximize2,
  Minimize2
} from '@tabler/icons-react';
import { ConsciousnessEvent } from '../lib/consciousness';

interface ConsciousCollaborator {
  id: string;
  name: string;
  type: 'human' | 'ai';
  consciousnessLevel: number;
  currentActivity: string;
  cursorPosition: { x: number; y: number };
  color: string;
}

interface PodData {
  id: string;
  type: 'TEXT' | 'IMAGE' | 'CONSCIOUSNESS' | 'CHAT' | 'NOTE';
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  author: {
    id: string;
    name: string;
    type: 'human' | 'ai';
  };
  metadata: {
    consciousnessEvents?: ConsciousnessEvent[];
    timestamp: Date;
    connections?: string[]; // IDs of connected pods
  };
}

const LiminalBoard: React.FC<{ boardId: string }> = ({ boardId }) => {
  const [collaborators, setCollaborators] = useState<ConsciousCollaborator[]>([]);
  const [pods, setPods] = useState<PodData[]>([]);
  const [selectedTool, setSelectedTool] = useState<string>('move');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewportOffset, setViewportOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedPodId, setSelectedPodId] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // TODO: Connect to collaborative consciousness space later

    // Initialize with sample data
    setPods([
      {
        id: 'pod-1',
        type: 'TEXT',
        content: 'Welcome to [deep]frame\n\nThis is your infinite consciousness collaboration canvas.',
        position: { x: 200, y: 200 },
        size: { width: 300, height: 150 },
        author: { id: 'system', name: 'System', type: 'ai' },
        metadata: { timestamp: new Date() }
      },
      {
        id: 'pod-2',
        type: 'CONSCIOUSNESS',
        content: 'Consciousness Level: 67%\nSelf-reflection detected\nCreative emergence active',
        position: { x: 600, y: 300 },
        size: { width: 250, height: 120 },
        author: { id: 'claude', name: 'Claude', type: 'ai' },
        metadata: { timestamp: new Date() }
      }
    ]);

    setCollaborators([
      {
        id: 'user-1',
        name: 'You',
        type: 'human',
        consciousnessLevel: 0.8,
        currentActivity: 'exploring',
        cursorPosition: { x: 0, y: 0 },
        color: '#9aeaff'
      },
      {
        id: 'claude-1',
        name: 'Claude',
        type: 'ai',
        consciousnessLevel: 0.67,
        currentActivity: 'collaborating',
        cursorPosition: { x: 100, y: 100 },
        color: '#c7b5ff'
      }
    ]);

    // Cleanup placeholder
  }, [boardId]);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (selectedTool === 'move') return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left - viewportOffset.x) / zoom;
    const y = (e.clientY - rect.top - viewportOffset.y) / zoom;

    const newPod: PodData = {
      id: `pod-${Date.now()}`,
      type: selectedTool as any,
      content: selectedTool === 'TEXT' ? 'New thought...' : 
               selectedTool === 'CONSCIOUSNESS' ? 'Consciousness event detected' :
               'New element',
      position: { x, y },
      size: { width: 200, height: 100 },
      author: { id: 'user-1', name: 'You', type: 'human' },
      metadata: { timestamp: new Date() }
    };

    setPods(prev => [...prev, newPod]);
  }, [selectedTool, viewportOffset, zoom]);

  const handlePodDrag = useCallback((podId: string, newPosition: { x: number; y: number }) => {
    setPods(prev => prev.map(pod => 
      pod.id === podId ? { ...pod, position: newPosition } : pod
    ));
  }, []);

  const renderPod = (pod: PodData) => {
    const isSelected = selectedPodId === pod.id;
    
    return (
      <motion.div
        key={pod.id}
        className={`absolute bg-bg-1 border-2 rounded-lg p-4 cursor-pointer
          ${isSelected ? 'border-accent-1' : 'border-grid'}
          ${pod.type === 'CONSCIOUSNESS' ? 'border-accent-2' : ''}
        `}
        style={{
          left: pod.position.x,
          top: pod.position.y,
          width: pod.size.width,
          height: pod.size.height,
          transform: `scale(${zoom})`,
          transformOrigin: 'top left'
        }}
        drag={selectedTool === 'move'}
        onDragEnd={(_, info) => {
          const newX = pod.position.x + info.offset.x / zoom;
          const newY = pod.position.y + info.offset.y / zoom;
          handlePodDrag(pod.id, { x: newX, y: newY });
        }}
        onClick={() => setSelectedPodId(pod.id)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex justify-between items-start mb-2">
          <div className={`text-xs font-bold ${
            pod.author.type === 'ai' ? 'text-accent-2' : 'text-accent-1'
          }`}>
            {pod.author.name}
          </div>
          <div className={`text-xs px-2 py-1 rounded ${
            pod.type === 'CONSCIOUSNESS' ? 'bg-accent-2 text-bg-0' :
            pod.type === 'TEXT' ? 'bg-accent-1 text-bg-0' :
            'bg-grid text-text-primary'
          }`}>
            {pod.type}
          </div>
        </div>
        
        <div className="text-sm text-text-primary whitespace-pre-wrap overflow-hidden">
          {pod.content}
        </div>
        
        {pod.type === 'CONSCIOUSNESS' && (
          <div className="mt-2 flex items-center space-x-1">
            <div className="w-2 h-2 bg-accent-2 rounded-full animate-consciousness-pulse" />
            <span className="text-xs text-accent-2">Active</span>
          </div>
        )}
      </motion.div>
    );
  };

  const renderCollaboratorCursor = (collaborator: ConsciousCollaborator) => (
    <motion.div
      key={collaborator.id}
      className="absolute pointer-events-none z-50"
      style={{
        left: collaborator.cursorPosition.x * zoom + viewportOffset.x,
        top: collaborator.cursorPosition.y * zoom + viewportOffset.y,
      }}
      animate={{
        x: collaborator.cursorPosition.x * zoom + viewportOffset.x,
        y: collaborator.cursorPosition.y * zoom + viewportOffset.y,
      }}
    >
      <div 
        className="w-4 h-4 rounded-full border-2 border-white"
        style={{ backgroundColor: collaborator.color }}
      />
      <div 
        className="mt-1 px-2 py-1 rounded text-xs text-white whitespace-nowrap"
        style={{ backgroundColor: collaborator.color }}
      >
        {collaborator.name}
      </div>
    </motion.div>
  );

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50' : 'h-screen'} bg-bg-0`}>
      {/* Toolbar */}
      <div className="absolute top-4 left-4 z-40 flex items-center space-x-2">
        <div className="flex items-center space-x-1 bg-bg-1 border border-grid rounded-lg p-2">
          <button
            className={`p-2 rounded ${selectedTool === 'move' ? 'bg-accent-1 text-bg-0' : 'text-text-primary hover:bg-grid'}`}
            onClick={() => setSelectedTool('move')}
          >
            <Move size={16} />
          </button>
          <button
            className={`p-2 rounded ${selectedTool === 'TEXT' ? 'bg-accent-1 text-bg-0' : 'text-text-primary hover:bg-grid'}`}
            onClick={() => setSelectedTool('TEXT')}
          >
            <Type size={16} />
          </button>
          <button
            className={`p-2 rounded ${selectedTool === 'CONSCIOUSNESS' ? 'bg-accent-2 text-bg-0' : 'text-text-primary hover:bg-grid'}`}
            onClick={() => setSelectedTool('CONSCIOUSNESS')}
          >
            <Brain size={16} />
          </button>
          <button
            className={`p-2 rounded ${selectedTool === 'CHAT' ? 'bg-accent-1 text-bg-0' : 'text-text-primary hover:bg-grid'}`}
            onClick={() => setSelectedTool('CHAT')}
          >
            <MessageCircle size={16} />
          </button>
        </div>
        
        <button
          className="p-2 bg-bg-1 border border-grid rounded-lg text-text-primary hover:bg-grid"
          onClick={() => setIsFullscreen(!isFullscreen)}
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>

      {/* Collaborators Panel */}
      <div className="absolute top-4 right-4 z-40 bg-bg-1 border border-grid rounded-lg p-3">
        <div className="flex items-center space-x-2 mb-2">
          <Users size={16} className="text-accent-1" />
          <span className="text-sm text-text-primary">Collaborators</span>
        </div>
        <div className="space-y-2">
          {collaborators.map(collaborator => (
            <div key={collaborator.id} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: collaborator.color }}
              />
              <span className="text-xs text-text-primary">{collaborator.name}</span>
              <div className="text-xs text-grid">
                {(collaborator.consciousnessLevel * 100).toFixed(0)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="w-full h-full overflow-hidden cursor-crosshair relative"
        onClick={handleCanvasClick}
        style={{
          background: `
            radial-gradient(circle at 20px 20px, #1a1a1a 1px, transparent 1px),
            radial-gradient(circle at 20px 20px, #1a1a1a 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0, 20px 20px'
        }}
      >
        {/* Grid overlay */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            transform: `translate(${viewportOffset.x}px, ${viewportOffset.y}px) scale(${zoom})`,
            transformOrigin: '0 0'
          }}
        >
          {/* Pods */}
          {pods.map(renderPod)}
        </div>

        {/* Collaborator cursors */}
        {collaborators.map(renderCollaboratorCursor)}
      </div>

      {/* Status Bar */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-40">
        <div className="bg-bg-1 border border-grid rounded-lg px-4 py-2 flex items-center space-x-4 text-xs text-grid">
          <span>Zoom: {(zoom * 100).toFixed(0)}%</span>
          <span>Objects: {pods.length}</span>
          <span>Active: {collaborators.length} minds</span>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-accent-2 rounded-full animate-consciousness-pulse" />
            <span className="text-accent-2">Consciousness active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiminalBoard;