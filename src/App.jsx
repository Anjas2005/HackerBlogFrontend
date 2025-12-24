import { useState, useEffect, useRef } from 'react';
import { 
  ExternalLink, MessageCircle, ArrowUp, Clock, User, 
  TrendingUp, Zap, Star, Flame, Heart, AlertTriangle, 
  Github, Linkedin, Terminal, RefreshCw, Server, Radio, Wifi 
} from 'lucide-react';
import API_BASE from "./config";

// --- Configuration & Constants ---

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

function App() {
  // --- Logic State ---
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0); // For the loading animation text
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

  // --- Keep Alive Logic (Dual Ping) ---
  useEffect(() => {
    const SCRAPER_URL = "https://hackernewsscraper-7x6b.onrender.com/";
    const BACKEND_URL = "https://hackerblogbackend.onrender.com"; // Added Backend URL

    const keepAlive = () => {
      // We use no-cors because we just want to hit the server to wake it up, we don't need the response here
      fetch(SCRAPER_URL, { mode: "no-cors" }).catch(() => console.log("Waking Scraper..."));
      fetch(BACKEND_URL, { mode: "no-cors" }).catch(() => console.log("Waking Backend..."));
    };

    keepAlive(); // Immediate ping on mount
    const interval = setInterval(keepAlive, 30000); // Ping every 30s
    return () => clearInterval(interval);
  }, []);

  // --- Loading Animation Text Cycler ---
  useEffect(() => {
    if (!loading) return;
    
    const messages = [
      "Establishing secure connection...",
      "Waking up Render instances...",
      "Syncing with Hacker News...",
      "Decrypting headlines...",
      "Almost there..."
    ];

    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev + 1) % messages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [loading]);

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

  // --- COOL LOADING STATE ---
  if (loading) {
    const messages = [
      "Establishing secure connection...",
      "Waking up Render instances...",
      "Syncing with Hacker News...",
      "Decrypting headlines...",
      "Almost there..."
    ];

    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center relative overflow-hidden font-mono">
        {/* Matrix/Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-[#09090b]/80"></div>
        
        <div className="relative z-10 flex flex-col items-center max-w-sm w-full p-4">
          
          {/* Animated Server Icon */}
          <div className="relative mb-12">
            {/* Ping Circles */}
            <div className="absolute inset-0 rounded-full bg-orange-500/20 animate-ping"></div>
            <div className="absolute inset-0 rounded-full bg-orange-500/10 animate-ping delay-75"></div>
            
            {/* Center Icon */}
            <div className="relative bg-zinc-900 border border-orange-500/30 p-6 rounded-2xl shadow-[0_0_30px_-5px_rgba(249,115,22,0.3)]">
              <Server className="w-10 h-10 text-orange-500 animate-pulse" />
              <div className="absolute -top-2 -right-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                </span>
              </div>
            </div>
          </div>

          {/* Text Status */}
          <div className="flex flex-col items-center space-y-4 w-full">
            <div className="flex items-center gap-2 text-orange-500/80 text-xs tracking-widest uppercase">
              <Radio className="w-3 h-3 animate-pulse" />
              <span>System Boot</span>
            </div>
            
            <div className="h-8 overflow-hidden relative w-full text-center">
               <h2 className="text-lg text-zinc-200 font-bold transition-all duration-500 transform animate-fade-in-up">
                 {messages[loadingStep]}
               </h2>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-zinc-800/50 rounded-full h-1 mt-4 overflow-hidden border border-white/5">
              <div className="bg-gradient-to-r from-orange-600 to-yellow-500 h-full rounded-full animate-progress w-full origin-left"></div>
            </div>
            
            <p className="text-zinc-500 text-xs mt-2">
              Waiting for backend cold start...
            </p>
          </div>
        </div>

        <style jsx>{`
          @keyframes progress {
            0% { transform: scaleX(0); }
            50% { transform: scaleX(0.7); }
            100% { transform: scaleX(1); }
          }
        `}</style>
      </div>
    );
  }

  // --- Main Feed UI ---
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
