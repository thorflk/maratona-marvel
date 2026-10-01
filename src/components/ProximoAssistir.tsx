import { motion } from 'framer-motion'
import { chaveEpisodio, todosEpisodios } from '../lib/catalogo'
import { formatarDuracao, formatarPosicao } from '../lib/formato'
import { useProgresso } from '../state/contexto'
import { episodiosAssistidos } from '../state/progresso'
import type { ItemCatalogo } from '../types'
import { IconeSeta } from './Icones'
import { Poster } from './Poster'

interface Props {
  item: ItemCatalogo | undefined
  aoIrPara: (id: string) => void
}

export function ProximoAssistir({ item, aoIrPara }: Props) {
  const { progresso } = useProgresso()
  if (!item) return null

  const p = progresso.itens[item.id]
  const vistos = item.tipo === 'serie' ? episodiosAssistidos(item, p) : 0
  const total = item.tipo === 'serie' ? todosEpisodios(item).length : 0
  const proximoEp = item.tipo === 'serie' ? todosEpisodios(item).find((ep) => !p?.episodios?.[chaveEpisodio(ep)]) : undefined

  return (
    <motion.section
      aria-labelledby="titulo-proximo"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto mt-10 max-w-3xl px-4 sm:px-6"
    >
      <div className="relative flex items-center gap-4 overflow-hidden rounded-2xl border border-marvel/30 bg-gradient-to-r from-marvel/15 via-superficie to-superficie p-3 pr-4 sm:gap-6 sm:p-4 sm:pr-6">
        <Poster src={item.poster} titulo={item.titulo} colorido sizes="80px" className="aspect-[2/3] w-16 shrink-0 rounded-lg sm:w-20" />
        <div className="min-w-0 flex-1">
          <p id="titulo-proximo" className="rotulo !text-marvel-claro">
            Próximo a assistir
          </p>
          <p className="mt-1 truncate font-display text-2xl leading-tight text-white sm:text-3xl">
            <span className="text-apagado">#{formatarPosicao(item.posicao)} </span>
            {item.titulo}
          </p>
          <p className="mt-0.5 truncate text-sm text-suave">
            {item.ano}
            {item.tipo === 'filme' && item.duracao ? ` · ${formatarDuracao(item.duracao)}` : ''}
            {item.tipo === 'serie' && ` · ${vistos}/${total} episódios`}
            {proximoEp && ` · próximo: T${proximoEp.temporada}E${proximoEp.numero}`}
          </p>
        </div>
        <button type="button" className="botao-primario shrink-0 px-3 sm:px-4" onClick={() => aoIrPara(item.id)}>
          <span className="hidden sm:inline">Ir até ele</span>
          <span className="sr-only sm:hidden">Ir até {item.titulo} na linha do tempo</span>
          <IconeSeta tamanho={18} />
        </button>
      </div>
    </motion.section>
  )
}
