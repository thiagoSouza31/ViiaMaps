"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AccessibilityIcon } from "@/components/icons/accessibility-icon"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { clearSession, getSessionUser } from "@/lib/session"

interface MapHeaderProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  onSearch: (query: string) => void
  isSearching: boolean
}

export function MapHeader({ searchQuery, setSearchQuery, onSearch, isSearching }: MapHeaderProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string; avatar?: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    setUser(getSessionUser())
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  const handleLogout = () => {
    clearSession()
    router.push("/")
  }

  return (
    <header className="bg-card border-b px-4 py-3 flex items-center gap-4 relative z-50">
      {/* Logo */}
      <Link href="/mapa" className="flex items-center gap-2 flex-shrink-0">
        <AccessibilityIcon className="size-8 text-primary" />
        <span className="text-xl font-bold text-foreground hidden sm:inline">ViiaMaps</span>
      </Link>

      {/* Barra de busca */}
      <form 
        onSubmit={handleSubmit}
        className={`flex-1 max-w-2xl mx-auto relative transition-all ${
          isFocused ? "scale-[1.02]" : ""
        }`}
      >
        <div className="relative flex items-center">
          <SearchIcon className="absolute left-3 size-5 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="Buscar endereço, local ou estabelecimento..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="pl-10 pr-24 h-11 bg-secondary/50 border-secondary focus:bg-card"
            aria-label="Buscar local"
          />
          <Button 
            type="submit" 
            size="sm" 
            className="absolute right-1.5"
            disabled={isSearching || !searchQuery.trim()}
          >
            {isSearching ? (
              <span className="size-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              "Buscar"
            )}
          </Button>
        </div>
      </form>

      {/* Menu do usuário */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative size-10 rounded-full p-0">
            <Avatar className="size-10">
              <AvatarImage src={user?.avatar ?? "/avatar-placeholder.png"} alt="Foto do usuário" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user?.name?.charAt(0).toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 z-[100]">
          <div className="flex items-center gap-2 p-2">
            <Avatar className="size-10">
              <AvatarImage src={user?.avatar ?? ""} alt="Foto do usuário" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user?.name?.charAt(0).toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user?.name ?? "Usuário"}</span>
              <span className="text-xs text-muted-foreground">{user?.email ?? "usuario@email.com"}</span>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/perfil">
              <UserIcon className="size-4 mr-2" />
              Meu Perfil
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/minhas-avaliacoes">
              <StarIcon className="size-4 mr-2" />
              Minhas Avaliacoes
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/configuracoes">
              <SettingsIcon className="size-4 mr-2" />
              Configuracoes
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full text-left"
            >
              <LogOutIcon className="size-4 mr-2" />
              Sair
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  )
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  )
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  )
}



function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function LogOutIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
    </svg>
  )
}
