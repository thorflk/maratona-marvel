#!/usr/bin/env node
// Gera src/data/catalogo.json a partir da API do TMDB.
//
// Uso:
//   npm run catalogo              → busca tudo no TMDB (precisa de TMDB_API_KEY no .env)
//   npm run catalogo -- --sem-tmdb → gera um catálogo provisório, só com os dados locais
//
// A chave é lida do arquivo .env (que está no .gitignore) e nunca vai para o site:
// o site publicado lê apenas o JSON gerado.

import { writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { DESTINO, LISTA } from './lista.mjs'

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SAIDA = resolve(RAIZ, 'src/data/catalogo.json')
const API = 'https://api.themoviedb.org/3'
const IMG = 'https://image.tmdb.org/t/p'
const PAIS = 'BR'

const semTmdb = process.argv.includes('--sem-tmdb')

try {
  process.loadEnvFile(resolve(RAIZ, '.env'))
} catch {
  // Sem .env: segue com as variáveis de ambiente do sistema.
}
const CHAVE = (process.env.TMDB_API_KEY ?? '').trim()

if (!semTmdb && !CHAVE) {
  console.error('✖ TMDB_API_KEY não encontrada. Crie um arquivo .env (veja .env.example) ou rode com --sem-tmdb.')
  process.exit(1)
}

// ---------------------------------------------------------------------------
// Acesso à API
// ---------------------------------------------------------------------------

const usaToken = CHAVE.startsWith('eyJ') // Token de leitura (v4) x chave da API (v3)

async function tmdb(caminho, params = {}) {
  const url = new URL(API + caminho)
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v))
  if (!usaToken) url.searchParams.set('api_key', CHAVE)
  const headers = { accept: 'application/json' }
  if (usaToken) headers.authorization = `Bearer ${CHAVE}`

  for (let tentativa = 1; ; tentativa++) {
    const resp = await fetch(url, { headers })
    if (resp.ok) return resp.json()
    if ((resp.status === 429 || resp.status >= 500) && tentativa < 4) {
      await new Promise((r) => setTimeout(r, 1000 * 2 ** tentativa))
      continue
    }
    const corpo = await resp.text()
    throw new Error(`TMDB ${resp.status} em ${caminho}: ${corpo.slice(0, 200)}`)
  }
}

const imagem = (caminho, tamanho) => (caminho ? `${IMG}/${tamanho}${caminho}` : null)

// ---------------------------------------------------------------------------
// Regras de escolha
// ---------------------------------------------------------------------------

/** Encurta a sinopse no fim de uma frase, sem passar de ~320 caracteres. */
function sinopseCurta(texto) {
  const limpo = (texto ?? '').replace(/\s+/g, ' ').trim()
  if (limpo.length <= 320) return limpo
  const frases = limpo.match(/[^.!?]+[.!?]+(\s|$)/g) ?? [limpo]
  let saida = ''
  for (const frase of frases) {
    if ((saida + frase).length > 320) break
    saida += frase
  }
  return (saida || limpo.slice(0, 317) + '…').trim()
}

/** Pontua um vídeo: trailer em PT-BR (dublado > legendado) > teaser PT-BR > trailer em inglês. */
function pontuarVideo(v) {
  if (v.site !== 'YouTube') return -1
  const nome = (v.name ?? '').toLowerCase()
  const pt = v.iso_639_1 === 'pt'
  const en = v.iso_639_1 === 'en'
  if (!pt && !en) return -1
  let p = 0
  if (pt) p += 1000
  if (pt && nome.includes('dublado')) p += 50
  if (pt && nome.includes('legendado')) p += 40
  if (v.type === 'Trailer') p += 300
  else if (v.type === 'Teaser') p += 100
  else return -1
  if (v.official) p += 20
  if (en && /official trailer/.test(nome)) p += 10
  // Prefere o mais recente entre empates (trailers finais costumam ser os melhores).
  p += (Date.parse(v.published_at ?? '') || 0) / 1e13
  return p
}

async function escolherTrailer(tipo, tmdbId) {
  const caminho = `/${tipo === 'serie' ? 'tv' : 'movie'}/${tmdbId}/videos`
  const [pt, en] = await Promise.all([tmdb(caminho, { language: 'pt-BR' }), tmdb(caminho, { language: 'en-US' })])
  const candidatos = [...(pt.results ?? []), ...(en.results ?? [])]
    .map((v) => ({ v, p: pontuarVideo(v) }))
    .filter((x) => x.p >= 0)
    .sort((a, b) => b.p - a.p)
  const melhor = candidatos[0]?.v
  if (!melhor) return null
  return { youtubeId: melhor.key, nome: melhor.name, idioma: melhor.iso_639_1 === 'pt' ? 'pt-BR' : 'en' }
}

/** Provedores no Brasil (dados do JustWatch via TMDB). Prioriza assinatura; senão, aluguel/compra. */
async function ondeAssistir(tipo, tmdbId) {
  const dados = await tmdb(`/${tipo === 'serie' ? 'tv' : 'movie'}/${tmdbId}/watch/providers`)
  const br = dados.results?.[PAIS]
  if (!br) return []
  const vistos = new Set()
  const lista = []
  const adicionar = (provedores, modalidade) => {
    for (const p of provedores ?? []) {
      if (vistos.has(p.provider_id)) continue
      vistos.add(p.provider_id)
      lista.push({
        tmdbId: p.provider_id,
        nome: p.provider_name,
        logo: imagem(p.logo_path, 'w92'),
        modalidade,
        prioridade: p.display_priority ?? 99,
      })
    }
  }
  adicionar(br.flatrate, 'assinatura')
  adicionar(br.free, 'gratis')
  adicionar(br.ads, 'gratis')
  if (lista.length === 0) {
    adicionar(br.rent, 'aluguel')
    adicionar(br.buy, 'compra')
  }
  return lista
    .sort((a, b) => a.prioridade - b.prioridade)
    .slice(0, 6)
    .map(({ prioridade: _p, ...resto }) => resto)
}

// ---------------------------------------------------------------------------
// Montagem de cada item
// ---------------------------------------------------------------------------

async function detalhes(entrada) {
  const tipoApi = entrada.tipo === 'serie' ? 'tv' : 'movie'
  const [pt, en] = await Promise.all([
    tmdb(`/${tipoApi}/${entrada.tmdbId}`, { language: 'pt-BR' }),
    tmdb(`/${tipoApi}/${entrada.tmdbId}`, { language: 'en-US' }),
  ])
  const data = pt.release_date || pt.first_air_date || ''
  const anoTmdb = Number(data.slice(0, 4)) || null
  if (anoTmdb && anoTmdb !== entrada.ano) {
    console.warn(`  ⚠ ${entrada.titulo}: o TMDB informa ${anoTmdb}, a lista diz ${entrada.ano}. Confira o tmdbId em scripts/lista.mjs.`)
  }
  return { pt, en }
}

async function temporadas(entrada, serieEn) {
  const resultado = []
  for (const numero of entrada.temporadas) {
    const [pt, en] = await Promise.all([
      tmdb(`/tv/${entrada.tmdbId}/season/${numero}`, { language: 'pt-BR' }),
      tmdb(`/tv/${entrada.tmdbId}/season/${numero}`, { language: 'en-US' }),
    ])
    const duracaoPadrao = serieEn.episode_run_time?.[0] ?? null
    const episodios = (pt.episodes ?? []).map((ep) => {
      const epEn = en.episodes?.find((e) => e.episode_number === ep.episode_number)
      // Quando não há tradução, o TMDB devolve "Episódio N"; nesse caso mantemos o título original.
      const generico = /^epis[oó]dio \d+$/i.test(ep.name ?? '')
      return {
        temporada: numero,
        numero: ep.episode_number,
        titulo: (!generico && ep.name) || epEn?.name || `Episódio ${ep.episode_number}`,
        duracao: ep.runtime ?? epEn?.runtime ?? duracaoPadrao,
      }
    })
    resultado.push({ numero, titulo: `Temporada ${numero}`, episodios })
  }
  return resultado
}

async function montarItem(entrada, posicao) {
  const { pt, en } = await detalhes(entrada)
  const [trailer, provedores] = await Promise.all([
    escolherTrailer(entrada.tipo, entrada.tmdbId),
    ondeAssistir(entrada.tipo, entrada.tmdbId),
  ])
  const item = {
    id: entrada.id,
    posicao,
    tipo: entrada.tipo,
    titulo: entrada.tituloExibicao ?? entrada.titulo,
    tituloOriginal: entrada.tituloOriginal,
    ano: entrada.ano,
    duracao: entrada.tipo === 'filme' ? pt.runtime || en.runtime || null : null,
    temporadas: entrada.tipo === 'serie' ? await temporadas(entrada, en) : undefined,
    sinopse: sinopseCurta(pt.overview || en.overview || entrada.provisorio?.sinopse),
    poster: imagem(pt.poster_path || en.poster_path, 'w500'),
    backdrop: imagem(en.backdrop_path || pt.backdrop_path, 'w1280'),
    trailer,
    ondeAssistir: provedores,
    tmdbId: entrada.tmdbId,
  }
  if (!trailer) console.warn(`  ⚠ ${item.titulo}: nenhum trailer encontrado (o site vai abrir a busca no YouTube).`)
  if (!item.poster) console.warn(`  ⚠ ${item.titulo}: sem pôster.`)
  return item
}

function itemProvisorio(entrada, posicao) {
  const p = entrada.provisorio ?? {}
  return {
    id: entrada.id,
    posicao,
    tipo: entrada.tipo,
    titulo: entrada.tituloExibicao ?? entrada.titulo,
    tituloOriginal: entrada.tituloOriginal,
    ano: entrada.ano,
    duracao: entrada.tipo === 'filme' ? (p.duracao ?? null) : null,
    temporadas:
      entrada.tipo === 'serie'
        ? entrada.temporadas.map((numero) => ({
            numero,
            titulo: `Temporada ${numero}`,
            episodios: Array.from({ length: p.episodios?.[numero] ?? 0 }, (_, i) => ({
              temporada: numero,
              numero: i + 1,
              titulo: `Episódio ${i + 1}`,
              duracao: p.duracaoEpisodio ?? null,
            })),
          }))
        : undefined,
    sinopse: p.sinopse ?? '',
    poster: null,
    backdrop: null,
    trailer: null,
    ondeAssistir: [],
    tmdbId: entrada.tmdbId,
  }
}

// ---------------------------------------------------------------------------
// Execução
// ---------------------------------------------------------------------------

async function main() {
  const itens = []
  let destino

  if (semTmdb) {
    console.log('Gerando catálogo provisório (sem TMDB)…')
    LISTA.forEach((e, i) => itens.push(itemProvisorio(e, i + 1)))
    destino = itemProvisorio(DESTINO, LISTA.length + 1)
  } else {
    console.log(`Buscando ${LISTA.length + 1} itens no TMDB…`)
    for (const [i, entrada] of LISTA.entries()) {
      console.log(`  ${String(i + 1).padStart(2, '0')}. ${entrada.tituloExibicao ?? entrada.titulo}`)
      itens.push(await montarItem(entrada, i + 1))
    }
    console.log(`  ★  ${DESTINO.titulo}`)
    destino = await montarItem(DESTINO, LISTA.length + 1)
  }

  const catalogo = {
    versao: 1,
    fonte: semTmdb ? 'provisorio' : 'tmdb',
    geradoEm: new Date().toISOString(),
    itens,
    destino: { ...destino, estreia: DESTINO.estreia, sessao: DESTINO.sessao },
  }
  await writeFile(SAIDA, JSON.stringify(catalogo, null, 2) + '\n', 'utf8')
  console.log(`✔ Catálogo salvo em ${SAIDA.replace(RAIZ + '/', '')}`)
}

main().catch((erro) => {
  console.error('✖ Falha ao gerar o catálogo:', erro.message)
  process.exit(1)
})
