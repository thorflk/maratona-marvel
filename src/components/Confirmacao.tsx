import type { ReactNode } from 'react'
import { Modal } from './Modal'

interface Props {
  aberto: boolean
  titulo: string
  children: ReactNode
  textoConfirmar: string
  perigoso?: boolean
  aoConfirmar: () => void
  aoCancelar: () => void
  /** Ação extra opcional (ex.: exportar backup antes de resetar). */
  extra?: ReactNode
}

export function Confirmacao({ aberto, titulo, children, textoConfirmar, perigoso, aoConfirmar, aoCancelar, extra }: Props) {
  return (
    <Modal aberto={aberto} aoFechar={aoCancelar} rotulo={titulo} className="w-full max-w-md">
      <div className="cartao border-borda-forte bg-superficie p-6 shadow-2xl sm:p-8">
        <h2 className="titulo-display text-4xl">{titulo}</h2>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-suave">{children}</div>
        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
          {extra}
          <button type="button" className="botao-secundario" onClick={aoCancelar} data-foco-inicial>
            Cancelar
          </button>
          <button
            type="button"
            className={perigoso ? 'botao bg-marvel text-white hover:bg-marvel-claro' : 'botao-primario'}
            onClick={aoConfirmar}
          >
            {textoConfirmar}
          </button>
        </div>
      </div>
    </Modal>
  )
}
