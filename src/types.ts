export type TipoItem = 'filme' | 'serie'

export type Modalidade = 'assinatura' | 'gratis' | 'aluguel' | 'compra'

export interface Provedor {
  tmdbId: number
  nome: string
  logo: string | null
  modalidade: Modalidade
}

export interface Episodio {
  temporada: number
  numero: number
  titulo: string
  /** Duração em minutos. */
  duracao: number | null
}

export interface Temporada {
  numero: number
  titulo: string
  episodios: Episodio[]
}

export interface Trailer {
  youtubeId: string
  nome: string
  idioma: 'pt-BR' | 'en'
}

export interface ItemCatalogo {
  id: string
  posicao: number
  tipo: TipoItem
  titulo: string
  tituloOriginal: string
  ano: number
  /** Duração do filme em minutos (séries usam a soma dos episódios). */
  duracao: number | null
  temporadas?: Temporada[]
  sinopse: string
  poster: string | null
  backdrop: string | null
  trailer: Trailer | null
  ondeAssistir: Provedor[]
  tmdbId: number
}

export interface ItemDestino extends ItemCatalogo {
  /** Data de estreia oficial (AAAA-MM-DD). */
  estreia: string
  /** Data e hora da sessão pessoal (ISO com fuso). */
  sessao: string
}

export interface Catalogo {
  versao: number
  fonte: 'tmdb' | 'provisorio'
  geradoEm: string
  itens: ItemCatalogo[]
  destino: ItemDestino
}

// ---------------------------------------------------------------------------
// Progresso salvo no navegador
// ---------------------------------------------------------------------------

export interface OndeAssistirUsuario {
  /** IDs dos serviços pré-definidos (ver lib/servicos.ts). */
  servicos: string[]
  /** Texto livre para qualquer outro lugar. */
  outro: string
}

export interface ProgressoItem {
  /** Data/hora (ISO) em que o item foi marcado como assistido. */
  assistidoEm?: string
  /** Episódios assistidos: chave "T1E3" → data/hora (ISO). */
  episodios?: Record<string, string>
  /** Nota de 0 a 10, em passos de 0,5. */
  nota?: number
  justificativa?: string
  anotacoes?: string
  /** Quando ausente, vale a sugestão do catálogo (TMDB). */
  ondeAssistir?: OndeAssistirUsuario
}

export interface Progresso {
  versao: 1
  itens: Record<string, ProgressoItem>
}
