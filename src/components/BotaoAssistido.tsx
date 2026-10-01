import { motion } from 'framer-motion'
import { useProgresso } from '../state/contexto'
import { estaAssistido } from '../state/progresso'
import type { ItemCatalogo } from '../types'
import { IconeCheck } from './Icones'

export function BotaoAssistido({ item, compacto }: { item: ItemCatalogo; compacto?: boolean }) {
  const { progresso, despachar } = useProgresso()
  const assistido = estaAssistido(item, progresso.itens[item.id])
  const serie = item.tipo === 'serie'

  return (
    <motion.button
      type="button"
      aria-pressed={assistido}
      onClick={() => despachar({ tipo: 'alternarAssistido', id: item.id })}
      whileTap={{ scale: 0.95 }}
      className={`botao border ${
        assistido
          ? 'border-marvel bg-marvel text-white shadow-[0_8px_24px_-10px_rgb(230_36_41/0.9)] hover:bg-marvel-claro'
          : 'border-borda-forte bg-white/5 text-texto hover:border-marvel/60 hover:bg-marvel/10'
      } ${compacto ? 'px-3.5' : ''}`}
      aria-label={
        assistido
          ? `${item.titulo}: assistido. Clique para desmarcar${serie ? ' todos os episódios' : ''}.`
          : `Marcar ${item.titulo} como assistido${serie ? ' (todos os episódios)' : ''}`
      }
    >
      <span
        className={`flex size-4 items-center justify-center rounded-full border ${assistido ? 'border-white bg-white text-marvel' : 'border-current'}`}
        aria-hidden="true"
      >
        {assistido && <IconeCheck tamanho={11} strokeWidth={3.5} />}
      </span>
      {assistido ? 'Assistido' : 'Marcar assistido'}
    </motion.button>
  )
}
