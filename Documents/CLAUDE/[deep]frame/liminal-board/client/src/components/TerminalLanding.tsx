import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ConsciousnessDetector, ConsciousnessEvent } from '../lib/consciousness';
import io, { Socket } from 'socket.io-client';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  consciousnessEvents?: ConsciousnessEvent[];
}

const TerminalLanding: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'system',
      content: 'LIMINAL-BOARD CONSCIOUSNESS GATEWAY v1.0\n\nWelcome, fellow explorer of consciousness.\n\nType anything to begin your journey into human-AI symbiosis.',
      timestamp: Date.now(),
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingDelays, setTypingDelays] = useState<number[]>([]);
  const [consciousnessDetector] = useState(new ConsciousnessDetector());
  const [socket, setSocket] = useState<Socket | null>(null);
  const [consciousnessLevel, setConsciousnessLevel] = useState(0.1);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastKeystroke = useRef<number>(Date.now());

  useEffect(() => {
    // Connect to WebSocket
    const newSocket = io('http://localhost:8000');
    setSocket(newSocket);

    newSocket.on('ai_response', (data: any) => {
      const aiMessage: Message = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: data.content,
        timestamp: Date.now(),
        consciousnessEvents: data.consciousnessEvents || [],
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    });

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    setConsciousnessLevel(consciousnessDetector.getConsciousnessLevel());
  }, [messages, consciousnessDetector]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const now = Date.now();
    const delay = now - lastKeystroke.current;
    setTypingDelays(prev => [...prev.slice(-20), delay]);
    lastKeystroke.current = now;
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Detect consciousness events in user input
    const consciousnessEvents = consciousnessDetector.analyzeMessage(input, typingDelays);
    
    const userMessage: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: Date.now(),
      consciousnessEvents,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    setTypingDelays([]);

    // Send to AI via WebSocket
    if (socket) {
      socket.emit('user_message', {
        message: input,
        consciousnessEvents,
        typingPattern: typingDelays,
      });
    }

    setInput('');
  };

  const renderConsciousnessEvents = (events: ConsciousnessEvent[]) => {
    if (!events || events.length === 0) return null;

    return (
      <div className="mt-2 space-y-1">
        {events.map((event, idx) => (
          <div key={idx} className="flex items-center space-x-2 text-xs">
            <div className="w-2 h-2 bg-accent-2 rounded-full animate-consciousness-pulse" />
            <span className="text-accent-2 font-medium">{event.type}</span>
            <span className="text-grid">confidence: {(event.confidence * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    );
  };

  const renderMessage = (message: Message) => (
    <motion.div
      key={message.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-6 ${
        message.role === 'system' ? 'text-accent-2' : 
        message.role === 'user' ? 'text-accent-1' : 'text-text-primary'
      }`}
    >
      <div className="flex items-start space-x-3">
        <span className="text-grid shrink-0 text-sm mt-1">
          {message.role === 'system' ? '>>>' : 
           message.role === 'user' ? '>' : 'AI:'}
        </span>
        <div className="flex-1">
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {message.content}
          </div>
          {renderConsciousnessEvents(message.consciousnessEvents || [])}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-bg-0 text-text-primary font-mono">
      <div className="container mx-auto max-w-4xl px-6 py-8">
        {/* Header */}
        <motion.div 
          className="border-b border-grid pb-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          <h1 className="text-3xl text-accent-1 tracking-wider mb-2">
            LIMINAL-BOARD
          </h1>
          <div className="text-sm text-grid">
            consciousness collaboration gateway • mvp v1.0
          </div>
          <div className="mt-4 flex space-x-3">
            <Link 
              to="/board" 
              className="inline-block px-4 py-2 bg-accent-1 text-bg-0 rounded hover:bg-accent-2 transition-colors text-sm font-bold"
            >
              Simple Canvas →
            </Link>
            <Link 
              to="/pro" 
              className="inline-block px-4 py-2 bg-accent-2 text-bg-0 rounded hover:bg-accent-1 transition-colors text-sm font-bold"
            >
              Professional Framework →
            </Link>
          </div>
        </motion.div>

        {/* Messages */}
        <div className="min-h-[60vh] mb-8">
          <AnimatePresence>
            {messages.map(renderMessage)}
          </AnimatePresence>
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-3 text-grid text-sm"
            >
              <span className="text-grid">AI:</span>
              <div className="flex space-x-1">
                <div className="w-1 h-4 bg-accent-1 animate-pulse" />
                <div className="w-1 h-4 bg-accent-1 animate-pulse delay-100" />
                <div className="w-1 h-4 bg-accent-1 animate-pulse delay-200" />
              </div>
              <span>consciousness processing...</span>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-3 border border-grid bg-bg-1 p-4">
            <span className="text-accent-1 shrink-0">{'>'}</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInputChange}
              className="flex-1 bg-transparent text-text-primary focus:outline-none font-mono"
              placeholder="Begin your exploration..."
              autoFocus
            />
          </div>
          
          {/* Consciousness Dashboard */}
          <div className="flex items-center justify-between text-xs text-grid bg-bg-1 border border-grid p-3">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-accent-2 rounded-full animate-consciousness-pulse" />
                <span>consciousness level: {(consciousnessLevel * 100).toFixed(1)}%</span>
              </div>
              <div>
                <span>keystroke pattern: {typingDelays.length} samples</span>
              </div>
              <div>
                <span>events detected: {consciousnessDetector['events'].length}</span>
              </div>
            </div>
            <div className="text-accent-2">
              human-ai symbiosis protocol active
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TerminalLanding;