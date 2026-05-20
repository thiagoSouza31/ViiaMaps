"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AccessibilityIcon } from "@/components/icons/accessibility-icon"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { getSettings, saveSettings } from "@/lib/settings"
import { clearSession, getSessionUser } from "@/lib/session"
import { excluirConta } from "@/services/api"

export default function ConfiguracoesPage() {
  const [settings, setSettings] = useState({
    showOnlyAccessible: false,
    showOnlyMyPlaces: false,
    darkTheme: false,
    highContrast: false,
    largeText: false,
    nightMode: false,
  })

  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  // Estado do modal de exclusão
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteChecked, setDeleteChecked] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState("")

  useEffect(() => {
    if (!getSessionUser()) { window.location.href = "/"; return }
    setSettings(getSettings())
  }, [])

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = () => {
    setIsSaving(true)
    saveSettings(settings)
    setSuccessMessage("Configurações salvas com sucesso!")
    setIsSaving(false)
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const handleOpenDeleteModal = () => {
    setDeleteChecked(false)
    setDeleteError("")
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    setDeleteError("")
    setIsDeleting(true)
    try {
      await excluirConta()
      // Limpa toda a sessão e configurações locais
      clearSession()
      localStorage.removeItem("token")
      localStorage.removeItem("viia_settings")
      window.location.href = "/"
    } catch (err: unknown) {
      setDeleteError(err instanceof Error ? err.message : "Erro ao excluir conta. Tente novamente.")
      setIsDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">

      {/* ── Modal de confirmação de exclusão ── */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-card rounded-xl shadow-xl p-6 w-full max-w-md">

            {/* Ícone de aviso */}
            <div className="flex justify-center mb-4">
              <div className="size-14 rounded-full bg-destructive/10 flex items-center justify-center">
                <svg className="size-7 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-center mb-1">Excluir minha conta</h3>
            <p className="text-sm text-muted-foreground text-center mb-5">
              Esta ação é <span className="font-semibold text-destructive">permanente e irreversível</span>.
              Os seguintes dados serão excluídos definitivamente:
            </p>

            {/* Lista do que será removido */}
            <ul className="text-sm text-muted-foreground space-y-1.5 mb-6 bg-muted rounded-lg p-4">
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-destructive flex-shrink-0" />
                Seus dados de acesso (nome, e-mail e senha)
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-destructive flex-shrink-0" />
                Todas as suas avaliações de estabelecimentos
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-destructive flex-shrink-0" />
                Todas as informações de acessibilidade que você marcou
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-destructive flex-shrink-0" />
                Sua foto de perfil e configurações
              </li>
            </ul>

            {/* Checkbox de confirmação */}
            <label className="flex items-start gap-3 cursor-pointer mb-5 select-none">
              <Checkbox
                checked={deleteChecked}
                onCheckedChange={(v) => setDeleteChecked(v as boolean)}
                className="mt-0.5 flex-shrink-0"
              />
              <span className="text-sm text-foreground leading-snug">
                Estou ciente de que minha conta e todos os meus dados serão permanentemente excluídos e não poderão ser recuperados.
              </span>
            </label>

            {deleteError && (
              <p className="text-sm text-destructive mb-4">{deleteError}</p>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleConfirmDelete}
                disabled={!deleteChecked || isDeleting}
              >
                {isDeleting ? "Excluindo..." : "Excluir minha conta"}
              </Button>
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
        <h1 className="text-2xl font-bold mb-6">Configurações</h1>

        {successMessage && (
          <div className="bg-accent/20 text-accent-foreground border border-accent rounded-lg p-4 mb-6">
            {successMessage}
          </div>
        )}

        {/* Preferências do Mapa */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Preferências do Mapa</CardTitle>
            <CardDescription>Personalize sua experiência no mapa</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <div className="flex items-center justify-between">
                <Field className="flex-1">
                  <FieldLabel htmlFor="showOnlyAccessible">Mostrar apenas locais acessíveis</FieldLabel>
                  <p className="text-sm text-muted-foreground">
                    Exibe somente locais com pelo menos um recurso de acessibilidade confirmado por avaliações
                  </p>
                </Field>
                <Switch
                  id="showOnlyAccessible"
                  checked={settings.showOnlyAccessible}
                  onCheckedChange={() => handleToggle("showOnlyAccessible")}
                />
              </div>
              <div className="flex items-center justify-between">
                <Field className="flex-1">
                  <FieldLabel htmlFor="showOnlyMyPlaces">Mostrar apenas locais que avaliei</FieldLabel>
                  <p className="text-sm text-muted-foreground">
                    Filtra o mapa para exibir somente os locais que você mesmo avaliou
                  </p>
                </Field>
                <Switch
                  id="showOnlyMyPlaces"
                  checked={settings.showOnlyMyPlaces}
                  onCheckedChange={() => handleToggle("showOnlyMyPlaces")}
                />
              </div>
            </FieldGroup>
          </CardContent>
        </Card>

        {/* Acessibilidade do App */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Acessibilidade do Aplicativo</CardTitle>
            <CardDescription>Ajuste a interface para suas necessidades</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <div className="flex items-center justify-between">
                <Field className="flex-1">
                  <FieldLabel htmlFor="darkTheme">Tema escuro</FieldLabel>
                  <p className="text-sm text-muted-foreground">
                    Interface em tons escuros com o laranja do ViiaMaps mantido
                  </p>
                </Field>
                <Switch
                  id="darkTheme"
                  checked={settings.darkTheme}
                  onCheckedChange={() => handleToggle("darkTheme")}
                />
              </div>
              <div className="flex items-center justify-between">
                <Field className="flex-1">
                  <FieldLabel htmlFor="highContrast">Alto contraste</FieldLabel>
                  <p className="text-sm text-muted-foreground">
                    Aumenta o contraste das cores para melhor visibilidade
                  </p>
                </Field>
                <Switch
                  id="highContrast"
                  checked={settings.highContrast}
                  onCheckedChange={() => handleToggle("highContrast")}
                />
              </div>
              <div className="flex items-center justify-between">
                <Field className="flex-1">
                  <FieldLabel htmlFor="largeText">Texto ampliado</FieldLabel>
                  <p className="text-sm text-muted-foreground">
                    Aumenta o tamanho de todo o texto do aplicativo para facilitar a leitura
                  </p>
                </Field>
                <Switch
                  id="largeText"
                  checked={settings.largeText}
                  onCheckedChange={() => handleToggle("largeText")}
                />
              </div>
              <div className="flex items-center justify-between">
                <Field className="flex-1">
                  <FieldLabel htmlFor="nightMode">Modo noturno</FieldLabel>
                  <p className="text-sm text-muted-foreground">
                    Aplica filtro amarelo quente para reduzir a luz azul e proteger os olhos à noite
                  </p>
                </Field>
                <Switch
                  id="nightMode"
                  checked={settings.nightMode}
                  onCheckedChange={() => handleToggle("nightMode")}
                />
              </div>
            </FieldGroup>
          </CardContent>
        </Card>

        {/* Salvar */}
        <div className="flex justify-end mb-8">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Salvando..." : "Salvar Configurações"}
          </Button>
        </div>

        {/* Zona de perigo */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
            <CardDescription>Ações irreversíveis para sua conta</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Excluir minha conta</p>
                <p className="text-sm text-muted-foreground">
                  Remove permanentemente sua conta e todos os seus dados
                </p>
              </div>
              <Button variant="destructive" onClick={handleOpenDeleteModal}>
                Excluir Conta
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
