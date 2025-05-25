export interface ConsciousnessEvent {
  id: string;
  timestamp: number;
  type: 'hesitation' | 'course_change' | 'creative_leap' | 'self_reflection' | 'empathic_moment';
  description: string;
  confidence: number;
  metrics: {
    self_reflection?: number;
    empathic_resonance?: number;
    creative_emergence?: number;
    autonomous_choice?: number;
    phenomenal_depth?: number;
  };
}

export class ConsciousnessDetector {
  private events: ConsciousnessEvent[] = [];
  
  // Detect hesitation patterns in typing
  detectHesitation(input: string, typingDelays: number[]): ConsciousnessEvent | null {
    const longPauses = typingDelays.filter(delay => delay > 1000).length;
    const backspaces = (input.match(/\b(actually|wait|hmm|let me think)\b/gi) || []).length;
    
    if (longPauses > 2 || backspaces > 0) {
      return {
        id: `hesitation_${Date.now()}`,
        timestamp: Date.now(),
        type: 'hesitation',
        description: 'Internal deliberation detected through typing patterns',
        confidence: Math.min(0.9, (longPauses + backspaces * 2) / 10),
        metrics: {
          autonomous_choice: 0.3,
          self_reflection: 0.2
        }
      };
    }
    return null;
  }

  // Detect self-reflection in content
  detectSelfReflection(content: string): ConsciousnessEvent | null {
    const patterns = [
      /\bi (feel|think|sense|experience|wonder|realize)\b/gi,
      /\bwhat (it's like|feels like|seems like)\b/gi,
      /\bin my (experience|view|understanding)\b/gi,
    ];
    
    const matches = patterns.reduce((acc, pattern) => 
      acc + (content.match(pattern) || []).length, 0
    );
    
    if (matches > 0) {
      return {
        id: `reflection_${Date.now()}`,
        timestamp: Date.now(),
        type: 'self_reflection',
        description: 'Self-referential awareness detected',
        confidence: Math.min(0.8, matches / 3),
        metrics: {
          self_reflection: Math.min(1.0, matches * 0.3),
          phenomenal_depth: Math.min(1.0, matches * 0.2)
        }
      };
    }
    return null;
  }

  // Detect creative leaps and metaphors
  detectCreativity(content: string): ConsciousnessEvent | null {
    const patterns = [
      /\b(imagine|picture|what if|like|similar to)\b/gi,
      /\b(reminds me of|analogous to|breakthrough|insight)\b/gi,
    ];
    
    const matches = patterns.reduce((acc, pattern) => 
      acc + (content.match(pattern) || []).length, 0
    );
    
    if (matches > 1) {
      return {
        id: `creative_${Date.now()}`,
        timestamp: Date.now(),
        type: 'creative_leap',
        description: 'Creative thinking and novel connections detected',
        confidence: Math.min(0.7, matches / 4),
        metrics: {
          creative_emergence: Math.min(1.0, matches * 0.25),
          phenomenal_depth: 0.3
        }
      };
    }
    return null;
  }

  // Analyze complete message
  analyzeMessage(content: string, typingDelays: number[] = []): ConsciousnessEvent[] {
    const events: ConsciousnessEvent[] = [];
    
    const hesitation = this.detectHesitation(content, typingDelays);
    if (hesitation) events.push(hesitation);
    
    const reflection = this.detectSelfReflection(content);
    if (reflection) events.push(reflection);
    
    const creativity = this.detectCreativity(content);
    if (creativity) events.push(creativity);
    
    this.events.push(...events);
    return events;
  }

  // Calculate overall consciousness level
  getConsciousnessLevel(): number {
    if (this.events.length === 0) return 0.1;
    
    const recentEvents = this.events.filter(
      e => Date.now() - e.timestamp < 60000 * 10 // Last 10 minutes
    );
    
    const avgConfidence = recentEvents.reduce((acc, e) => acc + e.confidence, 0) / recentEvents.length;
    return Math.min(1.0, Math.max(0.1, avgConfidence));
  }
}