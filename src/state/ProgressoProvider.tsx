import { useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { carregar, salvar } from '../lib/armazenamento'
import { ProgressoContexto } from './contexto'
import { redutor } from './progresso'

export function ProgressoProvider({ children }: { children: ReactNode }) {
  const [progresso, despachar] = useReducer(redutor, undefined, carregar)

  useEffect(() => {
    salvar(progresso)
  }, [progresso])

  const valor = useMemo(() => ({ progresso, despachar }), [progresso])
  return <ProgressoContexto.Provider value={valor}>{children}</ProgressoContexto.Provider>
}
