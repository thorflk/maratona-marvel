import { useUI } from '../state/ui'
import type { ItemCatalogo } from '../types'
import { IconeExterno, IconePlay } from './Icones'

/** Abre o trailer num modal; sem trailer no catálogo, abre a busca no YouTube. */
export function BotaoTrailer({ item, className = 'botao-secundario' }: { item: ItemCatalogo; className?: string }) {
  const { abrirTrailer } = useUI()

  if (!item.trailer) {
    const busca = encodeURIComponent(`${item.titulo} trailer oficial dublado`)
    return (
      <a
        href={`https://www.youtube.com/results?search_query=${busca}`}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        aria-label={`Buscar trailer de ${item.titulo} no YouTube (abre em nova aba)`}
      >
        <IconePlay tamanho={14} />
        Trailer
        <IconeExterno tamanho={13} className="opacity-60" />
      </a>
    )
  }

  return (
    <button type="button" className={className} onClick={() => abrirTrailer(item)} aria-label={`Assistir ao trailer de ${item.titulo}`}>
      <IconePlay tamanho={14} />
      Trailer
    </button>
  )
}
