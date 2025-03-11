"use client"

import { useState, useEffect, type RefObject } from "react"

type Props = {
  text: string
  speed?: number
  mistakeProbability?: number
  pauseProbability?: number
  scrollContainer?: RefObject<HTMLDivElement>
}

export default function HumanTypewriter({
  text,
  speed = 50,
  mistakeProbability = 0.02,
  pauseProbability = 0.1,
  scrollContainer,
}: Props) {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [isMakingMistake, setIsMakingMistake] = useState(false)
  const [mistake, setMistake] = useState("")
  const [isPaused, setIsPaused] = useState(false)

  const getRandomSpeed = () => {
    // Simulate variable typing speed
    return Math.floor(speed * (0.5 + Math.random()))
  }

  const getRandomChar = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz,.;'[]"
    return chars[Math.floor(Math.random() * chars.length)]
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
      } else if (isMakingMistake) {
        // Simulate making a mistake
        if (mistake.length < 3) {
          // Add a random character as a mistake
          timeout = setTimeout(() => {
            const newChar = getRandomChar()
            setMistake((prev) => prev + newChar)
          }, getRandomSpeed())
        } else {
          // Start deleting the mistake
          timeout = setTimeout(() => {
            setMistake((prev) => prev.slice(0, -1))
            if (mistake.length === 1) {
              setIsMakingMistake(false)
            }
          }, getRandomSpeed())
        }
      } else {
        // Normal typing
        timeout = setTimeout(() => {
          // Decide if we should make a mistake
          if (Math.random() < mistakeProbability && text[currentIndex] !== " " && !text[currentIndex].match(/\n/)) {
            setIsMakingMistake(true)
          }
          // Decide if we should pause
          else if (Math.random() < pauseProbability && text[currentIndex].match(/[.,!?;:]/)) {
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
    isMakingMistake,
    mistake,
    isPaused,
    mistakeProbability,
    pauseProbability,
    scrollContainer,
  ])

  return (
    <div className="whitespace-pre-line">
      {displayedText}
      {isMakingMistake && mistake}
      {!isComplete && <span className="animate-pulse">▋</span>}
    </div>
  )
}

