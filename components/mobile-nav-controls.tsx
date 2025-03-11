import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

type MobileNavControlsProps = {
  onUp: () => void;
  onDown: () => void;
  onEnter: () => void;
  onReturn: () => void;
};

export default function MobileNavControls({ 
  onUp, 
  onDown, 
  onEnter, 
  onReturn 
}: MobileNavControlsProps) {
  const isMobile = useIsMobile();
  
  // Don't render anything on desktop to avoid interfering with keyboard navigation
  if (!isMobile) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 mx-auto flex justify-center gap-2 z-30 mobile-controls">
      <div className="flex items-center gap-2">
        {/* Arrow Up */}
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Prevent event bubbling
            onUp();
          }}
          className="mobile-control-button flex items-center justify-center text-white"
          aria-label="Up"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m18 15-6-6-6 6"/>
          </svg>
        </button>
        
        {/* Arrow Down */}
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Prevent event bubbling
            onDown();
          }}
          className="mobile-control-button flex items-center justify-center text-white"
          aria-label="Down"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>
        
        {/* Return */}
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Prevent event bubbling
            onReturn();
          }}
          className="mobile-control-button flex items-center justify-center text-white"
          aria-label="Return to menu"
        >
          <span className="text-md font-mono">R</span>
        </button>
        
        {/* Enter */}
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Prevent event bubbling
            onEnter();
          }}
          className="mobile-control-button flex items-center justify-center text-white"
          aria-label="Enter"
        >
          <span className="text-md font-mono">&gt;</span>
        </button>
      </div>
    </div>
  );
} 