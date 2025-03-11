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

type Section = "menu" | "profile" | "experience" | "skills" | "contact" | "memoir" | "exit"

export default function Terminal() {
  const [activeSection, setActiveSection] = useState<Section>("menu")
  const [exitCounter, setExitCounter] = useState<number | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const terminalContentRef = useRef<HTMLDivElement>(null)

  // Handle global 'r' key press to return to menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "r" && activeSection !== "menu") {
        setActiveSection("menu")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeSection])

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
    setActiveSection(section)
  }

  const handleReturn = () => {
    setActiveSection("menu")
  }

  const handleOpenLinkedIn = () => {
    window.open("https://www.linkedin.com/in/wesmelo", "_blank")
  }

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <DraggableWindow isFullscreen={isFullscreen}>
      {/* Terminal Header */}
      <div className="w-full flex items-center">
        <div className="flex space-x-2">
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
        <div className="text-gray-500 text-xs">⌘1</div>
      </div>

      {/* Terminal Content */}
      <div ref={terminalContentRef} className="bg-blue-900 text-white p-4 h-full overflow-y-auto font-mono text-sm">
        <AsciiTitle selectedOption={activeSection} />
        <p className="mb-4">Welcome to Wesley Melo interactive website terminal 
          <br/>~ ( Use arrow keys to choose the options below ) ~ </p>
        <p className="mb-6 text-gray-400">{">"} Made by Wesley M. | v1.0.0 | wesm.tech © 2025 </p>

        {activeSection === "menu" && <Menu onSelect={handleMenuSelect} />}

        {activeSection === "profile" && <ProfessionalProfile onReturn={handleReturn} />}

        {activeSection === "experience" && <WorkExperience onReturn={handleReturn} />}

        {activeSection === "skills" && <AvailableSkills onReturn={handleReturn} />}

        {activeSection === "contact" && <ContactInfo onReturn={handleReturn} />}

        {activeSection === "memoir" && <Memoir onReturn={handleReturn} />}

        {exitCounter !== null && (
          <div className="mt-4">
            <p>Exiting in {exitCounter} seconds...</p>
            {exitCounter === 0 && <p>Hello again!</p>}
          </div>
        )}
      </div>
    </DraggableWindow>
  )
}

