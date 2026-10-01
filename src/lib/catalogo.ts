import dados from '../data/catalogo.json'
import type { Catalogo, Episodio, ItemCatalogo } from '../types'

export const CATALOGO = dados as Catalogo
export const ITENS: ItemCatalogo[] = CATALOGO.itens
export const DESTINO = CATALOGO.destino

/** Chave estável de um episódio, ex.: "T1E3". */
export const chaveEpisodio = (ep: Pick<Episodio, 'temporada' | 'numero'>) => `T${ep.temporada}E${ep.numero}`

export const todosEpisodios = (item: ItemCatalogo): Episodio[] => item.temporadas?.flatMap((t) => t.episodios) ?? []

/** Duração total do item em minutos (soma dos episódios nas séries). */
export function duracaoItem(item: ItemCatalogo): number {
  if (item.tipo === 'serie') return todosEpisodios(item).reduce((s, ep) => s + (ep.duracao ?? 0), 0)
  return item.duracao ?? 0
}

export const ITENS_POR_ID: Record<string, ItemCatalogo> = Object.fromEntries(ITENS.map((i) => [i.id, i]))

/** Troca o tamanho de uma URL de imagem do TMDB (ex.: w500 → w342). */
export const tamanhoImagem = (url: string, tamanho: string) => url.replace(/\/t\/p\/[^/]+\//, `/t/p/${tamanho}/`)
