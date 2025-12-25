
import React from 'react';
import { Marble } from '../types';

interface Props {
  marble: Marble;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const MarbleVisual: React.FC<Props> = ({ marble, size = 'md' }) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48'
  };

  const getOverlay = () => {
    switch (marble.visualType) {
      case 'swirl':
        return <div className="absolute inset-0 rounded-full opacity-40 mix-blend-overlay bg-gradient-to-br from-white via-transparent to-black rotate-45" />;
      case 'sparkle':
        return <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.8)_1px,transparent_1px)] bg-[length:8px_8px] opacity-60" />;
      case 'metallic':
        return <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-black/40 via-white/40 to-black/40" />;
      case 'clear':
        return <div className="absolute inset-1 rounded-full border border-white/30 bg-white/10" />;
      default:
        return null;
    }
  };

  return (
    <div 
      className={`relative ${sizeMap[size]} rounded-full shadow-2xl transition-transform hover:scale-105 overflow-hidden`}
      style={{ 
        backgroundColor: marble.color,
        boxShadow: `inset -4px -4px 12px rgba(0,0,0,0.5), inset 4px 4px 12px rgba(255,255,255,0.3), 0 10px 20px rgba(0,0,0,0.3)`
      }}
    >
      <div className="absolute top-1 left-2 w-1/3 h-1/4 bg-white/40 rounded-full blur-[2px]" />
      {getOverlay()}
    </div>
  );
};

export default MarbleVisual;
