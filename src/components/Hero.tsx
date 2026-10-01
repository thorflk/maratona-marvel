import { motion } from 'framer-motion'
import { useEstatisticas } from '../hooks/useEstatisticas'
import { DESTINO, tamanhoImagem } from '../lib/catalogo'
import { duracaoPorExtenso, formatarDataLonga, formatarDuracao } from '../lib/formato'
import { BarraProgresso } from './BarraProgresso'
import { Contagem } from './Contagem'
import { Emblema } from './Emblema'
import { MenuBackup } from './MenuBackup'

const entrada = (atraso: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay: atraso, ease: [0.22, 1, 0.36, 1] as const },
})

export function Hero() {
  const est = useEstatisticas()
  const sessao = new Date(DESTINO.sessao)

  return (
    <header className="relative isolate overflow-hidden border-b border-borda">
      {/* Fundo */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        {DESTINO.backdrop && (
          <img
            src={tamanhoImagem(DESTINO.backdrop, 'w1280')}
            alt=""
            className="absolute inset-0 size-full object-cover object-top opacity-30"
            fetchPriority="high"
          />
        )}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_0%,rgb(230_36_41/0.35),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_0%_100%,rgb(230_36_41/0.15),transparent_70%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-fundo/40 via-fundo/80 to-fundo" />
        <div className="grao absolute inset-0 opacity-[0.07] mix-blend-overlay" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-marvel/60 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Barra superior */}
        <div className="flex items-center justify-between gap-4 py-5">
          <div className="flex items-center gap-3">
            <Emblema tamanho={34} />
            <span className="font-display text-xl tracking-[0.08em] text-white">Maratona Marvel</span>
          </div>
          <MenuBackup />
        </div>

        <div className="grid gap-12 pt-10 pb-16 sm:pt-16 lg:grid-cols-[1.25fr_1fr] lg:items-end lg:gap-16 lg:pt-24 lg:pb-24">
          {/* Título e progresso */}
          <div>
            <motion.p {...entrada(0)} className="rotulo flex items-center gap-3 !text-marvel-claro">
              <span className="h-px w-8 bg-marvel" aria-hidden="true" />
              {est.total} títulos · da ordem cronológica até o destino final
            </motion.p>
            <motion.h1 {...entrada(0.08)} className="titulo-display mt-5 text-[clamp(3.5rem,11vw,8.5rem)] text-white">
              Rumo a<span className="block bg-gradient-to-br from-white via-red-100 to-marvel bg-clip-text text-transparent">Doomsday</span>
            </motion.h1>
            <motion.p {...entrada(0.16)} className="mt-6 max-w-xl text-base leading-relaxed text-suave sm:text-lg">
              Uma maratona pessoal do Universo Marvel, filme a filme e episódio a episódio, até a sessão de{' '}
              <strong className="font-semibold text-texto">{DESTINO.titulo}</strong>.
            </motion.p>

            <motion.div {...entrada(0.24)} className="mt-10 max-w-xl">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <span className="rotulo">Progresso</span>
                  <p className="mt-1 font-display text-5xl leading-none text-white tabular-nums sm:text-6xl">
                    {est.assistidos}
                    <span className="text-3xl text-apagado sm:text-4xl"> / {est.total}</span>
                  </p>
                </div>
                <p className="font-display text-5xl leading-none text-marvel tabular-nums sm:text-6xl">{Math.round(est.porcentagem)}%</p>
              </div>
              <BarraProgresso valor={est.assistidos} maximo={est.total} rotulo="Progresso da maratona" className="mt-4" altura="h-2.5" />
              <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-borda pt-5">
                <Estatistica rotulo="Tempo total" minutos={est.minutosTotal} aproximado={est.duracaoIncompleta} />
                <Estatistica rotulo="Já assistido" minutos={est.minutosAssistidos} />
                <Estatistica rotulo="Falta assistir" minutos={est.minutosRestantes} destaque aproximado={est.duracaoIncompleta} />
              </dl>
            </motion.div>
          </div>

          {/* Contagem regressiva */}
          <motion.section
            {...entrada(0.3)}
            aria-labelledby="titulo-contagem"
            className="relative overflow-hidden rounded-3xl border border-borda-forte bg-black/40 p-6 shadow-[0_30px_80px_-30px_rgb(230_36_41/0.5)] backdrop-blur-xl sm:p-8"
          >
            <div className="absolute -top-24 -right-24 size-56 rounded-full bg-marvel/25 blur-3xl" aria-hidden="true" />
            <p className="rotulo">Contagem regressiva</p>
            <h2 id="titulo-contagem" className="titulo-display mt-2 text-3xl text-white sm:text-4xl">
              {DESTINO.titulo}
            </h2>
            <div className="mt-6">
              <Contagem />
            </div>
            <div className="mt-6 space-y-1.5 border-t border-borda pt-5 text-sm">
              <p className="text-texto">
                <span className="text-suave">Minha sessão:</span>{' '}
                <time dateTime={DESTINO.sessao} className="font-semibold">
                  {formatarDataLonga(DESTINO.sessao)}, às{' '}
                  {sessao.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' })}
                </time>{' '}
                <span className="text-apagado">(horário de Brasília)</span>
              </p>
              <p className="text-suave">
                Estreia oficial: <time dateTime={DESTINO.estreia}>{formatarDataLonga(`${DESTINO.estreia}T12:00:00-03:00`)}</time>
              </p>
            </div>
          </motion.section>
        </div>
      </div>
    </header>
  )
}

function Estatistica({
  rotulo,
  minutos,
  destaque,
  aproximado,
}: {
  rotulo: string
  minutos: number
  destaque?: boolean
  aproximado?: boolean
}) {
  return (
    <div>
      <dt className="rotulo !text-[0.625rem] !tracking-[0.14em]">{rotulo}</dt>
      <dd className={`mt-1.5 text-base font-semibold tabular-nums sm:text-lg ${destaque ? 'text-white' : 'text-texto/90'}`}>
        <span aria-hidden="true">
          {aproximado ? '~' : ''}
          {formatarDuracao(minutos)}
        </span>
        <span className="sr-only">
          {aproximado ? 'aproximadamente ' : ''}
          {duracaoPorExtenso(minutos)}
        </span>
      </dd>
    </div>
  )
}
