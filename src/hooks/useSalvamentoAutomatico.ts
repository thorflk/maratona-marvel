import { useCallback, useEffect, useRef, useState } from 'react'

export type EstadoSalvamento = 'ocioso' | 'digitando' | 'salvo'

/**
 * Campo de texto com salvamento automático (debounce).
 * Salva também ao desmontar, para não perder o que foi digitado ao fechar o painel.
 */
export function useSalvamentoAutomatico(valorSalvo: string, salvar: (valor: string) => void, atrasoMs = 600) {
  const [valor, setValor] = useState(valorSalvo)
  const [estado, setEstado] = useState<EstadoSalvamento>('ocioso')
  const pendente = useRef<string | null>(null)
  const salvarRef = useRef(salvar)
  useEffect(() => {
    salvarRef.current = salvar
  }, [salvar])

  const confirmar = useCallback(() => {
    if (pendente.current === null) return
    salvarRef.current(pendente.current)
    pendente.current = null
    setEstado('salvo')
  }, [])

  useEffect(() => {
    if (pendente.current === null) return
    const id = window.setTimeout(confirmar, atrasoMs)
    return () => window.clearTimeout(id)
  }, [valor, atrasoMs, confirmar])

  // Salva o que estiver pendente ao desmontar.
  useEffect(() => () => confirmar(), [confirmar])

  const alterar = useCallback((novo: string) => {
    pendente.current = novo
    setValor(novo)
    setEstado('digitando')
  }, [])

  return { valor, alterar, estado, confirmar }
}
