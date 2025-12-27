
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
      {/* Binding Mechanism (The Top Seal) */}
      <div className={`relative z-20 transition-all duration-700 ease-in-out origin-bottom ${isCatching ? 'translate-y-6 md:translate-y-20 scale-y-90' : 'group-hover:-translate-y-4'}`}>
        <div className="scale-[1.2] md:scale-[2.4] lg:scale-[3.0] drop-shadow-[0_15px_40px_rgba(0,0,0,0.8)]">
          <CoverVisual coverId={coverId} />
        </div>
        {isCatching && (
           <div className="absolute inset-0 bg-amber-400/20 blur-2xl animate-pulse rounded-full" />
        )}
      </div>
      
      {/* Imperial Energy Stream */}
      <div className={`w-[2px] md:w-[6px] h-8 md:h-36 bg-gradient-to-b from-amber-400/80 via-amber-600/30 to-transparent -mt-2 md:-mt-8 transition-all duration-500 ${isCatching ? 'opacity-100 scale-x-150' : 'opacity-20'}`} />

      {/* The Vessel - Tang Lacquer aesthetic */}
      <div className={`relative -mt-12 md:-mt-12 text-6xl md:text-[10rem] lg:text-[14rem] filter transition-all duration-700 ease-out select-none ${isCatching ? 'scale-110 brightness-125' : 'drop-shadow-[0_40px_60px_rgba(0,0,0,0.9)] group-hover:scale-105'}`}>
        <span className="inline-block transform-gpu drop-shadow-[0_0_15px_rgba(251,191,36,0.2)]">{jarIcon}</span>
        
        {/* Internal Spirit Glow */}
        <div className={`absolute inset-0 rounded-full blur-2xl md:blur-[120px] transition-all duration-1000 ${isCatching ? 'bg-amber-400/40 opacity-100 scale-150' : 'bg-red-500/10 opacity-0 scale-50'}`} />
      </div>

      {/* Grounding Shadow (Imperial Court Floor) */}
      <div className={`w-32 md:w-80 h-5 md:h-16 bg-black/80 blur-2xl md:blur-[60px] rounded-full mt-6 md:mt-16 transition-all duration-700 ${isCatching ? 'scale-150 opacity-50' : 'opacity-100 scale-100'}`} />
    </div>
  );
};

export default TrapVisual;
