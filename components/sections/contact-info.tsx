"use client"

import { useState, useEffect, useRef } from "react"
import TypewriterEffect from "../typewriter-effect"

type Props = {
  onReturn: () => void
  skipAnimation?: boolean
}

export default function ContactInfo({ onReturn, skipAnimation = false }: Props) {
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

  const content = `$ whoami
WESLEY MELO

$ system --status
┌────────────────────────────────────────────────────────────┐
│ USER STATUS                                                │
├────────────────────────────────────────────────────────────┤
│ last location: Brazil                                      │
│ status: online (Remote)                                    │
│ availability: relocation open                              │
└────────────────────────────────────────────────────────────┘

$ cat contact.conf
-------------------------------------------------------------------------
[x] Email
    - sync.wesm@gmail.com

[x] LinkedIn
    - linkedin.com/in/wesmelo

[x] Website
    - wesm.tech

$ cat README.md
-------------------------------------------------------------------------
[x] Personal Note:
    - If you've read this far and want to connect with me 
      professionally, feel free to reach out using the links above.

`

  return (
    <div ref={sectionRef}>
      {showContent ? (
        <>
          <TypewriterEffect 
            text={content} 
            speed={10} 
            onComplete={scrollToBottom}
            skipAnimation={skipAnimation}
          />
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

