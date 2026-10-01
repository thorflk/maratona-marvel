import { CATALOGO } from '../lib/catalogo'
import { formatarData } from '../lib/formato'
import { Emblema } from './Emblema'

export function Rodape() {
  return (
    <footer className="border-t border-borda bg-black/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 text-sm text-suave sm:px-6 md:grid-cols-[1fr_1.4fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <Emblema tamanho={28} />
            <span className="font-display text-lg tracking-[0.08em] text-white">Maratona Marvel</span>
          </div>
          <p className="mt-3 max-w-sm text-apagado">
            Site pessoal e sem fins lucrativos para acompanhar uma maratona. Seu progresso fica salvo apenas neste navegador.
          </p>
        </div>
        <div className="space-y-3 text-apagado md:text-right">
          <p>
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="mr-1.5 inline-flex items-center rounded bg-gradient-to-r from-[#90cea1] via-[#3cbec9] to-[#01b4e4] px-1.5 py-0.5 align-middle text-xs font-black tracking-wide text-[#0d253f]"
            >
              TMDB
            </a>
            Este produto usa a API do TMDB, mas não é endossado nem certificado pelo{' '}
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-suave underline-offset-2 hover:text-texto hover:underline"
            >
              TMDB
            </a>
            . Pôsteres, sinopses e trailers vêm do TMDB.
          </p>
          <p>
            Dados de “onde assistir” fornecidos pela{' '}
            <a
              href="https://www.justwatch.com/br"
              target="_blank"
              rel="noopener noreferrer"
              className="text-suave underline-offset-2 hover:text-texto hover:underline"
            >
              JustWatch
            </a>{' '}
            (via TMDB).
          </p>
          <p>
            Marvel e todos os personagens relacionados são marcas registradas de seus respectivos donos. Projeto de fã, sem afiliação
            oficial.
          </p>
          {CATALOGO.fonte === 'tmdb' && <p>Catálogo atualizado em {formatarData(CATALOGO.geradoEm)}.</p>}
        </div>
      </div>
    </footer>
  )
}
