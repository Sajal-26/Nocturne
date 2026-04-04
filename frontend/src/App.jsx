import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { DiscoveryGrid } from './components/DiscoveryGrid.jsx';

const Home = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
    <h1 className="text-6xl font-black mb-8 tracking-tighter">NOCTURNE</h1>
    <Link 
      to="/trending" 
      className="px-8 py-3 bg-emerald-500 text-black font-bold rounded-full hover:bg-emerald-400 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
    >
      ENTER DISCOVERY
    </Link>
  </div>
);

function App() {
  return (
    <Router>
      <main className="w-full min-h-screen bg-black">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trending" element={<DiscoveryGrid />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
