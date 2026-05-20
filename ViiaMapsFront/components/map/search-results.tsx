"use client"

import { Place } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface SearchResultsProps {
  query: string
  isSearching: boolean
  places: Place[]
  onPlaceSelect: (place: Place) => void
  onClose: () => void
}

export function SearchResults({ query, isSearching, places, onPlaceSelect, onClose }: SearchResultsProps) {
  const filteredPlaces = places.filter(
    (place) =>
      place.name.toLowerCase().includes(query.toLowerCase()) ||
      place.address.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <Card className="absolute top-4 left-4 w-80 max-h-[calc(100vh-8rem)] overflow-hidden shadow-lg z-40">
      <div className="flex items-center justify-between p-3 border-b">
        <h3 className="font-semibold text-sm">
          {isSearching ? "Buscando..." : `${filteredPlaces.length} resultados`}
        </h3>
        <Button variant="ghost" size="icon-sm" onClick={onClose}>
          <CloseIcon className="size-4" />
          <span className="sr-only">Fechar</span>
        </Button>
      </div>

      <div className="overflow-y-auto max-h-80">
        {isSearching ? (
          <div className="flex items-center justify-center p-8">
            <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredPlaces.length === 0 ? (
          <div className="p-6 text-center">
            <MapIcon className="size-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              Nenhum local encontrado para &quot;{query}&quot;
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredPlaces.map((place) => (
              <SearchResultItem
                key={place.id}
                place={place}
                onClick={() => onPlaceSelect(place)}
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}

function SearchResultItem({ place, onClick }: { place: Place; onClick: () => void }) {
  const accessibilityCount = Object.values(place.accessibility).filter(Boolean).length

  return (
    <button
      onClick={onClick}
      className="w-full p-3 text-left hover:bg-muted/50 transition-colors focus:outline-none focus:bg-muted/50"
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 size-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <MapPinIcon className="size-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate">{place.name}</h4>
          <p className="text-xs text-muted-foreground truncate">{place.address}</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1">
              <StarIcon className="size-3 text-amber-500 fill-amber-500" />
              <span className="text-xs font-medium">{place.rating}</span>
            </div>
            {accessibilityCount > 0 && (
              <span className="text-xs text-accent font-medium">
                {accessibilityCount} recursos de acessibilidade
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  )
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

function MapIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
    </svg>
  )
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
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
