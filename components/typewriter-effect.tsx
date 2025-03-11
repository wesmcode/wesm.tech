"use client"

import { useState, useEffect } from "react"

type Props = {
  text: string
  speed?: number
  onComplete?: () => void
}

export default function TypewriterEffect({ text, speed = 20, onComplete }: Props) {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
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
  }, [currentIndex, speed, text, onComplete])

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

  return (
    <div className="whitespace-pre-line">
      {displayedText}
      {!isComplete && <span className="animate-pulse">▋</span>}
    </div>
  )
}

