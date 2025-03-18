"use client"

import { useState, useEffect, useRef } from "react"
import AsciiTitle from "./ascii-title"
import Menu from "./menu"
import ProfessionalProfile from "./sections/professional-profile"
import WorkExperience from "./sections/work-experience"
import AvailableSkills from "./sections/available-skills"
import ContactInfo from "./sections/contact-info"
import Memoir from "./sections/memoir"
import { useRouter } from "next/navigation"
import DraggableWindow from "./draggable-window"
import { useIsMobile } from "@/hooks/use-mobile"
import MobileNavControls from "./mobile-nav-controls"
import TypewriterEffect from "./typewriter-effect"

type Section = "menu" | "profile" | "experience" | "skills" | "contact" | "memoir" | "resume" | "exit"

export default function Terminal() {
  const [activeSection, setActiveSection] = useState<Section>("menu")
  const [exitCounter, setExitCounter] = useState<number | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const terminalContentRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  const [menuIndex, setMenuIndex] = useState(0)
  const [skipTypewriter, setSkipTypewriter] = useState(false)
  const [typingStage, setTypingStage] = useState(0)
  
  const menuOptions = [
    { id: "profile", label: "professional profile" },
    { id: "experience", label: "work experience" },
    { id: "skills", label: "available skills" },
    { id: "contact", label: "contact info" },
    { id: "resume", label: "open resume (PDF)" },
    { id: "memoir", label: "#M3M0!R#" },
    { id: "exit", label: "Exit" },
  ] as const;

  // Force fullscreen on mobile
  useEffect(() => {
    if (isMobile) {
      setIsFullscreen(true);
    }
  }, [isMobile])

  // Global keyboard handler
  useEffect(() => {
    // This handler ensures we capture keyboard events at the document level
    const globalKeyHandler = (e: KeyboardEvent) => {
      // Only handle r key globally
      if (e.key.toLowerCase() === "r" && activeSection !== "menu") {
        setActiveSection("menu");
      }
    };
    
    document.addEventListener("keydown", globalKeyHandler);
    return () => document.removeEventListener("keydown", globalKeyHandler);
  }, [activeSection]);

  // Handle exit countdown
  useEffect(() => {
    if (exitCounter === 0) {
      window.open("https://www.linkedin.com/in/wesmelo", "_blank")
      setExitCounter(null)
      setActiveSection("menu")
    }

    if (exitCounter !== null && exitCounter > 0) {
      const timer = setTimeout(() => {
        setExitCounter(exitCounter - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [exitCounter, router])

  // Auto-scroll when section changes
  useEffect(() => {
    if (terminalContentRef.current && activeSection !== "menu") {
      setTimeout(() => {
        terminalContentRef.current?.scrollTo({
          top: terminalContentRef.current.scrollHeight,
          behavior: "smooth",
        })
      }, 100)
    }
  }, [activeSection])

  const handleMenuSelect = (section: Section) => {
    if (section === "exit") {
      setExitCounter(4)
      return
    }
    
    if (section === "resume") {
      window.open("/wesley_melo_resume_remote.pdf", "_blank")
      return
    }
    
    setActiveSection(section)
  }

  const handleReturn = () => {
    setActiveSection("menu")
  }

  const handleOpenLinkedIn = () => {
    window.open("https://www.linkedin.com/in/wesmelo", "_blank")
  }

  const handleToggleFullscreen = () => {
    if (!isMobile) {
      setIsFullscreen(!isFullscreen)
    }
  }
  
  // Mobile navigation handlers
  const handleMobileUp = () => {
    if (activeSection === "menu") {
      setMenuIndex((prev) => (prev > 0 ? prev - 1 : prev));
    }
  }
  
  const handleMobileDown = () => {
    if (activeSection === "menu") {
      setMenuIndex((prev) => (prev < menuOptions.length - 1 ? prev + 1 : prev));
    }
  }
  
  const handleMobileEnter = () => {
    if (activeSection === "menu") {
      // In menu: select the current option
      const selectedOption = menuOptions[menuIndex].id;
      handleMenuSelect(selectedOption);
    } else {
      // In other sections: skip the typewriter animation
      setSkipTypewriter(true);
      setTimeout(() => setSkipTypewriter(false), 100);
    }
  }

  return (
    <>
      <DraggableWindow isFullscreen={isFullscreen}>
        {/* Terminal Header */}
        <div className={`w-full flex items-center ${isMobile ? 'py-2' : ''}`}>
          <div className="flex space-x-2 ml-2">
            <button
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
              aria-label="Open LinkedIn"
              onClick={handleOpenLinkedIn}
            ></button>
            <button
              className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors"
              aria-label="Minimize"
            ></button>
            <button
              className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
              aria-label="Toggle Fullscreen"
              onClick={handleToggleFullscreen}
            ></button>
          </div>
          <div className="flex-1 text-center text-sm text-gray-600 font-medium">wesm.tech</div>
          <div className="text-gray-500 text-xs mr-2">⌘1</div>
        </div>

        {/* Terminal Content */}
        <div 
          ref={terminalContentRef} 
          className="bg-blue-900 text-white p-4 h-full overflow-y-auto font-mono text-sm terminal-content terminal-text"
          style={isMobile ? { 
            width: '100%', 
            maxWidth: '100%',
            overflowX: 'hidden',
            padding: '8px',
            paddingBottom: '60px'
          } : {}}
        >
          <AsciiTitle selectedOption={activeSection} />
          <div className="mb-4 terminal-text">
            <TypewriterEffect 
              text="Welcome to Wesley Melo interactive website terminal"
              skipAnimation={isMobile || skipTypewriter}
              onComplete={() => !skipTypewriter && setTypingStage(1)}
            />
            
            {(typingStage >= 1 || skipTypewriter) && (
              <TypewriterEffect 
                text="~ ( Use arrow keys to choose the options below ) ~"
                skipAnimation={isMobile || skipTypewriter}
                onComplete={() => !skipTypewriter && setTypingStage(2)}
              />
            )}
            
            {(typingStage >= 2 || skipTypewriter) && (
              <TypewriterEffect 
                text="~ (press r to return to the menu, press enter to skip animations) ~"
                skipAnimation={isMobile || skipTypewriter}
              />
            )}
          </div>
          <p className="mb-6 text-gray-400 terminal-text">{">"} Made by Wesley M. | v1.0.0 | wesm.tech © 2025 </p>

          {activeSection === "menu" && (
            <Menu 
              onSelect={handleMenuSelect} 
              mobileSelectedIndex={isMobile ? menuIndex : undefined} 
              onMobileIndexChange={isMobile ? setMenuIndex : undefined}
            />
          )}

          {activeSection === "profile" && (
            <ProfessionalProfile 
              onReturn={handleReturn} 
              skipAnimation={skipTypewriter}
            />
          )}

          {activeSection === "experience" && (
            <WorkExperience 
              onReturn={handleReturn} 
              skipAnimation={skipTypewriter}
            />
          )}

          {activeSection === "skills" && (
            <AvailableSkills 
              onReturn={handleReturn} 
              skipAnimation={skipTypewriter}
            />
          )}

          {activeSection === "contact" && (
            <ContactInfo 
              onReturn={handleReturn} 
              skipAnimation={skipTypewriter}
            />
          )}

          {activeSection === "memoir" && (
            <Memoir 
              onReturn={handleReturn} 
              skipAnimation={skipTypewriter}
            />
          )}

          {exitCounter !== null && (
            <div className="mt-4">
              <p>Exiting in {exitCounter} seconds...</p>
              {exitCounter === 0 && <p>Hello again!</p>}
            </div>
          )}
        </div>
      </DraggableWindow>
      
      {/* Mobile Navigation Controls */}
      <MobileNavControls
        onUp={handleMobileUp}
        onDown={handleMobileDown}
        onEnter={handleMobileEnter}
        onReturn={handleReturn}
      />
    </>
  )
}

