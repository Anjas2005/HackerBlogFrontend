import { useState, useEffect, useRef } from 'react';
import { ExternalLink, MessageCircle, ArrowUp, Clock, User, TrendingUp, Zap, Star, Flame, Heart, AlertTriangle, Info } from 'lucide-react';

// Demo data fallback
const demoData = [
  {
    Rank: 1,
    Title: "Revolutionary AI Model Achieves Human-Level Reasoning",
    Points: 1247,
    Author: "tech_pioneer",
    Post_Time: "2 hours ago",
    Link_To_Article: "#demo",
    category: "ai"
  },
  {
    Rank: 2,
    Title: "Show HN: Built a Real-Time Collaboration Tool in 48 Hours",
    Points: 892,
    Author: "weekend_hacker",
    Post_Time: "4 hours ago",
    Link_To_Article: "#demo",
    category: "show"
  },
  {
    Rank: 3,
    Title: "Ask HN: What's the Best Way to Learn Quantum Computing?",
    Points: 645,
    Author: "curious_dev",
    Post_Time: "6 hours ago",
    Link_To_Article: "#demo",
    category: "ask"
  },
  {
    Rank: 4,
    Title: "Critical Security Vulnerability Found in Popular Framework",
    Points: 1156,
    Author: "security_expert",
    Post_Time: "1 hour ago",
    Link_To_Article: "#demo",
    category: "security"
  },
  {
    Rank: 5,
    Title: "NASA Discovers Water on Mars Using New Spectroscopy Method",
    Points: 2043,
    Author: "space_researcher",
    Post_Time: "8 hours ago",
    Link_To_Article: "#demo",
    category: "science"
  }
];


const categoryColors = {
  security: "from-red-400 via-pink-500 to-red-600",
  show: "from-purple-400 via-violet-500 to-purple-600",
  tech: "from-blue-400 via-cyan-500 to-blue-600",
  ask: "from-green-400 via-emerald-500 to-green-600",
  ai: "from-orange-400 via-amber-500 to-orange-600",
  science: "from-indigo-400 via-blue-500 to-indigo-600",
  default: "from-gray-400 via-gray-500 to-gray-600"
};

const categoryIcons = {
  security: Zap,
  show: Star,
  tech: TrendingUp,
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
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUsingDemoData, setIsUsingDemoData] = useState(false);
  const pollingTimer = useRef(null);

  useEffect(() => {
    const fetchNews = async () => {
      if (!loading) {
        setIsUpdating(true);
      }

      try {
        const response = await fetch(`${VITE_API_URL}`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const jsonData = await response.json();
        
        const dataWithCategory = jsonData.map(story => ({
          ...story,
          category: getCategoryFromTitle(story.Title)
        }));
        
        setData(dataWithCategory);
        setIsUsingDemoData(false);

      } catch (err) {
        console.error("Failed to fetch news:", err);
        
        // Use demo data as fallback
        const demoWithCategory = demoData.map(story => ({
          ...story,
          category: getCategoryFromTitle(story.Title)
        }));
        
        setData(demoWithCategory);
        setIsUsingDemoData(true);
        setError(null); // Clear error since we have demo data
        
      } finally {
        setLoading(false);
        setTimeout(() => setIsUpdating(false), 1000);
        
        // Schedule the next fetch in 10 seconds
        pollingTimer.current = setTimeout(fetchNews, 10000);
      }
    };

    fetchNews();

    return () => {
      if (pollingTimer.current) {
        clearTimeout(pollingTimer.current);
      }
    };
  }, []);

  const handleCardClick = (link) => {
    if (link === "#demo") {
      // Demo link behavior - could show a message or do nothing
      return;
    }
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center overflow-hidden px-4">
        <div className="relative">
          <div className="absolute -top-10 -left-10 sm:-top-20 sm:-left-20 w-20 h-20 sm:w-40 sm:h-40 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-10 -right-10 sm:-bottom-20 sm:-right-20 w-16 h-16 sm:w-32 sm:h-32 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-xl opacity-20 animate-bounce"></div>
          
          <div className="text-center z-10 relative">
            <div className="relative mb-6 sm:mb-8">
              <div className="inline-block animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 border-4 border-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 p-1">
                <div className="bg-gray-900 rounded-full w-full h-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-white animate-pulse" />
                </div>
              </div>
              <div className="absolute top-0 left-0 w-full h-full animate-spin" style={{ animationDuration: '3s' }}>
                <div className="absolute -top-2 left-1/2 w-2 h-2 sm:w-3 sm:h-3 bg-pink-400 rounded-full animate-pulse"></div>
                <div className="absolute top-1/2 -right-2 w-1 h-1 sm:w-2 sm:h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-2 left-1/2 w-2 h-2 sm:w-3 sm:h-3 bg-purple-400 rounded-full animate-pulse"></div>
                <div className="absolute top-1/2 -left-2 w-1 h-1 sm:w-2 sm:h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
                Loading Epic Stories...
              </h2>
              <div className="flex justify-center space-x-1">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-2 h-6 sm:h-8 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full animate-pulse ${
                      animationPhase > i ? 'opacity-100 scale-100' : 'opacity-30 scale-75'
                    } transition-all duration-300`}
                    style={{ animationDelay: `${i * 150}ms` }}
                  ></div>
                ))}
              </div>
              <p className="text-purple-200 font-medium animate-bounce text-sm sm:text-base">Preparing something amazing...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-x-hidden">
      {/* Animated Background Elements - Adjusted for mobile */}
      <div className="fixed top-5 left-5 sm:top-10 sm:left-10 w-36 h-36 sm:w-72 sm:h-72 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="fixed top-1/2 right-5 sm:right-10 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="fixed bottom-5 left-1/3 sm:bottom-10 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Header - Mobile optimized */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/10 border-b border-purple-500/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="relative group">
                <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transform transition-all duration-300">
                  <TrendingUp className="w-5 h-5 sm:w-8 sm:h-8 text-white animate-pulse" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 rounded-xl sm:rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              </div>
              <div>
                <h1 className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
                  HackerNews
                </h1>
                <p className="text-purple-200 font-bold text-xs sm:text-sm">🚀 Supercharged • 🎨 Animated • ✨ Epic</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-3 sm:px-6 py-2 sm:py-3 rounded-full border border-purple-400/30 backdrop-blur-sm transition-all duration-500"
                style={{boxShadow: isUpdating ? '0 0 15px #38bdf8' : 'none'}}>
                <div className={`w-2 h-2 sm:w-3 sm:h-3 ${isUpdating ? 'bg-cyan-400' : 'bg-green-400'} rounded-full animate-pulse shadow-lg`}></div>
                <span className="text-white font-bold text-xs sm:text-sm">{isUpdating ? 'UPDATING...' : '🔴 LIVE'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Demo Data Warning */}
      {isUsingDemoData && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl border border-yellow-400/30 p-4 mb-6">
            <div className="flex items-center space-x-3">
              <Info className="w-5 h-5 text-yellow-400 animate-pulse" />
              <div>
                <h3 className="text-yellow-300 font-bold text-sm sm:text-base">Demo Mode Active</h3>
                <p className="text-yellow-200 text-xs sm:text-sm">Unable to fetch live data. Showing demo stories for preview.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Mobile optimized */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10">
        <div className="mb-8 sm:mb-12 text-center">
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-4 animate-pulse">
            🔥 TRENDING STORIES 🔥
          </h2>
          <p className="text-lg sm:text-2xl text-purple-200 font-bold">The most epic tech stories right now!</p>
          <div className="flex justify-center mt-4 sm:mt-6">
            <div className="h-2 w-24 sm:w-32 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-full animate-pulse shadow-lg"></div>
          </div>
        </div>

        <div className="grid gap-6 sm:gap-8">
          {data.map((story, index) => {
            const CategoryIcon = categoryIcons[story.category] || categoryIcons.default;
            const colorGradient = categoryColors[story.category] || categoryColors.default;
            
            return (
              <article
                key={story.Rank}
                className={`group relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/20 hover:border-purple-400/50 transition-all duration-500 cursor-pointer shadow-2xl hover:shadow-purple-500/25 transform hover:-translate-y-1 sm:hover:-translate-y-2 hover:scale-102 sm:hover:scale-105 ${
                  hoveredCard === index ? 'shadow-cyan-500/30 border-cyan-400/50' : ''
                }`}
                onClick={() => handleCardClick(story.Link_To_Article)}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  animationDelay: `${index * 150}ms`,
                  animation: `slideInUp 0.6s ease-out forwards`
                }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${colorGradient} opacity-0 group-hover:opacity-10 rounded-2xl sm:rounded-3xl transition-opacity duration-500`}></div>
                
                {/* Floating Rank Badge - Mobile optimized */}
                <div className="absolute -left-3 -top-3 sm:-left-4 sm:-top-4 z-20">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${colorGradient} rounded-full flex items-center justify-center text-white font-black text-sm sm:text-lg shadow-2xl transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-300`}>
                    {story.Rank}
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-br ${colorGradient} rounded-full blur opacity-50 animate-pulse`}></div>
                </div>

                {/* Category Icon - Mobile optimized */}
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br ${colorGradient} rounded-full flex items-center justify-center shadow-lg group-hover:animate-spin`}>
                    <CategoryIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                </div>

                <div className="p-6 sm:p-8 pt-10 sm:pt-12">
                  {/* Title - Mobile optimized */}
                  <h3 className="text-lg sm:text-2xl font-black text-white mb-4 sm:mb-6 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:via-purple-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300 leading-tight">
                    {story.Title}
                  </h3>

                  {/* Meta Information - Mobile responsive grid */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-6 text-purple-200 mb-4 sm:mb-6">
                    <div className="flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 px-2 sm:px-4 py-1 sm:py-2 rounded-full border border-pink-400/30">
                      <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400 animate-bounce" />
                      <span className="font-black text-white text-sm sm:text-base">{story.Points}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-2 sm:px-4 py-1 sm:py-2 rounded-full border border-cyan-400/30">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                      <span className="font-bold text-cyan-300 text-sm sm:text-base truncate max-w-20 sm:max-w-none">{story.Author}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 px-2 sm:px-4 py-1 sm:py-2 rounded-full border border-green-400/30">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 animate-pulse" />
                      <span className="font-bold text-green-300 text-sm sm:text-base">{story.Post_Time}</span>
                    </div>
                  </div>

                  {/* Action Bar - Mobile stacked layout */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0 pt-4 sm:pt-6 border-t border-white/10">
                    <button className="flex items-center justify-center space-x-2 sm:space-x-3 text-purple-300 hover:text-white transition-colors duration-300 bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-purple-400/30 hover:border-purple-400/50 hover:scale-105 transform">
                      <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
                      <span className="font-bold text-sm sm:text-base">💬 Discuss</span>
                    </button>
                    
                    <div className="flex items-center justify-center space-x-2 sm:space-x-3 text-cyan-300 group-hover:text-white transition-colors duration-300 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-cyan-400/30 group-hover:border-cyan-400/50 group-hover:scale-105 transform">
                      <span className="font-bold text-sm sm:text-base">🚀 Read Story</span>
                      <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-300" />
                    </div>
                  </div>
                </div>

                {/* Hover Particles Effect */}
                <div className="absolute inset-0 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute top-4 left-8 w-1 h-1 sm:w-2 sm:h-2 bg-pink-400 rounded-full animate-ping"></div>
                  <div className="absolute top-12 right-12 w-1 h-1 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                  <div className="absolute bottom-8 left-12 w-1 h-1 sm:w-2 sm:h-2 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                  <div className="absolute bottom-12 right-8 w-1 h-1 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Epic Footer - Mobile optimized */}
        <footer className="mt-12 sm:mt-20 py-8 sm:py-12 text-center">
          <div className="inline-flex items-center space-x-3 sm:space-x-4 px-4 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 backdrop-blur-sm rounded-full border border-purple-400/30 hover:scale-105 sm:hover:scale-110 transform transition-all duration-300">
            <div className="flex space-x-1 sm:space-x-2">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400 animate-bounce" />
              <Star className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 animate-pulse" />
              <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 animate-bounce" style={{ animationDelay: '0.5s' }} />
            </div>
            <span className="text-white font-black text-sm sm:text-lg">🌟 Stay updated with the most EPIC tech stories! 🌟</span>
          </div>
        </footer>
      </main>

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default App;