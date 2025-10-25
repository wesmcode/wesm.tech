"use client"

import { useState, useEffect, useRef, type KeyboardEvent, Dispatch, SetStateAction } from "react"

type MenuOption = "contact" | "memoir" | "resume" | "exit"
type MenuProps = {
  onSelect: (option: MenuOption | "menu") => void;
  mobileSelectedIndex?: number;
  onMobileIndexChange?: Dispatch<SetStateAction<number>>;
}

export default function Menu({ onSelect, mobileSelectedIndex, onMobileIndexChange }: MenuProps) {
  const options: { id: MenuOption; label: string }[] = [
    { id: "contact", label: "contact info" },
    { id: "resume", label: "open resume .pdf" },
    { id: "memoir", label: "live chat memoir" },
    { id: "exit", label: "exit" },
  ]

  // Use mobileSelectedIndex if provided, otherwise use internal state
  const [localSelectedIndex, setLocalSelectedIndex] = useState(0)
  const selectedIndex = mobileSelectedIndex !== undefined ? mobileSelectedIndex : localSelectedIndex
  const setSelectedIndex = (newIndex: number | ((prev: number) => number)) => {
    if (onMobileIndexChange && mobileSelectedIndex !== undefined) {
      if (typeof newIndex === 'function') {
        onMobileIndexChange(newIndex);
      } else {
        onMobileIndexChange(newIndex);
      }
    } else {
      if (typeof newIndex === 'function') {
        setLocalSelectedIndex(newIndex);
      } else {
        setLocalSelectedIndex(newIndex);
      }
    }
  };
  
  const [currentDateTime, setCurrentDateTime] = useState<string>("")
  
  // Add ref for focus management
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Auto-focus the menu when it mounts
  useEffect(() => {
    if (menuRef.current) {
      menuRef.current.focus();
    }
  }, []);
  
  // Handle keyboard navigation for desktop
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < options.length - 1 ? prev + 1 : prev));
    } else if (e.key === "Enter") {
      e.preventDefault();
      onSelect(options[selectedIndex].id);
    }
  };

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
        {options.map((option, index) => (
          <li key={option.id} role="none">
            <button
              role="menuitem"
              aria-label={option.label}
              aria-current={selectedIndex === index ? "true" : "false"}
              className={`w-full text-left cursor-pointer py-1 terminal-menu-item ${
                selectedIndex === index
                  ? option.id === "memoir"
                    ? "text-yellow-300 bg-blue-600 selected"
                    : "text-white bg-blue-600 selected"
                  : ""
              }`}
              onClick={() => {
                setSelectedIndex(index);
                onSelect(option.id);
              }}
              onFocus={() => setSelectedIndex(index)}
              tabIndex={selectedIndex === index ? 0 : -1}
            >
              {selectedIndex === index ? "> " : "  "}
              {selectedIndex === index ? (
                <span className={`font-bold ${option.id === "memoir" ? "text-yellow-300" : ""}`}>
                  {option.label}
                </span>
              ) : (
                option.label
              )}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

