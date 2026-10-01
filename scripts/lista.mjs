// Lista oficial da maratona, na ordem cronológica escolhida.
// - `id` é a chave estável usada no localStorage (não mude depois de publicar).
// - `titulo` é o título oficial em português exibido no site.
// - `tmdbId` aponta para o item no TMDB; `ano` serve para conferir se o ID está certo.
// - Os campos `provisorio` só são usados quando o catálogo é gerado sem acesso ao TMDB.

export const LISTA = [
  {
    id: 'x-men-2000',
    tmdbId: 36657,
    tipo: 'filme',
    titulo: 'X-Men: O Filme',
    tituloOriginal: 'X-Men',
    ano: 2000,
    provisorio: {
      duracao: 104,
      sinopse:
        'Em um mundo que teme e odeia os mutantes, Wolverine e a jovem Vampira se juntam aos X-Men do Professor Xavier para impedir que Magneto ataque líderes mundiais.',
    },
  },
  {
    id: 'x-men-2-2003',
    tmdbId: 36658,
    tipo: 'filme',
    titulo: 'X-Men 2',
    tituloOriginal: 'X2',
    ano: 2003,
    provisorio: {
      duracao: 134,
      sinopse:
        'Depois de um ataque à Casa Branca, o militar William Stryker lança uma ofensiva contra os mutantes, forçando os X-Men a se aliarem a Magneto.',
    },
  },
  {
    id: 'capitao-america-primeiro-vingador-2011',
    tmdbId: 1771,
    tipo: 'filme',
    titulo: 'Capitão América: O Primeiro Vingador',
    tituloOriginal: 'Captain America: The First Avenger',
    ano: 2011,
    provisorio: {
      duracao: 124,
      sinopse:
        'Durante a Segunda Guerra, o franzino Steve Rogers recebe o soro do supersoldado e se torna o Capitão América para enfrentar o Caveira Vermelha e a HIDRA.',
    },
  },
  {
    id: 'homem-de-ferro-2008',
    tmdbId: 1726,
    tipo: 'filme',
    titulo: 'Homem de Ferro',
    tituloOriginal: 'Iron Man',
    ano: 2008,
    provisorio: {
      duracao: 126,
      sinopse:
        'Sequestrado no Afeganistão, o bilionário Tony Stark constrói uma armadura para escapar e decide usar sua tecnologia para proteger o mundo.',
    },
  },
  {
    id: 'homem-de-ferro-2-2010',
    tmdbId: 10138,
    tipo: 'filme',
    titulo: 'Homem de Ferro 2',
    tituloOriginal: 'Iron Man 2',
    ano: 2010,
    provisorio: {
      duracao: 124,
      sinopse:
        'Com a identidade revelada, Tony Stark enfrenta a pressão do governo, a doença causada pelo próprio reator e o vingativo Ivan Vanko.',
    },
  },
  {
    id: 'incrivel-hulk-2008',
    tmdbId: 1724,
    tipo: 'filme',
    titulo: 'O Incrível Hulk',
    tituloOriginal: 'The Incredible Hulk',
    ano: 2008,
    provisorio: {
      duracao: 112,
      sinopse:
        'Foragido, Bruce Banner busca uma cura para a fúria que o transforma no Hulk enquanto o Exército e o soldado Emil Blonsky o perseguem.',
    },
  },
  {
    id: 'thor-2011',
    tmdbId: 10195,
    tipo: 'filme',
    titulo: 'Thor',
    tituloOriginal: 'Thor',
    ano: 2011,
    provisorio: {
      duracao: 115,
      sinopse:
        'Banido de Asgard por sua arrogância, Thor cai na Terra sem seus poderes e precisa provar que é digno enquanto Loki trama pelo trono.',
    },
  },
  {
    id: 'vingadores-2012',
    tmdbId: 24428,
    tipo: 'filme',
    titulo: 'Os Vingadores',
    tituloOriginal: 'The Avengers',
    ano: 2012,
    provisorio: {
      duracao: 143,
      sinopse:
        'Nick Fury reúne Homem de Ferro, Capitão América, Thor, Hulk, Viúva Negra e Gavião Arqueiro para deter Loki e uma invasão alienígena em Nova York.',
    },
  },
  {
    id: 'capitao-america-soldado-invernal-2014',
    tmdbId: 100402,
    tipo: 'filme',
    titulo: 'Capitão América 2: O Soldado Invernal',
    tituloOriginal: 'Captain America: The Winter Soldier',
    ano: 2014,
    provisorio: {
      duracao: 136,
      sinopse:
        'Steve Rogers descobre uma conspiração dentro da S.H.I.E.L.D. e enfrenta um assassino misterioso ligado ao seu passado: o Soldado Invernal.',
    },
  },
  {
    id: 'guardioes-da-galaxia-2014',
    tmdbId: 118340,
    tipo: 'filme',
    titulo: 'Guardiões da Galáxia',
    tituloOriginal: 'Guardians of the Galaxy',
    ano: 2014,
    provisorio: {
      duracao: 121,
      sinopse:
        'O aventureiro Peter Quill rouba um orbe cobiçado e acaba formando uma equipe improvável de foras da lei para salvar a galáxia de Ronan.',
    },
  },
  {
    id: 'vingadores-era-de-ultron-2015',
    tmdbId: 99861,
    tipo: 'filme',
    titulo: 'Vingadores: Era de Ultron',
    tituloOriginal: 'Avengers: Age of Ultron',
    ano: 2015,
    provisorio: {
      duracao: 141,
      sinopse: 'Tony Stark cria uma inteligência artificial de defesa, mas Ultron conclui que a paz exige a extinção da humanidade.',
    },
  },
  {
    id: 'capitao-america-guerra-civil-2016',
    tmdbId: 271110,
    tipo: 'filme',
    titulo: 'Capitão América: Guerra Civil',
    tituloOriginal: 'Captain America: Civil War',
    ano: 2016,
    provisorio: {
      duracao: 147,
      sinopse: 'Um acordo da ONU para supervisionar os heróis divide os Vingadores entre o Capitão América e o Homem de Ferro.',
    },
  },
  {
    id: 'viuva-negra-2021',
    tmdbId: 497698,
    tipo: 'filme',
    titulo: 'Viúva Negra',
    tituloOriginal: 'Black Widow',
    ano: 2021,
    provisorio: {
      duracao: 134,
      sinopse:
        'Foragida após a Guerra Civil, Natasha Romanoff confronta seu passado e a família que deixou para trás no programa da Sala Vermelha.',
    },
  },
  {
    id: 'pantera-negra-2018',
    tmdbId: 284054,
    tipo: 'filme',
    titulo: 'Pantera Negra',
    tituloOriginal: 'Black Panther',
    ano: 2018,
    provisorio: {
      duracao: 134,
      sinopse: 'T’Challa volta a Wakanda para assumir o trono, mas um desafiante inesperado coloca em risco o reino e o mundo.',
    },
  },
  {
    id: 'homem-aranha-de-volta-ao-lar-2017',
    tmdbId: 315635,
    tipo: 'filme',
    titulo: 'Homem-Aranha: De Volta ao Lar',
    tituloOriginal: 'Spider-Man: Homecoming',
    ano: 2017,
    provisorio: {
      duracao: 133,
      sinopse:
        'Depois de lutar ao lado dos Vingadores, Peter Parker tenta equilibrar a escola e a vida de herói enquanto enfrenta o Abutre.',
    },
  },
  {
    id: 'doutor-estranho-2016',
    tmdbId: 284052,
    tipo: 'filme',
    titulo: 'Doutor Estranho',
    tituloOriginal: 'Doctor Strange',
    ano: 2016,
    provisorio: {
      duracao: 115,
      sinopse:
        'Após um acidente destruir suas mãos, o neurocirurgião Stephen Strange busca a cura no Nepal e descobre o mundo das artes místicas.',
    },
  },
  {
    id: 'thor-ragnarok-2017',
    tmdbId: 284053,
    tipo: 'filme',
    titulo: 'Thor: Ragnarok',
    tituloOriginal: 'Thor: Ragnarok',
    ano: 2017,
    provisorio: {
      duracao: 130,
      sinopse:
        'Preso num planeta distante e sem o martelo, Thor precisa escapar de uma arena de gladiadores e voltar a tempo de impedir que Hela destrua Asgard.',
    },
  },
  {
    id: 'vingadores-guerra-infinita-2018',
    tmdbId: 299536,
    tipo: 'filme',
    titulo: 'Vingadores: Guerra Infinita',
    tituloOriginal: 'Avengers: Infinity War',
    ano: 2018,
    provisorio: {
      duracao: 149,
      sinopse:
        'Os Vingadores e seus aliados precisam impedir Thanos de reunir as seis Joias do Infinito e eliminar metade de toda a vida no universo.',
    },
  },
  {
    id: 'vingadores-ultimato-2019',
    tmdbId: 299534,
    tipo: 'filme',
    titulo: 'Vingadores: Ultimato',
    tituloOriginal: 'Avengers: Endgame',
    ano: 2019,
    provisorio: {
      duracao: 181,
      sinopse: 'Após o estalo de Thanos, os Vingadores que restaram se reúnem uma última vez para tentar desfazer a tragédia.',
    },
  },
  {
    id: 'loki',
    tmdbId: 84958,
    tipo: 'serie',
    titulo: 'Loki',
    tituloOriginal: 'Loki',
    ano: 2021,
    temporadas: [1, 2],
    tituloExibicao: 'Loki – Temporadas 1 e 2',
    provisorio: {
      episodios: { 1: 6, 2: 6 },
      duracaoEpisodio: 50,
      sinopse:
        'Capturado pela Autoridade de Variância Temporal após fugir com o Tesseract, Loki é recrutado para caçar uma variante perigosa de si mesmo e acaba diante do destino de toda a linha do tempo.',
    },
  },
  {
    id: 'wandavision',
    tmdbId: 85271,
    tipo: 'serie',
    titulo: 'WandaVision',
    tituloOriginal: 'WandaVision',
    ano: 2021,
    temporadas: [1],
    provisorio: {
      episodios: { 1: 9 },
      duracaoEpisodio: 35,
      sinopse: 'Wanda Maximoff e Visão levam uma vida perfeita de sitcom no subúrbio de Westview, até que a realidade começa a rachar.',
    },
  },
  {
    id: 'falcao-e-o-soldado-invernal',
    tmdbId: 88396,
    tipo: 'serie',
    titulo: 'Falcão e o Soldado Invernal',
    tituloOriginal: 'The Falcon and the Winter Soldier',
    ano: 2021,
    temporadas: [1],
    provisorio: {
      episodios: { 1: 6 },
      duracaoEpisodio: 50,
      sinopse: 'Sam Wilson e Bucky Barnes se unem para enfrentar os Apátridas enquanto lidam com o legado do escudo do Capitão América.',
    },
  },
  {
    id: 'shang-chi-2021',
    tmdbId: 566525,
    tipo: 'filme',
    titulo: 'Shang-Chi e a Lenda dos Dez Anéis',
    tituloOriginal: 'Shang-Chi and the Legend of the Ten Rings',
    ano: 2021,
    provisorio: {
      duracao: 132,
      sinopse:
        'Shang-Chi precisa confrontar o passado que tentou deixar para trás quando é atraído para a organização dos Dez Anéis, comandada pelo próprio pai.',
    },
  },
  {
    id: 'homem-aranha-sem-volta-para-casa-2021',
    tmdbId: 634649,
    tipo: 'filme',
    titulo: 'Homem-Aranha: Sem Volta Para Casa',
    tituloOriginal: 'Spider-Man: No Way Home',
    ano: 2021,
    provisorio: {
      duracao: 148,
      sinopse:
        'Com a identidade revelada, Peter Parker pede ajuda ao Doutor Estranho, mas um feitiço mal executado abre as portas do multiverso.',
    },
  },
  {
    id: 'doutor-estranho-multiverso-da-loucura-2022',
    tmdbId: 453395,
    tipo: 'filme',
    titulo: 'Doutor Estranho no Multiverso da Loucura',
    tituloOriginal: 'Doctor Strange in the Multiverse of Madness',
    ano: 2022,
    provisorio: {
      duracao: 126,
      sinopse: 'Doutor Estranho protege uma jovem capaz de viajar entre universos e enfrenta uma ameaça que ele conhece muito bem.',
    },
  },
  {
    id: 'thor-amor-e-trovao-2022',
    tmdbId: 616037,
    tipo: 'filme',
    titulo: 'Thor: Amor e Trovão',
    tituloOriginal: 'Thor: Love and Thunder',
    ano: 2022,
    provisorio: {
      duracao: 119,
      sinopse:
        'Thor interrompe a busca por paz interior para enfrentar Gorr, o Carniceiro dos Deuses, ao lado de Valquíria, Korg e Jane Foster, agora a Poderosa Thor.',
    },
  },
  {
    id: 'pantera-negra-wakanda-para-sempre-2022',
    tmdbId: 505642,
    tipo: 'filme',
    titulo: 'Pantera Negra: Wakanda Para Sempre',
    tituloOriginal: 'Black Panther: Wakanda Forever',
    ano: 2022,
    provisorio: {
      duracao: 161,
      sinopse:
        'Após a morte do rei T’Challa, Wakanda precisa se proteger das potências mundiais e de Namor, governante do reino submarino de Talokan.',
    },
  },
  {
    id: 'homem-formiga-vespa-quantumania-2023',
    tmdbId: 640146,
    tipo: 'filme',
    titulo: 'Homem-Formiga e a Vespa: Quantumania',
    tituloOriginal: 'Ant-Man and the Wasp: Quantumania',
    ano: 2023,
    provisorio: {
      duracao: 125,
      sinopse: 'Scott Lang, Hope van Dyne e a família são sugados para o Reino Quântico, onde enfrentam Kang, o Conquistador.',
    },
  },
  {
    id: 'deadpool-e-wolverine-2024',
    tmdbId: 533535,
    tipo: 'filme',
    titulo: 'Deadpool & Wolverine',
    tituloOriginal: 'Deadpool & Wolverine',
    ano: 2024,
    provisorio: {
      duracao: 128,
      sinopse: 'Recrutado pela AVT, Deadpool precisa salvar o próprio universo e acaba se aliando a uma variante relutante do Wolverine.',
    },
  },
  {
    id: 'capitao-america-admiravel-mundo-novo-2025',
    tmdbId: 822119,
    tipo: 'filme',
    titulo: 'Capitão América: Admirável Mundo Novo',
    tituloOriginal: 'Captain America: Brave New World',
    ano: 2025,
    provisorio: {
      duracao: 118,
      sinopse:
        'Sam Wilson, agora o Capitão América, se vê no centro de uma conspiração internacional após um encontro com o presidente Thaddeus Ross.',
    },
  },
  {
    id: 'thunderbolts-2025',
    tmdbId: 986056,
    tipo: 'filme',
    titulo: 'Thunderbolts*',
    tituloOriginal: 'Thunderbolts*',
    ano: 2025,
    provisorio: {
      duracao: 127,
      sinopse: 'Yelena Belova e um grupo de anti-heróis desajustados caem numa armadilha e precisam trabalhar juntos numa missão perigosa.',
    },
  },
  {
    id: 'homem-aranha-um-novo-dia-2026',
    tmdbId: 969681,
    tipo: 'filme',
    titulo: 'Homem-Aranha: Um Novo Dia',
    tituloOriginal: 'Spider-Man: Brand New Day',
    ano: 2026,
    provisorio: {
      duracao: null,
      sinopse: 'Depois que o mundo esqueceu quem ele é, Peter Parker segue sozinho como o Homem-Aranha em Nova York.',
    },
  },
  {
    id: 'quarteto-fantastico-primeiros-passos-2025',
    tmdbId: 617126,
    tipo: 'filme',
    titulo: 'Quarteto Fantástico: Primeiros Passos',
    tituloOriginal: 'The Fantastic Four: First Steps',
    ano: 2025,
    provisorio: {
      duracao: 115,
      sinopse:
        'Num mundo retrofuturista inspirado nos anos 1960, o Quarteto Fantástico precisa defender a Terra de Galactus e da Surfista Prateada.',
    },
  },
]

// Card final: o "destino" da maratona.
export const DESTINO = {
  id: 'vingadores-doomsday-2026',
  tmdbId: 1003596,
  tipo: 'filme',
  titulo: 'Vingadores: Doomsday',
  tituloOriginal: 'Avengers: Doomsday',
  ano: 2026,
  estreia: '2026-12-18',
  // Sessão pessoal: 16/12/2026 às 20:45, horário de Brasília (UTC−3, sem horário de verão).
  sessao: '2026-12-16T20:45:00-03:00',
  provisorio: {
    duracao: null,
    sinopse: 'Vingadores, X-Men e outros heróis se unem diante da maior ameaça que já enfrentaram: o Doutor Destino.',
  },
}
