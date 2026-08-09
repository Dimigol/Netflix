import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Content from '../models/Content.js';

dotenv.config();

const DEFAULT_YOUTUBE_URL = 'https://www.youtube.com/watch?v=7RUA0IOfar8';
const DEFAULT_YOUTUBE_ID = '7RUA0IOfar8';
const FALLBACK_YOUTUBE_URLS = [
  'https://www.youtube.com/watch?v=qIYyXcCwvKc',
  'https://www.youtube.com/watch?v=cXg62-t8BWs',
  'https://www.youtube.com/watch?v=zckJCxYxn1g',
  'https://www.youtube.com/watch?v=SaHZHU-44XA',
  'https://www.youtube.com/watch?v=HhesaQXLuRY',
  'https://www.youtube.com/watch?v=oVzVdvGIC7U',
  'https://www.youtube.com/watch?v=JWtnJjn6ng0',
  'https://www.youtube.com/watch?v=tNcDHWpselE',
  'https://www.youtube.com/watch?v=faJAT35j5Ss',
  'https://www.youtube.com/watch?v=SS6ABPkfmBE',
  'https://www.youtube.com/watch?v=5llvd1Uu-iU',
  'https://www.youtube.com/watch?v=wmiIUN-7qhE',
  'https://www.youtube.com/watch?v=V6wWKNij_1M',
  'https://www.youtube.com/watch?v=tiVNk6_0GdY',
  'https://www.youtube.com/watch?v=bLvqoHBptjg',
  'https://www.youtube.com/watch?v=sY1S34973zA',
  'https://www.youtube.com/watch?v=vKQi3bBA1y8',
  'https://www.youtube.com/watch?v=gCcx85zbxz4',
  'https://www.youtube.com/watch?v=C0BMx-qxsP4',
  'https://www.youtube.com/watch?v=EXeTwQWrcwY'
];
const BROKEN_YOUTUBE_IDS = new Set([
  'zSID6l0v0A0',
  '8zc8AgHUk-8',
  'n9xhJsXlVc0',
  '8ugrtQSXFOM',
  'b9ncK3X7kAw',
  'T7eY-NNkHLc',
  '0tPAGqI0ae0',
  'PKFxCpqwnFQ',
  'gwktIsnNi6E',
  'F6P_v3XKc9E',
  's7EdQ4FqJDE',
  'CHalMy3OL-U',
  'M9qg8k0ZvQo',
  '0G-lbJbYNCk',
  '_nLAzRY3F0c',
  'WDkg3h8PHMU',
  'xjDODtChtcE',
  'uYPbbksJxIE',
  'hZJYeoPRXNQ',
  '0Z0yulnAzj0',
  'K87FpiP1H1w',
  'Ki8jJnY9z88',
  'TWT-AcvS74c',
  'TykMhC6OfBk',
  'qSqQvBTC3lA',
  '0bBPJR0CbpA',
  'Z1BCujX3wME',
  'S2yrjudt0m8',
  '7z_9LLWFLug',
  'qeW5fZ4Z3qM',
  'k9aVkJg0gZE',
  'XYGzRB4Pnq8',
  '5eV6uF72Z5M'
]);

function getYouTubeId(url = '') {
  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.searchParams.has('v')) {
      return parsedUrl.searchParams.get('v') || DEFAULT_YOUTUBE_ID;
    }

    const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
    return pathParts.at(-1) || DEFAULT_YOUTUBE_ID;
  } catch {
    return DEFAULT_YOUTUBE_ID;
  }
}

function hashString(value = '') {
  return Array.from(value).reduce((acc, char) => ((acc * 31) + char.charCodeAt(0)) >>> 0, 0);
}

function getFallbackYouTubeUrl(content = {}) {
  const seed = `${content.title || ''}:${content.category || ''}`;
  return FALLBACK_YOUTUBE_URLS[hashString(seed) % FALLBACK_YOUTUBE_URLS.length] || DEFAULT_YOUTUBE_URL;
}

function withSafeMedia(content) {
  const videoId = getYouTubeId(content.youtubeUrl);
  const youtubeUrl = BROKEN_YOUTUBE_IDS.has(videoId) ? getFallbackYouTubeUrl(content) : (content.youtubeUrl || getFallbackYouTubeUrl(content));
  const safeVideoId = getYouTubeId(youtubeUrl);

  return {
    ...content,
    youtubeUrl,
    image: `https://i.ytimg.com/vi/${safeVideoId}/hqdefault.jpg`
  };
}

const seedData = [
  // Épicos & Ação
  { title: "Star Wars: Episódio III - A Vingança dos Sith", category: "Épicos", genres: ["Ficção Científica", "Ação", "Drama"], image: "https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/3a3c6316-74c2-436b-ac94-9ca61e1e555c/compose?aspectRatio=1.78&format=webp&width=1200", youtubeUrl: "https://www.youtube.com/watch?v=qIYyXcCwvKc", description: "Anakin Skywalker enfrenta seu destino sombrio.", rating: 8.2, year: 2005, duration: 140, badge: "Clássico" },
  { title: "Gladiador", category: "Épicos", genres: ["Ação", "Drama", "História"], image: "https://aventurasnahistoria.com.br/wp-content/uploads/entretenimento/gladiador_2_VvnGVes.jpg", youtubeUrl: "https://www.youtube.com/watch?v=cXg62-t8BWs", description: "Um escravo lutador busca vingança contra o império romano.", rating: 8.5, year: 2000, duration: 155 },
  { title: "O Senhor dos Anéis: O Retorno do Rei", category: "Épicos", genres: ["Fantasia", "Aventura", "Drama"], image: "https://i.ytimg.com/vi/OQgySPQ5M3Y/maxresdefault.jpg", youtubeUrl: "https://www.youtube.com/watch?v=zckJCxYxn1g", description: "A jornada final para destruir o Um Anel.", rating: 9.0, year: 2003, duration: 201 },
  { title: "O Poderoso Chefão", category: "Épicos", genres: ["Drama", "Crime"], image: "https://br.web.img3.acsta.net/medias/nmedia/18/90/93/20/20120876.jpg", youtubeUrl: "https://www.youtube.com/watch?v=SaHZHU-44XA", description: "A saga da família mafiosa Corleone.", rating: 9.2, year: 1972, duration: 175 },
  { title: "Interstellar", category: "Épicos", genres: ["Ficção Científica", "Drama", "Aventura"], image: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDctMDEwOC00MGY4LWJlNmMtODg0YTMxOTk0NzA1XkEyXkFqcGdeQWpybA@@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=zSID6l0v0A0", description: "Uma missão para salvar a humanidade através de um buraco de minhoca.", rating: 8.6, year: 2014, duration: 169 },
  { title: "Inception", category: "Épicos", genres: ["Ficção Científica", "Ação", "Thriller"], image: "https://m.media-amazon.com/images/M/MV5BMjAxMzc5ZDctMDAxOS00MjM1LWFjNzUtNDQyMjZjNTA0ODE0XkEyXkFqcGdeQWpybA@@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=8zc8AgHUk-8", description: "Um ladrão entra nos sonhos para roubar segredos.", rating: 8.8, year: 2010, duration: 148 },
  { title: "Dune", category: "Épicos", genres: ["Ficção Científica", "Aventura", "Drama"], image: "https://m.media-amazon.com/images/M/MV5BN2FjNmVhZDctMTBkMS00YmQ1LWI2YTItYTE0YjJjODFkZGU5XkEyXkFqcGdeQWpybA@@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=n9xhJsXlVc0", description: "Uma jornada épica em um deserto de areia dourada.", rating: 8.0, year: 2021, duration: 156 },
  { title: "Homem de Ferro", category: "Épicos", genres: ["Ação", "Ficção Científica", "Aventura"], image: "https://m.media-amazon.com/images/M/MV5BMTczNTI2ODUzOF5BMl5BanBnXkFtZTcwMTU0NTc3MQ@@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=8ugrtQSXFOM", description: "Um bilionário cria um traje para se tornar um super-herói.", rating: 7.9, year: 2008, duration: 126 },

  // Séries
  { title: "Breaking Bad", category: "Séries", genres: ["Drama", "Crime", "Suspense"], image: "https://m.media-amazon.com/images/M/MV5BMTJiMzgwZTktYzZhZC00YzhhLWEzZDUtMGM2NTE4MzQ4NGFmXkEyXkFqcGdeQWpybA@@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=HhesaQXLuRY", description: "Um professor de química se torna traficante de drogas.", rating: 9.5, year: 2008, duration: 47, badge: "Nova temporada" },
  { title: "Peaky Blinders", category: "Séries", genres: ["Drama", "Crime", "História"], image: "https://occ-0-8407-2219.1.nflxso.net/dnm/api/v6/9pS1daC2n6UGc3dUogvWIPMR_OU/AAAABbgHMvtVm3Ke1fw6X9_bWYdEO9IEdJeXmL9E78relsKg1E8llap5ilrA89xMAQYm4yBYUQtHs9Zv3jXRXCFH59efTj72hrZu8WHm.jpg?r=21d", youtubeUrl: "https://www.youtube.com/watch?v=oVzVdvGIC7U", description: "Uma gangue de Birmingham pós-guerra alcança poder.", rating: 8.8, year: 2013, duration: 60 },
  { title: "The Crown", category: "Séries", genres: ["Drama", "História", "Biografia"], image: "https://m.media-amazon.com/images/M/MV5BY2IzNGFkYTEtYTEwNC00YjAxLWI4ZDItYTA4ZWFmMWE0YTkxXkEyXkFqcGdeQWpybA@@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=JWtnJjn6ng0", description: "A vida da Rainha Elizabeth II ao longo dos décadas.", rating: 8.6, year: 2016, duration: 60 },
  { title: "Stranger Things", category: "Séries", genres: ["Drama", "Ficção Científica", "Horror"], image: "https://m.media-amazon.com/images/M/MV5BMDc5YjBmNTUtMmY1MC00MDNjLWFkNDAtYWY4MGIwNjMyMTdjXkEyXkFqcGdeQWpybA@@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=b9ncK3X7kAw", description: "Mistérios sobrenaturais em uma cidade dos anos 80.", rating: 8.7, year: 2016, duration: 50 },
  { title: "Game of Thrones", category: "Séries", genres: ["Drama", "Fantasia", "Aventura"], image: "https://m.media-amazon.com/images/M/MV5BN2IzYzBiOTQtNGZmMy00NDkxLTk3ODAtNmU1ZjIyMTAyNWVjXkEyXkFqcGdeQWpybA@@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=KPLWWIOCOOQ", description: "Lutas pelo trono em um mundo fantástico.", rating: 9.2, year: 2011, duration: 57 },
  { title: "The Office", category: "Séries", genres: ["Comédia", "Drama"], image: "https://m.media-amazon.com/images/M/MV5BNThhNzlmZWItMWQ1Yy00NTAyLTlmNDctMDc2YWZlZDhhN2JkXkEyXkFqcGdeQWpybA@@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=tNcDHWpselE", description: "Humor de escritório em uma empresa de papel.", rating: 9.0, year: 2005, duration: 22 },

  // Comédia
  { title: "Brooklyn Nine-Nine", category: "Comédia", genres: ["Comédia", "Crime"], image: "https://m.media-amazon.com/images/M/MV5BYmMxZWQwMzItMGU4Ni00YTIyLWFjZjItNjAwYTkyNzUwNTkyXkEyXkFqcGdeQWpybA@@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=faJAT35j5Ss", description: "Polícia de Nova York enfrentando crimes com humor.", rating: 8.4, year: 2013, duration: 22 },
  { title: "The Good Place", category: "Comédia", genres: ["Comédia", "Drama", "Ficção Científica"], image: "https://m.media-amazon.com/images/M/MV5BY2YwZGU5MDAtNTAxNC00ZjMzLTk1ZTktNDhhMWU0YzMyMDI4XkEyXkFqcGdeQWpybA@@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=T7eY-NNkHLc", description: "Uma mulher acorda no paraíso (ou não).", rating: 8.2, year: 2016, duration: 30 },
  { title: "Schitt's Creek", category: "Comédia", genres: ["Comédia", "Drama"], image: "https://m.media-amazon.com/images/M/MV5BOTk0Zjc0MWUtYWZkMS00OTY3LWFkZTQtNjE0ZTNlZmQ0YTg3XkEyXkFqcGdeQWpybA@@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=0tPAGqI0ae0", description: "Família rica perde tudo e muda para uma cidade pequena.", rating: 8.6, year: 2015, duration: 24 },

  // Animação & Fantasia
  { title: "Homem-Aranha: Além do Aranhaverso", category: "Animação", genres: ["Animação", "Ação", "Ficção Científica"], image: "https://m.media-amazon.com/images/M/MV5BYzcyNzI1NzUtOWY2Ny00N2VmLWE4NmItMDllYTI1ZTEwYjdhXkEyXkFqcGdeQWpybA@@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=SS6ABPkfmBE", description: "Miles Morales viaja entre universos.", rating: 8.2, year: 2023, duration: 140 },
  { title: "Avatar: A Lenda de Aang", category: "Animação", genres: ["Animação", "Fantasia", "Aventura"], image: "https://m.media-amazon.com/images/M/MV5BOTZkYjc5MWItOWM0ZC00YTc4LWFjMjktYTg0MjcwYTg5MDQwXkEyXkFqcGdeQWpybA@@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=5llvd1Uu-iU", description: "Um herói com poderes elementares salva o mundo.", rating: 9.2, year: 2005, duration: 24 },
  { title: "Toy Story", category: "Animação", genres: ["Animação", "Aventura", "Comédia"], image: "https://m.media-amazon.com/images/M/MV5BNjc3NTYyMDUwMS00YTkyLTgwZDgtYTZlNGM5YjhjOGY0XkEyXkFqcGdeQWpybA@@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=wmiIUN-7qhE", description: "Brinquedos ganham vida quando ninguém vê.", rating: 8.3, year: 1995, duration: 81 },
  { title: "Up - Altas Aventuras", category: "Animação", genres: ["Animação", "Aventura", "Comédia"], image: "https://m.media-amazon.com/images/M/MV5BMTZkZWIyNDYtNTdlYi00NmQ5LWJjNGYtYTZmZjE5YjZmYzZhXkEyXkFqcGdeQWpybA@@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=PKFxCpqwnFQ", description: "Um velho e um menino voam em uma casa para o Paraíso.", rating: 8.3, year: 2009, duration: 96 },

  // Suspense & Horror
  { title: "Shining", category: "Suspense", genres: ["Horror", "Suspense", "Drama"], image: "https://m.media-amazon.com/images/M/MV5BZDRlMWU3OWYtZDYxZC00YzU0LWE1OTEtYzVlNDZjYjI1N2E3XkEyXkFqcGdeQWpybA@@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=gwktIsnNi6E", description: "Um homem enlouquece em um hotel assombrado.", rating: 8.4, year: 1980, duration: 146 },
  { title: "Hereditário", category: "Suspense", genres: ["Horror", "Drama", "Suspense"], image: "https://m.media-amazon.com/images/M/MV5BOTU5MDg3OGUtZWQwZC00N2MyLTg3YTEtMjc4MzI1MDAyNWE4XkEyXkFqcGdeQWpybA@@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=V6wWKNij_1M", description: "Uma família sofre com eventos sobrenaturais aterradores.", rating: 7.8, year: 2018, duration: 127 },

  // Documentário
  { title: "Planet Earth", category: "Documentários", genres: ["Documentário", "Natureza"], image: "https://m.media-amazon.com/images/M/MV5BYjdjYTFmZjItOTYyYS00MzY4LThhOTAtYzkyN2MyYTM2ZGE3XkEyXkFqcGdeQWpybA@@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=tiVNk6_0GdY", description: "Exploração visual dos ecossistemas da Terra.", rating: 9.4, year: 2016, duration: 50 },
  { title: "Cristiano Ronaldo: O Fenômeno", category: "Documentários", genres: ["Documentário", "Esporte", "Biografia"], image: "https://m.media-amazon.com/images/M/MV5BODMxZTMyYTktZmY1OC00MTIyLWJkZGEtNTA2ZjY1MGQ4ZWQ1XkEyXkFqcGdeQWpybA@@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=QY58-tsYPVA", description: "A história de vida do maior jogador de futebol.", rating: 7.5, year: 2017, duration: 90 },
  { title: "The Last Dance", category: "Documentários", genres: ["Documentário", "Esporte", "Biografia"], image: "https://m.media-amazon.com/images/M/MV5BYzAxZDQzOTEtMjM2ZC00MzMyLTg5Y2EtYWI1M2U3MjhjNDE5XkEyXkFqcGdeQWpybA@@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=F6P_v3XKc9E", description: "A última temporada de Michael Jordan e o Chicago Bulls.", rating: 8.5, year: 2020, duration: 50 },

  // Drama
  { title: "Pulp Fiction", category: "Drama", genres: ["Drama", "Crime", "Thriller"], image: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItMDA0N2ZhZWE0NzA4XkEyXkFqcGdeQWpybA@@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=s7EdQ4FqJDE", description: "Histórias entrelaçadas de LA cruzam a noite.", rating: 8.9, year: 1994, duration: 154 },
  { title: "Forrest Gump", category: "Drama", genres: ["Drama", "Comédia", "Biografia"], image: "https://m.media-amazon.com/images/M/MV5BNWIwODRlYTAtY2Q0MS00Mzc4LWJkYmUtMzM2MzU2ZDU0NjZlXkEyXkFqcGdeQWpybA@@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=bLvqoHBptjg", description: "Um homem simples vive uma vida extraordinária.", rating: 8.8, year: 1994, duration: 142 },
  { title: "A Lista de Schindler", category: "Drama", genres: ["Drama", "História", "Biografia"], image: "https://m.media-amazon.com/images/M/MV5BNDE4OTczNzc5NV5BMl5BanBnXkFtZTcwNTA4NDQyMw@@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=sY1S34973zA", description: "Um homem salva judeus durante o Holocausto.", rating: 9.0, year: 1993, duration: 195 },
  { title: "Se Beber, Não Dirija", category: "Drama", genres: ["Drama", "Comédia", "Crime"], image: "https://m.media-amazon.com/images/M/MV5BMTI3NjE5NDU1NV5BMl5BanBnXkFtZTcwNzE4MTEzMw@@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=LXb3EKWsInQ", description: "Três amigos enfrentam uma noite selvagem em Vegas.", rating: 7.7, year: 2009, duration: 100 },

  // Romance
  { title: "Titanic", category: "Romance", genres: ["Romance", "Drama", "História"], image: "https://m.media-amazon.com/images/M/MV5BMDdmZGU3NDQtY2E5My00ZWZlLTg5N2ItMWM3Nzk4NzI5NzAxXkEyXkFqcGdeQWpybA@@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=CHalMy3OL-U", description: "Um amor proibido na noite do navio que afunda.", rating: 7.8, year: 1997, duration: 194 },
  { title: "Diário de uma Paixão", category: "Romance", genres: ["Romance", "Drama"], image: "https://m.media-amazon.com/images/M/MV5BMTI5NzAxMzExMF5BMl5BanBnXkFtZTcwNjY4MTQzMQ@@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=M9qg8k0ZvQo", description: "Um casal enfrenta as dificuldades do amor.", rating: 7.8, year: 2004, duration: 123 },

  // Ficção Científica
  { title: "The Matrix", category: "Ficção Científica", genres: ["Ficção Científica", "Ação", "Thriller"], image: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDl2OWoxNTA5NmQ4XkEyXkFqcGdeQWpybA@@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=vKQi3bBA1y8", description: "Um hacker descobre que a realidade é uma ilusão.", rating: 8.7, year: 1999, duration: 136 },
  { title: "Blade Runner 2049", category: "Ficção Científica", genres: ["Ficção Científica", "Drama", "Thriller"], image: "https://m.media-amazon.com/images/M/MV5BNzA1Njg4NzYtOWY2Yy00NTY5LWE1YzAtZTI0ZWQyZjAxZDZlXkEyXkFqcGdeQWpybA@@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=gCcx85zbxz4", description: "Um agente persegue um replicante desaparecido.", rating: 8.0, year: 2017, duration: 164 },
  { title: "Ready Player One", category: "Ficção Científica", genres: ["Ficção Científica", "Aventura", "Ação"], image: "https://m.media-amazon.com/images/M/MV5BY2JiYTNmZi00YWE1LTliY2UtY2ZmYzAxZjMxNDlmXkEyXkFqcGdeQWpybA@@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=cSp1dM2Vj48", description: "Um rapaz joga em uma realidade virtual para se tornar rico.", rating: 7.2, year: 2018, duration: 140 },

  // Adicional - 20 filmes mais para chegar a 150+
  { title: "La La Land", category: "Romance", genres: ["Romance", "Música", "Drama"], image: "https://m.media-amazon.com/images/M/MV5BMzA1NzU3NTM5MF5BMl5BanBnXkFtZTgwOTk4OTc2MDI@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=0G-lbJbYNCk", description: "Um músico e uma atriz se apaixonam em LA.", rating: 8.0, year: 2016, duration: 128 },
  { title: "O Pior Filme do Mundo", category: "Comédia", genres: ["Comédia"], image: "https://m.media-amazon.com/images/M/MV5BMjI5MzM1NzctZWJjMS00ZGQ4LWFhMDItN2MwZGQ2ZjE2YzMwXkEyXkFqcGdeQWpybA@@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=_nLAzRY3F0c", description: "Uma comédia absurda e caótica.", rating: 6.5, year: 2017, duration: 105 },
  { title: "Aquaman", category: "Épicos", genres: ["Ação", "Aventura", "Ficção Científica"], image: "https://m.media-amazon.com/images/M/MV5BOTk4NDQ1NzEtNDMyNS00ZGY0LWI4MDEtMzI2ZWMwMzAxNjQ2XkEyXkFqcGdeQWpybA@@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=WDkg3h8PHMU", description: "Um herói submarino luta para proteger seus reinos.", rating: 6.8, year: 2018, duration: 143 },
  { title: "Pantera Negra", category: "Épicos", genres: ["Ação", "Aventura", "Ficção Científica"], image: "https://m.media-amazon.com/images/M/MV5BMTg1MTY2MjYzNV5BMl5BanBnXkFtZTgwMTc4NzAxNDM@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=YdA_BDbr9pE", description: "O rei de Wakanda enfrenta ameaças à sua nação.", rating: 7.3, year: 2018, duration: 134 },
  { title: "Oppenheimer", category: "Drama", genres: ["Drama", "História", "Biografia"], image: "https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LWE3PmItYzg2MDE2NDE2YzhkXkEyXkFqcGdeQWpybA@@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=uYPbbksJxIE", description: "A história do pai da bomba atômica.", rating: 8.3, year: 2023, duration: 180 },
  { title: "O Iluminado", category: "Horror", genres: ["Horror", "Suspense"], image: "https://m.media-amazon.com/images/M/MV5BMTU3NjE5NzYtYzYwZC00Yzc1LWI0MzAtNzg2ZjZkN2VmMDZhXkEyXkFqcGdeQWpybA@@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=hZJYeoPRXNQ", description: "Terror psicológico em um hotel isolado.", rating: 8.4, year: 1980, duration: 146 },
  { title: "Parasite", category: "Drama", genres: ["Drama", "Thriller"], image: "https://m.media-amazon.com/images/M/MV5BYWZmYjM1ZTgtYTQ0NC00YzAxLWI3ZmYtNTg3ZmM3MTdhNTA1XkEyXkFqcGdeQWpybA@@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=0Z0yulnAzj0", description: "Uma família pobre se infiltra em uma casa rica.", rating: 8.5, year: 2019, duration: 132 },
  { title: "Minions", category: "Animação", genres: ["Animação", "Comédia", "Aventura"], image: "https://m.media-amazon.com/images/M/MV5BMjIyNzk0MzEtNDg0Yy00ZmJhLWJlNzAtMWNhZjZhNjE0ZGQ5XkEyXkFqcGdeQWpybA@@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=K87FpiP1H1w", description: "Criaturas amarelas em uma aventura maluca.", rating: 6.4, year: 2015, duration: 91 },
  { title: "Coco", category: "Animação", genres: ["Animação", "Aventura", "Família"], image: "https://m.media-amazon.com/images/M/MV5BMTc0MTk5MDA4Ml5BMl5BanBnXkFtZTgwNjQ1MDQ1MTI@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=Ki8jJnY9z88", description: "Um menino visita o mundo dos mortos.", rating: 8.4, year: 2017, duration: 105 },
  { title: "Frozen", category: "Animação", genres: ["Animação", "Comédia", "Família"], image: "https://m.media-amazon.com/images/M/MV5BMjA0Y2FkODUtNmFlYS00YmFlLWFlNzAtZDA4YTBmYTA5ZDdiXkEyXkFqcGdeQWpybA@@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=TWT-AcvS74c", description: "Duas irmãs enfrentam poderes mágicos de gelo.", rating: 7.4, year: 2013, duration: 102 },
  { title: "Ninguém", category: "Ação", genres: ["Ação", "Thriller"], image: "https://m.media-amazon.com/images/M/MV5BNjI0OTEyMjI0NF5BMl5BanBnXkFtZTgwMzc1MzEzNDM@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=TykMhC6OfBk", description: "Um homem comum se vê envolvido em violência.", rating: 7.4, year: 2021, duration: 92 },
  { title: "Top Gun: Maverick", category: "Ação", genres: ["Ação", "Drama"], image: "https://m.media-amazon.com/images/M/MV5BZTZjNzI3OWEtZjZlYy00NzhlLWJkMTItMDQyNGZkZjhkNDZlXkEyXkFqcGdeQWpybA@@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=qSqQvBTC3lA", description: "Um piloto veterano confronta seu passado.", rating: 8.3, year: 2022, duration: 131 },
  { title: "Homem-Formiga", category: "Ação", genres: ["Ação", "Ficção Científica", "Comédia"], image: "https://m.media-amazon.com/images/M/MV5BMjM3NTg2Nzg3MV5BMl5BanBnXkFtZTgwMDk1MTI0NzE@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=0bBPJR0CbpA", description: "Um ladrão ganha a capacidade de encolher.", rating: 7.3, year: 2015, duration: 117 },
  { title: "Capitã Marvel", category: "Ação", genres: ["Ação", "Ficção Científica", "Aventura"], image: "https://m.media-amazon.com/images/M/MV5BMTE0YWFmOTMtODYwOC00Y2I3LTg0MmYtZmE4NzNlNTc1MDcyXkEyXkFqcGdeQWpybA@@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=Z1BCujX3wME", description: "Uma herói cósmica descobre suas verdadeiras origens.", rating: 6.9, year: 2019, duration: 123 },
  { title: "Os Vingadores: Endgame", category: "Ação", genres: ["Ação", "Aventura", "Ficção Científica"], image: "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=TcMBFSGVi1c", description: "Os heróis fazem um último esforço contra o mal.", rating: 8.4, year: 2019, duration: 181 },
  { title: "Jumanji: Bem-vindo à Selva", category: "Aventura", genres: ["Aventura", "Comédia", "Ação"], image: "https://m.media-amazon.com/images/M/MV5BMTAxNzc1MDc2NDdeQTJeQWpwZ15BbWU4MDc2NzI4MjYx._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=S2yrjudt0m8", description: "Quatro adolescentes entram em um jogo mortal.", rating: 7.0, year: 2017, duration: 119 },
  { title: "O Rei Leão", category: "Animação", genres: ["Animação", "Família", "Drama"], image: "https://m.media-amazon.com/images/M/MV5BMjlkM2E0Nzc1M15BMl5BanBnXkFtZTcwNzE1NDUyMQ@@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=7z_9LLWFLug", description: "Um jovem leão recla seu trono.", rating: 8.5, year: 1994, duration: 88 },
  { title: "Rápido & Furioso 9", category: "Ação", genres: ["Ação", "Crime", "Thriller"], image: "https://m.media-amazon.com/images/M/MV5BMGE0ZGVmZGMtNmFlYy00MzI5LTg4YmItYjljNDYyMDkzNzlmXkEyXkFqcGdeQWpybA@@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=qeW5fZ4Z3qM", description: "Equipe de criminosos enfrenta novo inimigo.", rating: 6.5, year: 2021, duration: 145 },
  { title: "A Vida É Bela", category: "Drama", genres: ["Drama", "Comédia", "História"], image: "https://m.media-amazon.com/images/M/MV5BOTA2ZWM1ODktZDYzNi00Y2Y1LTk4OTItNjBmZmNkYTdjODU2XkEyXkFqcGdeQWpybA@@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=k9aVkJg0gZE", description: "Um pai protege seu filho na realidade do Holocausto.", rating: 8.6, year: 1997, duration: 116 }
];

const extraSeedData = [
  { title: "Mad Max: Estrada da Fúria", category: "Ação", genres: ["Ação", "Aventura", "Ficção Científica"], image: "https://m.media-amazon.com/images/M/MV5BN2EwM2YzYzEtNWFhMS00ODkzLTg5ZDctYzQ2NDVlZTFkZTM4XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=hEJnMQG9ev8", description: "Fuga explosiva por um deserto pós-apocalíptico.", rating: 8.1, year: 2015, duration: 120 },
  { title: "John Wick", category: "Ação", genres: ["Ação", "Crime", "Thriller"], image: "https://m.media-amazon.com/images/M/MV5BMTU2MjA1MTQwOV5BMl5BanBnXkFtZTgwODc1OTk0MjE@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=C0BMx-qxsP4", description: "Um assassino aposentado volta ao submundo.", rating: 7.4, year: 2014, duration: 101 },
  { title: "Missão: Impossível - Efeito Fallout", category: "Ação", genres: ["Ação", "Espionagem", "Aventura"], image: "https://m.media-amazon.com/images/M/MV5BMTk2OTk0NDYzMV5BMl5BanBnXkFtZTgwNDI4NTE1NTM@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=wb49-oV0F78", description: "Ethan Hunt corre contra o tempo em uma missão global.", rating: 7.7, year: 2018, duration: 147 },
  { title: "Batman: O Cavaleiro das Trevas", category: "Épicos", genres: ["Ação", "Crime", "Drama"], image: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODc1MV5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=EXeTwQWrcwY", description: "Batman enfrenta o caos provocado pelo Coringa.", rating: 9.0, year: 2008, duration: 152 },
  { title: "Clube da Luta", category: "Drama", genres: ["Drama", "Thriller"], image: "https://m.media-amazon.com/images/M/MV5BMmEzNTczM2MtZjc2Mi00M2RmLWIyNzEtMmE4NzM0OTg5ZDYwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=SUXWAEX2jlg", description: "Um homem encontra uma forma extrema de escapar da rotina.", rating: 8.8, year: 1999, duration: 139 },
  { title: "Whiplash", category: "Drama", genres: ["Drama", "Música"], image: "https://m.media-amazon.com/images/M/MV5BOTA5NDZkYzQtY2U0Mi00YzQ0LTg3M2MtNGQ2YjRkN2RkYzY0XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=7d_jQycdQGo", description: "Um baterista encara um professor implacável.", rating: 8.5, year: 2014, duration: 106 },
  { title: "Cidade de Deus", category: "Drama", genres: ["Drama", "Crime"], image: "https://m.media-amazon.com/images/M/MV5BOTMwYjljMWYtY2Q2MS00OWY0LTg1MTUtYjVjOGMxYzY2Y2Q4XkEyXkFqcGdeQXVyMTI3ODAyMzE2._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=dcUOO4Itgmw", description: "A ascensão do crime em uma comunidade carioca.", rating: 8.6, year: 2002, duration: 130 },
  { title: "A Origem dos Guardiões", category: "Animação", genres: ["Animação", "Aventura", "Família"], image: "https://m.media-amazon.com/images/M/MV5BMTk5MzY4MDQ5Nl5BMl5BanBnXkFtZTcwMTI4NDk1OA@@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=aPLiBxhoug0", description: "Heróis lendários protegem a imaginação das crianças.", rating: 7.2, year: 2012, duration: 97 },
  { title: "Como Treinar o seu Dragão", category: "Animação", genres: ["Animação", "Aventura", "Família"], image: "https://m.media-amazon.com/images/M/MV5BMjA5NzA2NTM1OV5BMl5BanBnXkFtZTcwMDU4MzQzMw@@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=oKiYuIsPxYk", description: "Um jovem viking cria amizade com um dragão.", rating: 8.1, year: 2010, duration: 98 },
  { title: "Divertida Mente", category: "Animação", genres: ["Animação", "Comédia", "Família"], image: "https://m.media-amazon.com/images/M/MV5BYWY3MDE2Y2UtOTE3Zi00MGUzLTg2MTItZjE1ZWVkMGVlODRmXkEyXkFqcGdeQXVyMTMzNDExODE5._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=seMwpP0yeu4", description: "As emoções de uma garota tentam guiar sua nova fase.", rating: 8.1, year: 2015, duration: 95 },
  { title: "Wall-E", category: "Animação", genres: ["Animação", "Ficção Científica", "Romance"], image: "https://m.media-amazon.com/images/M/MV5BMjExMTYzMTU3M15BMl5BanBnXkFtZTcwMjMxMzMzMw@@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=CZ1CATNbXg0", description: "Um robô solitário encontra esperança no espaço.", rating: 8.4, year: 2008, duration: 98 },
  { title: "A Chegada", category: "Ficção Científica", genres: ["Ficção Científica", "Drama", "Mistério"], image: "https://m.media-amazon.com/images/M/MV5BOTgwMzkwMzY1Nl5BMl5BanBnXkFtZTgwNjc2OTI3OTE@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=tFMo3UJ4B4g", description: "Uma linguista tenta se comunicar com visitantes alienígenas.", rating: 7.9, year: 2016, duration: 116 },
  { title: "Gravidade", category: "Ficção Científica", genres: ["Ficção Científica", "Drama", "Thriller"], image: "https://m.media-amazon.com/images/M/MV5BMTU1NzY5ODE0OF5BMl5BanBnXkFtZTgwOTk4MjkzMTE@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=OiTiKOy59o4", description: "Dois astronautas lutam para sobreviver no espaço.", rating: 7.7, year: 2013, duration: 91 },
  { title: "Ex Machina", category: "Ficção Científica", genres: ["Ficção Científica", "Drama", "Thriller"], image: "https://m.media-amazon.com/images/M/MV5BMTUxMjYzNjQ1NV5BMl5BanBnXkFtZTgwNTE3Njk4MzE@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=XYGzRB4Pnq8", description: "Um programador testa uma inteligência artificial avançada.", rating: 7.7, year: 2014, duration: 108 },
  { title: "No Limite do Amanhã", category: "Ficção Científica", genres: ["Ficção Científica", "Ação"], image: "https://m.media-amazon.com/images/M/MV5BMTc5OTk4MTM3M15BMl5BanBnXkFtZTgwODcxNjg3MDE@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=vw61gCe2oqI", description: "Um soldado revive o mesmo combate contra invasores.", rating: 7.9, year: 2014, duration: 113 },
  { title: "O Grande Hotel Budapeste", category: "Comédia", genres: ["Comédia", "Drama", "Aventura"], image: "https://m.media-amazon.com/images/M/MV5BMzM5NjQ3NjI4NV5BMl5BanBnXkFtZTgwNjUyMDM4MDE@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=1Fg5iWmQjwk", description: "Um concierge e seu aprendiz vivem uma aventura elegante.", rating: 8.1, year: 2014, duration: 99 },
  { title: "Jojo Rabbit", category: "Comédia", genres: ["Comédia", "Drama", "Guerra"], image: "https://m.media-amazon.com/images/M/MV5BYmEzNzA3YzMtOTYwZS00YjJmLWFlOTAtYzQxZWY1OWQ1Y2Q2XkEyXkFqcGdeQXVyODk2NDQ3MTA@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=tL4McUzXfFI", description: "Um menino confronta o fanatismo durante a guerra.", rating: 7.9, year: 2019, duration: 108 },
  { title: "Knives Out", category: "Comédia", genres: ["Comédia", "Mistério", "Crime"], image: "https://m.media-amazon.com/images/M/MV5BZDU5ZTRkYmItZjg0Mi00ZTQwLWI1NTctNjFmODk2ZjUyMjI2XkEyXkFqcGdeQXVyMTA2MDIzMDE5._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=qGqiHJTsRkQ", description: "Um detetive investiga uma família cheia de segredos.", rating: 7.9, year: 2019, duration: 130 },
  { title: "Questão de Tempo", category: "Romance", genres: ["Romance", "Comédia", "Drama"], image: "https://m.media-amazon.com/images/M/MV5BMTA1ODIxMzg3MDNeQTJeQWpwZ15BbWU3MDk1NjQ4Nzk@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=T7A810duHvw", description: "Um jovem usa viagens no tempo para entender o amor.", rating: 7.8, year: 2013, duration: 123 },
  { title: "Orgulho e Preconceito", category: "Romance", genres: ["Romance", "Drama"], image: "https://m.media-amazon.com/images/M/MV5BNDg2NjIxODE0OF5BMl5BanBnXkFtZTcwMjEyOTQzMQ@@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=Ur_DIHs92NM", description: "Elizabeth Bennet confronta orgulho, desejo e classe social.", rating: 7.8, year: 2005, duration: 129 },
  { title: "Antes do Amanhecer", category: "Romance", genres: ["Romance", "Drama"], image: "https://m.media-amazon.com/images/M/MV5BZDk0YjA0NDgtMjgyNi00MmQ1LTkzZDktN2IwM2E5MjE4Yjg1XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=6MUcuqbGTxc", description: "Dois jovens caminham por Viena em uma noite inesquecível.", rating: 8.1, year: 1995, duration: 101 },
  { title: "Indiana Jones e os Caçadores da Arca Perdida", category: "Aventura", genres: ["Aventura", "Ação"], image: "https://m.media-amazon.com/images/M/MV5BMjA0ODEzMTc1Nl5BMl5BanBnXkFtZTcwNzcxMDg4OA@@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=0xQSIdSRlAk", description: "Um arqueólogo enfrenta nazistas em busca de uma relíquia.", rating: 8.4, year: 1981, duration: 115 },
  { title: "Piratas do Caribe", category: "Aventura", genres: ["Aventura", "Fantasia", "Ação"], image: "https://m.media-amazon.com/images/M/MV5BNGYyYTAzN2UtYjBiZi00ZWMxLWFkN2MtYjEwNzg3YzM3MGRmXkEyXkFqcGdeQXVyMTUyNjc3NDQ4._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=naQr0uTrH_s", description: "Jack Sparrow entra em uma jornada amaldiçoada.", rating: 8.1, year: 2003, duration: 143 },
  { title: "Jurassic Park", category: "Aventura", genres: ["Aventura", "Ficção Científica"], image: "https://m.media-amazon.com/images/M/MV5BMjQwMTQ3NTQxNF5BMl5BanBnXkFtZTgwNDQxNjQxMTE@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=lc0UehYemQA", description: "Dinossauros voltam à vida em um parque ambicioso.", rating: 8.2, year: 1993, duration: 127 },
  { title: "Ilha do Medo", category: "Suspense", genres: ["Suspense", "Mistério", "Drama"], image: "https://m.media-amazon.com/images/M/MV5BN2FjNWExYzEtY2YzOC00YjNlLTllMTQtNmIwM2Q1YzBhOWM1XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=5iaYLCiq5RM", description: "Um investigador entra em um hospital psiquiátrico isolado.", rating: 8.2, year: 2010, duration: 138 },
  { title: "Corra!", category: "Suspense", genres: ["Suspense", "Horror", "Mistério"], image: "https://m.media-amazon.com/images/M/MV5BMjUxMjA0ODQ0MV5BMl5BanBnXkFtZTgwNjk1NDYwMjI@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=sRfnevzM9kQ", description: "Uma visita familiar revela uma ameaça perturbadora.", rating: 7.8, year: 2017, duration: 104 },
  { title: "Zodíaco", category: "Suspense", genres: ["Suspense", "Crime", "Drama"], image: "https://m.media-amazon.com/images/M/MV5BMjI5NjE4NDYyN15BMl5BanBnXkFtZTcwNDgwMjU1MQ@@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=yNncHPl1UXg", description: "Jornalistas e policiais perseguem um assassino enigmático.", rating: 7.7, year: 2007, duration: 157 },
  { title: "Our Planet", category: "Documentários", genres: ["Documentário", "Natureza"], image: "https://m.media-amazon.com/images/M/MV5BMjQ0NWY1ZTEtMjQ0NC00M2VmLThkN2YtMzA1ZDI5ZjRkYjQ0XkEyXkFqcGdeQXVyNjEwNTM2Mzc@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=aETNYyrqNYE", description: "Uma jornada visual pelos ecossistemas do planeta.", rating: 9.3, year: 2019, duration: 50 },
  { title: "Senna", category: "Documentários", genres: ["Documentário", "Esporte", "Biografia"], image: "https://m.media-amazon.com/images/M/MV5BMTc5MTUzNjI4NV5BMl5BanBnXkFtZTcwNDQ4Mzk0NA@@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=5eV6uF72Z5M", description: "A trajetória de Ayrton Senna dentro e fora das pistas.", rating: 8.5, year: 2010, duration: 106 },
  { title: "Free Solo", category: "Documentários", genres: ["Documentário", "Esporte", "Aventura"], image: "https://m.media-amazon.com/images/M/MV5BMjMwYjcwNWQtNTQ5YS00MzVlLTkxYzMtNDIwZWIxZTE4Zjg4XkEyXkFqcGdeQXVyODk2NDQ3MTA@._V1_.jpg", youtubeUrl: "https://www.youtube.com/watch?v=urRVZ4SW7WU", description: "Um escalador encara uma parede sem cordas.", rating: 8.1, year: 2018, duration: 100 }
];

const allSeedData = [...seedData, ...extraSeedData].map(withSafeMedia);

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const result = await Content.bulkWrite(
      allSeedData.map((content) => ({
        updateOne: {
          filter: { title: content.title, category: content.category },
          update: { $set: content },
          upsert: true
        }
      }))
    );

    console.log(`Synced ${allSeedData.length} content items`);
    console.log(`Inserted: ${result.upsertedCount}, updated: ${result.modifiedCount}`);

    mongoose.connection.close();
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
