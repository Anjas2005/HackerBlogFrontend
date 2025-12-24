import { useState, useEffect, useRef } from 'react';
import { 
  ExternalLink, MessageCircle, ArrowUp, Clock, User, 
  TrendingUp, Zap, Star, Flame, Heart, AlertTriangle, 
  Github, Linkedin, Terminal, RefreshCw, Server, Wifi, ShieldCheck 
} from 'lucide-react';
import API_BASE from "./config";

// --- Configuration & Constants (Kept Original) ---

const categoryColors = {
  security: "text-red-400 border-red-500/50 shadow-red-500/20",
  show: "text-purple-400 border-purple-500/50 shadow-purple-500/20",
  tech: "text-blue-400 border-blue-500/50 shadow-blue-500/20",
  ask: "text-green-400 border-green-500/50 shadow-green-500/20",
  ai: "text-orange-400 border-orange-500/50 shadow-orange-500/20",
  science: "text-indigo-400 border-indigo-500/50 shadow-indigo-500/20",
  default: "text-gray-400 border-gray-500/50 shadow-gray-500/20"
};

const categoryGradients = {
  security: "from-red-500/20 to-red-900/5",
  show: "from-purple-500/20 to-purple-900/5",
  tech: "from-blue-500/20 to-blue-900/5",
  ask: "from-green-500/20 to-green-900/5",
  ai: "from-orange-500/20 to-orange-900/5",
  science: "from-indigo-500/20 to-indigo-900/5",
  default: "from-gray-500/20 to-gray-900/5"
};

const categoryIcons = {
  security: Zap,
  show: Star,
  tech: Terminal,
  ask: MessageCircle,
  ai: Flame,
  science: Heart,
  default: TrendingUp
};

const getCategoryFromTitle = (title) => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('security') || lowerTitle.includes('compromised') || lowerTitle.includes('vulnerability')) return 'security';
  if (lowerTitle.startsWith('show hn:')) return 'show';
  if (lowerTitle.startsWith('ask hn:')) return 'ask';
  if (lowerTitle.includes('ai') || lowerTitle.includes('machine learning') || lowerTitle.includes('llm')) return 'ai';
  if (lowerTitle.includes('quantum') || lowerTitle.includes('science') || lowerTitle.includes('nasa')) return 'science';
  return 'tech';
};

const LOADING_MESSAGES = [
  "INITIALIZING SYSTEM CORE...",
  "PINGING BACKEND SERVICES...",
  "WAKING UP SERVER INSTANCES...",
  "ESTABLISHING SECURE HANDSHAKE...",
  "DOWNLOADING NEWS STREAM...",
  "PARSING METADATA...",
  "FINALIZING UI RENDER..."
];

function App() {
  // --- Logic State ---
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0); // For the new animation
  const pollingTimer = useRef(null);

  // --- Fetch Logic ---
  useEffect(() => {
    const fetchNews = async () => {
      if(!loading) setIsUpdating(true);

      try {
        const response = await fetch(`${API_BASE}`);

        if (!response.ok) {
          clearTimeout(pollingTimer.current);
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const jsonData = await response.json();
        const dataWithCategory = jsonData.map(story => ({
          ...story,
          category: getCategoryFromTitle(story.Title)
        }));
        dataWithCategory.sort((a, b) => a.Rank - b.Rank);
        setData(dataWithCategory);

      } catch (err) {
        console.error("Failed to fetch news:", err);
        setError(err.message);
        clearTimeout(pollingTimer.current);
      } finally {
        setLoading(false);
        setTimeout(() => setIsUpdating(false), 1000); 
        pollingTimer.current = setTimeout(fetchNews, 10000);
      }
    };

    fetchNews();

    return () => {
      if (pollingTimer.current) clearTimeout(pollingTimer.current);
    };
  }, []);

  // --- 1. NEW: Loading Text Animation Effect ---
  useEffect(() => {
    if (!loading) return;
    
    // Cycle through messages every 800ms
    const interval = setInterval(() => {
      setLoadingMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 800);

    return () => clearInterval(interval);
  }, [loading]);

  // --- 2. UPDATED: Keep Scraper & Backend Alive ---
  useEffect(() => {
    const SCRAPER_URL = "https://hackernewsscraper-7x6b.onrender.com/";
    
    const keepAlive = () => {
      // Ping the Scraper
      fetch(SCRAPER_URL, { mode: "no-cors" }).catch(() => console.log("Scraper ping silent fail"));
      
      // Ping the Main Backend (API_BASE)
      // This ensures the backend wakes up if it's on a free tier cold start
      fetch(API_BASE, { mode: "no-cors" }).catch(() => console.log("Backend ping silent fail"));
    };
    
    // Initial ping
    keepAlive();
    
    // Ping every 30 seconds
    const interval = setInterval(keepAlive, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleCardClick = (link) => window.open(link, '_blank', 'noopener,noreferrer');

  // --- UI Render ---

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-black to-black"></div>
        <div className="bg-zinc-900/80 border border-red-500/30 p-8 rounded-xl max-w-md w-full relative z-10 backdrop-blur-md shadow-2xl shadow-red-900/20">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-red-500/10 rounded-full animate-pulse">
                <AlertTriangle className="w-12 h-12 text-red-500" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center mb-2 tracking-tight">Connection Lost</h2>
            <p className="text-zinc-400 text-center font-mono text-sm mb-6 bg-black/50 p-3 rounded border border-zinc-800">
              {error}
            </p>
            <button onClick={() => window.location.reload()} className="w-full py-3 bg-red-600 hover:bg-red-500 transition-colors rounded-lg font-bold flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4" /> Retry Connection
            </button>
        </div>
      </div>
    );
  }

  // --- 3. UPDATED: Cool System Boot Loading State ---
  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center relative overflow-hidden font-mono">
        {/* Modern Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="relative z-10 w-full max-w-md p-6">
          
          {/* Main Loader Icon */}
          <div className="flex justify-center mb-8 relative">
            <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full animate-pulse"></div>
            <div className="w-20 h-20 border-2 border-zinc-800 border-t-orange-500 border-r-orange-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Server className="w-8 h-8 text-orange-500" />
            </div>
          </div>

          {/* Status Text HUD */}
          <div className="bg-black/40 border border-zinc-800 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2 text-xs text-zinc-500 uppercase tracking-widest">
              <span>System Status</span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                Online
              </span>
            </div>

            {/* Dynamic Message */}
            <h2 className="text-orange-400 font-bold text-lg mb-4 h-7 tracking-wide">
              {'>'} {LOADING_MESSAGES[loadingMsgIndex]}<span className="animate-pulse">_</span>
            </h2>

            {/* Progress Bar Animation */}
            <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-orange-500 animate-progress"></div>
            </div>
          </div>

          {/* Helper Text for Cold Starts */}
          <p className="text-zinc-600 text-xs text-center mt-6">
            <Wifi className="inline w-3 h-3 mr-1" />
            Note: First load may take up to 30s while backend wakes up.
          </p>
        </div>

        <style jsx>{`
          @keyframes progress {
            0% { width: 5%; }
            50% { width: 70%; }
            100% { width: 95%; }
          }
          .animate-progress {
            animation: progress 2s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  // Main Feed UI
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-orange-500/30">
      
      {/* Background Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#09090b]/50 to-[#09090b]"></div>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-xl supports-[backdrop-filter]:bg-[#09090b]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo Area */}
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-8 h-8 bg-orange-600 rounded flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-orange-900/20 group-hover:scale-105 transition-transform">
                Y
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight tracking-tight">HackerNews</span>
                <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Live Feed</span>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-6">
              {/* Updating Indicator */}
              <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-500 ${
                  isUpdating 
                    ? 'border-orange-500/30 bg-orange-500/10 text-orange-400' 
                    : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                }`}>
                <div className={`w-2 h-2 rounded-full ${isUpdating ? 'bg-orange-500 animate-ping' : 'bg-emerald-500'}`}></div>
                <span className="text-xs font-bold tracking-wide">{isUpdating ? 'SYNCING' : 'LIVE'}</span>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-4 pl-6 border-l border-white/5">
                <a 
                  href="https://github.com/Anjas2005/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-zinc-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a 
                  href="https://www.linkedin.com/in/anjas-vaidya2020/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-zinc-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-500 mb-4">
            Top Stories
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl">
            Curated tech news, harvested in real-time.
          </p>
        </header>

        {/* Masonry-style Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((story, index) => {
            const CategoryIcon = categoryIcons[story.category] || categoryIcons.default;
            const styleClass = categoryColors[story.category] || categoryColors.default;
            const gradientClass = categoryGradients[story.category] || categoryGradients.default;

            return (
              <article 
                key={story.Rank}
                onClick={() => handleCardClick(story.Link_To_Article)}
                className={`
                  group relative flex flex-col justify-between
                  bg-zinc-900/50 hover:bg-zinc-800/80 
                  border border-white/5 hover:border-white/10
                  rounded-xl overflow-hidden backdrop-blur-sm
                  transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl
                  cursor-pointer
                `}
                style={{ animation: `fadeIn 0.5s ease-out ${index * 0.05}s backwards` }}
              >
                {/* Hover Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                <div className="p-6 relative z-10 flex flex-col h-full">
                  {/* Header: Rank & Category */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-4xl font-bold text-white/5 group-hover:text-white/10 transition-colors">
                      {String(story.Rank).padStart(2, '0')}
                    </span>
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${styleClass} bg-black/20 backdrop-blur-md`}>
                      <CategoryIcon className="w-3 h-3" />
                      <span className="uppercase tracking-wider">{story.category}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-zinc-100 leading-snug mb-6 group-hover:text-orange-400 transition-colors">
                    {story.Title}
                  </h3>

                  {/* Footer Meta Data */}
                  <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between text-xs font-medium text-zinc-500 group-hover:text-zinc-400 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5" title="Points">
                        <ArrowUp className="w-3.5 h-3.5" />
                        <span>{story.Points}</span>
                      </div>
                      <div className="flex items-center gap-1.5" title="Author">
                        <User className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[80px]">{story.Author}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-zinc-600 group-hover:text-zinc-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{story.Post_Time}</span>
                    </div>
                  </div>
                </div>

                {/* External Link Indicator (Shows on Hover) */}
                <div className="absolute top-4 right-4 p-2 bg-white text-black rounded-full opacity-0 transform scale-75 translate-x-2 -translate-y-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 shadow-lg z-20">
                  <ExternalLink className="w-4 h-4" />
                </div>
              </article>
            );
          })}
        </div>

        {/* Footer */}
        <footer className="mt-20 border-t border-white/5 py-8 text-center">
            <p className="text-zinc-600 text-sm flex items-center justify-center gap-2">
              Made for the <span className="text-orange-500 font-bold">Hacker News</span> community
            </p>
        </footer>

      </main>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default App;
