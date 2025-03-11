"use client"

import { useState, useEffect } from "react"

export default function TerminalCursor() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible((prev) => !prev)
    }, 530) // Typical cursor blink rate

    return () => clearInterval(interval)
  }, [])

  return (
    <span
      className={`inline-block w-2 h-4 bg-white ${visible ? "opacity-100" : "opacity-0"}`}
      style={{ transition: "opacity 0.1s ease-in-out" }}
    ></span>
  )
}

