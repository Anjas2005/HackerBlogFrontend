import { Radio, Server } from "lucide-react";
import {messages} from "../../data/data"
import { 
    useState, 
    useEffect 
} from "react";

const ColdStart = (
    loading
) => {

   const [loadingStep, setLoadingStep] = useState(0);

   // Change messages every 2 seconds.
   useEffect(() => {
    if (!loading) return;
        const interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % messages.length);
        }, 2000);

        return () => clearInterval(interval);
    }, [loading]);

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
    )
}

export default ColdStart;
