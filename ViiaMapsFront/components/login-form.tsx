"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { loginUsuario } from "@/services/api"
import { saveSessionUser } from "@/lib/session"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Spinner } from "@/components/ui/spinner"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [registrationSuccess, setRegistrationSuccess] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get("cadastro") === "ok") {
      setRegistrationSuccess(true)
    }
  }, [])

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}
    
    if (!email) {
      newErrors.email = "E-mail é obrigatório"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "E-mail inválido"
    }
    
    if (!password) {
      newErrors.password = "Senha é obrigatória"
    } else if (password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    
    try {
      const data = await loginUsuario(email, password)

      saveSessionUser({
        id: String(data.id),
        name: data.nome,
        email: data.email,
        token: data.token,
        avatar: data.fotoPerfil ?? "",
      }, rememberMe)

      window.location.href = "/mapa"
    } catch (error) {
      alert("Email ou senha inválidos")
    }

    setIsLoading(false)
  }

  return (
    <div className="flex flex-col gap-6">
    {registrationSuccess && (
      <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-sm text-green-700 dark:text-green-400">
        Conta criada com sucesso! Faça login para continuar.
      </div>
    )}
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-describedby={errors.email ? "email-error" : undefined}
          aria-invalid={!!errors.email}
          disabled={isLoading}
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-destructive">
            {errors.email}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center">
          <Label htmlFor="password">Senha</Label>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="Digite sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-describedby={errors.password ? "password-error" : undefined}
          aria-invalid={!!errors.password}
          disabled={isLoading}
        />
        {errors.password && (
          <p id="password-error" className="text-sm text-destructive">
            {errors.password}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="remember"
          checked={rememberMe}
          onCheckedChange={(checked) => setRememberMe(checked as boolean)}
          disabled={isLoading}
        />
        <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
          Lembrar de mim
        </Label>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Spinner size="sm" />
            Entrando...
          </>
        ) : (
          "Entrar"
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Não tem uma conta?{" "}
        <Link
          href="/cadastro"
          className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded font-medium"
        >
          Cadastre-se
        </Link>
      </p>
    </form>
    </div>
  )
}
