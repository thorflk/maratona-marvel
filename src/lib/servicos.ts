import type { Provedor } from '../types'
import { ITENS, DESTINO } from './catalogo'

export interface Servico {
  id: string
  nome: string
  /** Cor de destaque do selo (quando não há logo). */
  cor: string
  /** IDs de provedores do TMDB que correspondem a este serviço. */
  tmdbIds: number[]
}

/** Serviços mais comuns no Brasil, para edição rápida de "Onde assistir". */
export const SERVICOS: Servico[] = [
  { id: 'disney', nome: 'Disney+', cor: '#113ccf', tmdbIds: [337] },
  { id: 'prime', nome: 'Prime Video', cor: '#1399ff', tmdbIds: [119, 9] },
  { id: 'netflix', nome: 'Netflix', cor: '#e50914', tmdbIds: [8, 1796] },
  { id: 'max', nome: 'Max', cor: '#5b2cff', tmdbIds: [1899, 384] },
  { id: 'apple', nome: 'Apple TV+', cor: '#8e8e93', tmdbIds: [350] },
  { id: 'globoplay', nome: 'Globoplay', cor: '#f2353b', tmdbIds: [307] },
  { id: 'paramount', nome: 'Paramount+', cor: '#0064ff', tmdbIds: [531] },
  { id: 'aluguel', nome: 'Aluguel/compra digital', cor: '#a1a1aa', tmdbIds: [] },
  { id: 'cinema', nome: 'Cinema', cor: '#f5c518', tmdbIds: [] },
  { id: 'midia', nome: 'DVD/Blu-ray', cor: '#71717a', tmdbIds: [] },
]

export const SERVICOS_POR_ID: Record<string, Servico> = Object.fromEntries(SERVICOS.map((s) => [s.id, s]))

/** Serviço pré-definido que corresponde a um provedor do TMDB, se houver. */
export function servicoDoProvedor(p: Provedor): string | null {
  if (p.modalidade === 'aluguel' || p.modalidade === 'compra') return 'aluguel'
  return SERVICOS.find((s) => s.tmdbIds.includes(p.tmdbId))?.id ?? null
}

/** Logos vindos do TMDB, reaproveitados para os serviços pré-definidos. */
export const LOGOS: Record<string, string> = (() => {
  const logos: Record<string, string> = {}
  for (const item of [...ITENS, DESTINO]) {
    for (const p of item.ondeAssistir) {
      if (p.modalidade === 'aluguel' || p.modalidade === 'compra' || !p.logo) continue
      const id = servicoDoProvedor(p)
      if (id && !logos[id]) logos[id] = p.logo
    }
  }
  return logos
})()
