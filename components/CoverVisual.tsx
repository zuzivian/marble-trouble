
import React from 'react';

interface Props {
  coverId: string;
}

const CoverVisual: React.FC<Props> = ({ coverId }) => {
  const renderCover = () => {
    switch (coverId) {
      case 'wooden_snapper':
        return (
          <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Wooden Base */}
            <rect x="20" y="30" width="60" height="40" rx="8" fill="#5c4033" />
            <rect x="25" y="35" width="50" height="30" rx="4" fill="#7b5e4f" />
            {/* Metal Spring */}
            <path d="M40 70V50C40 45 45 40 50 40C55 40 60 45 60 50V70" stroke="#94a3b8" strokeWidth="4" />
            <path d="M35 75C35 75 42 65 50 65C58 65 65 75 65 75" stroke="#4a3728" strokeWidth="6" strokeLinecap="round" />
            {/* Clamping "Snap" Mechanism */}
            <rect x="30" y="20" width="40" height="8" rx="2" fill="#3e2723" />
            <circle cx="50" cy="24" r="2" fill="#fbbf24" />
          </svg>
        );
      case 'clockwork_cage':
        return (
          <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Brass Outer Ring */}
            <circle cx="50" cy="50" r="40" stroke="#d97706" strokeWidth="3" />
            <circle cx="50" cy="50" r="35" stroke="#f59e0b" strokeWidth="1" />
            {/* Rotating Gear Center */}
            <g className="animate-[spin_10s_linear_infinite] origin-center">
              <circle cx="50" cy="50" r="10" fill="#92400e" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
                <rect key={deg} x="48" y="35" width="4" height="6" rx="1" fill="#92400e" transform={`rotate(${deg}, 50, 50)`} />
              ))}
            </g>
            {/* Cage Bars */}
            <path d="M20 30L80 70M80 30L20 70" stroke="#fef3c7" strokeWidth="2" strokeOpacity="0.5" />
            <path d="M50 10V90M10 50H90" stroke="#fef3c7" strokeWidth="1" strokeOpacity="0.3" />
          </svg>
        );
      case 'gilded_clasp':
        return (
          <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Golden Fingers */}
            <defs>
              <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fde047" />
                <stop offset="100%" stopColor="#a16207" />
              </linearGradient>
            </defs>
            {/* Top Claw */}
            <path d="M30 15C30 15 50 10 70 15L65 30H35L30 15Z" fill="url(#goldGrad)" />
            {/* Bottom Claw */}
            <path d="M30 85C30 85 50 90 70 85L65 70H35L30 85Z" fill="url(#goldGrad)" />
            {/* Mechanical Joints */}
            <circle cx="35" cy="50" r="6" fill="#713f12" />
            <circle cx="65" cy="50" r="6" fill="#713f12" />
            <rect x="35" y="47" width="30" height="6" fill="#ca8a04" />
            {/* Jeweled Center */}
            <circle cx="50" cy="50" r="4" fill="#ef4444" className="animate-pulse" />
          </svg>
        );
      case 'chrono_vacuum':
        return (
          <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="vacuumCore" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#1e3a8a" />
              </radialGradient>
            </defs>
            {/* Metallic Shielding */}
            <rect x="20" y="20" width="60" height="60" rx="12" fill="#334155" />
            <circle cx="50" cy="50" r="25" fill="#1e293b" stroke="#60a5fa" strokeWidth="2" strokeDasharray="4 2" className="animate-[spin_4s_linear_infinite]" />
            {/* Pulsating Singularity */}
            <circle cx="50" cy="50" r="12" fill="url(#vacuumCore)" className="animate-pulse" />
            {/* Blue Energy Lines */}
            <path d="M50 10V20M50 80V90M10 50H20M80 50H90" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
            <circle cx="50" cy="50" r="45" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.2" />
          </svg>
        );
      default:
        return (
          <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center">
            <span className="text-2xl">⚙️</span>
          </div>
        );
    }
  };

  return (
    <div className="relative flex items-center justify-center drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]">
      {renderCover()}
    </div>
  );
};

export default CoverVisual;
