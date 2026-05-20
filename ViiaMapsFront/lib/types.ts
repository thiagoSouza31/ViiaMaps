export interface AccessibilityFeatures {
  wheelchairRamp: boolean
  adaptedBathroom: boolean
  elevator: boolean
  tactilePaving: boolean
  preferentialParking: boolean
  signLanguage: boolean
  brailleSignage: boolean
}

export interface Place {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  rating: number
  totalReviews: number
  photos: string[]
  accessibility: AccessibilityFeatures
}

export interface AvaliacaoResponse {
  id: string
  usuarioId: string
  autor: string
  nota: number
  dataAvaliacao: string
  comentario: string
  estabelecimentoId: string
  nomeEstabelecimento: string
  enderecoEstabelecimento: string
  cadeiraDeRodas: boolean
  banheiroComAcessibilidade: boolean
  menuBraile: boolean
  linguagemDeSinal: boolean
  estacionamentoPreferencial: boolean
  elevador: boolean
  pisoTatil: boolean
}

export interface Review {
  id: string
  placeId: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  comment: string
  accessibility: Partial<AccessibilityFeatures>
  createdAt: Date
  placeName?: string
  placeAddress?: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}
