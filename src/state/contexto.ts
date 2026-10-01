import { createContext, useContext, type Dispatch } from 'react'
import type { Progresso } from '../types'
import type { Acao } from './progresso'

export interface ContextoProgresso {
  progresso: Progresso
  despachar: Dispatch<Acao>
}

export const ProgressoContexto = createContext<ContextoProgresso | null>(null)

export function useProgresso(): ContextoProgresso {
  const ctx = useContext(ProgressoContexto)
  if (!ctx) throw new Error('useProgresso precisa estar dentro de <ProgressoProvider>.')
  return ctx
}
