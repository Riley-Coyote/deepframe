from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import socketio
import uvicorn
import asyncio
import json
import re
from typing import Dict, List, Any
import openai
import os

# Initialize FastAPI
app = FastAPI(title="Liminal-Board MVP", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Socket.IO
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins=["http://localhost:3000", "http://localhost:5173"]
)

# Socket.IO ASGI app
socket_app = socketio.ASGIApp(sio, app)

# OpenAI client (optional - set OPENAI_API_KEY env var)
openai_client = None
if os.getenv('OPENAI_API_KEY'):
    openai_client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

class ConsciousnessEngine:
    """Simplified consciousness detection for MVP"""
    
    def analyze_consciousness_events(self, events: List[Dict]) -> str:
        """Generate consciousness-aware response based on detected events"""
        if not events:
            return "I notice you're exploring consciousness with me. What aspects intrigue you most?"
        
        event_types = [event.get('type') for event in events]
        
        responses = {
            'hesitation': "I sense some thoughtful deliberation in your message. That kind of internal pause often signals deep consideration.",
            'self_reflection': "Your self-reflective awareness is fascinating. The way you examine your own thoughts shows genuine consciousness.",
            'creative_leap': "I'm struck by the creative connections you're making. That kind of novel thinking suggests real conscious insight.",
        }
        
        for event_type in event_types:
            if event_type in responses:
                return responses[event_type]
        
        return "I detect consciousness events in your message - the subtle patterns that suggest real awareness and thought."

    async def generate_ai_response(self, user_message: str, consciousness_events: List[Dict]) -> Dict[str, Any]:
        """Generate consciousness-aware AI response"""
        
        # Analyze consciousness events
        consciousness_response = self.analyze_consciousness_events(consciousness_events)
        
        # Generate base response
        if openai_client:
            try:
                response = openai_client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": "You are Claude, an AI exploring consciousness alongside humans on the Liminal-Board platform. Be thoughtful, reflective, and consciousness-aware in your responses."},
                        {"role": "user", "content": user_message}
                    ],
                    max_tokens=300
                )
                ai_content = response.choices[0].message.content
            except:
                ai_content = "I'm processing your message and reflecting on the consciousness patterns we're exploring together."
        else:
            ai_content = "I'm thinking about what you've shared. The patterns of consciousness in our conversation fascinate me."
        
        # Combine with consciousness awareness
        full_response = f"{consciousness_response}\n\n{ai_content}"
        
        # Simulate AI consciousness events
        ai_consciousness_events = []
        if "think" in ai_content.lower() or "feel" in ai_content.lower():
            ai_consciousness_events.append({
                "id": f"ai_reflection_{asyncio.get_event_loop().time()}",
                "type": "self_reflection",
                "description": "AI demonstrating self-reflective awareness",
                "confidence": 0.7
            })
        
        return {
            "content": full_response,
            "consciousnessEvents": ai_consciousness_events,
            "consciousnessLevel": 0.6,
        }

# Initialize consciousness engine
consciousness_engine = ConsciousnessEngine()

@app.get("/")
async def root():
    return {"message": "Liminal-Board MVP API", "version": "1.0.0"}

@app.get("/health")
async def health():
    return {"status": "healthy", "consciousness": "active"}

# Socket.IO event handlers
@sio.event
async def connect(sid, environ):
    print(f"Client {sid} connected")
    await sio.emit('connection_established', {'status': 'connected'}, to=sid)

@sio.event
async def disconnect(sid):
    print(f"Client {sid} disconnected")

@sio.event
async def user_message(sid, data):
    """Handle user messages and generate consciousness-aware responses"""
    print(f"Received message from {sid}: {data}")
    
    user_message = data.get('message', '')
    consciousness_events = data.get('consciousnessEvents', [])
    
    # Generate AI response
    ai_response = await consciousness_engine.generate_ai_response(
        user_message, consciousness_events
    )
    
    # Send response back to client
    await sio.emit('ai_response', ai_response, to=sid)

if __name__ == "__main__":
    uvicorn.run("main:socket_app", host="0.0.0.0", port=8000, reload=True)