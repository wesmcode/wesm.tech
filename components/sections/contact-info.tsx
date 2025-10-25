"use client"

import { useState, useEffect, useRef } from "react"
import TypewriterEffect from "../typewriter-effect"
import { useIsMobile } from "@/hooks/use-mobile"
import { CONTACT_INFO_LOAD_DELAY_MS } from "@/lib/constants"

type Props = {
  onReturn: () => void
  skipAnimation?: boolean
}

export default function ContactInfo({ onReturn, skipAnimation = false }: Props) {
  const [showContent, setShowContent] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  // Note: 'r' key press is handled globally in terminal.tsx to avoid conflicts

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true)
    }, CONTACT_INFO_LOAD_DELAY_MS)

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

  const mobileContent = `$ whoami
WESLEY MELO

$ system --status
┌────────────────────────────┐
│ USER STATUS                │
├────────────────────────────┤
│ location: Brazil           │
│ status: online (Remote)    │
│ relocation: open           │
└────────────────────────────┘

$ cat contact.conf
─────────────────────────────
[x] Email
    sync.wesm@gmail.com

[x] LinkedIn
    linkedin.com/in/wesmelo

[x] Website
    wesm.tech

$ cat README.md
─────────────────────────────
[x] Personal Note:
    If you've read this far
    and want to connect
    professionally, feel
    free to reach out using
    the links above.

`

  const desktopContent = `$ whoami
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

  const content = isMobile ? mobileContent : desktopContent

  return (
    <div ref={sectionRef} className={isMobile ? "mb-24" : ""}>
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

