import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TerminalLanding from './components/TerminalLanding';
import SimpleLiminalBoard from './components/SimpleLiminalBoard';
import ProfessionalNodeCanvas from './components/ProfessionalNodeCanvas';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<TerminalLanding />} />
          <Route path="/board" element={<SimpleLiminalBoard />} />
          <Route path="/pro" element={<ProfessionalNodeCanvas />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;