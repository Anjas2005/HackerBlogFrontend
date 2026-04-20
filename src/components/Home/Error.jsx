import { 
    AlertTriangle, 
    RefreshCw 
} from "lucide-react"

const LoadError = ({error}) => {
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
            {error ?? ''} 
          </p>
          <button onClick={() => window.location.reload()} className="w-full py-3 bg-red-600 hover:bg-red-500 transition-colors rounded-lg font-bold flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4" /> Retry Connection
          </button>
      </div>
    </div>
  )
}

export default LoadError
