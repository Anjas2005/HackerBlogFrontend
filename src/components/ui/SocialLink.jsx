
const SocialBtn = ({
    Icon,
    label,
    link
}) => {
  return (
    <a 
      href={link}
      target="_blank" 
      rel="noreferrer"
      className="text-zinc-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
      aria-label={label}
    >
      <Icon className="w-5 h-5" />
    </a>
  )
}

export default SocialBtn
