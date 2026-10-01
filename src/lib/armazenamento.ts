import type { Progresso, ProgressoItem } from '../types'

/**
 * Persistência no localStorage.
 *
 * O objeto salvo tem um campo `versao`. Quando o formato mudar no futuro,
 * aumente VERSAO_ATUAL e adicione um passo em MIGRACOES — dados antigos
 * (inclusive de backups importados) são convertidos automaticamente.
 */
export const CHAVE_STORAGE = 'maratona-marvel:progresso'
export const VERSAO_ATUAL = 1 as const

export const progressoVazio = (): Progresso => ({ versao: VERSAO_ATUAL, itens: {} })

type Migracao = (dados: Record<string, unknown>) => Record<string, unknown>

/** MIGRACOES[n] converte a versão n para a versão n + 1. */
const MIGRACOES: Record<number, Migracao> = {
  // Exemplo para o futuro:
  // 1: (v1) => ({ ...v1, versao: 2, novoCampo: … }),
}

const ehObjeto = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v)
const texto = (v: unknown) => (typeof v === 'string' ? v : undefined)
const dataValida = (v: unknown) => (typeof v === 'string' && !Number.isNaN(Date.parse(v)) ? v : undefined)

/** Limpa um item vindo de fonte não confiável (backup editado à mão, versão antiga…). */
function sanearItem(bruto: unknown): ProgressoItem | null {
  if (!ehObjeto(bruto)) return null
  const item: ProgressoItem = {}
  const assistidoEm = dataValida(bruto.assistidoEm)
  if (assistidoEm) item.assistidoEm = assistidoEm
  if (ehObjeto(bruto.episodios)) {
    const eps: Record<string, string> = {}
    for (const [k, v] of Object.entries(bruto.episodios)) {
      const d = dataValida(v)
      if (/^T\d+E\d+$/.test(k) && d) eps[k] = d
    }
    if (Object.keys(eps).length) item.episodios = eps
  }
  if (typeof bruto.nota === 'number' && Number.isFinite(bruto.nota)) {
    item.nota = Math.min(10, Math.max(0, Math.round(bruto.nota * 2) / 2))
  }
  const justificativa = texto(bruto.justificativa)
  if (justificativa) item.justificativa = justificativa
  const anotacoes = texto(bruto.anotacoes)
  if (anotacoes) item.anotacoes = anotacoes
  if (ehObjeto(bruto.ondeAssistir)) {
    const servicos = Array.isArray(bruto.ondeAssistir.servicos)
      ? bruto.ondeAssistir.servicos.filter((s): s is string => typeof s === 'string')
      : []
    item.ondeAssistir = { servicos, outro: texto(bruto.ondeAssistir.outro) ?? '' }
  }
  return Object.keys(item).length ? item : null
}

/** Converte qualquer versão conhecida para a atual. Lança erro se o formato for inválido. */
export function migrar(bruto: unknown): Progresso {
  if (!ehObjeto(bruto) || typeof bruto.versao !== 'number') throw new Error('Formato de progresso inválido.')
  let dados = bruto
  let versao = bruto.versao
  if (versao > VERSAO_ATUAL) throw new Error('Este backup foi criado por uma versão mais nova do site.')
  while (versao < VERSAO_ATUAL) {
    const passo = MIGRACOES[versao]
    if (!passo) throw new Error(`Não há migração da versão ${versao}.`)
    dados = passo(dados)
    versao += 1
  }
  const itens: Record<string, ProgressoItem> = {}
  if (ehObjeto(dados.itens)) {
    for (const [id, valor] of Object.entries(dados.itens)) {
      const item = sanearItem(valor)
      if (item) itens[id] = item
    }
  }
  return { versao: VERSAO_ATUAL, itens }
}

export function carregar(): Progresso {
  try {
    const bruto = localStorage.getItem(CHAVE_STORAGE)
    return bruto ? migrar(JSON.parse(bruto)) : progressoVazio()
  } catch (erro) {
    console.error('Não foi possível ler o progresso salvo.', erro)
    return progressoVazio()
  }
}

export function salvar(progresso: Progresso): boolean {
  try {
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(progresso))
    return true
  } catch (erro) {
    console.error('Não foi possível salvar o progresso.', erro)
    return false
  }
}

// ---------------------------------------------------------------------------
// Backup
// ---------------------------------------------------------------------------

const APP = 'maratona-marvel'

export function gerarBackup(progresso: Progresso): string {
  return JSON.stringify({ app: APP, exportadoEm: new Date().toISOString(), progresso }, null, 2)
}

export function lerBackup(conteudo: string): Progresso {
  let json: unknown
  try {
    json = JSON.parse(conteudo)
  } catch {
    throw new Error('O arquivo não é um JSON válido.')
  }
  if (!ehObjeto(json) || json.app !== APP || !('progresso' in json)) {
    throw new Error('Este arquivo não é um backup da Maratona Marvel.')
  }
  return migrar(json.progresso)
}

export function baixarArquivo(nome: string, conteudo: string) {
  const blob = new Blob([conteudo], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = nome
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
