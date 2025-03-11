"use client"

import { useState, useEffect, type RefObject } from "react"

type Props = {
  text: string
  speed?: number
  pauseProbability?: number
  scrollContainer?: RefObject<HTMLDivElement | null>
}

export default function HumanTypewriter({
  text,
  speed = 50,
  pauseProbability = 0.1,
  scrollContainer,
}: Props) {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const getRandomSpeed = () => {
    // Simulate variable typing speed
    return Math.floor(speed * (0.5 + Math.random()))
  }

  useEffect(() => {
    if (currentIndex < text.length) {
      let timeout: NodeJS.Timeout

      if (isPaused) {
        // Simulate a pause in typing
        timeout = setTimeout(
          () => {
            setIsPaused(false)
          },
          Math.random() * 1000 + 500,
        )
      } else {
        // Normal typing
        timeout = setTimeout(() => {
          // Decide if we should pause
          if (Math.random() < pauseProbability && text[currentIndex].match(/[.,!?;:]/)) {
            setIsPaused(true)
          }
          // Regular typing
          else {
            setDisplayedText((prev) => prev + text[currentIndex])
            setCurrentIndex((prev) => prev + 1)

            // Auto-scroll if container is provided
            if (scrollContainer?.current) {
              scrollContainer.current.scrollTop = scrollContainer.current.scrollHeight
            }
          }
        }, getRandomSpeed())
      }

      return () => clearTimeout(timeout)
    } else {
      setIsComplete(true)
    }
  }, [
    currentIndex,
    speed,
    text,
    isPaused,
    pauseProbability,
    scrollContainer,
  ])

  // Add effect to handle Enter key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !isComplete) {
        setDisplayedText(text)
        setCurrentIndex(text.length)
        setIsComplete(true)
        setIsPaused(false)
        
        // Auto-scroll if container is provided
        if (scrollContainer?.current) {
          scrollContainer.current.scrollTop = scrollContainer.current.scrollHeight
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [text, isComplete, scrollContainer])

  return (
    <div className="whitespace-pre-line">
      {displayedText}
      {!isComplete && <span className="animate-pulse">▋</span>}
    </div>
  )
}

