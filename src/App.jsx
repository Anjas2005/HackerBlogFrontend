import { useState, useEffect, useRef } from 'react';
import LoadErr from './components/Home/Error';
import {URL} from "./config/config";
import { apiPaths } from './config/apiPaths';
import Header from './components/Header';
import Footer from './components/Footer';
import ColdStart from './components/Home/ColdStart';
import { getCategoryFromTitle } from './utils/utils';
import Home from './pages/Home';


function App() {

    // --- Logic State ---
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const pollingTimer = useRef(null);
    const isFetching = useRef(false); // concurrecy guard.

    useEffect(() => {
      const fetchNews = async () => {
        if (isFetching.current) return;
      
        isFetching.current = true;
        if (!loading) setIsUpdating(true);
      
        try {
          const response = await fetch(URL.BASE + apiPaths.hackerNews);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
        
          const jsonData = await response.json();
          // 1. Inferring category from title
          // 2. Sorting on basis of Rank. [Rank = Order of recency]
          setData(
            jsonData
              .map(story => ({
                ...story,
                category: getCategoryFromTitle(story.Title),
              }))
              .sort((a, b) => a.Rank - b.Rank)
          );
        } catch (err) {
          console.log(err.message)
          setError(err.message);
        } finally {
          isFetching.current = false;
          setLoading(false);
        
          setTimeout(() => setIsUpdating(false), 1000);
        
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

    // --- Keep Alive Logic (Dual Ping) ---
    useEffect(() => {
      const keepAlive = () => {
        // We use no-cors because we just want to hit the server to wake it up, we don't need the response here
        fetch(URL.SCRAPPER, { mode: "no-cors" }).catch(() => console.log("Waking Scraper..."));
        fetch(URL.BACKEND, { mode: "no-cors" }).catch(() => console.log("Waking Backend..."));
      };

      keepAlive(); // Immediate ping on mount
      const interval = setInterval(keepAlive, 30000); // Ping every 30s
      return () => clearInterval(interval);
    }, []);


    // --- UI Render ---

    // Error State
    if (error) 
      return <LoadErr error={error}/>

    // --- COOL LOADING STATE ---
    if (loading) 
      return <ColdStart loading={loading}/>


    // --- Main Feed UI ---
    return (
      <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-orange-500/30">

        {/* Background Pattern */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px), linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#09090b]/50 to-[#09090b]"></div>
        </div>

        <Header isUpdating={isUpdating} />

        {/* Main Content */}
        {/* Bro in future, treat this App.js file purely for routing and establish context for the data handling logic.
        
        For the moment, I've not established a context.
        */}
        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Home 
            data={data}
          />
          <Footer />

        </main>

        <style jsx global>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
  );
};

export default App;
