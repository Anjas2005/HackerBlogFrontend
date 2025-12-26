import SocialBtn from './ui/SocialLink'
import { Github, Linkedin } from 'lucide-react'
import UpdationIndicator from './ui/UpdationIndicator'
import { socials } from '../data/data'

const Header = ({isUpdating}) => {
  return (

    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-xl supports-[backdrop-filter]:bg-[#09090b]/60">
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
              <UpdationIndicator isUpdating={isUpdating}/>
              {/* Social Media Btns */}
              <nav>
                 {/* This is semantically incorrect btw. As the site doesn't have domestic navigation links.     Social Media hyperlinks are treated as nav section. */}
                <div className="flex items-center gap-4 pl-6 border-l border-white/5">
                    {socials.map((social,idx) => (
                      <SocialBtn
                        key={social.label+idx}
                        label={social.label}
                        link={social.link}
                        Icon={social.Icon}
                      />
                    ))}
                </div>
              </nav>
            </div>
          </div>
        </div>
      </header>
  )
}

export default Header
