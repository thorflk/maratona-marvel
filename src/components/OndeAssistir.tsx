import { useState, type ReactNode } from 'react'
import { LOGOS, SERVICOS, SERVICOS_POR_ID, servicoDoProvedor } from '../lib/servicos'
import { useProgresso } from '../state/contexto'
import type { ItemCatalogo, Modalidade, OndeAssistirUsuario } from '../types'
import { IconeCheck, IconeLapis } from './Icones'

const NOME_MODALIDADE: Record<Modalidade, string> = {
  assinatura: 'Assinatura',
  gratis: 'Grátis',
  aluguel: 'Aluguel',
  compra: 'Compra',
}

/** Converte a sugestão do TMDB para o formato editável. */
function sugestaoTmdb(item: ItemCatalogo): OndeAssistirUsuario {
  const servicos = new Set<string>()
  const outros: string[] = []
  for (const p of item.ondeAssistir) {
    const id = servicoDoProvedor(p)
    if (id) servicos.add(id)
    else outros.push(p.nome)
  }
  return { servicos: [...servicos], outro: outros.join(', ') }
}

export function OndeAssistir({ item }: { item: ItemCatalogo }) {
  const { progresso, despachar } = useProgresso()
  const doUsuario = progresso.itens[item.id]?.ondeAssistir
  const [editando, setEditando] = useState(false)
  const [rascunho, setRascunho] = useState<OndeAssistirUsuario>(() => doUsuario ?? sugestaoTmdb(item))

  function iniciarEdicao() {
    setRascunho(doUsuario ?? sugestaoTmdb(item))
    setEditando(true)
  }

  function salvar() {
    despachar({ tipo: 'definirOndeAssistir', id: item.id, valor: { servicos: rascunho.servicos, outro: rascunho.outro.trim() } })
    setEditando(false)
  }

  function restaurar() {
    despachar({ tipo: 'definirOndeAssistir', id: item.id, valor: undefined })
    setEditando(false)
  }

  if (editando) {
    return (
      <div className="space-y-4">
        <fieldset>
          <legend className="mb-3 text-sm font-semibold text-texto">Serviços</legend>
          <div className="flex flex-wrap gap-2">
            {SERVICOS.map((s) => {
              const marcado = rascunho.servicos.includes(s.id)
              return (
                <label
                  key={s.id}
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-marvel-claro ${
                    marcado ? 'border-marvel bg-marvel/15 text-white' : 'border-borda-forte text-suave hover:text-texto'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={marcado}
                    onChange={() =>
                      setRascunho((r) => ({
                        ...r,
                        servicos: marcado ? r.servicos.filter((x) => x !== s.id) : [...r.servicos, s.id],
                      }))
                    }
                  />
                  {marcado ? (
                    <IconeCheck tamanho={14} strokeWidth={3} />
                  ) : (
                    <span className="size-2 rounded-full" style={{ background: s.cor }} aria-hidden="true" />
                  )}
                  {s.nome}
                </label>
              )
            })}
          </div>
        </fieldset>
        <div>
          <label htmlFor={`outro-${item.id}`} className="mb-2 block text-sm font-semibold text-texto">
            Outro lugar <span className="font-normal text-apagado">(opcional)</span>
          </label>
          <input
            id={`outro-${item.id}`}
            type="text"
            className="campo"
            value={rascunho.outro}
            placeholder="Ex.: TV a cabo, emprestado de um amigo…"
            onChange={(e) => setRascunho((r) => ({ ...r, outro: e.target.value }))}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="botao-primario" onClick={salvar}>
            Salvar
          </button>
          <button type="button" className="botao-secundario" onClick={() => setEditando(false)}>
            Cancelar
          </button>
          {doUsuario && (
            <button type="button" className="botao-fantasma" onClick={restaurar}>
              Restaurar sugestão do TMDB
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      {doUsuario ? <ListaUsuario valor={doUsuario} /> : <ListaTmdb item={item} />}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-apagado">
          {doUsuario ? 'Editado por você.' : 'Sugestão automática para o Brasil (JustWatch via TMDB). Isso muda com o tempo.'}
        </p>
        <button type="button" className="botao-secundario h-9 min-h-9 px-3 text-xs" onClick={iniciarEdicao}>
          <IconeLapis tamanho={14} /> Editar
        </button>
      </div>
    </div>
  )
}

function Logo({ src, nome, cor }: { src?: string | null; nome: string; cor?: string }) {
  if (src) return <img src={src} alt="" width={32} height={32} loading="lazy" className="size-8 rounded-lg" />
  return (
    <span
      aria-hidden="true"
      className="flex size-8 items-center justify-center rounded-lg text-xs font-bold text-white"
      style={{ background: cor ?? '#3f3f46' }}
    >
      {nome.replace(/[^A-Za-zÀ-ú0-9]/g, '').slice(0, 2)}
    </span>
  )
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <li className="inline-flex items-center gap-2.5 rounded-xl border border-borda bg-white/[0.03] py-1.5 pr-3.5 pl-1.5 text-sm">
      {children}
    </li>
  )
}

function ListaTmdb({ item }: { item: ItemCatalogo }) {
  if (item.ondeAssistir.length === 0) {
    return (
      <p className="text-sm text-suave">Nenhuma informação disponível para o Brasil. Use “Editar” para registrar onde você vai assistir.</p>
    )
  }
  return (
    <ul className="flex flex-wrap gap-2">
      {item.ondeAssistir.map((p) => (
        <Chip key={p.tmdbId}>
          <Logo src={p.logo} nome={p.nome} />
          <span>
            <span className="block leading-tight text-texto">{p.nome}</span>
            <span className="block text-[0.6875rem] leading-tight text-apagado">{NOME_MODALIDADE[p.modalidade]}</span>
          </span>
        </Chip>
      ))}
    </ul>
  )
}

function ListaUsuario({ valor }: { valor: OndeAssistirUsuario }) {
  const servicos = valor.servicos.map((id) => SERVICOS_POR_ID[id]).filter(Boolean)
  if (servicos.length === 0 && !valor.outro) {
    return <p className="text-sm text-suave">Nenhum serviço definido.</p>
  }
  return (
    <ul className="flex flex-wrap gap-2">
      {servicos.map((s) => (
        <Chip key={s.id}>
          <Logo src={LOGOS[s.id]} nome={s.nome} cor={s.cor} />
          <span className="text-texto">{s.nome}</span>
        </Chip>
      ))}
      {valor.outro && (
        <Chip>
          <Logo nome={valor.outro} />
          <span className="text-texto">{valor.outro}</span>
        </Chip>
      )}
    </ul>
  )
}
