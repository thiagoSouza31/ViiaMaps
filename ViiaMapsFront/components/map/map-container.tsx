"use client"

import dynamic from "next/dynamic"
import { Place } from "@/lib/types"

const MapView = dynamic(
  () => import("./map-view-client").then((mod) => mod.MapViewClient),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-muted">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-muted-foreground">Carregando mapa...</span>
        </div>
      </div>
    ),
  }
)

interface MapContainerProps {
  places: Place[]
  onPlaceSelect: (place: Place) => void
  selectedPlace: Place | null
  searchLocation: { lat: number; lng: number } | null
}

export function MapContainer({ places, onPlaceSelect, selectedPlace, searchLocation }: MapContainerProps) {
  return (
    <MapView
      places={places}
      onPlaceSelect={onPlaceSelect}
      selectedPlace={selectedPlace}
      searchLocation={searchLocation}
    />
  )
}
