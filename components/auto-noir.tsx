"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"

/**
 * Auto-applies noir (grayscale) effect when dark mode is detected.
 * No UI - purely functional component that listens to theme changes.
 */
export function AutoNoir() {
  const { theme, resolvedTheme } = useTheme()

  useEffect(() => {
    // resolvedTheme will be 'dark' or 'light' after system preference is resolved
    const isDark = resolvedTheme === "dark" || theme === "dark"

    if (isDark) {
      document.documentElement.classList.add("noir")
    } else {
      document.documentElement.classList.remove("noir")
    }
  }, [theme, resolvedTheme])

  // No UI rendered
  return null
}
