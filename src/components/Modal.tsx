import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

// Pilha de modais abertos: só o do topo responde ao ESC e prende o foco.
const pilha: symbol[] = []

const SELETOR_FOCAVEL =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])'

interface Props {
  aberto: boolean
  aoFechar: () => void
  /** Título acessível (lido pelo leitor de tela). */
  rotulo: string
  variante?: 'centro' | 'lateral'
  /** Classes do painel. */
  className?: string
  children: ReactNode
}

export function Modal(props: Props) {
  return createPortal(<AnimatePresence>{props.aberto && <ConteudoModal {...props} />}</AnimatePresence>, document.body)
}

function ConteudoModal({ aoFechar, rotulo, variante = 'centro', className = '', children }: Props) {
  const painel = useRef<HTMLDivElement>(null)
  const aoFecharRef = useRef(aoFechar)
  useEffect(() => {
    aoFecharRef.current = aoFechar
  }, [aoFechar])

  useEffect(() => {
    const token = Symbol('modal')
    pilha.push(token)
    const anterior = document.activeElement as HTMLElement | null
    const overflowAnterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const el = painel.current
    const inicial = el?.querySelector<HTMLElement>('[data-foco-inicial]') ?? el
    inicial?.focus({ preventScroll: true })

    function aoTeclar(e: KeyboardEvent) {
      if (pilha[pilha.length - 1] !== token || !el) return
      if (e.key === 'Escape') {
        e.preventDefault()
        aoFecharRef.current()
        return
      }
      if (e.key !== 'Tab') return
      const focaveis = [...el.querySelectorAll<HTMLElement>(SELETOR_FOCAVEL)].filter((n) => n.offsetParent !== null)
      if (focaveis.length === 0) {
        e.preventDefault()
        return
      }
      const primeiro = focaveis[0]
      const ultimo = focaveis[focaveis.length - 1]
      if (e.shiftKey && (document.activeElement === primeiro || document.activeElement === el)) {
        e.preventDefault()
        ultimo.focus()
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault()
        primeiro.focus()
      }
    }
    document.addEventListener('keydown', aoTeclar)

    return () => {
      document.removeEventListener('keydown', aoTeclar)
      pilha.splice(pilha.indexOf(token), 1)
      if (pilha.length === 0) document.body.style.overflow = overflowAnterior
      anterior?.focus?.({ preventScroll: true })
    }
  }, [])

  const lateral = variante === 'lateral'

  return (
    <div className={`fixed inset-0 z-50 flex ${lateral ? 'justify-end' : 'items-center justify-center p-4 sm:p-8'}`}>
      <motion.div
        className="absolute inset-0 bg-black/75 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={aoFechar}
        aria-hidden="true"
      />
      <motion.div
        ref={painel}
        role="dialog"
        aria-modal="true"
        aria-label={rotulo}
        tabIndex={-1}
        className={`relative focus:outline-none ${className}`}
        initial={lateral ? { x: '100%' } : { opacity: 0, scale: 0.96, y: 16 }}
        animate={lateral ? { x: 0 } : { opacity: 1, scale: 1, y: 0 }}
        exit={lateral ? { x: '100%' } : { opacity: 0, scale: 0.97, y: 8 }}
        transition={{ type: 'tween', ease: [0.22, 1, 0.36, 1], duration: lateral ? 0.45 : 0.3 }}
      >
        {children}
      </motion.div>
    </div>
  )
}
