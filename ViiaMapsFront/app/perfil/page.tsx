"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AccessibilityIcon } from "@/components/icons/accessibility-icon"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { getSessionUser, saveSessionUser } from "@/lib/session"
import { atualizarPerfil, alterarSenha, atualizarFoto } from "@/services/api"

const CROP_SIZE = 280

function getCropMetrics(naturalW: number, naturalH: number) {
  const scale = Math.max(CROP_SIZE / naturalW, CROP_SIZE / naturalH)
  return { scale, renderedW: naturalW * scale, renderedH: naturalH * scale }
}

function clampOffset(x: number, y: number, renderedW: number, renderedH: number) {
  return {
    x: Math.max(CROP_SIZE - renderedW, Math.min(0, x)),
    y: Math.max(CROP_SIZE - renderedH, Math.min(0, y)),
  }
}

export default function PerfilPage() {
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)
  const [isLoadingPassword, setIsLoadingPassword] = useState(false)
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState("")
  const [profileError, setProfileError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [avatarError, setAvatarError] = useState("")

  const [userData, setUserData] = useState({ name: "", email: "", avatar: "" })
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" })

  // Crop modal
  const [cropOpen, setCropOpen] = useState(false)
  const [cropImageUrl, setCropImageUrl] = useState("")
  const [cropNatural, setCropNatural] = useState({ w: 0, h: 0 })
  const [cropOffset, setCropOffset] = useState({ x: 0, y: 0 })
  const [isCropDragging, setIsCropDragging] = useState(false)
  const isDraggingRef = useRef(false)
  const dragStartRef = useRef({ mx: 0, my: 0, ox: 0, oy: 0 })

  useEffect(() => {
    const currentUser = getSessionUser()
    if (!currentUser) { window.location.href = "/"; return }
    setUserData({ name: currentUser.name, email: currentUser.email, avatar: currentUser.avatar ?? "" })
  }, [])

  // ── Dados pessoais ────────────────────────────────────────────────────
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileError("")
    setProfileSuccess("")
    setIsLoadingProfile(true)
    try {
      const result = await atualizarPerfil(userData.name, userData.email)
      const currentUser = getSessionUser()
      if (currentUser) {
        saveSessionUser({ ...currentUser, name: result.nome, email: result.email, token: result.token })
      }
      setProfileSuccess("Perfil atualizado com sucesso!")
      setTimeout(() => setProfileSuccess(""), 3000)
    } catch (err: unknown) {
      setProfileError(err instanceof Error ? err.message : "Erro ao atualizar perfil.")
    } finally {
      setIsLoadingProfile(false)
    }
  }

  // ── Senha ─────────────────────────────────────────────────────────────
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError("")
    setPasswordSuccess("")
    if (passwords.new !== passwords.confirm) {
      setPasswordError("As novas senhas não coincidem.")
      return
    }
    if (passwords.new.length < 6) {
      setPasswordError("A nova senha deve ter pelo menos 6 caracteres.")
      return
    }
    setIsLoadingPassword(true)
    try {
      await alterarSenha(passwords.current, passwords.new)
      setPasswordSuccess("Senha alterada com sucesso!")
      setPasswords({ current: "", new: "", confirm: "" })
      setTimeout(() => setPasswordSuccess(""), 3000)
    } catch (err: unknown) {
      setPasswordError(err instanceof Error ? err.message : "Erro ao alterar senha.")
    } finally {
      setIsLoadingPassword(false)
    }
  }

  // ── Foto: selecionar arquivo → abrir modal de recorte ─────────────────
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarError("")

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setAvatarError("Apenas arquivos PNG e JPG são aceitos.")
      e.target.value = ""
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setAvatarError("A foto deve ter no máximo 2MB.")
      e.target.value = ""
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const dataUrl = reader.result as string
      const img = new Image()
      img.onload = () => {
        const { renderedW, renderedH } = getCropMetrics(img.naturalWidth, img.naturalHeight)
        setCropNatural({ w: img.naturalWidth, h: img.naturalHeight })
        setCropOffset({
          x: (CROP_SIZE - renderedW) / 2,
          y: (CROP_SIZE - renderedH) / 2,
        })
        setCropImageUrl(dataUrl)
        setCropOpen(true)
      }
      img.src = dataUrl
    }
    reader.readAsDataURL(file)
    e.target.value = ""
  }

  // ── Crop: drag com mouse ──────────────────────────────────────────────
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    isDraggingRef.current = true
    setIsCropDragging(true)
    dragStartRef.current = { mx: e.clientX, my: e.clientY, ox: cropOffset.x, oy: cropOffset.y }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return
    const dx = e.clientX - dragStartRef.current.mx
    const dy = e.clientY - dragStartRef.current.my
    const { renderedW, renderedH } = getCropMetrics(cropNatural.w, cropNatural.h)
    setCropOffset(clampOffset(dragStartRef.current.ox + dx, dragStartRef.current.oy + dy, renderedW, renderedH))
  }

  const handleDragEnd = () => {
    isDraggingRef.current = false
    setIsCropDragging(false)
  }

  // ── Crop: drag com toque (mobile) ─────────────────────────────────────
  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0]
    isDraggingRef.current = true
    dragStartRef.current = { mx: t.clientX, my: t.clientY, ox: cropOffset.x, oy: cropOffset.y }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return
    const t = e.touches[0]
    const dx = t.clientX - dragStartRef.current.mx
    const dy = t.clientY - dragStartRef.current.my
    const { renderedW, renderedH } = getCropMetrics(cropNatural.w, cropNatural.h)
    setCropOffset(clampOffset(dragStartRef.current.ox + dx, dragStartRef.current.oy + dy, renderedW, renderedH))
  }

  // ── Crop: confirmar → recortar com canvas → upload ────────────────────
  const handleCropConfirm = () => {
    const img = new Image()
    img.onload = async () => {
      const { scale } = getCropMetrics(img.naturalWidth, img.naturalHeight)
      const canvas = document.createElement("canvas")
      canvas.width = 400
      canvas.height = 400
      const ctx = canvas.getContext("2d")!
      // Mapeia o trecho visível do original para o canvas quadrado
      const srcX = -cropOffset.x / scale
      const srcY = -cropOffset.y / scale
      const srcSize = CROP_SIZE / scale
      ctx.drawImage(img, srcX, srcY, srcSize, srcSize, 0, 0, 400, 400)
      const croppedBase64 = canvas.toDataURL("image/jpeg", 0.88)

      setCropOpen(false)

      const currentUser = getSessionUser()
      const avatarAnterior = userData.avatar
      setUserData((prev) => ({ ...prev, avatar: croppedBase64 }))
      setIsLoadingAvatar(true)
      try {
        await atualizarFoto(croppedBase64)
        if (currentUser) saveSessionUser({ ...currentUser, avatar: croppedBase64 })
      } catch (err: unknown) {
        setAvatarError(err instanceof Error ? err.message : "Erro ao salvar foto.")
        setUserData((prev) => ({ ...prev, avatar: avatarAnterior }))
      } finally {
        setIsLoadingAvatar(false)
      }
    }
    img.src = cropImageUrl
  }

  const metrics = cropNatural.w ? getCropMetrics(cropNatural.w, cropNatural.h) : { renderedW: 0, renderedH: 0 }

  return (
    <div className="min-h-screen bg-background">

      {/* ── Modal de recorte ── */}
      {cropOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-card rounded-xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-1">Ajustar Foto</h3>
            <p className="text-sm text-muted-foreground mb-5">
              Arraste a imagem para centralizar o rosto
            </p>

            {/* Área de recorte circular */}
            <div className="flex justify-center mb-6">
              <div
                className="relative overflow-hidden rounded-full border-4 border-primary select-none"
                style={{
                  width: CROP_SIZE,
                  height: CROP_SIZE,
                  cursor: isCropDragging ? "grabbing" : "grab",
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleDragEnd}
              >
                <img
                  src={cropImageUrl}
                  alt="Ajuste"
                  draggable={false}
                  style={{
                    position: "absolute",
                    left: cropOffset.x,
                    top: cropOffset.y,
                    width: metrics.renderedW,
                    height: metrics.renderedH,
                    userSelect: "none",
                    pointerEvents: "none",
                  }}
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setCropOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCropConfirm}>Usar Foto</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <header className="bg-card border-b px-4 py-3 flex items-center gap-4">
        <Link href="/mapa" className="flex items-center gap-2">
          <AccessibilityIcon className="size-8 text-primary" />
          <span className="text-xl font-bold text-foreground">ViiaMaps</span>
        </Link>
        <div className="flex-1" />
        <Button variant="ghost" asChild>
          <Link href="/mapa">Voltar ao Mapa</Link>
        </Button>
      </header>

      <main className="container max-w-2xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Meu Perfil</h1>

        {/* ── Foto do perfil ── */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Foto do Perfil</CardTitle>
            <CardDescription>PNG ou JPG, máximo 2MB. Clique na imagem para alterar.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <label
              htmlFor="avatar-upload"
              className={`cursor-pointer group relative ${isLoadingAvatar ? "pointer-events-none opacity-70" : ""}`}
            >
              <Avatar className="size-32 border-4 border-primary/20 group-hover:border-primary transition-colors">
                <AvatarImage src={userData.avatar} alt="Foto do perfil" />
                <AvatarFallback className="bg-primary text-primary-foreground text-4xl">
                  {userData.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                {isLoadingAvatar ? (
                  <div className="size-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <CameraIcon className="size-8 text-white" />
                )}
              </div>
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/png,image/jpeg,.jpg,.jpeg,.png"
              className="hidden"
              onChange={handleAvatarChange}
              disabled={isLoadingAvatar}
            />
            {avatarError ? (
              <p className="text-sm text-red-600">{avatarError}</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                {isLoadingAvatar ? "Salvando foto..." : "Clique na imagem para alterar"}
              </p>
            )}
          </CardContent>
        </Card>

        {/* ── Dados pessoais ── */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Dados Pessoais</CardTitle>
            <CardDescription>Atualize suas informações de perfil</CardDescription>
          </CardHeader>
          <CardContent>
            {profileSuccess && (
              <div className="bg-green-100 text-green-800 border border-green-300 rounded-lg p-3 mb-4 text-sm">
                {profileSuccess}
              </div>
            )}
            {profileError && (
              <div className="bg-red-100 text-red-800 border border-red-300 rounded-lg p-3 mb-4 text-sm">
                {profileError}
              </div>
            )}
            <form onSubmit={handleUpdateProfile}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Nome</FieldLabel>
                  <Input
                    id="name"
                    value={userData.name}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    placeholder="Seu nome"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">E-mail</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    value={userData.email}
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    placeholder="seu@email.com"
                    required
                  />
                </Field>
              </FieldGroup>
              <Button type="submit" className="mt-4" disabled={isLoadingProfile}>
                {isLoadingProfile ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* ── Alterar senha ── */}
        <Card>
          <CardHeader>
            <CardTitle>Alterar Senha</CardTitle>
            <CardDescription>Mantenha sua conta segura</CardDescription>
          </CardHeader>
          <CardContent>
            {passwordSuccess && (
              <div className="bg-green-100 text-green-800 border border-green-300 rounded-lg p-3 mb-4 text-sm">
                {passwordSuccess}
              </div>
            )}
            {passwordError && (
              <div className="bg-red-100 text-red-800 border border-red-300 rounded-lg p-3 mb-4 text-sm">
                {passwordError}
              </div>
            )}
            <form onSubmit={handleUpdatePassword}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="current-password">Senha Atual</FieldLabel>
                  <Input
                    id="current-password"
                    type="password"
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    placeholder="Digite sua senha atual"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="new-password">Nova Senha</FieldLabel>
                  <Input
                    id="new-password"
                    type="password"
                    value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                    placeholder="Mínimo 6 caracteres"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="confirm-password">Confirmar Nova Senha</FieldLabel>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    placeholder="Repita a nova senha"
                    required
                  />
                </Field>
              </FieldGroup>
              <Button type="submit" className="mt-4" disabled={isLoadingPassword}>
                {isLoadingPassword ? "Alterando..." : "Alterar Senha"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
    </svg>
  )
}
