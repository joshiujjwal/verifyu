import React from 'react';
import { ShieldCheck, Diamond, Award, Star } from 'lucide-react';

interface LevelBadgeProps {
  level: 1 | 2 | 3 | 4;
  showText?: boolean;
}

const levelInfo = {
  1: { name: 'Bronze', icon: <Star className="w-full h-full" />, color: 'text-orange-400' },
  2: { name: 'Silver', icon: <Award className="w-full h-full" />, color: 'text-slate-400' },
  3: { name: 'Gold', icon: <ShieldCheck className="w-full h-full" />, color: 'text-yellow-400' },
  4: { name: 'Diamond', icon: <Diamond className="w-full h-full" />, color: 'text-cyan-400' },
};

const LevelBadge: React.FC<LevelBadgeProps> = ({ level, showText = true }) => {
  const { name, icon, color } = levelInfo[level] || levelInfo[1];

  return (
    <div className={`flex items-center gap-2 font-semibold ${color}`}>
      <div className="w-6 h-6">{icon}</div>
      {showText && <span>Level {level}: {name}</span>}
    </div>
  );
};

export default LevelBadge;