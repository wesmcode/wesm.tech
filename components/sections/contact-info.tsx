"use client"

import { useState, useEffect, useRef } from "react"
import TypewriterEffect from "../typewriter-effect"

type Props = {
  onReturn: () => void
}

export default function ContactInfo({ onReturn }: Props) {
  const [showContent, setShowContent] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  // Handle 'r' key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "r") {
        onReturn()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onReturn])

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const scrollToBottom = () => {
    if (sectionRef.current) {
      const parentElement = sectionRef.current.parentElement
      if (parentElement) {
        parentElement.scrollTop = parentElement.scrollHeight
      }
    }
  }

  const content = `WESLEY MELO
- last location: Brazil 
- status: online (Remote)
- availability: relocation open


[x] Email
- sync.wesm@gmail.com
[x] LinkedIn
- linkedin.com/in/wesmelo

[x] Personal Note: 
- If you've read this far and want to connect with me professionally, feel free to reach out using the links above.`

  return (
    <div ref={sectionRef}>
      {showContent ? (
        <>
          <TypewriterEffect text={content} speed={10} onComplete={scrollToBottom} />
          <p className="mt-4 text-yellow-300">(press r to return to the menu, press enter to skip animations)</p>
        </>
      ) : (
        <p>Loading contact data...</p>
      )}

      <div className="sr-only">
        <button onClick={onReturn}>Return to menu</button>
      </div>
    </div>
  )
}

