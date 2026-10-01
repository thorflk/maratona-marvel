import type { ItemCatalogo } from '../types'
import { IconeFechar } from './Icones'
import { Modal } from './Modal'

/** Trailer do YouTube (youtube-nocookie). Ao fechar, o iframe é removido e o vídeo para. */
export function TrailerModal({ item, aoFechar }: { item: ItemCatalogo | null; aoFechar: () => void }) {
  const trailer = item?.trailer
  return (
    <Modal
      aberto={Boolean(trailer)}
      aoFechar={aoFechar}
      rotulo={item ? `Trailer de ${item.titulo}` : 'Trailer'}
      className="w-full max-w-5xl"
    >
      {item && trailer && (
        <div>
          <div className="mb-3 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="rotulo">Trailer{trailer.idioma === 'pt-BR' ? ' · em português' : ' · em inglês'}</p>
              <p className="truncate font-display text-2xl text-white sm:text-3xl">{item.titulo}</p>
            </div>
            <button
              type="button"
              onClick={aoFechar}
              className="botao-icone shrink-0 bg-white/10 text-white"
              aria-label="Fechar trailer"
              data-foco-inicial
            >
              <IconeFechar />
            </button>
          </div>
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-black shadow-[0_40px_100px_-20px_rgb(230_36_41/0.35)] ring-1 ring-white/10">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${trailer.youtubeId}?autoplay=1&rel=0&modestbranding=1&cc_lang_pref=pt&hl=pt-BR`}
              title={`Trailer de ${item.titulo}: ${trailer.nome}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="absolute inset-0 size-full"
            />
          </div>
        </div>
      )}
    </Modal>
  )
}
