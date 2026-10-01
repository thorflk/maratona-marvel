import { chaveEpisodio, ITENS_POR_ID, todosEpisodios } from '../lib/catalogo'
import { progressoVazio } from '../lib/armazenamento'
import type { ItemCatalogo, OndeAssistirUsuario, Progresso, ProgressoItem } from '../types'

export type Acao =
  | { tipo: 'alternarAssistido'; id: string }
  | { tipo: 'alternarEpisodio'; id: string; chave: string }
  | { tipo: 'marcarTemporada'; id: string; temporada: number; marcar: boolean }
  | { tipo: 'definirNota'; id: string; nota: number | undefined }
  | { tipo: 'definirTexto'; id: string; campo: 'justificativa' | 'anotacoes'; valor: string }
  | { tipo: 'definirOndeAssistir'; id: string; valor: OndeAssistirUsuario | undefined }
  | { tipo: 'substituir'; progresso: Progresso }
  | { tipo: 'resetar' }

const agora = () => new Date().toISOString()

// ---------------------------------------------------------------------------
// Seletores
// ---------------------------------------------------------------------------

export function episodiosAssistidos(item: ItemCatalogo, p: ProgressoItem | undefined): number {
  if (!p?.episodios) return 0
  return todosEpisodios(item).filter((ep) => p.episodios?.[chaveEpisodio(ep)]).length
}

export function estaAssistido(item: ItemCatalogo, p: ProgressoItem | undefined): boolean {
  if (item.tipo === 'serie') {
    const total = todosEpisodios(item).length
    return total > 0 && episodiosAssistidos(item, p) === total
  }
  return Boolean(p?.assistidoEm)
}

/** Data em que o item foi concluído (para séries: quando o último episódio foi marcado). */
export function dataConclusao(item: ItemCatalogo, p: ProgressoItem | undefined): string | undefined {
  if (!estaAssistido(item, p)) return undefined
  return p?.assistidoEm
}

// ---------------------------------------------------------------------------
// Redutor
// ---------------------------------------------------------------------------

/** Remove campos vazios para manter o localStorage enxuto. */
function limpar(item: ProgressoItem): ProgressoItem | undefined {
  const r: ProgressoItem = { ...item }
  if (!r.assistidoEm) delete r.assistidoEm
  if (r.episodios && Object.keys(r.episodios).length === 0) delete r.episodios
  if (r.nota === undefined) delete r.nota
  if (!r.justificativa) delete r.justificativa
  if (!r.anotacoes) delete r.anotacoes
  if (!r.ondeAssistir) delete r.ondeAssistir
  return Object.keys(r).length ? r : undefined
}

/** Atualiza a data de conclusão de uma série conforme os episódios marcados. */
function sincronizarSerie(item: ItemCatalogo, p: ProgressoItem): ProgressoItem {
  const total = todosEpisodios(item).length
  const vistos = episodiosAssistidos(item, p)
  if (total > 0 && vistos === total) return p.assistidoEm ? p : { ...p, assistidoEm: agora() }
  const { assistidoEm: _removido, ...resto } = p
  return resto
}

function atualizarItem(estado: Progresso, id: string, f: (atual: ProgressoItem, item: ItemCatalogo) => ProgressoItem): Progresso {
  const item = ITENS_POR_ID[id]
  if (!item) return estado
  const novo = limpar(f(estado.itens[id] ?? {}, item))
  const itens = { ...estado.itens }
  if (novo) itens[id] = novo
  else delete itens[id]
  return { ...estado, itens }
}

export function redutor(estado: Progresso, acao: Acao): Progresso {
  switch (acao.tipo) {
    case 'alternarAssistido':
      return atualizarItem(estado, acao.id, (atual, item) => {
        if (item.tipo === 'filme') {
          return atual.assistidoEm ? { ...atual, assistidoEm: undefined } : { ...atual, assistidoEm: agora() }
        }
        // Série: marcar como assistida marca todos os episódios; desmarcar limpa todos.
        if (estaAssistido(item, atual)) return { ...atual, episodios: {}, assistidoEm: undefined }
        const data = agora()
        const episodios = { ...atual.episodios }
        for (const ep of todosEpisodios(item)) episodios[chaveEpisodio(ep)] ??= data
        return { ...atual, episodios, assistidoEm: data }
      })

    case 'alternarEpisodio':
      return atualizarItem(estado, acao.id, (atual, item) => {
        const episodios = { ...atual.episodios }
        if (episodios[acao.chave]) delete episodios[acao.chave]
        else episodios[acao.chave] = agora()
        return sincronizarSerie(item, { ...atual, episodios })
      })

    case 'marcarTemporada':
      return atualizarItem(estado, acao.id, (atual, item) => {
        const episodios = { ...atual.episodios }
        const temporada = item.temporadas?.find((t) => t.numero === acao.temporada)
        const data = agora()
        for (const ep of temporada?.episodios ?? []) {
          const chave = chaveEpisodio(ep)
          if (acao.marcar) episodios[chave] ??= data
          else delete episodios[chave]
        }
        return sincronizarSerie(item, { ...atual, episodios })
      })

    case 'definirNota':
      return atualizarItem(estado, acao.id, (atual) => ({ ...atual, nota: acao.nota }))

    case 'definirTexto':
      return atualizarItem(estado, acao.id, (atual) => ({ ...atual, [acao.campo]: acao.valor }))

    case 'definirOndeAssistir':
      return atualizarItem(estado, acao.id, (atual) => ({ ...atual, ondeAssistir: acao.valor }))

    case 'substituir':
      return acao.progresso

    case 'resetar':
      return progressoVazio()
  }
}
