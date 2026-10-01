import { MotionConfig, useReducedMotion } from 'framer-motion'
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import { Celebracao } from './components/Celebracao'
import { Filtros, type Filtro } from './components/Filtros'
import { Hero } from './components/Hero'
import { PainelDetalhes } from './components/PainelDetalhes'
import { ProximoAssistir } from './components/ProximoAssistir'
import { Rodape } from './components/Rodape'
import { Timeline } from './components/Timeline'
import { TrailerModal } from './components/TrailerModal'
import { useEstatisticas } from './hooks/useEstatisticas'
import { CATALOGO, DESTINO, ITENS, ITENS_POR_ID } from './lib/catalogo'
import { normalizar } from './lib/formato'
import { useProgresso } from './state/contexto'
import { estaAssistido } from './state/progresso'
import { UIContexto } from './state/ui'
import type { ItemCatalogo } from './types'

export default function App() {
  return (
    // Com "user", o Framer Motion desliga animações de movimento quando o sistema pede menos movimento.
    <MotionConfig reducedMotion="user">
      <Pagina />
    </MotionConfig>
  )
}

function Pagina() {
  const { progresso } = useProgresso()
  const est = useEstatisticas()
  const reduzido = useReducedMotion()

  const [filtro, setFiltro] = useState<Filtro>('todos')
  const [busca, setBusca] = useState('')
  const buscaAdiada = useDeferredValue(busca)
  const [detalhesId, setDetalhesId] = useState<string | null>(null)
  const [trailer, setTrailer] = useState<ItemCatalogo | null>(null)
  const [destacado, setDestacado] = useState<string | null>(null)
  const [celebrando, setCelebrando] = useState(false)

  // Celebração só quando a maratona é concluída nesta visita (não ao abrir o site já concluído).
  const concluidoAntes = useRef(est.concluido)
  useEffect(() => {
    if (est.concluido && !concluidoAntes.current) setCelebrando(true)
    concluidoAntes.current = est.concluido
  }, [est.concluido])

  const ui = useMemo(
    () => ({
      abrirDetalhes: (id: string) => setDetalhesId(id),
      abrirTrailer: (item: ItemCatalogo) => setTrailer(item),
    }),
    [],
  )

  const contagens = useMemo(() => {
    const assistidos = ITENS.filter((i) => estaAssistido(i, progresso.itens[i.id])).length
    const series = ITENS.filter((i) => i.tipo === 'serie').length
    return {
      todos: ITENS.length,
      assistidos,
      'nao-assistidos': ITENS.length - assistidos,
      filmes: ITENS.length - series,
      series,
    }
  }, [progresso])

  const visiveis = useMemo(() => {
    const termo = normalizar(buscaAdiada)
    return ITENS.filter((item) => {
      const assistido = estaAssistido(item, progresso.itens[item.id])
      if (filtro === 'assistidos' && !assistido) return false
      if (filtro === 'nao-assistidos' && assistido) return false
      if (filtro === 'filmes' && item.tipo !== 'filme') return false
      if (filtro === 'series' && item.tipo !== 'serie') return false
      if (termo && !normalizar(`${item.titulo} ${item.tituloOriginal} ${item.ano}`).includes(termo)) return false
      return true
    })
  }, [filtro, buscaAdiada, progresso])

  const termoBusca = normalizar(buscaAdiada)
  const mostrarDestino =
    (filtro === 'todos' || filtro === 'nao-assistidos' || filtro === 'filmes') &&
    (!termoBusca || normalizar(`${DESTINO.titulo} ${DESTINO.tituloOriginal} doomsday`).includes(termoBusca))

  const irPara = useCallback(
    (id: string) => {
      setFiltro('todos')
      setBusca('')
      // Espera a lista sem filtros ser renderizada antes de rolar.
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          const el = document.getElementById(`item-${id}`)
          if (!el) return
          el.scrollIntoView({ behavior: reduzido ? 'auto' : 'smooth', block: 'center' })
          el.focus({ preventScroll: true })
          setDestacado(id)
          window.setTimeout(() => setDestacado((atual) => (atual === id ? null : atual)), 2400)
        }),
      )
    },
    [reduzido],
  )

  const fecharDetalhes = useCallback(() => setDetalhesId(null), [])
  const fecharTrailer = useCallback(() => setTrailer(null), [])

  return (
    <UIContexto.Provider value={ui}>
      <a
        href="#conteudo"
        className="sr-only z-[70] rounded-full bg-marvel px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Pular para a linha do tempo
      </a>

      <Hero />

      <main id="conteudo" tabIndex={-1} className="focus:outline-none">
        {import.meta.env.DEV && CATALOGO.fonte === 'provisorio' && (
          <p className="mx-auto mt-6 max-w-3xl rounded-xl border border-ouro/30 bg-ouro/10 px-4 py-3 text-center text-sm text-amber-200">
            Catálogo provisório (sem pôsteres e trailers). Rode <code className="font-mono">npm run catalogo</code> com a chave do TMDB.
          </p>
        )}

        <ProximoAssistir item={est.proximo} aoIrPara={irPara} />

        <div className="mt-10">
          <Filtros
            filtro={filtro}
            aoFiltrar={setFiltro}
            busca={busca}
            aoBuscar={setBusca}
            contagens={contagens}
            resultados={visiveis.length}
          />
          <Timeline itens={visiveis} mostrarDestino={mostrarDestino} destacado={destacado} />
        </div>
      </main>

      <Rodape />

      <PainelDetalhes item={detalhesId ? (ITENS_POR_ID[detalhesId] ?? null) : null} aoFechar={fecharDetalhes} />
      <TrailerModal item={trailer} aoFechar={fecharTrailer} />
      <Celebracao aberta={celebrando} aoFechar={() => setCelebrando(false)} minutos={est.minutosTotal} />
    </UIContexto.Provider>
  )
}
