"use client"

import { useEffect } from "react"
import { getSettings } from "@/lib/settings"

function applyTheme() {
  const s = getSettings()
  const cl = document.documentElement.classList
  cl.toggle("dark", s.darkTheme)
  cl.toggle("high-contrast", s.highContrast)
  cl.toggle("large-text", s.largeText)
  cl.toggle("night-mode", s.nightMode)
}

export function ThemeApplier() {
  useEffect(() => {
    applyTheme()
    window.addEventListener("viia-settings-changed", applyTheme)
    return () => window.removeEventListener("viia-settings-changed", applyTheme)
  }, [])

  return null
}
