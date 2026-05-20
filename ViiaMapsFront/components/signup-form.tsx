"use client"

import { useState } from "react"
import Link from "next/link"
import { criarUsuario } from "@/services/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Spinner } from "@/components/ui/spinner"


interface FormErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
  terms?: string
}

export function SignupForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const validateForm = () => {
    const newErrors: FormErrors = {}
    
    if (!name.trim()) {
      newErrors.name = "Nome é obrigatório"
    } else if (name.trim().length < 3) {
      newErrors.name = "Nome deve ter pelo menos 3 caracteres"
    }
    
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
    
    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirmação de senha é obrigatória"
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem"
    }
    
    if (!acceptTerms) {
      newErrors.terms = "Você deve aceitar os termos de uso"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    
    try {

      const usuario = {
        nome: name,
        email: email,
        senha: password
      }

      await criarUsuario(usuario)

      // Redireciona para login — a sessão será criada pelo próprio login com o ID correto do banco
      window.location.href = "/?cadastro=ok"

    } catch (error) {
      console.error("Erro ao criar usuário:", error)
      setIsLoading(false)
      alert("Erro ao criar conta. Tente novamente.")

    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Nome completo</Label>
        <Input
          id="name"
          type="text"
          placeholder="Seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-describedby={errors.name ? "name-error" : undefined}
          aria-invalid={!!errors.name}
          disabled={isLoading}
        />
        {errors.name && (
          <p id="name-error" className="text-sm text-destructive">
            {errors.name}
          </p>
        )}
      </div>

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
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          placeholder="Mínimo 6 caracteres"
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

      <div className="flex flex-col gap-2">
        <Label htmlFor="confirmPassword">Confirmar senha</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Digite a senha novamente"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
          aria-invalid={!!errors.confirmPassword}
          disabled={isLoading}
        />
        {errors.confirmPassword && (
          <p id="confirmPassword-error" className="text-sm text-destructive">
            {errors.confirmPassword}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-2">
          <Checkbox
            id="terms"
            checked={acceptTerms}
            onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
            disabled={isLoading}
            className="mt-0.5"
            aria-invalid={!!errors.terms}
          />
          <Label htmlFor="terms" className="text-sm font-normal cursor-pointer leading-relaxed">
            Eu concordo com os{" "}
            <Link href="/termos" className="text-primary hover:underline">
              Termos de Uso
            </Link>{" "}
            e{" "}
            <Link href="/privacidade" className="text-primary hover:underline">
              Política de Privacidade
            </Link>
          </Label>
        </div>
        {errors.terms && (
          <p className="text-sm text-destructive">
            {errors.terms}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Spinner size="sm" />
            Criando conta...
          </>
        ) : (
          "Criar conta"
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Já tem uma conta?{" "}
        <Link
          href="/"
          className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded font-medium"
        >
          Entrar
        </Link>
      </p>
    </form>
  )
}
