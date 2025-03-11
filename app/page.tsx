"use client"

import { useEffect, useState } from "react"
import Terminal from "@/components/terminal"

export default function Home() {
  const [mounted, setMounted] = useState(false)

  // Wait for client-side hydration to complete
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 p-0 overflow-hidden flex items-center justify-center">
      {mounted && <Terminal />}
    </main>
  )
}

