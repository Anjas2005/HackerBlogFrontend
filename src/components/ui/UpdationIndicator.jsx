const UpdationIndicator = ({isUpdating}) => {
  return (
    <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-500 ${
        isUpdating 
          ? 'border-orange-500/30 bg-orange-500/10 text-orange-400' 
          : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
      }`}>
      <div className={`w-2 h-2 rounded-full ${isUpdating ? 'bg-orange-500 animate-ping' : 'bg-emerald-500'}`}></div>
      <span className="text-xs font-bold tracking-wide">{isUpdating ? 'SYNCING' : 'LIVE'}</span>
    </div>

  )
}

export default UpdationIndicator
