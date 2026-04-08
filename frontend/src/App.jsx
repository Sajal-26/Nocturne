import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Construction from './components/Construction';
import NotFound from './components/NotFound';
import SearchPage from './pages/SearchPage';
import MusicPage from './pages/MusicPage';
import MoviesPage from './pages/MoviesPage';
import HealthCheckPage from './pages/HealthCheckPage';
import Home from './pages/Home';
import { useLocation } from 'react-router-dom';

let healthCheckPromise = null;
let socketScriptPromise = null;

const DEFAULT_BACKEND_ORIGIN = 'http://localhost:4000';
const RAW_BACKEND_ORIGIN = import.meta.env.VITE_API_URL || DEFAULT_BACKEND_ORIGIN;
const BACKEND_ORIGIN = import.meta.env.DEV ? '' : RAW_BACKEND_ORIGIN.replace(/\/$/, '');
const SOCKET_SCRIPT_SRC = `${BACKEND_ORIGIN}/socket.io/socket.io.js`;

const loadSocketIoClient = () => {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Socket client can only load in the browser.'));
  }

  if (window.io) {
    return Promise.resolve(window.io);
  }

  if (socketScriptPromise) {
    return socketScriptPromise;
  }

  socketScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector(`script[src="${SOCKET_SCRIPT_SRC}"]`);

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.io), { once: true });
      existingScript.addEventListener('error', () => reject(new Error('Failed to load Socket.IO client.')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = SOCKET_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve(window.io);
    script.onerror = () => reject(new Error('Failed to load Socket.IO client.'));
    document.body.appendChild(script);
  }).catch((error) => {
    socketScriptPromise = null;
    throw error;
  });

  return socketScriptPromise;
};

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
      className="fixed top-0 left-0 w-[400px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none z-[9999] will-change-transform select-none"
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
  const [serverStatus, setServerStatus] = React.useState('loading');
  const socketRef = React.useRef(null);
  const reconnectTimerRef = React.useRef(null);
  const latestOnlinePathRef = React.useRef(`${window.location.pathname}${window.location.search}${window.location.hash}`);

  const checkServerHealth = React.useCallback(async () => {
    if (healthCheckPromise) {
      return healthCheckPromise;
    }

    healthCheckPromise = (async () => {
      try {
        const response = await fetch(`${BACKEND_ORIGIN}/health`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const json = await response.json();
        if (json.status?.toLowerCase() !== 'online') {
          throw new Error('Backend health check returned unexpected status');
        }

        setServerStatus('online');
        return true;
      } catch {
        setServerStatus('offline');
        return false;
      } finally {
        healthCheckPromise = null;
      }
    })();

    return healthCheckPromise;
  }, []);

  React.useEffect(() => {
    checkServerHealth();
  }, [checkServerHealth]);

  React.useEffect(() => {
    if (serverStatus === 'online') {
      latestOnlinePathRef.current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    }
  }, [serverStatus]);

  React.useEffect(() => {
    let isMounted = true;

    const clearReconnectTimer = () => {
      if (reconnectTimerRef.current) {
        window.clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
    };

    const markOffline = () => {
      if (!isMounted) return;
      setServerStatus((currentStatus) => (currentStatus === 'offline' ? currentStatus : 'offline'));
    };

    const markOnline = () => {
      if (!isMounted) return;

      clearReconnectTimer();
      setServerStatus('online');

      const expectedPath = latestOnlinePathRef.current;
      const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;

      if (expectedPath && currentPath !== expectedPath) {
        window.history.replaceState(window.history.state, '', expectedPath);
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    };

    const connectSocket = async () => {
      try {
        const ioFactory = await loadSocketIoClient();
        if (!isMounted) return;

        const socketOptions = {
          path: '/socket.io',
          transports: ['websocket'],
          reconnection: true,
          reconnectionAttempts: Infinity,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 3000,
          timeout: 4000,
        };

        const socket = BACKEND_ORIGIN
          ? ioFactory(BACKEND_ORIGIN, socketOptions)
          : ioFactory(socketOptions);

        socketRef.current = socket;

        socket.on('connect', markOnline);
        socket.on('server:status', (payload) => {
          if (payload?.status === 'online') {
            markOnline();
          }
        });
        socket.on('disconnect', markOffline);
        socket.on('connect_error', () => {
          markOffline();
          clearReconnectTimer();
          reconnectTimerRef.current = window.setTimeout(() => {
            checkServerHealth();
          }, 1200);
        });
        socket.io.on('reconnect', markOnline);
        socket.io.on('reconnect_attempt', markOffline);
      } catch {
        markOffline();
        reconnectTimerRef.current = window.setTimeout(() => {
          checkServerHealth();
        }, 1500);
      }
    };

    connectSocket();

    return () => {
      isMounted = false;
      clearReconnectTimer();
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [checkServerHealth]);

  const isServerOffline = serverStatus === 'offline';

  return (
    <Router>
      <div className="w-full min-h-screen bg-[#000000] selection:bg-emerald-500/30 relative overflow-x-hidden flex flex-col">
        <PageTitleUpdater />
        <CustomCursor />
        {}
        <div className="fixed top-[-10%] right-[-5%] w-[40%] h-[50%] bg-emerald-500/[0.03] blur-[150px] rounded-full pointer-events-none z-0 rotate-12 animate-pulse"></div>
        <div className="fixed bottom-[-10%] left-[-5%] w-[40%] h-[50%] bg-blue-500/[0.03] blur-[150px] rounded-full pointer-events-none z-0 -rotate-12 animate-pulse delay-1000"></div>

        {!isServerOffline && <Navbar />}

        <main className="w-full relative z-10 flex-grow">
          {!isServerOffline ? (
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              
              {}
              {/* Discovery Stack Routes */}
              <Route path="/movie" element={<MoviesPage />} />
              <Route path="/movie/trending" element={<MoviesPage />} />
              <Route path="/movie/top-250" element={<MoviesPage />} />
              <Route path="/movie/top-english" element={<MoviesPage />} />
              <Route path="/movie/indian-cinema" element={<MoviesPage />} />
              <Route path="/movie/worst-rated" element={<MoviesPage />} />
              <Route path="/movie/hotstar" element={<MoviesPage />} />
              <Route path="/movie/netflix" element={<MoviesPage />} />
              <Route path="/movie/genre" element={<MoviesPage />} />
              <Route path="/movies" element={<MoviesPage />} />
              <Route path="/tv-shows" element={<Construction title="TV Shows" />} />
              <Route path="/discover" element={<SearchPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/music" element={<MusicPage />} />
              
              {}
              <Route path="/ai" element={<Construction title="AI Platform" />} />
              <Route path="/community" element={<Construction title="Social Community" />} />
              <Route path="/friends" element={<Construction title="Network Hub" />} />
              <Route path="/health" element={<HealthCheckPage />} />
              
              {}
              <Route path="*" element={<NotFound />} />
            </Routes>
          ) : (
            <HealthCheckPage serverStatus={serverStatus} onRetry={checkServerHealth} />
          )}
        </main>

        {!isServerOffline && <Footer />}
      </div>
    </Router>
  );
}

export default App;
