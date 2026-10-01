import { Fragment } from 'react'
import { useAgora } from '../hooks/useAgora'
import { DESTINO } from '../lib/catalogo'

const ALVO = Date.parse(DESTINO.sessao)

function calcular(agora: number) {
  const restante = Math.max(0, ALVO - agora)
  const minutosTotais = Math.floor(restante / 60_000)
  return {
    terminou: restante === 0,
    dias: Math.floor(minutosTotais / 1440),
    horas: Math.floor((minutosTotais % 1440) / 60),
    minutos: minutosTotais % 60,
  }
}

interface Props {
  variante?: 'hero' | 'destino'
}

export function Contagem({ variante = 'hero' }: Props) {
  const agora = useAgora(1000)
  const { terminou, dias, horas, minutos } = calcular(agora)

  if (terminou) {
    return (
      <p className="titulo-display text-4xl text-marvel-claro sm:text-5xl" role="status">
        A sessão começou! Bom filme.
      </p>
    )
  }

  const blocos = [
    { valor: dias, rotulo: dias === 1 ? 'dia' : 'dias' },
    { valor: horas, rotulo: horas === 1 ? 'hora' : 'horas' },
    { valor: minutos, rotulo: minutos === 1 ? 'minuto' : 'minutos' },
  ]
  const grande = variante === 'destino'
  const descricao = `Faltam ${dias} ${blocos[0].rotulo}, ${horas} ${blocos[1].rotulo} e ${minutos} ${blocos[2].rotulo} para a sua sessão de ${DESTINO.titulo}.`

  return (
    <div
      role="timer"
      aria-live="off"
      aria-label={descricao}
      className={`flex items-stretch gap-1.5 sm:gap-3 ${grande ? 'max-w-md' : 'max-w-sm'}`}
    >
      {blocos.map((b, i) => (
        <Fragment key={b.rotulo}>
          <div
            aria-hidden="true"
            className={`flex min-w-0 flex-1 flex-col items-center justify-center rounded-xl border border-borda-forte bg-black/40 backdrop-blur ${
              grande ? 'py-4 sm:py-5' : 'py-3 sm:py-4'
            }`}
          >
            <span
              className={`font-display leading-none text-white tabular-nums ${grande ? 'text-5xl sm:text-7xl' : 'text-[2.75rem] sm:text-6xl'}`}
            >
              {String(b.valor).padStart(2, '0')}
            </span>
            <span className="mt-1 text-[0.5625rem] font-semibold tracking-[0.18em] text-suave uppercase sm:text-[0.625rem]">
              {b.rotulo}
            </span>
          </div>
          {i < blocos.length - 1 && (
            <span
              aria-hidden="true"
              className={`self-center font-display text-marvel ${grande ? 'text-4xl sm:text-5xl' : 'text-3xl sm:text-4xl'}`}
            >
              :
            </span>
          )}
        </Fragment>
      ))}
    </div>
  )
}
