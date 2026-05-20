"use client"

import { useState, useEffect } from "react"
import { Place, AvaliacaoResponse, AccessibilityFeatures } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Spinner } from "@/components/ui/spinner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ReviewModalProps {
  place: Place | null
  open: boolean
  onOpenChange: (open: boolean) => void
  existingReview: AvaliacaoResponse | null
  onSubmit: (review: ReviewData) => Promise<void>
}

interface ReviewData {
  rating: number
  comment: string
  accessibility: Partial<AccessibilityFeatures>
}

const accessibilityOptions: { key: keyof AccessibilityFeatures; label: string; description: string }[] = [
  { key: "wheelchairRamp",        label: "Rampa de Acesso",        description: "Possui rampa para cadeirantes" },
  { key: "adaptedBathroom",       label: "Banheiro Adaptado",      description: "Possui banheiro acessível" },
  { key: "elevator",              label: "Elevador",               description: "Possui elevador acessível" },
  { key: "tactilePaving",         label: "Piso Tátil",             description: "Possui piso tátil para deficientes visuais" },
  { key: "preferentialParking",   label: "Vaga Preferencial",      description: "Possui vagas de estacionamento preferenciais" },
  { key: "signLanguage",          label: "Libras",                 description: "Funcionários treinados em Libras" },
  { key: "brailleSignage",        label: "Sinalização em Braille", description: "Possui sinalização em Braille" },
]

export function ReviewModal({ place, open, onOpenChange, existingReview, onSubmit }: ReviewModalProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [accessibility, setAccessibility] = useState<Partial<AccessibilityFeatures>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Pré-preenche o formulário quando o modal abre
  useEffect(() => {
    if (!open) return
    if (existingReview) {
      setRating(existingReview.nota)
      setComment(existingReview.comentario || "")
      setAccessibility({
        wheelchairRamp:      existingReview.cadeiraDeRodas,
        adaptedBathroom:     existingReview.banheiroComAcessibilidade,
        elevator:            existingReview.elevador,
        tactilePaving:       existingReview.pisoTatil,
        preferentialParking: existingReview.estacionamentoPreferencial,
        signLanguage:        existingReview.linguagemDeSinal,
        brailleSignage:      existingReview.menuBraile,
      })
    } else {
      setRating(0)
      setComment("")
      setAccessibility({})
    }
    setError("")
  }, [open, existingReview])

  const handleAccessibilityChange = (key: keyof AccessibilityFeatures, checked: boolean) => {
    setAccessibility((prev) => ({ ...prev, [key]: checked }))
  }

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Selecione uma avaliação em estrelas.")
      return
    }
    if (!Object.values(accessibility).some(Boolean)) {
      setError("Marque ao menos uma opção de acessibilidade.")
      return
    }

    setError("")
    setIsSubmitting(true)
    try {
      await onSubmit({ rating, comment, accessibility })
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao enviar avaliação.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false)
      setError("")
    }
  }

  if (!place) return null

  const isEditing = !!existingReview

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar avaliação" : `Avaliar ${place.name}`}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize sua avaliação e as informações de acessibilidade do local."
              : "Compartilhe sua experiência e ajude outros usuários a encontrar locais acessíveis."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Avaliação com estrelas */}
          <div className="space-y-2">
            <Label>Avaliação geral <span className="text-destructive">*</span></Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded transition-transform hover:scale-110"
                  aria-label={`${star} estrela${star > 1 ? "s" : ""}`}
                >
                  <StarIcon
                    className={`size-8 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? "text-amber-500 fill-amber-500"
                        : "text-muted-foreground/30"
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm text-muted-foreground">
                  {rating === 1 && "Ruim"}
                  {rating === 2 && "Regular"}
                  {rating === 3 && "Bom"}
                  {rating === 4 && "Muito bom"}
                  {rating === 5 && "Excelente"}
                </span>
              )}
            </div>
          </div>

          {/* Recursos de acessibilidade */}
          <div className="space-y-3">
            <div>
              <Label>Recursos de acessibilidade <span className="text-destructive">*</span></Label>
              <p className="text-sm text-muted-foreground mt-0.5">
                Marque ao menos um recurso que você encontrou neste local
              </p>
            </div>
            <div className="grid gap-3">
              {accessibilityOptions.map((option) => (
                <div
                  key={option.key}
                  className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    id={option.key}
                    checked={accessibility[option.key] || false}
                    onCheckedChange={(checked) =>
                      handleAccessibilityChange(option.key, checked as boolean)
                    }
                    disabled={isSubmitting}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <Label htmlFor={option.key} className="font-medium cursor-pointer">
                      {option.label}
                    </Label>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comentário */}
          <div className="space-y-2">
            <Label htmlFor="comment">Comentário <span className="text-muted-foreground text-xs">(opcional)</span></Label>
            <Textarea
              id="comment"
              placeholder="Conte sua experiência sobre a acessibilidade do local..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        {/* Ações */}
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner size="sm" />
                {isEditing ? "Salvando..." : "Enviando..."}
              </>
            ) : (
              isEditing ? "Salvar alterações" : "Enviar avaliação"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
      />
    </svg>
  )
}
