"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const [noirMode, setNoirMode] = useState(false)
  const { theme, setTheme } = useTheme()

  // Wait for client-side hydration
  useEffect(() => {
    setMounted(true)
    // Check if noir mode is enabled in localStorage
    const savedNoirMode = localStorage.getItem("noir-mode")
    if (savedNoirMode === "true") {
      setNoirMode(true)
      document.documentElement.classList.add("noir")
    }
  }, [])

  // Handle noir mode toggle
  const toggleNoirMode = () => {
    const newNoirMode = !noirMode
    setNoirMode(newNoirMode)

    if (newNoirMode) {
      document.documentElement.classList.add("noir")
      localStorage.setItem("noir-mode", "true")
    } else {
      document.documentElement.classList.remove("noir")
      localStorage.setItem("noir-mode", "false")
    }
  }

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return null
  }

  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 bg-gray-800 dark:bg-gray-900 p-3 rounded-lg shadow-lg border border-gray-600">
      {/* Theme selector */}
      <div className="flex flex-col gap-1">
        <span className="text-xs text-gray-300 font-mono">Theme:</span>
        <div className="flex gap-2">
          <button
            onClick={() => setTheme("light")}
            className={`px-2 py-1 text-xs rounded font-mono transition-colors ${
              theme === "light"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
            aria-label="Light theme"
          >
            Light
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={`px-2 py-1 text-xs rounded font-mono transition-colors ${
              theme === "dark"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
            aria-label="Dark theme"
          >
            Dark
          </button>
          <button
            onClick={() => setTheme("system")}
            className={`px-2 py-1 text-xs rounded font-mono transition-colors ${
              theme === "system"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
            aria-label="System theme"
          >
            Auto
          </button>
        </div>
      </div>

      {/* Noir mode toggle - only show when dark mode is active */}
      {isDark && (
        <div className="flex flex-col gap-1 pt-2 border-t border-gray-600">
          <span className="text-xs text-gray-300 font-mono">Effect:</span>
          <button
            onClick={toggleNoirMode}
            className={`px-2 py-1 text-xs rounded font-mono transition-colors ${
              noirMode
                ? "bg-gray-200 text-gray-900"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
            aria-label="Toggle noir mode"
          >
            {noirMode ? "Noir ON" : "Noir OFF"}
          </button>
        </div>
      )}
    </div>
  )
}
