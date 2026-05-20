"use client"

import Image from "next/image"
import { Place, AvaliacaoResponse } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AccessibilityBadges } from "@/components/map/accessibility-badges"

interface PlaceDetailsSheetProps {
  place: Place | null
  reviews: AvaliacaoResponse[]
  currentUserId: string | null
  onClose: () => void
  onOpenReview: () => void
}

export function PlaceDetailsSheet({ place, reviews, currentUserId, onClose, onOpenReview }: PlaceDetailsSheetProps) {
  if (!place) return null

  const accessibilityCount = Object.values(place.accessibility).filter(Boolean).length
  const userAlreadyReviewed = currentUserId != null && reviews.some((r) => String(r.usuarioId) === currentUserId)

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ""
    try {
      return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(dateStr + "T00:00:00"))
    } catch {
      return dateStr
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b flex items-start justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-foreground">{place.name}</h2>
          <p className="text-sm text-muted-foreground mt-1">{place.address}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="flex-shrink-0">
          <CloseIcon className="size-5" />
          <span className="sr-only">Fechar</span>
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Avaliacao */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  className={`size-5 ${
                    star <= Math.floor(place.rating)
                      ? "text-amber-500 fill-amber-500"
                      : star <= place.rating
                      ? "text-amber-500 fill-amber-500/50"
                      : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <span className="font-semibold">
              {place.rating > 0 ? place.rating.toFixed(1) : "—"}
            </span>
          </div>
          <span className="text-sm text-muted-foreground">
            ({place.totalReviews} {place.totalReviews === 1 ? "avaliação" : "avaliações"})
          </span>
        </div>

        {/* Imagem do local */}
        {place.photos && place.photos.length > 0 ? (
          <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
            <Image src={place.photos[0]} alt={place.name} fill className="object-cover" />
          </div>
        ) : (
          <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
            <ImageIcon className="size-12 text-muted-foreground/50" />
          </div>
        )}

        {/* Recursos de acessibilidade */}
        {accessibilityCount > 0 ? (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AccessibilityIcon className="size-5 text-accent" />
              <h3 className="font-semibold">Acessibilidade</h3>
              <Badge variant="secondary" className="text-xs">
                {accessibilityCount} {accessibilityCount === 1 ? "recurso" : "recursos"}
              </Badge>
            </div>
            <AccessibilityBadges accessibility={place.accessibility} />
          </div>
        ) : (
          <div className="border rounded-lg p-4 text-center">
            <AccessibilityIcon className="size-8 text-muted-foreground/50 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Nenhuma informação de acessibilidade disponível</p>
            <p className="text-xs text-muted-foreground mt-1">
              Seja o primeiro a avaliar e informar os recursos de acessibilidade
            </p>
          </div>
        )}

        {/* Botão de avaliar / editar */}
        <div className="flex flex-col gap-3">
          <Button className="w-full" onClick={onOpenReview} variant={userAlreadyReviewed ? "outline" : "default"}>
            <StarIcon className="size-4 mr-2" />
            {userAlreadyReviewed ? "Editar minha avaliação" : "Avaliar este local"}
          </Button>
        </div>

        {/* Lista de avaliações */}
        <div>
          <h3 className="font-semibold mb-3">
            Avaliações dos Usuários
            {reviews.length > 0 && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                — média {place.rating.toFixed(1)} ★
              </span>
            )}
          </h3>

          {reviews.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-3">Este local ainda não possui avaliações</p>
              <Button variant="outline" onClick={onOpenReview}>
                Seja o primeiro a avaliar
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {review.autor.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium text-sm">{review.autor}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{formatDate(review.dataAvaliacao)}</span>
                  </div>

                  <div className="flex mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className={`size-3 ${star <= review.nota ? "text-amber-500 fill-amber-500" : "text-muted-foreground/30"}`}
                      />
                    ))}
                  </div>

                  {review.comentario && (
                    <p className="text-sm text-muted-foreground">{review.comentario}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  )
}

function ImageIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  )
}

function AccessibilityIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="6" r="1.5" fill="currentColor" />
      <path d="M12 9v3m0 0l-3 5m3-5l3 5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 11h10" strokeLinecap="round" />
    </svg>
  )
}
