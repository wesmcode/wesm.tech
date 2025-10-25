"use client"

import { useState, useEffect, useRef } from "react"
import AsciiTitle from "./ascii-title"
import Menu from "./menu"
import ContactInfo from "./sections/contact-info"
import Memoir from "./sections/memoir"
import DraggableWindow from "./draggable-window"
import { useIsMobile } from "@/hooks/use-mobile"
import MobileNavControls from "./mobile-nav-controls"
import TypewriterEffect from "./typewriter-effect"
import { EXIT_COUNTDOWN_SECONDS, LINKEDIN_URL, RESUME_PDF_PATH, MOBILE_CONTROLS_HEIGHT_PX, SITE_VERSION, SITE_NAME, COPYRIGHT_YEAR, AUTHOR_NAME, AUTO_SCROLL_DELAY_MS, SKIP_ANIMATION_RESET_DELAY_MS } from "@/lib/constants"
import { openInNewTab } from "@/lib/utils/window"

type Section = "menu" | "contact" | "memoir" | "resume" | "exit"

const RETURN_TO_MENU_KEY = "r"

export default function Terminal() {
  // State management
  const [activeSection, setActiveSection] = useState<Section>("menu")
  const [exitCounter, setExitCounter] = useState<number | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [menuIndex, setMenuIndex] = useState(0)
  const [skipTypewriter, setSkipTypewriter] = useState(false)
  const [typingStage, setTypingStage] = useState(0)

  // Refs
  const terminalContentRef = useRef<HTMLDivElement>(null)

  // Hooks
  const isMobile = useIsMobile()

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
      openInNewTab(LINKEDIN_URL, "Please allow popups for this website to use the exit functionality")
      setExitCounter(null)
      setActiveSection("menu")
      return
    }

    if (exitCounter !== null && exitCounter > 0) {
      const timer = setTimeout(() => {
        setExitCounter(exitCounter - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [exitCounter])

  // Auto-scroll when section changes
  useEffect(() => {
    if (terminalContentRef.current && activeSection !== "menu") {
      setTimeout(() => {
        terminalContentRef.current?.scrollTo({
          top: terminalContentRef.current.scrollHeight,
          behavior: "smooth",
        })
      }, AUTO_SCROLL_DELAY_MS)
    }
  }, [activeSection])

  const handleMenuSelect = (section: Section) => {
    if (section === "exit") {
      setExitCounter(EXIT_COUNTDOWN_SECONDS)
      return
    }

    if (section === "resume") {
      openInNewTab(RESUME_PDF_PATH)
      return
    }

    setActiveSection(section)
  }

  const handleReturn = () => {
    setActiveSection("menu")
  }

  const handleOpenLinkedIn = () => {
    openInNewTab(LINKEDIN_URL)
  }

  const handleToggleFullscreen = () => {
    if (!isMobile) {
      setIsFullscreen(!isFullscreen)
    }
  }
  
  // Mobile navigation handlers
  const handleMobileUp = () => {
    if (activeSection === "menu") {
      setMenuIndex((prev) => Math.max(0, prev - 1));
    }
  }

  const handleMobileDown = () => {
    if (activeSection === "menu") {
      setMenuIndex((prev) => Math.min(3, prev + 1)); // 4 menu options (0-3)
    }
  }

  const handleMobileEnter = () => {
    if (activeSection === "menu") {
      // Menu options: contact, resume, memoir, exit (hardcoded to avoid duplication)
      const menuOptions: Section[] = ["contact", "resume", "memoir", "exit"];
      handleMenuSelect(menuOptions[menuIndex]);
    } else {
      // Skip the typewriter animation in non-menu sections
      setSkipTypewriter(true);
      setTimeout(() => setSkipTypewriter(false), SKIP_ANIMATION_RESET_DELAY_MS);
    }
  }

  return (
    <>
      <DraggableWindow isFullscreen={isFullscreen}>
        {/* Terminal Header */}
        <header className={`w-full flex items-center ${isMobile ? 'py-2' : ''}`} role="banner">
          <nav className="flex space-x-2 ml-2" aria-label="Window controls">
            <button
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
              aria-label="Open LinkedIn profile"
              onClick={handleOpenLinkedIn}
            ></button>
            <button
              className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-300"
              aria-label="Minimize window"
              disabled
            ></button>
            <button
              className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300"
              aria-label="Toggle fullscreen mode"
              onClick={handleToggleFullscreen}
            ></button>
          </nav>
          <div className="flex-1 text-center text-sm text-gray-600 font-medium" role="heading" aria-level={1}>{SITE_NAME}</div>
          <div className="text-gray-500 text-xs mr-2" aria-hidden="true">⌘1</div>
        </header>

        {/* Terminal Content */}
        <section
          ref={terminalContentRef}
          className="bg-blue-900 text-white p-4 h-full overflow-y-auto font-mono text-sm terminal-content terminal-text"
          role="region"
          aria-label="Terminal interface"
          style={isMobile ? {
            width: '100%',
            maxWidth: '100%',
            overflowX: 'hidden',
            padding: '8px',
            paddingBottom: `${MOBILE_CONTROLS_HEIGHT_PX}px`
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
          <footer className="mb-6 text-gray-400 terminal-text" role="contentinfo">
            <p>{">"} Made by {AUTHOR_NAME} | {SITE_VERSION} | {SITE_NAME} © {COPYRIGHT_YEAR} </p>
          </footer>

          {activeSection === "menu" && (
            <Menu
              onSelect={handleMenuSelect}
              mobileSelectedIndex={isMobile ? menuIndex : undefined}
              onMobileIndexChange={isMobile ? setMenuIndex : undefined}
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
            <div className="mt-4" role="alert" aria-live="assertive">
              <p>Exiting in {exitCounter} seconds...</p>
              {exitCounter === 0 && <p>Hello again!</p>}
            </div>
          )}
        </section>
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

