import { motion } from 'framer-motion'
import { DESTINO, tamanhoImagem } from '../lib/catalogo'
import { formatarDataLonga } from '../lib/formato'
import { BotaoTrailer } from './BotaoTrailer'
import { Contagem } from './Contagem'
import { IconeAlvo } from './Icones'
import { Poster } from './Poster'

/** Card final da maratona: Vingadores: Doomsday. Sem marcar nem avaliar. */
export function CardDestino() {
  const hora = new Date(DESTINO.sessao).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' })

  return (
    <section aria-labelledby="titulo-destino" className="relative pt-10 md:pt-16">
      <div className="relative z-10 mb-8 flex justify-start pl-0 md:justify-center" aria-hidden="true">
        <div className="flex size-14 items-center justify-center rounded-full border-2 border-marvel-claro bg-fundo text-marvel-claro shadow-[0_0_0_8px_rgb(230_36_41/0.12),0_0_40px_rgb(230_36_41/0.6)] max-md:-ml-2">
          <IconeAlvo tamanho={26} />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 48, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative isolate overflow-hidden rounded-3xl border border-marvel/40 bg-superficie shadow-[0_40px_120px_-40px_rgb(230_36_41/0.6)] max-md:ml-14"
      >
        {/* Fundo */}
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          {DESTINO.backdrop && (
            <img
              src={tamanhoImagem(DESTINO.backdrop, 'w1280')}
              alt=""
              loading="lazy"
              className="absolute inset-0 size-full object-cover opacity-25"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-superficie via-superficie/85 to-marvel-escuro/30" />
          <div className="absolute -top-32 left-1/2 h-64 w-[70%] -translate-x-1/2 rounded-full bg-marvel/30 blur-[100px]" />
          <div className="grao absolute inset-0 opacity-[0.08] mix-blend-overlay" />
        </div>

        <div className="grid grid-cols-1 gap-8 p-5 sm:p-10 md:grid-cols-[minmax(0,15rem)_1fr] md:items-center lg:gap-14 lg:p-14">
          <Poster
            src={DESTINO.poster}
            titulo={DESTINO.titulo}
            sizes="(min-width: 768px) 240px, 60vw"
            className="mx-auto aspect-[2/3] w-full max-w-[15rem] rounded-2xl shadow-[0_30px_60px_-20px_rgb(0_0_0/0.9)] ring-1 ring-marvel/40"
          />

          <div className="min-w-0">
            <p className="rotulo flex items-center gap-3 !text-marvel-claro">
              <span className="h-px w-8 bg-marvel" aria-hidden="true" />
              Destino final da maratona
            </p>
            <h2 id="titulo-destino" className="titulo-display mt-3 text-[2.75rem] text-white sm:text-7xl">
              {DESTINO.titulo}
            </h2>
            <p className="mt-2 text-sm text-suave">
              {DESTINO.ano} · Estreia oficial em{' '}
              <time dateTime={DESTINO.estreia}>{formatarDataLonga(`${DESTINO.estreia}T12:00:00-03:00`)}</time>
            </p>
            {DESTINO.sinopse && <p className="mt-4 max-w-xl text-sm leading-relaxed text-suave sm:text-base">{DESTINO.sinopse}</p>}

            <div className="mt-8">
              <p className="mb-3 text-sm text-texto">
                Minha sessão:{' '}
                <time dateTime={DESTINO.sessao} className="font-semibold">
                  {formatarDataLonga(DESTINO.sessao)}, {hora}
                </time>{' '}
                <span className="text-apagado">(Brasília)</span>
              </p>
              <Contagem variante="destino" />
            </div>

            <div className="mt-8">
              <BotaoTrailer item={DESTINO} className="botao-primario" />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
