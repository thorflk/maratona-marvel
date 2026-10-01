import { useMemo } from 'react'
import { chaveEpisodio, duracaoItem, ITENS, todosEpisodios } from '../lib/catalogo'
import { useProgresso } from '../state/contexto'
import { estaAssistido } from '../state/progresso'
import type { ItemCatalogo, Progresso } from '../types'

function calcular(progresso: Progresso) {
  let assistidos = 0
  let minutosTotal = 0
  let minutosRestantes = 0
  let proximo: ItemCatalogo | undefined
  for (const item of ITENS) {
    const p = progresso.itens[item.id]
    const visto = estaAssistido(item, p)
    minutosTotal += duracaoItem(item)
    if (visto) assistidos += 1
    else if (!proximo) proximo = item
    if (item.tipo === 'serie') {
      for (const ep of todosEpisodios(item)) {
        if (!p?.episodios?.[chaveEpisodio(ep)]) minutosRestantes += ep.duracao ?? 0
      }
    } else if (!visto) {
      minutosRestantes += item.duracao ?? 0
    }
  }
  const total = ITENS.length
  return {
    total,
    assistidos,
    porcentagem: total ? (assistidos / total) * 100 : 0,
    minutosTotal,
    minutosRestantes,
    minutosAssistidos: minutosTotal - minutosRestantes,
    /** Primeiro item não assistido, na ordem da maratona. */
    proximo,
    concluido: assistidos === total,
    /** Algum filme ainda sem duração conhecida (ex.: catálogo provisório). */
    duracaoIncompleta: ITENS.some((i) => i.tipo === 'filme' && !i.duracao),
  }
}

export function useEstatisticas() {
  const { progresso } = useProgresso()
  return useMemo(() => calcular(progresso), [progresso])
}
