
import React from 'react';
import CoverVisual from './CoverVisual';

interface Props {
  coverId: string;
  jarIcon: string;
  isCatching?: boolean;
}

const TrapVisual: React.FC<Props> = ({ coverId, jarIcon, isCatching = false }) => {
  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-[200px] md:max-w-[500px] mx-auto group">
      {/* The Cover (Top Part) */}
      <div className={`relative z-20 transition-all duration-700 ease-in-out origin-bottom ${isCatching ? 'translate-y-4 md:translate-y-16 scale-y-75' : 'group-hover:-translate-y-8'}`}>
        <div className="scale-[1.2] md:scale-[2.2] lg:scale-[2.8] drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]">
          <CoverVisual coverId={coverId} />
        </div>
      </div>
      
      {/* The Connecting Beam / Glow - Tighter on mobile/tablet */}
      <div className={`w-[2px] md:w-[8px] h-6 md:h-32 bg-gradient-to-b from-blue-400/50 via-blue-500/20 to-transparent -mt-2 md:-mt-6 transition-opacity duration-500 ${isCatching ? 'opacity-100' : 'opacity-15'}`} />

      {/* The Vessel (Bottom Part) - Pulled closer on mobile with stronger negative margin */}
      <div className={`relative -mt-10 md:-mt-10 text-6xl md:text-[9rem] lg:text-[12rem] filter transition-all duration-700 ease-out select-none ${isCatching ? 'scale-110 brightness-150' : 'drop-shadow-[0_30px_55px_rgba(0,0,0,0.75)] group-hover:scale-105'}`}>
        <span className="inline-block transform-gpu">{jarIcon}</span>
        
        {/* Vessel "Internal" Glow */}
        <div className={`absolute inset-0 rounded-full blur-2xl md:blur-[100px] transition-all duration-1000 ${isCatching ? 'bg-blue-400/60 opacity-100 scale-125' : 'bg-blue-500/15 opacity-0 scale-50'}`} />
      </div>

      {/* Grounding Shadow */}
      <div className={`w-28 md:w-64 h-4 md:h-12 bg-black/60 blur-xl md:blur-[40px] rounded-full mt-4 md:mt-12 transition-all duration-700 ${isCatching ? 'scale-125 opacity-40' : 'opacity-80 scale-100'}`} />
    </div>
  );
};

export default TrapVisual;
