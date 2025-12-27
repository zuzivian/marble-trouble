import React from 'react';
import { Marble } from '../types';

interface Props {
  marble: Marble;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isSilhouette?: boolean;
}

const MarbleVisual: React.FC<Props> = ({ marble, size = 'md', isSilhouette = false }) => {
  const sizeMap = {
    xs: 'w-5 h-5',
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48'
  };

  const getOverlay = () => {
    if (isSilhouette) return null;
    switch (marble.visualType) {
      case 'swirl':
        return (
          <>
            <div className="absolute inset-0 rounded-full opacity-30 mix-blend-overlay bg-gradient-to-br from-white via-transparent to-black rotate-45" />
            <div className="absolute inset-[15%] rounded-full opacity-40 border-l-[3px] border-white/20 blur-[1px] rotate-[15deg]" />
          </>
        );
      case 'sparkle':
        return <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.9)_1px,transparent_1.5px)] bg-[length:6px_6px] opacity-70" />;
      case 'metallic':
        return (
          <>
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-black/50 via-white/30 to-black/50" />
            <div className="absolute inset-0 rounded-full opacity-20 bg-white mix-blend-soft-light" />
          </>
        );
      case 'clear':
        return <div className="absolute inset-2 rounded-full border-[1.5px] border-white/30 bg-white/5 backdrop-blur-[1px]" />;
      default:
        return null;
    }
  };

  return (
    <div 
      className={`relative ${sizeMap[size]} rounded-full transition-transform hover:scale-110 overflow-hidden shrink-0 transform-gpu 
        ${isSilhouette ? 'grayscale brightness-0 opacity-20' : 'animate-pulse-alive'}`}
      style={{ 
        backgroundColor: isSilhouette ? '#1e293b' : marble.color,
        boxShadow: isSilhouette 
          ? 'inset -1px -1px 4px rgba(0,0,0,0.8)' 
          : `inset -4px -4px 12px rgba(0,0,0,0.5), inset 4px 4px 12px rgba(255,255,255,0.4), 0 8px 16px rgba(0,0,0,0.4)`
      }}
    >
      {/* Primary Reflection Highlight */}
      {!isSilhouette && (
        <div className="absolute top-[10%] left-[15%] w-[40%] h-[30%] bg-white/40 rounded-full blur-[1px] rotate-[-25deg] shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
      )}
      
      {/* Secondary Bottom Reflection */}
      {!isSilhouette && (
        <div className="absolute bottom-[10%] right-[15%] w-[20%] h-[15%] bg-white/20 rounded-full blur-[2px]" />
      )}
      
      {getOverlay()}
      
      {/* Final Glass Shine Polish */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
    </div>
  );
};

export default MarbleVisual;