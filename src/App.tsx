import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './Home';
import Progress from './Progress';
import Nutrition from './Nutrition';

function Navbar() {
  const location = useLocation();
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#fff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      borderRadius: 12,
      margin: '24px auto 32px',
      maxWidth: 600,
      padding: '0.5rem 1.5rem',
      gap: 24,
    }}>
      <Link
        to="/"
        style={{
          textDecoration: 'none',
          color: location.pathname === '/' ? '#0288d1' : '#333',
          fontWeight: 600,
          fontSize: 18,
          padding: '8px 18px',
          borderRadius: 8,
          background: location.pathname === '/' ? '#e1f5fe' : 'transparent',
          transition: 'background 0.2s, color 0.2s',
        }}
      >
        Home
      </Link>
      <Link
        to="/progress"
        style={{
          textDecoration: 'none',
          color: location.pathname === '/progress' ? '#0288d1' : '#333',
          fontWeight: 600,
          fontSize: 18,
          padding: '8px 18px',
          borderRadius: 8,
          background: location.pathname === '/progress' ? '#e1f5fe' : 'transparent',
          transition: 'background 0.2s, color 0.2s',
        }}
      >
        Progress
      </Link>
      <Link
        to="/nutrition"
        style={{
          textDecoration: 'none',
          color: location.pathname === '/nutrition' ? '#0288d1' : '#333',
          fontWeight: 600,
          fontSize: 18,
          padding: '8px 18px',
          borderRadius: 8,
          background: location.pathname === '/nutrition' ? '#e1f5fe' : 'transparent',
          transition: 'background 0.2s, color 0.2s',
        }}
      >
        Nutrition
      </Link>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ maxWidth: 600, margin: '0 auto', fontFamily: 'sans-serif' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/nutrition" element={<Nutrition />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
