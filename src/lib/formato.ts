/** "2 h 15 min", "48 min", "312 h 40 min". */
export function formatarDuracao(minutos: number): string {
  const m = Math.max(0, Math.round(minutos))
  const h = Math.floor(m / 60)
  const resto = m % 60
  if (h === 0) return `${resto} min`
  if (resto === 0) return `${h} h`
  return `${h} h ${resto} min`
}

/** Texto longo para leitores de tela: "2 horas e 15 minutos". */
export function duracaoPorExtenso(minutos: number): string {
  const m = Math.max(0, Math.round(minutos))
  const h = Math.floor(m / 60)
  const resto = m % 60
  const partes: string[] = []
  if (h) partes.push(`${h} ${h === 1 ? 'hora' : 'horas'}`)
  if (resto || !h) partes.push(`${resto} ${resto === 1 ? 'minuto' : 'minutos'}`)
  return partes.join(' e ')
}

const dataCurta = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
const dataLonga = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })

export const formatarData = (iso: string) => dataCurta.format(new Date(iso))
export const formatarDataLonga = (iso: string) => dataLonga.format(new Date(iso))

/** 8.5 → "8,5" */
export const formatarNota = (nota: number) => nota.toLocaleString('pt-BR', { maximumFractionDigits: 1 })

export const formatarPosicao = (n: number) => String(n).padStart(2, '0')

/** Normaliza para busca: minúsculas e sem acentos. */
export const normalizar = (texto: string) => texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()

export const plural = (n: number, singular: string, pluralTexto: string) => `${n} ${n === 1 ? singular : pluralTexto}`
