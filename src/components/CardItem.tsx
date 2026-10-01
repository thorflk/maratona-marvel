import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { duracaoItem, todosEpisodios } from '../lib/catalogo'
import { formatarData, formatarDuracao, formatarNota, formatarPosicao } from '../lib/formato'
import { useProgresso } from '../state/contexto'
import { dataConclusao, episodiosAssistidos, estaAssistido } from '../state/progresso'
import { useUI } from '../state/ui'
import type { ItemCatalogo } from '../types'
import { BarraProgresso } from './BarraProgresso'
import { BotaoAssistido } from './BotaoAssistido'
import { BotaoTrailer } from './BotaoTrailer'
import { Brilho } from './Brilho'
import { IconeEstrela, IconeNota } from './Icones'
import { Poster } from './Poster'
import { PosterInterativo } from './PosterInterativo'
import { Selo } from './Selo'

interface Props {
  item: ItemCatalogo
  lado: 'esquerda' | 'direita'
}

export function CardItem({ item, lado }: Props) {
  const { progresso } = useProgresso()
  const { abrirDetalhes } = useUI()
  const p = progresso.itens[item.id]
  const assistido = estaAssistido(item, p)
  const serie = item.tipo === 'serie'
  const totalEps = serie ? todosEpisodios(item).length : 0
  const vistosEps = serie ? episodiosAssistidos(item, p) : 0
  const concluidoEm = dataConclusao(item, p)
  const duracao = duracaoItem(item)

  // Dispara o brilho quando o item passa a ser assistido (não no carregamento da página).
  const [brilho, setBrilho] = useState(0)
  const anterior = useRef(assistido)
  useEffect(() => {
    if (assistido && !anterior.current) setBrilho((n) => n + 1)
    anterior.current = assistido
  }, [assistido])

  const esquerda = lado === 'esquerda'

  return (
    <motion.article
      aria-labelledby={`titulo-${item.id}`}
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative rounded-2xl border p-3 transition-colors duration-500 sm:p-4 ${
        assistido ? 'border-marvel/25 bg-gradient-to-br from-marvel/[0.07] to-superficie' : 'border-borda bg-superficie/70'
      }`}
    >
      <div className={`flex gap-4 sm:gap-6 ${esquerda ? 'md:flex-row-reverse md:text-right' : ''}`}>
        <div className="relative w-28 shrink-0 sm:w-44 lg:w-52">
          <PosterInterativo
            rotulo={`Ver detalhes de ${item.titulo}`}
            onClick={() => abrirDetalhes(item.id)}
            className="aspect-[2/3] w-full"
          >
            <Poster
              src={item.poster}
              titulo={item.titulo}
              colorido={assistido}
              sizes="(min-width: 1024px) 208px, (min-width: 640px) 176px, 112px"
              className="size-full"
            />
          </PosterInterativo>
          {brilho > 0 && <Brilho key={brilho} />}
        </div>

        <div className={`flex min-w-0 flex-1 flex-col py-1 ${esquerda ? 'md:items-end' : ''}`}>
          <div className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-suave ${esquerda ? 'md:justify-end' : ''}`}>
            <Selo tipo={item.tipo} />
            <span className="tabular-nums">{item.ano}</span>
            {duracao > 0 && (
              <>
                <span aria-hidden="true" className="text-apagado">
                  •
                </span>
                <span className="tabular-nums">{serie ? `${totalEps} episódios` : formatarDuracao(duracao)}</span>
              </>
            )}
          </div>

          <h3
            id={`titulo-${item.id}`}
            className="titulo-display mt-2 text-[1.65rem] text-white [overflow-wrap:anywhere] sm:text-4xl lg:text-[2.6rem]"
          >
            <span className="sr-only">Posição {item.posicao}: </span>
            {item.titulo}
          </h3>

          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-suave max-sm:hidden">{item.sinopse}</p>

          {serie && (
            <div className="mt-3 w-full max-w-xs">
              <div className={`mb-1.5 flex justify-between text-xs ${esquerda ? 'md:flex-row-reverse' : ''}`}>
                <span className="text-suave">Episódios</span>
                <span className="font-semibold text-texto tabular-nums">
                  {vistosEps}/{totalEps} episódios
                </span>
              </div>
              <BarraProgresso valor={vistosEps} maximo={totalEps} rotulo={`Episódios assistidos de ${item.titulo}`} altura="h-1.5" />
            </div>
          )}

          <div className={`mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs ${esquerda ? 'md:justify-end' : ''}`}>
            {concluidoEm && <span className="text-texto/80">Assistido em {formatarData(concluidoEm)}</span>}
            {assistido && p?.nota !== undefined && (
              <span className="inline-flex items-center gap-1 font-semibold text-ouro">
                <IconeEstrela tamanho={13} />
                {formatarNota(p.nota)}
                <span className="sr-only"> de 10</span>
              </span>
            )}
            {p?.anotacoes && (
              <span className="inline-flex items-center gap-1 text-suave">
                <IconeNota tamanho={13} /> Anotações
              </span>
            )}
          </div>

          <div className={`mt-auto hidden flex-wrap gap-2 pt-4 sm:flex ${esquerda ? 'md:justify-end' : ''}`}>
            <Acoes item={item} />
          </div>
        </div>
      </div>

      {/* No celular, as ações ocupam a largura toda abaixo do pôster. */}
      <div className="mt-3 grid grid-cols-2 gap-2 sm:hidden [&>*:first-child]:col-span-2">
        <Acoes item={item} />
      </div>
    </motion.article>
  )
}

function Acoes({ item }: { item: ItemCatalogo }) {
  const { abrirDetalhes } = useUI()
  return (
    <>
      <BotaoAssistido item={item} compacto />
      <BotaoTrailer item={item} className="botao-secundario px-3.5" />
      <button
        type="button"
        className="botao-fantasma border border-transparent px-3"
        onClick={() => abrirDetalhes(item.id)}
        aria-label={`Abrir detalhes de ${item.titulo}`}
      >
        Detalhes
      </button>
    </>
  )
}

export function NoTimeline({ posicao, assistido }: { posicao: number; assistido: boolean }) {
  return (
    <div
      data-no
      data-assistido={assistido}
      aria-hidden="true"
      className={`relative z-10 flex size-9 items-center sm:size-10 justify-center rounded-full border-2 font-display text-base leading-none sm:text-lg tabular-nums transition-all duration-700 ${
        assistido
          ? 'border-marvel-claro bg-marvel text-white shadow-[0_0_0_6px_rgb(230_36_41/0.18),0_0_24px_rgb(230_36_41/0.8)]'
          : 'border-white/15 bg-fundo text-apagado'
      }`}
    >
      {formatarPosicao(posicao)}
    </div>
  )
}
