"use client"

import { useState, useEffect, useRef } from "react"
import TypewriterEffect from "../typewriter-effect"

type Props = {
  onReturn: () => void
}

export default function AvailableSkills({ onReturn }: Props) {
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

  const content = `$ cat profile.txt
┌────────────────────────────────────────────────────────────┐
│ USER PROFILE                                   STATUS: ACTIVE │
└────────────────────────────────────────────────────────────┘

[✓] The tools and capabilities I've developed throughout my career 
    allow me to navigate complex digital landscapes and create 
    solutions that balance business needs with human experiences.

$ language --list
-------------------------------------------------------------------------
  • english    [##########] Fluent - C2
  • portuguese [##########] Native

$ skills --list
-------------------------------------------------------------------------
POWERED WITH:
+ Turning Complex Problems into Simple
+ Leading Without Micromanaging
+ Building Digital Experiences People

WORKS WITH:
+ translating tech-speak into human

$ cat approach.conf
-------------------------------------------------------------------------
CREATIVE APPROACH:
+ elaborate empathy and listening before building
+ when building consider long-term impact
+ testing ideas in the real world

$ cat interests.log | grep "FOMO" -A3
-------------------------------------------------------------------------
CURRENT FOMO SUBJECTS:
+ AI that actually solves people stress and overwork
+ making technology disappear into the background
+ sustainable growth strategies

`

  return (
    <div ref={sectionRef}>
      {showContent ? (
        <>
          <TypewriterEffect text={content} speed={10} onComplete={scrollToBottom} />
          <p className="mt-4 text-yellow-300">(press r to return to the menu, press enter to skip animations)</p>
        </>
      ) : (
        <p>Loading skills data...</p>
      )}

      <div className="sr-only">
        <button onClick={onReturn}>Return to menu</button>
      </div>
    </div>
  )
}

