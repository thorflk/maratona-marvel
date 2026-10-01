import type { ReactNode } from 'react'
import { duracaoItem, tamanhoImagem, todosEpisodios } from '../lib/catalogo'
import { duracaoPorExtenso, formatarDataLonga, formatarDuracao, formatarPosicao } from '../lib/formato'
import { useProgresso } from '../state/contexto'
import { dataConclusao, episodiosAssistidos, estaAssistido } from '../state/progresso'
import type { ItemCatalogo } from '../types'
import { Avaliacao } from './Avaliacao'
import { BotaoAssistido } from './BotaoAssistido'
import { BotaoTrailer } from './BotaoTrailer'
import { CampoTexto } from './CampoTexto'
import { Episodios } from './Episodios'
import { IconeExterno, IconeFechar } from './Icones'
import { Modal } from './Modal'
import { OndeAssistir } from './OndeAssistir'
import { Poster } from './Poster'
import { Selo } from './Selo'

interface Props {
  item: ItemCatalogo | null
  aoFechar: () => void
}

export function PainelDetalhes({ item, aoFechar }: Props) {
  return (
    <Modal
      aberto={item !== null}
      aoFechar={aoFechar}
      rotulo={item ? `Detalhes de ${item.titulo}` : 'Detalhes'}
      variante="lateral"
      className="h-full w-full max-w-2xl"
    >
      {item && <Conteudo item={item} aoFechar={aoFechar} />}
    </Modal>
  )
}

function Conteudo({ item, aoFechar }: { item: ItemCatalogo; aoFechar: () => void }) {
  const { progresso, despachar } = useProgresso()
  const p = progresso.itens[item.id]
  const assistido = estaAssistido(item, p)
  const concluidoEm = dataConclusao(item, p)
  const serie = item.tipo === 'serie'
  const duracao = duracaoItem(item)
  const imagemTopo = item.backdrop ? tamanhoImagem(item.backdrop, 'w1280') : null

  return (
    <div className="faixa-rolagem relative h-full overflow-y-auto overscroll-contain border-l border-borda-forte bg-superficie shadow-[-40px_0_80px_-20px_rgb(0_0_0/0.8)]">
      {/* Topo com imagem de fundo */}
      <div className="relative isolate">
        <div className="absolute inset-0 -z-10 h-72 overflow-hidden" aria-hidden="true">
          {imagemTopo ? (
            <img src={imagemTopo} alt="" className="size-full object-cover opacity-45" />
          ) : (
            <div className="size-full bg-gradient-to-br from-marvel-escuro/60 via-superficie to-superficie" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-superficie/30 via-superficie/70 to-superficie" />
        </div>

        <div className="sticky top-0 z-20 flex justify-end p-3">
          <button
            type="button"
            onClick={aoFechar}
            className="botao-icone bg-black/50 text-white backdrop-blur hover:bg-black/70"
            aria-label="Fechar detalhes"
            data-foco-inicial
          >
            <IconeFechar />
          </button>
        </div>

        <div className="-mt-6 flex gap-5 px-5 sm:gap-7 sm:px-8">
          <Poster
            src={item.poster}
            titulo={item.titulo}
            colorido={assistido}
            prioritario
            sizes="(min-width: 640px) 176px, 128px"
            className="aspect-[2/3] w-32 shrink-0 rounded-xl shadow-2xl ring-1 ring-white/15 sm:w-44"
          />
          <div className="flex min-w-0 flex-col justify-end pb-1">
            <p className="font-display text-xl leading-none text-marvel-claro">#{formatarPosicao(item.posicao)}</p>
            <h2 className="titulo-display mt-2 text-4xl text-white [overflow-wrap:anywhere] sm:text-5xl">{item.titulo}</h2>
            {item.tituloOriginal && item.tituloOriginal !== item.titulo && (
              <p className="mt-1.5 text-sm text-apagado italic">{item.tituloOriginal}</p>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-suave">
              <Selo tipo={item.tipo} />
              <span>{item.ano}</span>
              {duracao > 0 && (
                <>
                  <span aria-hidden="true">•</span>
                  <span title={duracaoPorExtenso(duracao)}>
                    {serie ? `${todosEpisodios(item).length} episódios · ${formatarDuracao(duracao)}` : formatarDuracao(duracao)}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2 px-5 sm:px-8">
          <BotaoAssistido item={item} />
          <BotaoTrailer item={item} />
        </div>
        <p className="mt-3 min-h-5 px-5 text-sm sm:px-8">
          {concluidoEm ? (
            <span className="text-texto/80">
              Assistido em <time dateTime={concluidoEm}>{formatarDataLonga(concluidoEm)}</time>
            </span>
          ) : serie ? (
            <span className="text-suave">
              {episodiosAssistidos(item, p)}/{todosEpisodios(item).length} episódios assistidos. A série fica assistida quando todos
              estiverem marcados.
            </span>
          ) : null}
        </p>
      </div>

      <div className="space-y-10 px-5 pt-8 pb-16 sm:px-8">
        {item.sinopse && (
          <Secao titulo="Sinopse">
            <p className="leading-relaxed text-suave">{item.sinopse}</p>
          </Secao>
        )}

        {serie && (
          <Secao titulo="Episódios">
            <Episodios item={item} />
          </Secao>
        )}

        <Secao titulo="Avaliação">
          <Avaliacao item={item} />
        </Secao>

        <Secao titulo="Anotações">
          <CampoTexto
            key={`${item.id}-anotacoes`}
            rotulo="Coisas importantes para lembrar"
            valor={p?.anotacoes ?? ''}
            aoSalvar={(v) => despachar({ tipo: 'definirTexto', id: item.id, campo: 'anotacoes', valor: v })}
            placeholder="Personagens, cenas pós-créditos, ganchos para os próximos filmes…"
            linhas={6}
            ajuda="Salvo automaticamente neste navegador."
          />
        </Secao>

        <Secao titulo="Onde assistir">
          <OndeAssistir key={item.id} item={item} />
        </Secao>

        <a
          href={`https://www.themoviedb.org/${serie ? 'tv' : 'movie'}/${item.tmdbId}?language=pt-BR`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-apagado hover:text-texto"
        >
          Ver no TMDB <IconeExterno tamanho={12} />
          <span className="sr-only">(abre em nova aba)</span>
        </a>
      </div>
    </div>
  )
}

function Secao({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="mb-4 flex items-center gap-3 font-display text-2xl tracking-wide text-white">
        <span className="h-5 w-1 rounded-full bg-marvel" aria-hidden="true" />
        {titulo}
      </h3>
      {children}
    </section>
  )
}
