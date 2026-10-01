import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { tamanhoImagem } from '../lib/catalogo'

interface Props {
  src: string | null
  titulo: string
  /** Itens não assistidos ficam levemente dessaturados. */
  colorido?: boolean
  /** Atributo `sizes` da imagem responsiva. */
  sizes?: string
  prioritario?: boolean
  className?: string
}

const FILTRO_COR = 'grayscale(0) brightness(1) contrast(1)'
const FILTRO_APAGADO = 'grayscale(0.85) brightness(0.62) contrast(1.05)'

export function Poster({ src, titulo, colorido = true, sizes = '(min-width: 1024px) 220px, 40vw', prioritario, className = '' }: Props) {
  const [carregado, setCarregado] = useState(false)
  const [erro, setErro] = useState(false)
  const img = useRef<HTMLImageElement>(null)

  // A imagem pode já estar no cache antes do React registrar o onLoad.
  useEffect(() => {
    if (img.current?.complete && img.current.naturalWidth > 0) setCarregado(true)
  }, [])

  const semImagem = !src || erro

  return (
    <div className={`relative overflow-hidden bg-superficie-2 ${className}`}>
      {semImagem ? (
        <PosterSubstituto titulo={titulo} colorido={colorido} />
      ) : (
        <>
          {!carregado && <div className="skeleton absolute inset-0" aria-hidden="true" />}
          <motion.img
            ref={img}
            src={tamanhoImagem(src, 'w342')}
            srcSet={`${tamanhoImagem(src, 'w185')} 185w, ${tamanhoImagem(src, 'w342')} 342w, ${tamanhoImagem(src, 'w500')} 500w, ${tamanhoImagem(src, 'w780')} 780w`}
            sizes={sizes}
            alt={`Pôster de ${titulo}`}
            loading={prioritario ? 'eager' : 'lazy'}
            decoding="async"
            onLoad={() => setCarregado(true)}
            onError={() => setErro(true)}
            className="absolute inset-0 size-full object-cover"
            initial={false}
            animate={{ filter: colorido ? FILTRO_COR : FILTRO_APAGADO, opacity: carregado ? 1 : 0 }}
            transition={{ filter: { duration: 1.1, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.5 } }}
          />
        </>
      )}
    </div>
  )
}

function PosterSubstituto({ titulo, colorido }: { titulo: string; colorido: boolean }) {
  return (
    <div
      role="img"
      aria-label={`Pôster de ${titulo} indisponível`}
      className={`absolute inset-0 flex flex-col justify-end bg-gradient-to-br p-4 transition-[filter] duration-1000 ${
        colorido ? 'from-marvel-escuro via-[#3a0b0d] to-black' : 'from-zinc-700 via-zinc-900 to-black grayscale'
      }`}
    >
      <div className="grao absolute inset-0 opacity-20 mix-blend-overlay" />
      <span className="titulo-display relative text-xl break-words text-white/90 hyphens-auto sm:text-2xl">{titulo}</span>
    </div>
  )
}
