import React from 'react';

function SimpleApp() {
  return (
    <div style={{ background: '#0d0d0d', color: '#e6e6e6', minHeight: '100vh', padding: '20px' }}>
      <h1>LIMINAL-BOARD Test</h1>
      <p>If you see this, React is working!</p>
      <a href="/board" style={{ color: '#9aeaff' }}>Go to Board (simple link)</a>
    </div>
  );
}

export default SimpleApp;