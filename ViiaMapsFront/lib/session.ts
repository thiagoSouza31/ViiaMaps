import { User } from "@/lib/types"

const SESSION_KEY = "viia_session"
const REMEMBER_KEY = "viia_remember"

export interface SessionUser extends User {
  token?: string
}

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

export function getSessionUser(): SessionUser | null {
  if (typeof window === "undefined") return null

  const remember = window.localStorage.getItem(REMEMBER_KEY) === "true"
  const raw = remember
    ? window.localStorage.getItem(SESSION_KEY)
    : window.sessionStorage.getItem(SESSION_KEY)

  if (!raw) return null

  try {
    const user = JSON.parse(raw) as SessionUser
    if (user.token && isTokenExpired(user.token)) {
      clearSession()
      return null
    }
    return user
  } catch {
    return null
  }
}

export function saveSessionUser(user: SessionUser, remember?: boolean) {
  if (typeof window === "undefined") return

  // Quando chamado sem o parâmetro (ex: atualização de perfil), preserva a preferência existente
  const shouldRemember =
    remember !== undefined
      ? remember
      : window.localStorage.getItem(REMEMBER_KEY) === "true"

  window.localStorage.setItem(REMEMBER_KEY, String(shouldRemember))
  const data = JSON.stringify(user)

  if (shouldRemember) {
    window.localStorage.setItem(SESSION_KEY, data)
    window.sessionStorage.removeItem(SESSION_KEY)
  } else {
    window.sessionStorage.setItem(SESSION_KEY, data)
    window.localStorage.removeItem(SESSION_KEY)
  }
}

export function clearSession() {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(SESSION_KEY)
  window.localStorage.removeItem(REMEMBER_KEY)
  window.localStorage.removeItem("token")
  window.sessionStorage.removeItem(SESSION_KEY)
}
