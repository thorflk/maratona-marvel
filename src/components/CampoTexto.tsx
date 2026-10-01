import { useId } from 'react'
import { useSalvamentoAutomatico } from '../hooks/useSalvamentoAutomatico'
import { IndicadorSalvo } from './IndicadorSalvo'

interface Props {
  rotulo: string
  valor: string
  aoSalvar: (valor: string) => void
  placeholder?: string
  linhas?: number
  ajuda?: string
}

/** Área de texto com salvamento automático e indicador "Salvo". */
export function CampoTexto({ rotulo, valor, aoSalvar, placeholder, linhas = 4, ajuda }: Props) {
  const id = useId()
  const { valor: atual, alterar, estado, confirmar } = useSalvamentoAutomatico(valor, aoSalvar)
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-sm font-semibold text-texto">
          {rotulo}
        </label>
        <IndicadorSalvo estado={estado} />
      </div>
      <textarea
        id={id}
        value={atual}
        onChange={(e) => alterar(e.target.value)}
        onBlur={confirmar}
        placeholder={placeholder}
        rows={linhas}
        aria-describedby={ajuda ? `${id}-ajuda` : undefined}
        className="campo resize-y leading-relaxed"
      />
      {ajuda && (
        <p id={`${id}-ajuda`} className="mt-1.5 text-xs text-apagado">
          {ajuda}
        </p>
      )}
    </div>
  )
}
