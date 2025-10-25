"use client"

import { useState, useEffect } from "react"

type Props = {
  text: string
  speed?: number
  onComplete?: () => void
  skipAnimation?: boolean
  className?: string
}

export default function TypewriterEffect({
  text,
  speed = 20,
  onComplete,
  skipAnimation = false,
  className = ""
}: Props) {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(skipAnimation)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  // Check for reduced motion preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      setPrefersReducedMotion(mediaQuery.matches)

      const handleChange = () => setPrefersReducedMotion(mediaQuery.matches)
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  useEffect(() => {
    // If skipAnimation is true or user prefers reduced motion, immediately show the full text
    if (skipAnimation || prefersReducedMotion) {
      setDisplayedText(text);
      setCurrentIndex(text.length);
      setIsComplete(true);
      if (onComplete) {
        onComplete();
      }
      return;
    }

    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, speed)

      return () => clearTimeout(timeout)
    } else {
      setIsComplete(true)
      if (onComplete) {
        onComplete()
      }
    }
  }, [currentIndex, speed, text, onComplete, skipAnimation, prefersReducedMotion])

  // Add effect to handle Enter key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !isComplete) {
        setDisplayedText(text)
        setCurrentIndex(text.length)
        setIsComplete(true)
        if (onComplete) {
          onComplete()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [text, isComplete, onComplete])

  // Update when skipAnimation changes
  useEffect(() => {
    if (skipAnimation && !isComplete) {
      setDisplayedText(text);
      setCurrentIndex(text.length);
      setIsComplete(true);
      if (onComplete) {
        onComplete();
      }
    }
  }, [skipAnimation, isComplete, text, onComplete]);

  return (
    <div
      className={`whitespace-pre-line ${className}`}
      aria-live="polite"
      aria-atomic="false"
      role="status"
    >
      {displayedText}
      {!isComplete && <span className="animate-pulse" aria-hidden="true">▋</span>}
    </div>
  )
}

