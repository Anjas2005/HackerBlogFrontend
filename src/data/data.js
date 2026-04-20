import {
    Zap,
    Star,
    Terminal,
    MessageCircle,
    Flame,
    Heart,
    TrendingUp,
    Linkedin,
    Github
} from "lucide-react"

// Messages to show during loading state activity.
export const messages = [
    "Establishing secure connection...",
    "Waking up Render instances...",
    "Syncing with Hacker News...",
    "Decrypting headlines...",
    "Almost there..."
];

// Luicide Icon map based on icon category.
export const categoryIcons = {
  security: Zap,
  show: Star,
  tech: Terminal,
  ask: MessageCircle,
  ai: Flame,
  science: Heart,
  default: TrendingUp
};

export const socials = [
  {
    label: "GitHub",
    link: "https://github.com/Anjas2005/",
    Icon: Github
  },
  {
    label: "LinkedIn",
    link: "https://www.linkedin.com/in/anjas-vaidya2020/",
    Icon: Linkedin
  }
];