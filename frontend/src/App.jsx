import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Construction from './components/Construction';
import NotFound from './components/NotFound';
import SearchPage from './pages/SearchPage';
import MusicPage from './pages/MusicPage';
import Home from './pages/Home';
import { useLocation } from 'react-router-dom';

const CustomCursor = () => {
  const cursorRef = React.useRef(null);

  React.useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let rafId;
    const handleMouseMove = (e) => {
      rafId = requestAnimationFrame(() => {
        cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div 
      ref={cursorRef}
      className="fixed top-0 left-0 w-[250px] h-[250px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none z-[9999] transition-transform duration-[400ms] cubic-bezier(0.23, 1, 0.32, 1) will-change-transform select-none"
    />
  );
};

const PageTitleUpdater = () => {
  const location = useLocation();
  
  React.useEffect(() => {
    const path = location.pathname.split('/')[1];
    let title = "Nocturne | Cinematic Universe";
    
    if (path) {
      const formatted = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
      if (path === 'discover' || path === 'search') {
        title = `Discover | Nocturne`;
      } else {
        title = `${formatted} | Nocturne`;
      }
    } else {
      title = "Home Node | Nocturne";
    }
    
    document.title = title;
  }, [location]);

  return null;
};

function App() {
  return (
    <Router>
      <div className="w-full min-h-screen bg-[#000000] selection:bg-emerald-500/30 relative overflow-x-hidden flex flex-col">
        <PageTitleUpdater />
        <CustomCursor />
        {}
        <div className="fixed top-[-10%] right-[-5%] w-[40%] h-[50%] bg-emerald-500/[0.03] blur-[150px] rounded-full pointer-events-none z-0 rotate-12 animate-pulse"></div>
        <div className="fixed bottom-[-10%] left-[-5%] w-[40%] h-[50%] bg-blue-500/[0.03] blur-[150px] rounded-full pointer-events-none z-0 -rotate-12 animate-pulse delay-1000"></div>
        
        <Navbar />
        
        <main className="w-full relative z-10 flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            
            {}
            <Route path="/trending" element={<Construction title="Trending" />} />
            <Route path="/movies" element={<Construction title="Movies" />} />
            <Route path="/tv-shows" element={<Construction title="TV Shows" />} />
            <Route path="/discover" element={<SearchPage />} />
            <Route path="/music" element={<MusicPage />} />
            
            {}
            <Route path="/ai" element={<Construction title="AI Platform" />} />
            <Route path="/community" element={<Construction title="Social Community" />} />
            <Route path="/friends" element={<Construction title="Network Hub" />} />
            
            {}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
