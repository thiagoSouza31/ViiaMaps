const SETTINGS_KEY = "viia_settings"

export interface AppSettings {
  showOnlyAccessible: boolean
  showOnlyMyPlaces: boolean
  darkTheme: boolean
  highContrast: boolean
  largeText: boolean
  nightMode: boolean
}

const defaults: AppSettings = {
  showOnlyAccessible: false,
  showOnlyMyPlaces: false,
  darkTheme: false,
  highContrast: false,
  largeText: false,
  nightMode: false,
}

export function getSettings(): AppSettings {
  if (typeof window === "undefined") return defaults
  try {
    const saved = localStorage.getItem(SETTINGS_KEY)
    return saved ? { ...defaults, ...JSON.parse(saved) } : defaults
  } catch {
    return defaults
  }
}

export function saveSettings(settings: AppSettings): void {
  if (typeof window === "undefined") return
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  // Notifica o ThemeApplier na mesma aba para atualizar as classes imediatamente
  window.dispatchEvent(new Event("viia-settings-changed"))
}
