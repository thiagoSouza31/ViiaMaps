"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Place } from "@/lib/types"
import { LONDRINA_CENTER, LONDRINA_BOUNDS } from "@/lib/mock-data"

interface MapViewClientProps {
  places: Place[]
  onPlaceSelect: (place: Place) => void
  selectedPlace: Place | null
  searchLocation: { lat: number; lng: number } | null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LeafletType = typeof import("leaflet")

function getTileConfig(isDark: boolean) {
  if (isDark) {
    return {
      url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
    }
  }
  return {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: "abc",
  }
}

export function MapViewClient({ places, onPlaceSelect, selectedPlace, searchLocation }: MapViewClientProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<any[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tileLayerRef = useRef<any>(null)
  const leafletRef = useRef<LeafletType | null>(null)
  const [isMapReady, setIsMapReady] = useState(false)
  const isInitializing = useRef(false)

  const handlePlaceSelect = useCallback((place: Place) => {
    onPlaceSelect(place)
  }, [onPlaceSelect])

  // Carregar Leaflet e inicializar mapa
  useEffect(() => {
    if (isInitializing.current || mapRef.current) return
    if (!mapContainerRef.current) return

    isInitializing.current = true

    const initMap = async () => {
      try {
        const L = await import("leaflet")
        await import("leaflet/dist/leaflet.css")

        leafletRef.current = L

        if (!mapContainerRef.current || mapRef.current) {
          isInitializing.current = false
          return
        }

        const londrinaBounds = L.latLngBounds(
          [LONDRINA_BOUNDS.south, LONDRINA_BOUNDS.west],
          [LONDRINA_BOUNDS.north, LONDRINA_BOUNDS.east]
        )

        const map = L.map(mapContainerRef.current, {
          center: [LONDRINA_CENTER.lat, LONDRINA_CENTER.lng],
          zoom: 14,
          zoomControl: false,
          minZoom: 12,
          maxZoom: 18,
          maxBounds: londrinaBounds,
          maxBoundsViscosity: 1.0,
        })

        L.control.zoom({ position: "bottomright" }).addTo(map)

        const isDark = document.documentElement.classList.contains("dark")
        const tileConfig = getTileConfig(isDark)
        tileLayerRef.current = L.tileLayer(tileConfig.url, {
          attribution: tileConfig.attribution,
          subdomains: tileConfig.subdomains,
        }).addTo(map)

        mapRef.current = map
        setIsMapReady(true)
      } catch (error) {
        console.error("Erro ao inicializar mapa:", error)
      } finally {
        isInitializing.current = false
      }
    }

    initMap()

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        setIsMapReady(false)
      }
      isInitializing.current = false
    }
  }, [])

  // Trocar tiles ao mudar entre tema claro e escuro
  useEffect(() => {
    if (!isMapReady || !mapRef.current || !leafletRef.current) return

    const L = leafletRef.current

    const updateTiles = () => {
      const isDark = document.documentElement.classList.contains("dark")
      const config = getTileConfig(isDark)

      if (tileLayerRef.current) mapRef.current!.removeLayer(tileLayerRef.current)
      tileLayerRef.current = L.tileLayer(config.url, {
        attribution: config.attribution,
        subdomains: config.subdomains,
      }).addTo(mapRef.current!)
    }

    window.addEventListener("viia-settings-changed", updateTiles)
    return () => window.removeEventListener("viia-settings-changed", updateTiles)
  }, [isMapReady])

  // Atualizar marcadores quando o mapa ou os lugares mudarem
  useEffect(() => {
    if (!isMapReady || !mapRef.current || !leafletRef.current) return

    const L = leafletRef.current

    const createCustomIcon = (hasAccessibility: boolean) => {
      return L.divIcon({
        className: "custom-marker",
        html: `
          <div style="position: relative;">
            <div style="width: 40px; height: 40px; border-radius: 50%; background-color: ${hasAccessibility ? '#22c55e' : '#3b82f6'}; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); border: 2px solid white;">
              <svg style="width: 20px; height: 20px; color: white;" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            </div>
            <div style="position: absolute; bottom: -4px; left: 50%; transform: translateX(-50%) rotate(45deg); width: 8px; height: 8px; background-color: ${hasAccessibility ? '#22c55e' : '#3b82f6'};"></div>
          </div>
        `,
        iconSize: [40, 48],
        iconAnchor: [20, 48],
        popupAnchor: [0, -48],
      })
    }

    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    places.forEach((place) => {
      const hasAccessibility = Object.values(place.accessibility).some(Boolean)
      const marker = L.marker([place.lat, place.lng], {
        icon: createCustomIcon(hasAccessibility),
      })
        .addTo(mapRef.current!)
        .on("click", () => handlePlaceSelect(place))

      markersRef.current.push(marker)
    })
  }, [isMapReady, places, handlePlaceSelect])

  // Centralizar no local selecionado
  useEffect(() => {
    if (!mapRef.current || !selectedPlace) return
    mapRef.current.flyTo([selectedPlace.lat, selectedPlace.lng], 16, { duration: 1 })
  }, [selectedPlace])

  // Centralizar na localização buscada
  useEffect(() => {
    if (!mapRef.current || !searchLocation) return
    mapRef.current.flyTo([searchLocation.lat, searchLocation.lng], 15, { duration: 1 })
  }, [searchLocation])

  // Reajustar tamanho quando o painel lateral abrir/fechar
  useEffect(() => {
    if (!mapRef.current) return
    const timer = setTimeout(() => mapRef.current?.invalidateSize(), 100)
    return () => clearTimeout(timer)
  }, [selectedPlace])

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-full"
      style={{ minHeight: "400px", isolation: "isolate", zIndex: 0 }}
    />
  )
}
