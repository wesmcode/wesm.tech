"use client"

import { useState, useEffect, type KeyboardEvent } from "react"

type MenuOption = "profile" | "experience" | "skills" | "contact" | "memoir" | "exit"
type MenuProps = {
  onSelect: (option: MenuOption | "menu") => void
}

export default function Menu({ onSelect }: MenuProps) {
  const options: { id: MenuOption; label: string }[] = [
    { id: "profile", label: "professional profile" },
    { id: "experience", label: "work experience" },
    { id: "skills", label: "available skills" },
    { id: "contact", label: "contact info" },
    { id: "memoir", label: "#M3M0!R#" },
    { id: "exit", label: "Exit" },
  ]

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [currentDateTime, setCurrentDateTime] = useState<string>("")

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowUp") {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev))
    } else if (e.key === "ArrowDown") {
      setSelectedIndex((prev) => (prev < options.length - 1 ? prev + 1 : prev))
    } else if (e.key === "Enter") {
      onSelect(options[selectedIndex].id)
    }
  }

  useEffect(() => {
    const handleKeyPress = (e: globalThis.KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev))
      } else if (e.key === "ArrowDown") {
        setSelectedIndex((prev) => (prev < options.length - 1 ? prev + 1 : prev))
      } else if (e.key === "Enter") {
        onSelect(options[selectedIndex].id)
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [selectedIndex, onSelect, options])

  // Update current date and time
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      const options: Intl.DateTimeFormatOptions = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
      setCurrentDateTime(now.toLocaleDateString(undefined, options))
    }

    updateDateTime()
    const interval = setInterval(updateDateTime, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="focus:outline-none" tabIndex={0} onKeyDown={handleKeyDown}>
      <p className="mb-4 text-yellow-300">
        ? Admin Dashboard | Unknown user | {currentDateTime}
      </p>
      <div className="pl-2">
        {options.map((option, index) => (
          <div
            key={option.id}
            className={`cursor-pointer py-1 ${
              selectedIndex === index 
                ? option.id === "memoir" 
                  ? "text-lime-500 bg-blue-600" 
                  : "text-white bg-blue-600" 
                : ""
            }`}
            onClick={() => {
              setSelectedIndex(index)
              onSelect(option.id)
            }}
          >
            {selectedIndex === index ? "> " : "  "}
            {selectedIndex === index ? (
              <span className={`font-bold ${option.id === "memoir" ? "text-lime-500" : ""}`}>
                {option.label}
              </span>
            ) : (
              option.label
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

