import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

type MobileNavControlsProps = {
  onUp: () => void;
  onDown: () => void;
  onLeft?: () => void;
  onRight?: () => void;
  onEnter: () => void;
  onReturn: () => void;
  mode?: 'default' | 'tetris';
};

export default function MobileNavControls({
  onUp,
  onDown,
  onLeft,
  onRight,
  onEnter,
  onReturn,
  mode = 'default'
}: MobileNavControlsProps) {
  const isMobile = useIsMobile();

  // Don't render anything on desktop to avoid interfering with keyboard navigation
  if (!isMobile) return null;

  const isTetrisMode = mode === 'tetris';

  return (
    <div className="fixed bottom-0 left-0 right-0 mx-auto flex justify-center gap-2 z-30 mobile-controls">
      <div className="flex items-center gap-2">
        {/* Left or Up Arrow */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            isTetrisMode && onLeft ? onLeft() : onUp();
          }}
          className="mobile-control-button flex items-center justify-center text-white"
          aria-label={isTetrisMode ? "Left" : "Up"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isTetrisMode ? (
              <path d="m15 18-6-6 6-6"/>
            ) : (
              <path d="m18 15-6-6-6 6"/>
            )}
          </svg>
        </button>

        {/* Right or Down Arrow */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            isTetrisMode && onRight ? onRight() : onDown();
          }}
          className="mobile-control-button flex items-center justify-center text-white"
          aria-label={isTetrisMode ? "Right" : "Down"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isTetrisMode ? (
              <path d="m9 18 6-6-6-6"/>
            ) : (
              <path d="m6 9 6 6 6-6"/>
            )}
          </svg>
        </button>

        {/* Up Arrow (Tetris) or Return (default) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            isTetrisMode ? onUp() : onReturn();
          }}
          className="mobile-control-button flex items-center justify-center text-white"
          aria-label={isTetrisMode ? "Rotate" : "Return to menu"}
        >
          {isTetrisMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m18 15-6-6-6 6"/>
            </svg>
          ) : (
            <span className="text-md font-mono">R</span>
          )}
        </button>

        {/* Down Arrow (Tetris) or Enter (default) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            isTetrisMode ? onDown() : onEnter();
          }}
          className="mobile-control-button flex items-center justify-center text-white"
          aria-label={isTetrisMode ? "Drop" : "Enter"}
        >
          {isTetrisMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          ) : (
            <span className="text-md font-mono">&gt;</span>
          )}
        </button>

        {/* Return button (Tetris mode only) */}
        {isTetrisMode && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReturn();
            }}
            className="mobile-control-button flex items-center justify-center text-white"
            aria-label="Return to menu"
          >
            <span className="text-md font-mono">R</span>
          </button>
        )}
      </div>
    </div>
  );
} 