"use client"

import { useState, useEffect, useRef, type KeyboardEvent, Dispatch, SetStateAction } from "react"
import { DATETIME_UPDATE_INTERVAL_MS } from "@/lib/constants"

type MenuOption = "contact" | "memoir" | "resume" | "tetris" | "exit"

type MenuProps = {
  onSelect: (option: MenuOption | "menu") => void;
  mobileSelectedIndex?: number;
  onMobileIndexChange?: Dispatch<SetStateAction<number>>;
}

const MENU_OPTIONS: { id: MenuOption; label: string }[] = [
  { id: "contact", label: "contact info" },
  { id: "resume", label: "open resume .pdf" },
  { id: "memoir", label: "live chat memoir" },
  { id: "tetris", label: "play" },
  { id: "exit", label: "exit" },
]

const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  weekday: "short",
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
}

export default function Menu({ onSelect, mobileSelectedIndex, onMobileIndexChange }: MenuProps) {
  // State: use controlled index from parent (mobile) or manage internally (desktop)
  const [localSelectedIndex, setLocalSelectedIndex] = useState(0)
  const [currentDateTime, setCurrentDateTime] = useState<string>("")

  // Refs
  const menuRef = useRef<HTMLDivElement>(null)

  // Determine which index to use and provide setter
  const selectedIndex = mobileSelectedIndex ?? localSelectedIndex
  const updateSelectedIndex = onMobileIndexChange ?? setLocalSelectedIndex

  // Auto-focus the menu when it mounts
  useEffect(() => {
    menuRef.current?.focus()
  }, [])

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault()
      updateSelectedIndex((prev) => Math.max(0, prev - 1))
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      updateSelectedIndex((prev) => Math.min(MENU_OPTIONS.length - 1, prev + 1))
    } else if (e.key === "Enter") {
      e.preventDefault()
      onSelect(MENU_OPTIONS[selectedIndex].id)
    }
  }

  // Update current date and time
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      setCurrentDateTime(now.toLocaleDateString(undefined, DATE_FORMAT_OPTIONS))
    }

    updateDateTime()
    const interval = setInterval(updateDateTime, DATETIME_UPDATE_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [])

  return (
    <nav
      className="terminal-menu"
      role="navigation"
      aria-label="Main menu"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      ref={menuRef}
    >
      <p className="mb-4 text-yellow-300" role="status" aria-live="polite">
        ? Admin Dashboard | Unknown user | {currentDateTime}
      </p>
      <ul className="pl-2 w-full list-none" role="menu">
        {MENU_OPTIONS.map((option, index) => {
          const isSelected = selectedIndex === index
          const isMemoir = option.id === "memoir"

          return (
            <li key={option.id} role="none">
              <button
                role="menuitem"
                aria-label={option.label}
                aria-current={isSelected ? "true" : "false"}
                className={`w-full text-left cursor-pointer py-1 terminal-menu-item ${
                  isSelected
                    ? isMemoir
                      ? "text-yellow-300 bg-blue-600 selected"
                      : "text-white bg-blue-600 selected"
                    : ""
                }`}
                onClick={() => {
                  updateSelectedIndex(index)
                  onSelect(option.id)
                }}
                onFocus={() => updateSelectedIndex(index)}
                tabIndex={isSelected ? 0 : -1}
              >
                {isSelected ? "> " : "  "}
                {isSelected ? (
                  <span className={`font-bold ${isMemoir ? "text-yellow-300" : ""}`}>
                    {option.label}
                  </span>
                ) : (
                  option.label
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

