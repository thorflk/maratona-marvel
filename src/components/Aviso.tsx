import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'

export interface AvisoDados {
  id: number
  texto: string
  tipo: 'sucesso' | 'erro'
}

/** Mensagem curta no rodapé da tela (some sozinha). */
export function Aviso({ aviso, aoSumir }: { aviso: AvisoDados | null; aoSumir: () => void }) {
  useEffect(() => {
    if (!aviso) return
    const id = window.setTimeout(aoSumir, 4500)
    return () => window.clearTimeout(id)
  }, [aviso, aoSumir])

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex justify-center px-4" role="status" aria-live="polite">
      <AnimatePresence>
        {aviso && (
          <motion.div
            key={aviso.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className={`pointer-events-auto rounded-full border px-5 py-3 text-sm font-medium shadow-2xl backdrop-blur-md ${
              aviso.tipo === 'sucesso'
                ? 'border-sucesso/30 bg-[#0d1f18]/95 text-emerald-200'
                : 'border-marvel/40 bg-[#2a0b0c]/95 text-red-200'
            }`}
          >
            {aviso.texto}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
