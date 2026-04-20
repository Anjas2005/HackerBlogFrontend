export const handleCardClick = (link) => window.open(link, '_blank', 'noopener,noreferrer');

export const getCategoryFromTitle = (title) => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('security') || lowerTitle.includes('compromised') || lowerTitle.includes('vulnerability')) return 'security';
  if (lowerTitle.startsWith('show hn:')) return 'show';
  if (lowerTitle.startsWith('ask hn:')) return 'ask';
  if (lowerTitle.includes('ai') || lowerTitle.includes('machine learning') || lowerTitle.includes('llm')) return 'ai';
  if (lowerTitle.includes('quantum') || lowerTitle.includes('science') || lowerTitle.includes('nasa')) return 'science';
  return 'tech';
};