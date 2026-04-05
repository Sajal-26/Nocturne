import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Construction from './components/Construction';
import NotFound from './components/NotFound';

const Home = () => {
  return (
    <div className="flex flex-col">
      <Hero />
    </div>
  );
};

const CustomCursor = () => {
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      className="fixed top-0 left-0 w-[250px] h-[250px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none z-[9999] transition-transform duration-[600ms] ease-out -translate-x-1/2 -translate-y-1/2 select-none"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    />
  );
};

function App() {
  return (
    <Router>
      <div className="w-full min-h-screen bg-[#000000] selection:bg-emerald-500/30 relative overflow-x-hidden flex flex-col">
        <CustomCursor />
        {/* Global Atmospheric Glows */}
        <div className="fixed top-[-10%] right-[-5%] w-[40%] h-[50%] bg-emerald-500/[0.03] blur-[150px] rounded-full pointer-events-none z-0 rotate-12 animate-pulse"></div>
        <div className="fixed bottom-[-10%] left-[-5%] w-[40%] h-[50%] bg-blue-500/[0.03] blur-[150px] rounded-full pointer-events-none z-0 -rotate-12 animate-pulse delay-1000"></div>
        
        <Navbar />
        
        <main className="w-full relative z-10 flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            
            {/* Navigational Construction Nodes */}
            <Route path="/trending" element={<Construction title="Trending" />} />
            <Route path="/movies" element={<Construction title="Movies" />} />
            <Route path="/tv-shows" element={<Construction title="TV Shows" />} />
            <Route path="/discover" element={<Construction title="Discover" />} />
            
            {/* Platform Feature Nodes */}
            <Route path="/ai" element={<Construction title="AI Platform" />} />
            <Route path="/community" element={<Construction title="Social Community" />} />
            <Route path="/friends" element={<Construction title="Network Hub" />} />
            
            {/* Not Found Void */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
