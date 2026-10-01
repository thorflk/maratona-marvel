import { chaveEpisodio } from '../lib/catalogo'
import { formatarData } from '../lib/formato'
import { useProgresso } from '../state/contexto'
import type { ItemCatalogo } from '../types'
import { BarraProgresso } from './BarraProgresso'
import { IconeCheck } from './Icones'

export function Episodios({ item }: { item: ItemCatalogo }) {
  const { progresso, despachar } = useProgresso()
  const vistos = progresso.itens[item.id]?.episodios ?? {}

  return (
    <div className="space-y-6">
      {item.temporadas?.map((temp) => {
        const total = temp.episodios.length
        const feitos = temp.episodios.filter((ep) => vistos[chaveEpisodio(ep)]).length
        const completa = total > 0 && feitos === total
        return (
          <div key={temp.numero} className="overflow-hidden rounded-2xl border border-borda bg-black/20">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-borda px-4 py-3">
              <div>
                <h4 className="font-display text-2xl leading-none text-white">{temp.titulo}</h4>
                <p className="mt-1 text-xs text-suave tabular-nums">
                  {feitos}/{total} episódios
                </p>
              </div>
              <button
                type="button"
                className={completa ? 'botao-fantasma h-9 min-h-9 px-3 text-xs' : 'botao-secundario h-9 min-h-9 px-3 text-xs'}
                onClick={() => despachar({ tipo: 'marcarTemporada', id: item.id, temporada: temp.numero, marcar: !completa })}
              >
                {completa ? 'Desmarcar temporada' : 'Marcar temporada inteira'}
              </button>
              <BarraProgresso valor={feitos} maximo={total} rotulo={`Progresso da ${temp.titulo}`} altura="h-1" className="w-full" />
            </div>
            <ul className="divide-y divide-borda">
              {temp.episodios.map((ep) => {
                const chave = chaveEpisodio(ep)
                const data = vistos[chave]
                const idCampo = `ep-${item.id}-${chave}`
                return (
                  <li key={chave}>
                    <label
                      htmlFor={idCampo}
                      className="flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-white/[0.03] has-[:focus-visible]:bg-white/[0.05]"
                    >
                      <input
                        id={idCampo}
                        type="checkbox"
                        checked={Boolean(data)}
                        onChange={() => despachar({ tipo: 'alternarEpisodio', id: item.id, chave })}
                        className="peer sr-only"
                      />
                      <span
                        aria-hidden="true"
                        className={`flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-marvel-claro peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-fundo ${
                          data ? 'border-marvel bg-marvel text-white' : 'border-white/25'
                        }`}
                      >
                        {data && <IconeCheck tamanho={13} strokeWidth={3.5} />}
                      </span>
                      <span className="w-10 shrink-0 text-xs font-semibold text-apagado tabular-nums">
                        E{String(ep.numero).padStart(2, '0')}
                      </span>
                      <span className={`min-w-0 flex-1 text-sm ${data ? 'text-suave' : 'text-texto'}`}>
                        <span className="sr-only">Episódio {ep.numero}: </span>
                        {ep.titulo}
                        {data && <span className="block text-[0.6875rem] text-apagado">Assistido em {formatarData(data)}</span>}
                      </span>
                      {ep.duracao ? <span className="shrink-0 text-xs text-apagado tabular-nums">{ep.duracao} min</span> : null}
                    </label>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </div>
  )
}
