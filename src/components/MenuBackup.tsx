import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { baixarArquivo, gerarBackup, lerBackup } from '../lib/armazenamento'
import { useProgresso } from '../state/contexto'
import type { Progresso } from '../types'
import { Aviso, type AvisoDados } from './Aviso'
import { Confirmacao } from './Confirmacao'
import { IconeBaixar, IconeChevron, IconeEnviar, IconeReiniciar } from './Icones'

export function MenuBackup() {
  const { progresso, despachar } = useProgresso()
  const [aberto, setAberto] = useState(false)
  const [importado, setImportado] = useState<Progresso | null>(null)
  const [confirmarReset, setConfirmarReset] = useState(false)
  const [aviso, setAviso] = useState<AvisoDados | null>(null)
  const raiz = useRef<HTMLDivElement>(null)
  const botao = useRef<HTMLButtonElement>(null)
  const arquivo = useRef<HTMLInputElement>(null)

  const avisar = (texto: string, tipo: AvisoDados['tipo'] = 'sucesso') => setAviso({ id: Date.now(), texto, tipo })
  const limparAviso = useCallback(() => setAviso(null), [])

  useEffect(() => {
    if (!aberto) return
    const fora = (e: PointerEvent) => {
      if (!raiz.current?.contains(e.target as Node)) setAberto(false)
    }
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAberto(false)
        botao.current?.focus()
      }
    }
    document.addEventListener('pointerdown', fora)
    document.addEventListener('keydown', tecla)
    return () => {
      document.removeEventListener('pointerdown', fora)
      document.removeEventListener('keydown', tecla)
    }
  }, [aberto])

  function exportar() {
    const data = new Date().toISOString().slice(0, 10)
    baixarArquivo(`maratona-marvel-backup-${data}.json`, gerarBackup(progresso))
    setAberto(false)
    avisar('Backup exportado.')
  }

  async function aoEscolherArquivo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      setImportado(lerBackup(await file.text()))
    } catch (erro) {
      avisar(erro instanceof Error ? erro.message : 'Não foi possível ler o arquivo.', 'erro')
    }
  }

  return (
    <div ref={raiz} className="relative">
      <button
        ref={botao}
        type="button"
        className="botao-secundario h-10 px-4"
        aria-expanded={aberto}
        aria-controls="menu-backup"
        onClick={() => setAberto((v) => !v)}
      >
        Backup
        <IconeChevron tamanho={16} className={`transition-transform ${aberto ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {aberto && (
          <motion.div
            id="menu-backup"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 z-40 mt-2 w-64 origin-top-right overflow-hidden rounded-2xl border border-borda-forte bg-superficie-2/95 p-1.5 shadow-2xl backdrop-blur-xl"
          >
            <ItemMenu
              icone={<IconeBaixar tamanho={18} />}
              titulo="Exportar backup"
              descricao="Baixa um arquivo .json com tudo"
              onClick={exportar}
            />
            <ItemMenu
              icone={<IconeEnviar tamanho={18} />}
              titulo="Importar backup"
              descricao="Restaura a partir de um .json"
              onClick={() => {
                setAberto(false)
                arquivo.current?.click()
              }}
            />
            <div className="mx-3 my-1 h-px bg-borda" />
            <ItemMenu
              icone={<IconeReiniciar tamanho={18} />}
              titulo="Resetar progresso"
              descricao="Apaga todos os dados salvos"
              perigoso
              onClick={() => {
                setAberto(false)
                setConfirmarReset(true)
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <input
        ref={arquivo}
        type="file"
        accept="application/json,.json"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={aoEscolherArquivo}
      />

      <Confirmacao
        aberto={importado !== null}
        titulo="Importar backup?"
        textoConfirmar="Substituir e importar"
        aoCancelar={() => setImportado(null)}
        aoConfirmar={() => {
          if (importado) despachar({ tipo: 'substituir', progresso: importado })
          setImportado(null)
          avisar('Backup importado com sucesso.')
        }}
      >
        <p>
          O progresso atual deste navegador será <strong className="text-texto">substituído</strong> pelo conteúdo do arquivo (assistidos,
          episódios, notas, justificativas, anotações e onde assistir).
        </p>
      </Confirmacao>

      <Confirmacao
        aberto={confirmarReset}
        titulo="Resetar progresso?"
        textoConfirmar="Apagar tudo"
        perigoso
        aoCancelar={() => setConfirmarReset(false)}
        aoConfirmar={() => {
          despachar({ tipo: 'resetar' })
          setConfirmarReset(false)
          avisar('Progresso apagado. A maratona recomeça do zero.')
        }}
        extra={
          <button type="button" className="botao-fantasma sm:mr-auto" onClick={exportar}>
            <IconeBaixar tamanho={16} /> Exportar antes
          </button>
        }
      >
        <p>
          Isso apaga <strong className="text-texto">tudo</strong> o que está salvo neste navegador: itens e episódios assistidos, notas,
          justificativas, anotações e onde assistir. Não dá para desfazer.
        </p>
        <p>Se quiser guardar uma cópia, exporte um backup antes.</p>
      </Confirmacao>

      <Aviso aviso={aviso} aoSumir={limparAviso} />
    </div>
  )
}

function ItemMenu({
  icone,
  titulo,
  descricao,
  perigoso,
  onClick,
}: {
  icone: React.ReactNode
  titulo: string
  descricao: string
  perigoso?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-white/[0.07] focus-visible:bg-white/[0.07] ${
        perigoso ? 'text-red-300' : 'text-texto'
      }`}
    >
      <span className={`mt-0.5 ${perigoso ? 'text-marvel-claro' : 'text-suave'}`}>{icone}</span>
      <span>
        <span className="block text-sm font-semibold">{titulo}</span>
        <span className="block text-xs text-apagado">{descricao}</span>
      </span>
    </button>
  )
}
