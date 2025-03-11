"use client"

import type React from "react"

import { useState, useRef, type ReactNode, useEffect } from "react"

interface DraggableWindowProps {
  children: ReactNode
}

export default function DraggableWindow({ children }: DraggableWindowProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [size, setSize] = useState({ width: 800, height: 600 })
  const [isResizing, setIsResizing] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [startSize, setStartSize] = useState({ width: 800, height: 600 })

  const windowRef = useRef<HTMLDivElement>(null)

  // Center the window and set responsive size on initial render
  useEffect(() => {
    if (windowRef.current && typeof window !== "undefined") {
      // Responsive sizing
      const isMobile = window.innerWidth < 768
      const newWidth = isMobile ? Math.min(window.innerWidth - 32, 400) : Math.min(window.innerWidth - 64, 800)
      const newHeight = isMobile ? Math.min(window.innerHeight - 100, 500) : Math.min(window.innerHeight - 100, 600)

      setSize({ width: newWidth, height: newHeight })

      // Center positioning
      const x = (window.innerWidth - newWidth) / 2
      const y = (window.innerHeight - newHeight) / 4
      setPosition({ x, y })
      setStartSize({ width: newWidth, height: newHeight })
    }
  }, [])

  // Handle mouse movement for dragging and resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault()
        const dx = e.clientX - startPos.x
        const dy = e.clientY - startPos.y
        setPosition({
          x: position.x + dx,
          y: position.y + dy,
        })
        setStartPos({ x: e.clientX, y: e.clientY })
      }

      if (isResizing) {
        e.preventDefault()
        const dx = e.clientX - startPos.x
        const dy = e.clientY - startPos.y
        const newWidth = Math.max(400, startSize.width + dx)
        const newHeight = Math.max(300, startSize.height + dy)
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

        // On mobile, make window fill most of the screen
        if (isMobile) {
          const newWidth = Math.min(window.innerWidth - 32, 400)
          const newHeight = Math.min(window.innerHeight - 100, 500)

          setSize({ width: newWidth, height: newHeight })

          // Center the window
          const x = (window.innerWidth - newWidth) / 2
          const y = (window.innerHeight - newHeight) / 4
          setPosition({ x, y })
        }
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div
      ref={windowRef}
      className="absolute rounded-lg overflow-hidden shadow-2xl border border-gray-200"
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex: 50,
      }}
    >
      {/* Header - draggable area */}
      <div className="bg-gray-200 px-4 py-2 flex items-center cursor-move" onMouseDown={handleDragStart}>
        {children[0]}
      </div>

      {/* Main content */}
      <div className="h-[calc(100%-40px)] overflow-hidden">{children[1]}</div>

      {/* Resize handle */}
      <div
        className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize flex items-center justify-center"
        onMouseDown={handleResizeStart}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-gray-500"
        >
          <polyline points="22 12 18 12 18 8"></polyline>
          <polyline points="12 22 12 18 8 18"></polyline>
          <path d="M12 12L22 22"></path>
        </svg>
      </div>
    </div>
  )
}

