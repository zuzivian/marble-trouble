
import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  message: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  className?: string; // Still used for relative offsets if needed
  wide?: boolean;
  anchorRef?: React.RefObject<HTMLElement | null>; // New: allow passing a ref to auto-calculate position
}

const MasterTooltip: React.FC<Props> = ({ message, position, className = "", wide = false, anchorRef }) => {
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: -9999, left: -9999 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatePosition = () => {
      if (!anchorRef?.current) return;
      
      const rect = anchorRef.current.getBoundingClientRect();
      let top = 0;
      let left = 0;

      // Calculate center of anchor
      const anchorCenterX = rect.left + rect.width / 2;
      const anchorCenterY = rect.top + rect.height / 2;

      switch (position) {
        case 'top':
          top = rect.top - 20; // Some spacing
          left = anchorCenterX;
          break;
        case 'bottom':
          top = rect.bottom + 20;
          left = anchorCenterX;
          break;
        case 'left':
          top = anchorCenterY;
          left = rect.left - 20;
          break;
        case 'right':
          top = anchorCenterY;
          left = rect.right + 20;
          break;
      }

      setCoords({ top, left });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [anchorRef, position]);

  const arrowStyles = {
    top: 'bottom-[-8px] left-1/2 -translate-x-1/2 border-t-blue-500',
    bottom: 'top-[-8px] left-1/2 -translate-x-1/2 border-b-blue-500',
    left: 'right-[-8px] top-1/2 -translate-y-1/2 border-l-blue-500',
    right: 'left-[-8px] top-1/2 -translate-y-1/2 border-r-blue-500',
  };

  const transformClass = {
    top: '-translate-x-1/2 -translate-y-full',
    bottom: '-translate-x-1/2',
    left: '-translate-x-full -translate-y-1/2',
    right: '-translate-y-1/2',
  }[position];

  const maxWidthClass = wide 
    ? 'w-[90vw] max-w-[500px] md:max-w-[650px]' 
    : 'w-[80vw] max-w-[340px] md:max-w-[500px]';

  const portalRoot = document.getElementById('tooltip-root');
  if (!portalRoot) return null;

  return createPortal(
    <div 
      ref={tooltipRef}
      style={{ 
        position: 'fixed', 
        top: coords.top, 
        left: coords.left,
        zIndex: 99999 
      }}
      className={`pointer-events-none transform-gpu ${transformClass} ${className}`}
    >
      <div className="animate-float">
        <div className={`relative bg-slate-900 px-8 py-3 md:px-12 md:py-4 rounded-[2rem] border-2 border-blue-500 shadow-[0_30px_70px_rgba(0,0,0,0.9),0_0_50px_rgba(37,99,235,0.4)] ${maxWidthClass} ring-1 ring-white/10`}>
          {/* Avatar Head */}
          <div className="absolute -top-6 -left-10 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-600 to-indigo-900 border-2 border-white/30 rounded-full flex items-center justify-center text-3xl md:text-4xl shadow-2xl z-20">
            🧙‍♂️
          </div>

          <p className="text-[12px] md:text-[15px] font-black text-white uppercase tracking-tight leading-snug italic drop-shadow-sm text-center">
            "{message}"
          </p>
          
          {/* Arrow */}
          <div className={`absolute w-0 h-0 border-[10px] border-transparent ${arrowStyles[position]}`} />
        </div>
      </div>
    </div>,
    portalRoot
  );
};

export default MasterTooltip;