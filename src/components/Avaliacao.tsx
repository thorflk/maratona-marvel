import { useId, type CSSProperties } from 'react'
import { formatarNota } from '../lib/formato'
import { useProgresso } from '../state/contexto'
import { estaAssistido } from '../state/progresso'
import type { ItemCatalogo } from '../types'
import { CampoTexto } from './CampoTexto'
import { IconeCadeado, IconeEstrela } from './Icones'

export function Avaliacao({ item }: { item: ItemCatalogo }) {
  const { progresso, despachar } = useProgresso()
  const p = progresso.itens[item.id]
  const liberada = estaAssistido(item, p)
  const id = useId()
  const nota = p?.nota

  if (!liberada) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-dashed border-borda-forte bg-white/[0.02] p-4 text-sm text-suave">
        <IconeCadeado tamanho={18} className="mt-0.5 shrink-0 text-apagado" />
        <p>
          {item.tipo === 'serie'
            ? 'A avaliação fica disponível depois que você marcar a série como assistida.'
            : 'A avaliação fica disponível depois que você marcar o filme como assistido.'}
          {nota !== undefined && ' Sua nota anterior continua salva.'}
        </p>
      </div>
    )
  }

  const definir = (valor: number | undefined) => despachar({ tipo: 'definirNota', id: item.id, nota: valor })

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-end justify-between gap-4">
          <label htmlFor={id} className="text-sm font-semibold text-texto">
            Nota {item.tipo === 'serie' && <span className="font-normal text-apagado">(da série inteira)</span>}
          </label>
          {nota !== undefined && (
            <button
              type="button"
              className="text-xs text-apagado underline-offset-2 hover:text-texto hover:underline"
              onClick={() => definir(undefined)}
            >
              Remover nota
            </button>
          )}
        </div>
        <div className="mt-2 flex items-center gap-5">
          <p className="flex w-28 shrink-0 items-baseline gap-1" aria-hidden="true">
            <IconeEstrela tamanho={22} className={`self-center ${nota !== undefined ? 'text-ouro' : 'text-white/15'}`} />
            <span className={`font-display text-5xl leading-none tabular-nums ${nota !== undefined ? 'text-white' : 'text-apagado'}`}>
              {nota !== undefined ? formatarNota(nota) : '–'}
            </span>
            <span className="text-sm text-apagado">/10</span>
          </p>
          <input
            id={id}
            type="range"
            min={0}
            max={10}
            step={0.5}
            value={nota ?? 0}
            data-vazio={nota === undefined}
            onChange={(e) => definir(Number(e.target.value))}
            onClick={(e) => nota === undefined && definir(Number(e.currentTarget.value))}
            aria-valuetext={nota !== undefined ? `${formatarNota(nota)} de 10` : 'Sem nota'}
            className="slider-nota w-full min-w-0"
            style={{ '--preenchido': `${((nota ?? 0) / 10) * 100}%` } as CSSProperties}
          />
        </div>
        <div className="mt-1 flex justify-between pl-[8.25rem] text-[0.625rem] text-apagado tabular-nums" aria-hidden="true">
          <span>0</span>
          <span>5</span>
          <span>10</span>
        </div>
      </div>

      <CampoTexto
        key={`${item.id}-justificativa`}
        rotulo="Justificativa"
        valor={p?.justificativa ?? ''}
        aoSalvar={(v) => despachar({ tipo: 'definirTexto', id: item.id, campo: 'justificativa', valor: v })}
        placeholder="Por que essa nota? O que funcionou e o que não funcionou…"
        linhas={3}
      />
    </div>
  )
}
