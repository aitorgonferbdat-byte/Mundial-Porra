import { getFlag } from '../utils/flags';

const Flag = ({ team, className = "w-6 h-4" }) => {
  const flagSrc = getFlag(team);
  
  if (!flagSrc) return null;

  // If it's a URL (from our new flags.js)
  if (flagSrc.startsWith('http')) {
    return (
      <img 
        src={flagSrc} 
        alt={team} 
        className={`${className} inline-block object-cover rounded-sm shadow-sm border border-slate-200`}
        loading="lazy"
      />
    );
  }

  // Fallback for emojis or other strings
  return <span className="text-xl leading-none">{flagSrc}</span>;
};

export default Flag;
