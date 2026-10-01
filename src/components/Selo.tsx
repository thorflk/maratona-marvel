import type { TipoItem } from '../types'
import { IconeFilme, IconeTv } from './Icones'

export function Selo({ tipo, className = '' }: { tipo: TipoItem; className?: string }) {
  const serie = tipo === 'serie'
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[0.625rem] font-bold tracking-[0.14em] uppercase ${
        serie ? 'border-sky-400/30 bg-sky-400/10 text-sky-300' : 'border-white/15 bg-white/5 text-zinc-300'
      } ${className}`}
    >
      {serie ? <IconeTv tamanho={11} /> : <IconeFilme tamanho={11} />}
      {serie ? 'Série' : 'Filme'}
    </span>
  )
}
