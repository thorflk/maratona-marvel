import { AnimatePresence, motion } from 'framer-motion'
import type { EstadoSalvamento } from '../hooks/useSalvamentoAutomatico'
import { IconeCheck } from './Icones'

export function IndicadorSalvo({ estado }: { estado: EstadoSalvamento }) {
  return (
    <span className="inline-flex h-5 items-center text-xs" role="status" aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        {estado === 'digitando' && (
          <motion.span key="d" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-apagado">
            Salvando…
          </motion.span>
        )}
        {estado === 'salvo' && (
          <motion.span
            key="s"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="inline-flex items-center gap-1 font-medium text-sucesso"
          >
            <IconeCheck tamanho={13} strokeWidth={3} /> Salvo
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}
