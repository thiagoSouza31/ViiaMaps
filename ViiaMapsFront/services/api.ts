import { Place, AvaliacaoResponse } from "@/lib/types"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8081/api"

function getToken(): string | null {
  try {
    const remember = localStorage.getItem("viia_remember") === "true"
    const raw = remember
      ? localStorage.getItem("viia_session")
      : sessionStorage.getItem("viia_session")
    if (!raw) return null
    return (JSON.parse(raw) as { token?: string }).token ?? null
  } catch {
    return null
  }
}

function authHeaders(): HeadersInit {
  return { Authorization: `Bearer ${getToken()}` }
}

function handleAuthError(status: number) {
  if (status === 401) throw new Error("Sessão expirada. Faça login novamente.")
  if (status === 403) throw new Error("Você não tem permissão para esta ação.")
  if (status === 404) throw new Error("Recurso não encontrado.")
}

// ========================
// USUÁRIOS
// ========================

export interface AtualizarPerfilResponse {
  id: number
  nome: string
  email: string
  token: string
}

export async function atualizarFoto(foto: string): Promise<void> {
  const response = await fetch(`${API_URL}/usuarios/foto`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ foto }),
  })
  if (!response.ok) {
    handleAuthError(response.status)
    throw new Error(await response.text() || "Erro ao salvar foto.")
  }
}

export async function atualizarPerfil(nome: string, email: string): Promise<AtualizarPerfilResponse> {
  const response = await fetch(`${API_URL}/usuarios/perfil`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ nome, email }),
  })
  if (!response.ok) {
    handleAuthError(response.status)
    throw new Error(await response.text() || "Erro ao atualizar perfil.")
  }
  return response.json()
}

export async function alterarSenha(senhaAtual: string, novaSenha: string): Promise<void> {
  const response = await fetch(`${API_URL}/usuarios/senha`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ senhaAtual, novaSenha }),
  })
  if (!response.ok) {
    if (response.status === 400) throw new Error("Senha atual incorreta.")
    handleAuthError(response.status)
    throw new Error("Erro ao alterar senha.")
  }
}

export async function excluirConta(): Promise<void> {
  const response = await fetch(`${API_URL}/usuarios/conta`, {
    method: "DELETE",
    headers: authHeaders(),
  })
  if (!response.ok) {
    handleAuthError(response.status)
    throw new Error("Erro ao excluir conta.")
  }
}


export async function criarUsuario(usuario: { nome: string; email: string; senha: string }) {
  const response = await fetch(`${API_URL}/usuarios/novo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario),
  })
  return response.json()
}

export interface LoginResponse {
  token: string
  id: number
  nome: string
  email: string
  fotoPerfil?: string
}

export async function loginUsuario(email: string, senha: string): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/usuarios/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  })
  if (!response.ok) throw new Error("Email ou senha incorretos.")
  return response.json() as Promise<LoginResponse>
}

// ========================
// ESTABELECIMENTOS
// ========================

export async function listarEstabelecimentos(): Promise<Place[]> {
  const response = await fetch(`${API_URL}/estabelecimentos/todos`, {
    headers: authHeaders(),
  })
  if (!response.ok) { handleAuthError(response.status); throw new Error("Erro ao carregar estabelecimentos.") }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any[] = await response.json()
  return data.map((e) => ({
    id: String(e.id),
    name: e.nome,
    address: e.endereco,
    lat: e.latitude,
    lng: e.longitude,
    rating: e.rating ?? 0,
    totalReviews: e.totalReviews ?? 0,
    photos: e.imagemCapa ? [e.imagemCapa] : [],
    accessibility: {
      wheelchairRamp: e.acessibilidade?.cadeiraDeRodas ?? false,
      adaptedBathroom: e.acessibilidade?.banheiroComAcessibilidade ?? false,
      elevator: e.acessibilidade?.elevador ?? false,
      tactilePaving: e.acessibilidade?.pisoTatil ?? false,
      preferentialParking: e.acessibilidade?.estacionamentoPreferencial ?? false,
      signLanguage: e.acessibilidade?.linguagemDeSinal ?? false,
      brailleSignage: e.acessibilidade?.menuBraile ?? false,
    },
  }))
}

// ========================
// AVALIAÇÕES
// ========================

export async function submeterAvaliacao(data: {
  usuarioId: number
  estabelecimentoId: number
  nota: number
  comentario: string
  accessibility: {
    wheelchairRamp: boolean
    adaptedBathroom: boolean
    elevator: boolean
    tactilePaving: boolean
    preferentialParking: boolean
    signLanguage: boolean
    brailleSignage: boolean
  }
}): Promise<AvaliacaoResponse> {
  const response = await fetch(`${API_URL}/avaliacao`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({
      usuarioId: data.usuarioId,
      estabelecimentoId: data.estabelecimentoId,
      nota: data.nota,
      comentario: data.comentario,
      cadeiraDeRodas: data.accessibility.wheelchairRamp,
      banheiroComAcessibilidade: data.accessibility.adaptedBathroom,
      menuBraile: data.accessibility.brailleSignage,
      linguagemDeSinal: data.accessibility.signLanguage,
      estacionamentoPreferencial: data.accessibility.preferentialParking,
      elevador: data.accessibility.elevator,
      pisoTatil: data.accessibility.tactilePaving,
    }),
  })
  if (!response.ok) {
    console.error("[submeterAvaliacao] status:", response.status)
    handleAuthError(response.status)
    throw new Error("Erro ao enviar avaliação.")
  }
  return response.json()
}

export async function listarAvaliacoesPorEstabelecimento(estabelecimentoId: string): Promise<AvaliacaoResponse[]> {
  const response = await fetch(`${API_URL}/avaliacao/estabelecimento/${estabelecimentoId}`, {
    headers: authHeaders(),
  })
  if (!response.ok) { handleAuthError(response.status); throw new Error("Erro ao carregar avaliações.") }
  return response.json()
}

export async function listarMinhasAvaliacoes(usuarioId: string): Promise<AvaliacaoResponse[]> {
  const response = await fetch(`${API_URL}/avaliacao/usuario/${usuarioId}`, {
    headers: authHeaders(),
  })
  if (!response.ok) { handleAuthError(response.status); throw new Error("Erro ao carregar suas avaliações.") }
  return response.json()
}

export async function atualizarAvaliacao(id: string, data: {
  nota: number
  comentario: string
  accessibility: {
    wheelchairRamp: boolean
    adaptedBathroom: boolean
    elevator: boolean
    tactilePaving: boolean
    preferentialParking: boolean
    signLanguage: boolean
    brailleSignage: boolean
  }
}): Promise<AvaliacaoResponse> {
  const response = await fetch(`${API_URL}/avaliacao/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({
      nota: data.nota,
      comentario: data.comentario,
      cadeiraDeRodas: data.accessibility.wheelchairRamp,
      banheiroComAcessibilidade: data.accessibility.adaptedBathroom,
      menuBraile: data.accessibility.brailleSignage,
      linguagemDeSinal: data.accessibility.signLanguage,
      estacionamentoPreferencial: data.accessibility.preferentialParking,
      elevador: data.accessibility.elevator,
      pisoTatil: data.accessibility.tactilePaving,
    }),
  })
  if (!response.ok) {
    handleAuthError(response.status)
    throw new Error("Erro ao atualizar avaliação.")
  }
  return response.json()
}

export async function deletarAvaliacao(avaliacaoId: string): Promise<void> {
  const response = await fetch(`${API_URL}/avaliacao/${avaliacaoId}`, {
    method: "DELETE",
    headers: authHeaders(),
  })
  if (!response.ok) {
    handleAuthError(response.status)
    throw new Error("Erro ao excluir avaliação.")
  }
}
