import { Place } from "@/lib/types"

// Coordenadas de Londrina
export const LONDRINA_CENTER = {
  lat: -23.3045,
  lng: -51.1696,
}

// Limites do município de Londrina
export const LONDRINA_BOUNDS = {
  north: -23.1500,
  south: -23.5000,
  east: -50.9500,
  west: -51.4000,
}

// Acessibilidade padrao (sem informacoes - usuarios ainda nao avaliaram)
const noAccessibilityInfo = {
  wheelchairRamp: false,
  adaptedBathroom: false,
  elevator: false,
  tactilePaving: false,
  preferentialParking: false,
  signLanguage: false,
  brailleSignage: false,
}

// Dados simulados de locais em Londrina - será substituído pela integração com SpringBoot
export const mockPlaces: Place[] = [
  {
    id: "1",
    name: "UniFil - Centro Universitário Filadélfia",
    address: "Av. JK, 1626 - Centro, Londrina - PR",
    lat: -23.31600,
    lng: -51.17075,
    rating: 0,
    totalReviews: 0,
    photos: ["/images/unifil.jpg"],
    accessibility: { ...noAccessibilityInfo },
  },
  {
    id: "2",
    name: "Terminal Urbano de Londrina",
    address: "Av. Arcebispo Dom Geraldo Fernandes, s/n - Centro, Londrina - PR",
    lat: -23.30805,
    lng: -51.16068,
    rating: 0,
    totalReviews: 0,
    photos: ["/images/terminal-central.jpg"],
    accessibility: { ...noAccessibilityInfo },
  },
  {
    id: "3",
    name: "Museu Histórico de Londrina Padre Carlos Weiss",
    address: "Av. Arcebispo Dom Geraldo Fernandes, 3600 - Centro, Londrina - PR",
    lat: -23.30796,
    lng: -51.15977,
    rating: 0,
    totalReviews: 0,
    photos: ["/images/museu-historico.jpg"],
    accessibility: { ...noAccessibilityInfo },
  },
  {
    id: "4",
    name: "Catedral Metropolitana de Londrina",
    address: "Av. Rio de Janeiro, 391 - Centro, Londrina - PR",
    lat: -23.31182,
    lng: -51.15944,
    rating: 0,
    totalReviews: 0,
    photos: ["/images/catedral.jpg"],
    accessibility: { ...noAccessibilityInfo },
  },
  {
    id: "5",
    name: "Lago Igapó",
    address: "Av. Higienópolis - Zona Sul, Londrina - PR",
    lat: -23.33010,
    lng: -51.16370,
    rating: 0,
    totalReviews: 0,
    photos: ["/images/lago-igapo.jpg"],
    accessibility: { ...noAccessibilityInfo },
  },
  {
    id: "6",
    name: "Shopping Catuaí Londrina",
    address: "Rod. Mábio Gonçalves Palhano, 2380 - Gleba Palhano, Londrina - PR",
    lat: -23.34248,
    lng: -51.18557,
    rating: 0,
    totalReviews: 0,
    photos: ["/images/shopping-catuai.jpg"],
    accessibility: { ...noAccessibilityInfo },
  },
  {
    id: "7",
    name: "UEL - Universidade Estadual de Londrina",
    address: "Rod. Celso Garcia Cid, PR-445 Km 380, Londrina - PR",
    lat: -23.3246,
    lng: -51.2016,
    rating: 0,
    totalReviews: 0,
    photos: ["/images/uel.jpg"],
    accessibility: { ...noAccessibilityInfo },
  },
  {
    id: "8",
    name: "Estádio do Café",
    address: "Av. Dez de Dezembro, s/n - Vila Casoni, Londrina - PR",
    lat: -23.28216,
    lng: -51.16481,
    rating: 0,
    totalReviews: 0,
    photos: ["/images/estadio-cafe.jpg"],
    accessibility: { ...noAccessibilityInfo },
  },
]
