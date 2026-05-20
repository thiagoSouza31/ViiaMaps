"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AccessibilityIcon } from "@/components/icons/accessibility-icon"
import { getSessionUser } from "@/lib/session"
import { listarMinhasAvaliacoes, deletarAvaliacao } from "@/services/api"
import { AvaliacaoResponse } from "@/lib/types"

export default function MinhasAvaliacoesPage() {
  const [reviews, setReviews] = useState<AvaliacaoResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null)

  useEffect(() => {
    const currentUser = getSessionUser()
    if (!currentUser) { window.location.href = "/"; return }
    setUser(currentUser)

    listarMinhasAvaliacoes(currentUser.id)
      .then(setReviews)
      .catch((err) => setError(err.message ?? "Erro ao carregar avaliações."))
      .finally(() => setIsLoading(false))
  }, [])

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta avaliação?")) return

    setIsDeleting(reviewId)
    setError(null)
    setSuccessMessage(null)

    try {
      await deletarAvaliacao(reviewId)
      setReviews((prev) => prev.filter((r) => String(r.id) !== reviewId))
      setSuccessMessage("Avaliação excluída com sucesso.")
      setTimeout(() => setSuccessMessage(null), 4000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir avaliação.")
    } finally {
      setIsDeleting(null)
    }
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ""
    try {
      return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date(dateStr + "T00:00:00"))
    } catch {
      return dateStr
    }
  }

  return (
    <div className="min-h-screen bg-background">
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

      <main className="container max-w-3xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Minhas Avaliações</h1>
          {!isLoading && <span className="text-muted-foreground">{reviews.length} avaliações</span>}
        </div>

        {successMessage && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-sm text-green-700 dark:text-green-400">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
            {error}
          </div>
        )}

        {!user ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <StarIcon className="size-16 text-muted-foreground/50 mb-4" />
              <h2 className="text-lg font-medium mb-2">Você precisa estar logado</h2>
              <p className="text-muted-foreground text-center mb-4">
                Faça login para ver suas avaliações.
              </p>
              <Button asChild>
                <Link href="/">Ir para login</Link>
              </Button>
            </CardContent>
          </Card>
        ) : isLoading ? (
          <div className="flex justify-center py-12">
            <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : reviews.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <StarIcon className="size-16 text-muted-foreground/50 mb-4" />
              <h2 className="text-lg font-medium mb-2">Nenhuma avaliação ainda</h2>
              <p className="text-muted-foreground text-center mb-4">
                Você ainda não avaliou nenhum local. Explore o mapa e compartilhe sua experiência!
              </p>
              <Button asChild>
                <Link href="/mapa">Explorar Mapa</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <Link
                        href={`/mapa`}
                        className="font-semibold text-lg hover:text-primary transition-colors"
                      >
                        {review.nomeEstabelecimento}
                      </Link>
                      <p className="text-sm text-muted-foreground mb-3">{review.enderecoEstabelecimento}</p>

                      {/* Estrelas */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon
                              key={star}
                              className={`size-5 ${
                                star <= review.nota
                                  ? "text-yellow-500 fill-yellow-500"
                                  : "text-muted-foreground/30"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(review.dataAvaliacao)}
                        </span>
                      </div>

                      {/* Comentario */}
                      {review.comentario && (
                        <p className="text-foreground mb-4">{review.comentario}</p>
                      )}

                      {/* Acessibilidade marcada */}
                      <div className="flex flex-wrap gap-2">
                        {review.cadeiraDeRodas && <Badge label="Rampa de Acesso" />}
                        {review.banheiroComAcessibilidade && <Badge label="Banheiro Adaptado" />}
                        {review.elevador && <Badge label="Elevador" />}
                        {review.pisoTatil && <Badge label="Piso Tátil" />}
                        {review.estacionamentoPreferencial && <Badge label="Vaga Preferencial" />}
                        {review.linguagemDeSinal && <Badge label="Libras" />}
                        {review.menuBraile && <Badge label="Braille" />}
                      </div>
                    </div>

                    {/* Botão excluir */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteReview(String(review.id))}
                      disabled={isDeleting === String(review.id)}
                    >
                      {isDeleting === String(review.id) ? (
                        <span className="size-4 border-2 border-destructive border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <TrashIcon className="size-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function Badge({ label }: { label: string }) {
  return (
    <span className="px-2 py-1 bg-accent/20 text-accent-foreground text-xs rounded-full">
      {label}
    </span>
  )
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  )
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  )
}
