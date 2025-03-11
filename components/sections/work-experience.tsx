"use client"

import { useState, useEffect, useRef } from "react"
import TypewriterEffect from "../typewriter-effect"
import Link from "next/link"

type Props = {
  onReturn: () => void
}

export default function WorkExperience({ onReturn }: Props) {
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

  const content = `Liferay Brazil | Digital Experience Craftsman | November 2023 - Present

Reimagined digital platform to let businesses create custom solutions without needing to code, freeing them to focus on what they do best
Spotted and fixed user frustrations across multiple digital touchpoints, making technology work for people rather than against them
Transformed how teams collaborate by introducing flexible workflows that let people see progress in real-time
Built systems to catch problems before they happen, creating stable digital environments where innovation can thrive

CBYK Consultoria | Digital Detective | June 2023 – November 2023

Uncovered what users actually needed (not just what they said they wanted) through conversations and live testing
Created dashboards that turned complex user behavior into clear stories about what was working and what wasn't
Translated user feedback into meaningful improvements that people actually noticed and appreciated

ThoughtWorks | Digital Experience Guide | December 2022 – March 2023

Helped teams understand how to build things people want by connecting technical possibilities with human needs
Improved marketplace development by ensuring user voices were heard throughout the creative process
Cleared the path for engineers by providing the context they needed to solve the right problems

ThoughtWorks | Digital Transformation Navigator | December 2020 – December 2022

Rebuilt how people manage memberships by moving experiences online, changing frustrating phone calls into simple self-service
Created digital experiments that revealed how people actually behave, not how we thought they would
Reinvented team dynamics to spend less time in meetings and more time making things that matter
Helped businesses evolve through changing markets by focusing on solving customer problems first

ThoughtWorks | Experience Architect | September 2019 – November 2020

Kept digital storefronts running smoothly during massive traffic spikes, ensuring nobody missed out during crucial moments
Made buying things online feel natural by streamlining checkout and adding payment options people prefer
Translated between business dreams and technical realities, ensuring everyone was building toward the same vision

Accenture Brazil | Digital Craftsman | September 2018 – April 2019

Built conversation systems that felt natural and helpful rather than robotic and frustrating
Created flexible foundations that let businesses connect with customers wherever they preferred to hang out

Accenture Brazil | Code Sculptor | April 2014 – August 2018

Modernized critical systems to create solid foundations for future growth
Enhanced system performance during high-pressure moments, keeping businesses running when it mattered most


[certified]
- Professional Scrum Product Owner PSPO II, Scrum.org
- Certified Product Leadership and Strategic Alignment Practitioner, Caroli.org
- Certified Lean Inception Facilitator, Caroli.org`

  return (
    <div ref={sectionRef}>
      {showContent ? (
        <>
          <TypewriterEffect text={content} speed={10} onComplete={scrollToBottom} />
          <div className="mt-4">
            <Link
              href="https://www.linkedin.com/in/wesmelo"
              target="_blank"
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
            >
              [connect?] Connect on LinkedIn
            </Link>
          </div>
          <p className="mt-4 text-yellow-300">(press r to return to the menu)</p>
        </>
      ) : (
        <p>Loading experience data...</p>
      )}

      <div className="sr-only">
        <button onClick={onReturn}>Return to menu</button>
      </div>
    </div>
  )
}

