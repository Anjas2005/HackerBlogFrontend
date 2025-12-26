import { handleCardClick } from '../../utils/utils'
import { ArrowUp, Clock, ExternalLink, User } from 'lucide-react'

const NewsCard = ({
    CategoryIcon,
    gradientClass,
    styleClass,
    index,
    story,
}) => {
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
  )
}

export default NewsCard;
