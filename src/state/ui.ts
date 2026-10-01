import { createContext, useContext } from 'react'
import type { ItemCatalogo } from '../types'

export interface ContextoUI {
  abrirDetalhes: (id: string) => void
  abrirTrailer: (item: ItemCatalogo) => void
}

export const UIContexto = createContext<ContextoUI | null>(null)

export function useUI(): ContextoUI {
  const ctx = useContext(UIContexto)
  if (!ctx) throw new Error('useUI precisa estar dentro de <UIContexto.Provider>.')
  return ctx
}
