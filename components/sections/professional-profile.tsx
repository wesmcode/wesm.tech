"use client"

import { useState, useEffect, useRef } from "react"
import TypewriterEffect from "../typewriter-effect"

type Props = {
  onReturn: () => void
  skipAnimation?: boolean
}

export default function ProfessionalProfile({ onReturn, skipAnimation = false }: Props) {
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

  const content = `
  $ cat profile.txt
┌────────────────────────────────────────────────────────────────────┐
│ USER PROFILE: WESLEY                                               │
└────────────────────────────────────────────────────────────────────┘

If you're reading this, my name is Wesley, and I am a Product Manager 
with a focus on design, growth, digital technology, and strategies to 
create user-centric solutions driving positively business success 
while impact people's lives.

$ cat journey.log
-------------------------------------------------------------------------
MY JOURNEY SO FAR:
+ 10+ years turning complex business challenges into elegant digital 
  solutions that people actually want to use
+ Shaped digital experiences that changed how organizations connect with 
  customers and build lasting relationships
+ Led diverse teams across three continents to build things that matter, 
  focusing on real human needs rather than flashy features
+ Combined tech understanding with business insight to build bridges 
  instead of silos

$ achievements --list
-------------------------------------------------------------------------
HIGHLIGHTS:
+ Led implementation to launch of an online membership management platform, 
  slashing cancellation complaints by 65% and increasing memberships 
  by 30%, which contributed to a 164% revenue increase from 2020 to 2023.

+ By revamping an e-commerce platform and implementing features like 
  Apple Pay and BNPL, I improved page load times and session durations, 
  driving a 54% annual growth in online sales.

+ Collaborating with multilingual teams, I optimized B2B usability through 
  A/B testing and OKRs, boosting customer retention, monetization and 
  feature adoption despite remote challenges.

+ I managed remote teams across Brazil, US and India, driving transition 
  to Scrum, which increased sprint forecast and delivery by 20%, and cut 
  long meeting times by over 70%, improved team efficiency, fostering 
  clear and efficient alignment.

$ cat background.info
-------------------------------------------------------------------------
I do value the diversity, creativity, and excellence of my team and culture.

I have a balanced career foundation in tech consulting companies with 
5 years of hands-on software development expertise and 5+ years in 
consulting and product leadership, leading cross-functional teams of 
software engineers, designers, and business analysts through projects 
globally and remotely with high-profile clients such as Natura, Telefonica, 
GAP Inc., Planet Fitness, Thomson Reuters, Pernod Ricard, and Liferay. 

Strong knowledge of the overall agile methodologies and frameworks, 
user-centered design, including competitive analysis, user research, 
experience strategy, information architecture, usability testing, project 
management, product leadership, work remote with cross-functional teams 
and so on...

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
        <p>Loading profile data...</p>
      )}

      <div className="sr-only">
        <button onClick={onReturn}>Return to menu</button>
      </div>
    </div>
  )
}

