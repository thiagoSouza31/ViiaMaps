"use client"

import {
  listarEstabelecimentos,
  listarMinhasAvaliacoes,
  submeterAvaliacao,
  atualizarAvaliacao,
  listarAvaliacoesPorEstabelecimento,
} from "@/services/api"
import { useEffect, useState, useCallback, useMemo } from "react"
import { Place, AvaliacaoResponse, AccessibilityFeatures } from "@/lib/types"
import { getSessionUser, SessionUser } from "@/lib/session"
import { getSettings, AppSettings } from "@/lib/settings"
import { MapHeader } from "@/components/map/map-header"
import { PlaceDetailsSheet } from "@/components/map/place-details-sheet"
import { SearchResults } from "@/components/map/search-results"
import { ReviewModal } from "@/components/map/review-modal"
import { MapContainer } from "@/components/map/map-container"

export default function MapaPage() {
  const [places, setPlaces] = useState<Place[]>([])
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
  const [placeReviews, setPlaceReviews] = useState<AvaliacaoResponse[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchLocation, setSearchLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null)

  // Configurações salvas pelo usuário em /configuracoes
  const [mapSettings, setMapSettings] = useState<AppSettings>({
    showOnlyAccessible: false,
    showOnlyMyPlaces: false,
    highContrast: false,
    largeText: false,
  })

  // IDs dos estabelecimentos que o usuário logado avaliou (para filtro "meus locais")
  const [userReviewedIds, setUserReviewedIds] = useState<Set<string>>(new Set())

  // Carrega dados iniciais — redireciona para login se não houver sessão válida
  useEffect(() => {
    const user = getSessionUser()
    if (!user) {
      window.location.href = "/"
      return
    }
    setCurrentUser(user)
    setMapSettings(getSettings())

    listarEstabelecimentos()
      .then(setPlaces)
      .catch((err) => console.error("Erro ao carregar estabelecimentos:", err))
  }, [])

  // Carrega avaliações do usuário quando o filtro "meus locais" estiver ativo
  useEffect(() => {
    if (!mapSettings.showOnlyMyPlaces || !currentUser) {
      setUserReviewedIds(new Set())
      return
    }
    listarMinhasAvaliacoes(currentUser.id)
      .then((reviews) => {
        setUserReviewedIds(new Set(reviews.map((r) => String(r.estabelecimentoId))))
      })
      .catch(() => setUserReviewedIds(new Set()))
  }, [mapSettings.showOnlyMyPlaces, currentUser])

  // Carrega avaliações do local selecionado
  useEffect(() => {
    if (!selectedPlace) { setPlaceReviews([]); return }
    listarAvaliacoesPorEstabelecimento(selectedPlace.id)
      .then(setPlaceReviews)
      .catch(() => setPlaceReviews([]))
  }, [selectedPlace])

  // Avaliação do usuário logado para o local selecionado (para edição)
  const existingReview = useMemo(() => {
    if (!currentUser || !placeReviews.length) return null
    return placeReviews.find((r) => String(r.usuarioId) === currentUser.id) ?? null
  }, [placeReviews, currentUser])

  // Lista de locais após aplicar os filtros ativos
  const filteredPlaces = useMemo(() => {
    let result = places

    if (mapSettings.showOnlyAccessible) {
      result = result.filter((p) => Object.values(p.accessibility).some(Boolean))
    }

    if (mapSettings.showOnlyMyPlaces) {
      result = result.filter((p) => userReviewedIds.has(String(p.id)))
    }

    return result
  }, [places, mapSettings.showOnlyAccessible, mapSettings.showOnlyMyPlaces, userReviewedIds])

  const handlePlaceSelect = useCallback((place: Place) => {
    setSelectedPlace(place)
    setShowSearchResults(false)
  }, [])

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) return
    setIsSearching(true)
    setShowSearchResults(true)

    const searchLower = query.toLowerCase()
    const results = filteredPlaces.filter(
      (p) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.address.toLowerCase().includes(searchLower)
    )
    if (results.length > 0) setSearchLocation({ lat: results[0].lat, lng: results[0].lng })

    setIsSearching(false)
  }, [filteredPlaces])

  const handleCloseDetails = useCallback(() => {
    setSelectedPlace(null)
    setPlaceReviews([])
  }, [])

  const handleOpenReview = useCallback(() => {
    setShowReviewModal(true)
  }, [])

  const handleSubmitReview = useCallback(
    async (review: { rating: number; comment: string; accessibility: Partial<AccessibilityFeatures> }) => {
      if (!selectedPlace || !currentUser) return

      const accessibilityData = {
        wheelchairRamp:      review.accessibility.wheelchairRamp ?? false,
        adaptedBathroom:     review.accessibility.adaptedBathroom ?? false,
        elevator:            review.accessibility.elevator ?? false,
        tactilePaving:       review.accessibility.tactilePaving ?? false,
        preferentialParking: review.accessibility.preferentialParking ?? false,
        signLanguage:        review.accessibility.signLanguage ?? false,
        brailleSignage:      review.accessibility.brailleSignage ?? false,
      }

      if (existingReview) {
        await atualizarAvaliacao(existingReview.id, {
          nota: review.rating,
          comentario: review.comment,
          accessibility: accessibilityData,
        })
      } else {
        await submeterAvaliacao({
          usuarioId: Number(currentUser.id),
          estabelecimentoId: Number(selectedPlace.id),
          nota: review.rating,
          comentario: review.comment,
          accessibility: accessibilityData,
        })
      }

      const [updatedPlaces, updatedReviews] = await Promise.all([
        listarEstabelecimentos(),
        listarAvaliacoesPorEstabelecimento(selectedPlace.id),
      ])

      setPlaces(updatedPlaces)
      setPlaceReviews(updatedReviews)

      const updatedPlace = updatedPlaces.find((p) => p.id === selectedPlace.id)
      if (updatedPlace) setSelectedPlace(updatedPlace)

      if (mapSettings.showOnlyMyPlaces && currentUser && !existingReview) {
        setUserReviewedIds((prev) => new Set([...prev, String(selectedPlace.id)]))
      }
    },
    [currentUser, selectedPlace, mapSettings.showOnlyMyPlaces, existingReview]
  )

  return (
    <div className="h-screen flex flex-col bg-background">
      <MapHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
        isSearching={isSearching}
      />

      <div className="flex-1 flex overflow-hidden">
        {selectedPlace && (
          <div className="w-full sm:w-96 h-full flex-shrink-0 border-r bg-card overflow-y-auto">
            <PlaceDetailsSheet
              place={selectedPlace}
              reviews={placeReviews}
              currentUserId={currentUser?.id ?? null}
              onClose={handleCloseDetails}
              onOpenReview={handleOpenReview}
            />
          </div>
        )}

        <div className="flex-1 relative z-0">
          <MapContainer
            places={filteredPlaces}
            onPlaceSelect={handlePlaceSelect}
            selectedPlace={selectedPlace}
            searchLocation={searchLocation}
          />

          {showSearchResults && (
            <SearchResults
              query={searchQuery}
              isSearching={isSearching}
              places={filteredPlaces}
              onPlaceSelect={handlePlaceSelect}
              onClose={() => setShowSearchResults(false)}
            />
          )}
        </div>

        <ReviewModal
          place={selectedPlace}
          open={showReviewModal}
          onOpenChange={setShowReviewModal}
          existingReview={existingReview}
          onSubmit={handleSubmitReview}
        />
      </div>
    </div>
  )
}
