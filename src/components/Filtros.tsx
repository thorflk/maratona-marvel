import { IconeBusca, IconeFechar } from './Icones'

export type Filtro = 'todos' | 'assistidos' | 'nao-assistidos' | 'filmes' | 'series'

const OPCOES_FILTRO: { valor: Filtro; rotulo: string }[] = [
  { valor: 'todos', rotulo: 'Todos' },
  { valor: 'assistidos', rotulo: 'Assistidos' },
  { valor: 'nao-assistidos', rotulo: 'Não assistidos' },
  { valor: 'filmes', rotulo: 'Filmes' },
  { valor: 'series', rotulo: 'Séries' },
]

interface Props {
  filtro: Filtro
  aoFiltrar: (f: Filtro) => void
  busca: string
  aoBuscar: (b: string) => void
  contagens: Record<Filtro, number>
  resultados: number
}

export function Filtros({ filtro, aoFiltrar, busca, aoBuscar, contagens, resultados }: Props) {
  return (
    <div className="sticky top-0 z-30 border-b border-borda bg-fundo/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div role="group" aria-label="Filtrar a lista" className="faixa-rolagem -mx-4 flex gap-1.5 overflow-x-auto px-4 md:mx-0 md:px-0">
          {OPCOES_FILTRO.map((op) => {
            const ativo = op.valor === filtro
            return (
              <button
                key={op.valor}
                type="button"
                aria-pressed={ativo}
                onClick={() => aoFiltrar(op.valor)}
                className={`inline-flex h-9 shrink-0 items-center gap-2 rounded-full border px-3.5 text-sm font-medium transition-colors ${
                  ativo
                    ? 'border-marvel bg-marvel text-white shadow-[0_6px_20px_-8px_rgb(230_36_41/0.9)]'
                    : 'border-borda-forte text-suave hover:border-white/30 hover:text-texto'
                }`}
              >
                {op.rotulo}
                <span className={`text-xs tabular-nums ${ativo ? 'text-white/80' : 'text-apagado'}`}>{contagens[op.valor]}</span>
              </button>
            )
          })}
        </div>

        <div className="relative w-full md:w-72">
          <label htmlFor="busca" className="sr-only">
            Buscar por nome
          </label>
          <IconeBusca tamanho={18} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-apagado" />
          <input
            id="busca"
            type="search"
            value={busca}
            onChange={(e) => aoBuscar(e.target.value)}
            placeholder="Buscar por nome…"
            autoComplete="off"
            className="campo h-10 rounded-full py-0 pr-10 pl-10 [&::-webkit-search-cancel-button]:hidden"
          />
          {busca && (
            <button
              type="button"
              onClick={() => aoBuscar('')}
              className="absolute top-1/2 right-1.5 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-suave hover:bg-white/10 hover:text-texto"
              aria-label="Limpar busca"
            >
              <IconeFechar tamanho={16} />
            </button>
          )}
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {resultados === 1 ? '1 título encontrado' : `${resultados} títulos encontrados`}
      </p>
    </div>
  )
}
