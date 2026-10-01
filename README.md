# Maratona Marvel · Rumo a Doomsday

Site pessoal para acompanhar a maratona do Universo Marvel, em ordem cronológica, de **X-Men: O Filme** até
**Vingadores: Doomsday** (sessão em 16/12/2026, às 20:45, horário de Brasília).

- 33 filmes e séries, na ordem definida em [`scripts/lista.mjs`](scripts/lista.mjs)
- Marcar como assistido (com data), episódios por temporada, nota de 0 a 10 com justificativa, anotações e "onde assistir"
- Progresso geral, tempo total e restante, contagem regressiva e destaque "Próximo a assistir"
- Filtros, busca, exportar/importar backup e resetar progresso
- Tudo fica salvo no `localStorage` do navegador (nada vai para servidor nenhum)

Feito com Vite, React, TypeScript, Tailwind CSS e Framer Motion.

---

## Como rodar no seu computador

Pré-requisito: [Node.js](https://nodejs.org/) 20.12 ou mais novo (recomendado: 22).

```bash
npm install      # instala as dependências (só na primeira vez)
npm run dev      # abre em http://localhost:5173/maratona-marvel/
```

Outros comandos úteis:

| Comando            | O que faz                                          |
| ------------------ | -------------------------------------------------- |
| `npm run build`    | Verifica os tipos e gera a versão final em `dist/` |
| `npm run preview`  | Mostra localmente a versão gerada pelo build       |
| `npm run lint`     | Procura problemas no código                        |
| `npm run format`   | Formata o código com o Prettier                    |
| `npm run catalogo` | Regenera os dados do TMDB (veja abaixo)            |

---

## Dados do TMDB (pôsteres, sinopses, trailers, episódios)

O site publicado **não** acessa o TMDB: ele só lê o arquivo [`src/data/catalogo.json`](src/data/catalogo.json),
que é gerado por um script rodado no seu computador. Assim a sua chave nunca fica exposta.

### Gerar ou atualizar o catálogo

1. Crie uma conta em [themoviedb.org](https://www.themoviedb.org/) e pegue sua chave em
   **Configurações → API**. Serve a "Chave da API" (v3) ou o "Token de Leitura da API" (v4, começa com `eyJ`).
2. Na raiz do projeto, copie o arquivo de exemplo e cole a chave:

   ```bash
   cp .env.example .env
   # edite o .env:  TMDB_API_KEY=sua_chave_aqui
   ```

   O `.env` está no `.gitignore`, então **não** vai para o GitHub.

3. Rode o script:

   ```bash
   npm run catalogo
   ```

   Ele busca, para cada item: título original, duração, sinopse em PT-BR, pôster, imagem de fundo,
   trailer no YouTube (prioridade: dublado/legendado em PT-BR; se não houver, o oficial em inglês),
   episódios por temporada (séries) e onde assistir no Brasil. Avisos aparecem no terminal se algo
   estiver faltando (ex.: um filme sem trailer, ou um ano diferente do esperado).

4. Confira no `npm run dev` e faça commit do `src/data/catalogo.json` atualizado.

> Sem chave, `npm run catalogo -- --sem-tmdb` gera um catálogo provisório (sem pôsteres nem trailers),
> só com os dados escritos em `scripts/lista.mjs`.

### Mudar a lista

A ordem, os títulos em português e os IDs do TMDB ficam em [`scripts/lista.mjs`](scripts/lista.mjs).
Depois de editar, rode `npm run catalogo` de novo. **Não mude o campo `id`** de um item já publicado:
é ele que liga o item ao seu progresso salvo.

### "Onde assistir"

O script preenche com a sugestão do TMDB/JustWatch para o Brasil. Como isso muda com o tempo, dá para
editar direto no site (painel de detalhes → **Onde assistir → Editar**). A sua edição fica salva no
navegador e vale mais que a sugestão; o botão "Restaurar sugestão do TMDB" volta ao automático.

---

## Publicar no GitHub Pages

O repositório já tem o workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), que roda o
lint, faz o build e publica o site **a cada push na branch `main`**.

Passo a passo (só na primeira vez):

1. Coloque o código na branch `main` do repositório `maratona-marvel` (por exemplo, fazendo o merge do pull request).
2. No GitHub, abra o repositório → **Settings → Pages**.
3. Em **Build and deployment → Source**, escolha **GitHub Actions**.
4. Vá em **Actions**, abra "Publicar no GitHub Pages" e clique em **Run workflow** (ou faça qualquer push na `main`).
5. Quando ficar verde, o site estará em **https://SEU-USUARIO.github.io/maratona-marvel/**.

Depois disso, todo push na `main` publica automaticamente.

**Se o repositório tiver outro nome**, troque `base: '/maratona-marvel/'` em [`vite.config.ts`](vite.config.ts) pelo
novo nome, e ajuste as URLs `og:url`/`og:image` em [`index.html`](index.html) (elas precisam ser absolutas para
a prévia de link funcionar no WhatsApp, Discord etc.).

---

## Seus dados

- O progresso fica no `localStorage`, na chave `maratona-marvel:progresso`. Ele é **por navegador**: no
  celular e no computador são progressos separados. Use **Backup → Exportar** num e **Importar** no outro.
- O formato salvo tem um número de versão. Se ele mudar no futuro, os dados antigos (e backups antigos)
  são convertidos automaticamente (veja `src/lib/armazenamento.ts`).
- Limpar os dados do navegador apaga o progresso, então exporte um backup de vez em quando.

## Estrutura

```
scripts/
  lista.mjs              ordem da maratona, títulos e IDs do TMDB
  gerar-catalogo.mjs     script que gera src/data/catalogo.json
src/
  components/            Hero, Timeline, cards, painel de detalhes, modais…
  hooks/                 contagem, estatísticas, salvamento automático
  lib/                   catálogo, formatação, armazenamento/backup, serviços de streaming
  state/                 progresso (reducer + contexto) e contexto da interface
  data/catalogo.json     dados gerados (não edite à mão)
public/                  favicon, ícones e imagem de compartilhamento (og.png)
```

## Créditos

Este produto usa a API do TMDB, mas não é endossado nem certificado pelo [TMDB](https://www.themoviedb.org/).
Dados de "onde assistir" fornecidos pela [JustWatch](https://www.justwatch.com/br).
Marvel e personagens relacionados são marcas de seus respectivos donos. Projeto de fã, sem fins lucrativos.
