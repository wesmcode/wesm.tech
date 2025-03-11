"use client"

import type React from "react"

import { useState, useRef, type ReactNode, useEffect } from "react"

interface DraggableWindowProps {
  children: ReactNode
  isFullscreen?: boolean
}

export default function DraggableWindow({ children, isFullscreen = false }: DraggableWindowProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [size, setSize] = useState({ width: 800, height: 600 })
  const [isResizing, setIsResizing] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [startSize, setStartSize] = useState({ width: 800, height: 600 })
  const [previousState, setPreviousState] = useState<{ position: { x: number, y: number }, size: { width: number, height: number } } | null>(null)
  const [isAtBoundary, setIsAtBoundary] = useState({
    top: false,
    right: false,
    bottom: false,
    left: false
  })

  const windowRef = useRef<HTMLDivElement>(null)
  const latestStateRef = useRef({ position, size })
  const boundaryRef = useRef(isAtBoundary)
  
  // Keep the refs updated with the latest state
  useEffect(() => {
    latestStateRef.current = { position, size }
  }, [position, size])
  
  useEffect(() => {
    boundaryRef.current = isAtBoundary
  }, [isAtBoundary])

  // Now add this at beginning of component function, just after the state declarations
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

  // And update the initial centering useEffect to ensure mobile is fullscreen
  useEffect(() => {
    if (windowRef.current && typeof window !== "undefined") {
      // Responsive sizing
      const isMobile = window.innerWidth < 768
      
      if (isMobile) {
        // On mobile, make it fullscreen - use window.innerWidth directly
        setSize({ 
          width: window.innerWidth, 
          height: window.innerHeight 
        })
        setPosition({ x: 0, y: 0 })
      } else {
        // For desktop, maintain the normal behavior
        const newWidth = Math.min(window.innerWidth - 64, 800)
        const newHeight = Math.min(window.innerHeight - 100, 600)

        setSize({ width: newWidth, height: newHeight })

        // Center positioning
        const x = (window.innerWidth - newWidth) / 2
        const y = (window.innerHeight - newHeight) / 4
        setPosition({ x, y })
      }
      
      setStartSize({ 
        width: isMobile ? window.innerWidth : Math.min(window.innerWidth - 64, 800),
        height: isMobile ? window.innerHeight : Math.min(window.innerHeight - 100, 600)
      })
    }
  }, [])

  // Handle fullscreen toggle
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isFullscreen) {
        // Save current position and size before going fullscreen
        if (!previousState) {
          setPreviousState({
            position: { ...latestStateRef.current.position },
            size: { ...latestStateRef.current.size }
          })
        }
        
        // Set to fullscreen (respecting screen size)
        setPosition({ x: 0, y: 0 })
        setSize({ 
          width: window.innerWidth,
          height: window.innerHeight
        })
      } else if (previousState) {
        // Restore previous position and size
        setPosition(previousState.position)
        setSize(previousState.size)
        setPreviousState(null)
      }
    }
  }, [isFullscreen, previousState])

  // Handle mouse movement for dragging and resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault()
        const dx = e.clientX - startPos.x
        const dy = e.clientY - startPos.y
        
        // Calculate new position
        let newX = position.x + dx
        let newY = position.y + dy
        
        // Add constraints to keep window within viewport
        const boundaries = {
          top: false,
          right: false,
          bottom: false,
          left: false
        }
        
        if (typeof window !== "undefined") {
          // Check left boundary
          if (newX <= 0) {
            newX = 0
            boundaries.left = true
          }
          
          // Check right boundary
          if (newX >= window.innerWidth - size.width) {
            newX = window.innerWidth - size.width
            boundaries.right = true
          }
          
          // Check top boundary
          if (newY <= 0) {
            newY = 0
            boundaries.top = true
          }
          
          // Check bottom boundary
          if (newY >= window.innerHeight - size.height) {
            newY = window.innerHeight - size.height
            boundaries.bottom = true
          }
        }
        
        // Update boundary state
        setIsAtBoundary(boundaries)
        
        setPosition({
          x: newX,
          y: newY,
        })
        setStartPos({ x: e.clientX, y: e.clientY })
      }

      if (isResizing) {
        e.preventDefault()
        const dx = e.clientX - startPos.x
        const dy = e.clientY - startPos.y
        
        // Calculate new size
        let newWidth = Math.max(400, startSize.width + dx)
        let newHeight = Math.max(300, startSize.height + dy)
        
        // Add constraints to keep window within viewport
        const boundaries = { ...boundaryRef.current };
        
        if (typeof window !== "undefined") {
          // Check right boundary when resizing
          if (position.x + newWidth >= window.innerWidth) {
            newWidth = window.innerWidth - position.x
            boundaries.right = true
          } else {
            boundaries.right = false
          }
          
          // Check bottom boundary when resizing
          if (position.y + newHeight >= window.innerHeight) {
            newHeight = window.innerHeight - position.y
            boundaries.bottom = true
          } else {
            boundaries.bottom = false
          }
        }
        
        // Update boundary state
        setIsAtBoundary(boundaries)
        
        setSize({
          width: newWidth,
          height: newHeight,
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, isResizing, position, size, startPos, startSize])

  // Start dragging from the header
  const handleDragStart = (e: React.MouseEvent) => {
    if (e.target instanceof HTMLButtonElement) return
    e.preventDefault()
    setIsDragging(true)
    setStartPos({ x: e.clientX, y: e.clientY })
  }

  // Start resizing from the corner
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
    setStartPos({ x: e.clientX, y: e.clientY })
    setStartSize({ width: size.width, height: size.height })
  }

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        const isMobile = window.innerWidth < 768
        
        if (isMobile || isFullscreen) {
          // For mobile or fullscreen, take up the entire viewport
          setSize({ 
            width: window.innerWidth, 
            height: window.innerHeight 
          })
          setPosition({ x: 0, y: 0 })
        } else {
          // Desktop normal window behavior
          const currentPosition = latestStateRef.current.position;
          const currentSize = latestStateRef.current.size;
          const boundaries = { ...boundaryRef.current };
          let newX = currentPosition.x;
          let newY = currentPosition.y;
          let newWidth = currentSize.width;
          let newHeight = currentSize.height;

          // For desktop, ensure window stays within viewport after resize
          if (newX + newWidth > window.innerWidth) {
            if (newWidth > window.innerWidth) {
              newWidth = window.innerWidth;
              newX = 0;
              boundaries.left = true;
              boundaries.right = true;
            } else {
              newX = window.innerWidth - newWidth;
              boundaries.right = true;
            }
          }

          if (newY + newHeight > window.innerHeight) {
            if (newHeight > window.innerHeight) {
              newHeight = window.innerHeight;
              newY = 0;
              boundaries.top = true;
              boundaries.bottom = true;
            } else {
              newY = window.innerHeight - newHeight;
              boundaries.bottom = true;
            }
          }

          setPosition({ x: newX, y: newY });
          setSize({ width: newWidth, height: newHeight });
          setIsAtBoundary(boundaries);
        }
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [isFullscreen])

  return (
    <div
      ref={windowRef}
      className={`flex flex-col overflow-hidden ${isMobile ? 'mobile-terminal' : 'rounded-lg border shadow-lg'}`}
      style={{
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        zIndex: 10,
        maxWidth: "100vw",
        maxHeight: "100vh",
        ...(isMobile && { 
          width: "100vw", 
          height: "calc(100vh - 50px)",
          top: "0",
          left: "0",
          maxWidth: "100vw",
          maxHeight: "calc(100vh - 50px)",
          borderRadius: "0",
          border: "none",
          boxShadow: "none"
        })
      }}
    >
      {/* Header - draggable area */}
      <div 
        className="bg-gray-200 px-4 py-2 flex items-center cursor-move" 
        onMouseDown={isFullscreen ? undefined : handleDragStart}
      >
        {Array.isArray(children) ? children[0] : null}
      </div>

      {/* Main content */}
      <div className="h-[calc(100%-40px)] overflow-hidden">
        {Array.isArray(children) ? children[1] : children}
      </div>

      {/* Resize handle - hide on mobile or fullscreen */}
      {!isFullscreen && !isMobile && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          onMouseDown={handleResizeStart}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-400"
          >
            <path
              d="M22 22L12 22M22 22L22 12M22 22L11 11"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </div>
  )
}

