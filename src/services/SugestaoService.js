import axios from 'axios';

// Simulação de dados de plataformas (em produção, usaria JustWatch API)
const PLATAFORMAS_FILME = {
  550: ['Netflix', 'Prime'],
  27205: ['Disney+', 'Prime'],
  278: ['Netflix'],
  680: ['Prime', 'HBO Max'],
  238: ['Netflix', 'Disney+'],
};

const TMDB_API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZDk1ZjM2ZDI5MDI5Yjk1YjI2NTQxNDU5YTg4YjhmMCIsInN1YiI6IjY2MGRmMjBkMDQ0MDBhMDEzOWQ3MjI1YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjogMX0.oLmYLBvuI8ycYxCNYB3v2Y9j4K1xZ3w7Q5m8n2P6r1E';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Dados padrão com plataformas para filmes top
export const FILMES_PADRAO_TOP = [
  {
    id: 550,
    titulo: 'Clube da Luta',
    genero: 'Drama',
    ano: 1999,
    avaliacao: '8.8',
    descricao: 'Um trabalhador insano forma uma equipe clandestina de luta livre.',
    plataformas: ['Netflix', 'Prime'],
    tipo: 'filme',
    capa: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500&h=750&fit=crop',
  },
  {
    id: 27205,
    titulo: 'Inception',
    genero: 'Ficção Científica',
    ano: 2010,
    avaliacao: '8.8',
    descricao: 'Um ladrão que rouba segredos corporativos através de tecnologia de compartilhamento de sonhos.',
    plataformas: ['Disney+', 'Prime'],
    tipo: 'filme',
    capa: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&h=750&fit=crop',
  },
  {
    id: 278,
    titulo: 'A Fuga de Shawshank',
    genero: 'Drama',
    ano: 1994,
    avaliacao: '9.3',
    descricao: 'Dois homens encarcerados estabelecem uma amizade duradoura enquanto buscam libertação através de atos de decência comum.',
    plataformas: ['Netflix'],
    tipo: 'filme',
    capa: 'https://images.unsplash.com/photo-1578733471386-f146f56e90f8?w=500&h=750&fit=crop',
  },
  {
    id: 680,
    titulo: 'Pulp Fiction',
    genero: 'Crime',
    ano: 1994,
    avaliacao: '8.9',
    descricao: 'A vida de vários criminosos de Los Angeles se entrelaçam em quatro histórias de violência e redenção.',
    plataformas: ['Prime', 'HBO Max'],
    tipo: 'filme',
    capa: 'https://images.unsplash.com/photo-1520676179915-927b68303c4c?w=500&h=750&fit=crop',
  },
  {
    id: 238,
    titulo: 'A Lista de Schindler',
    genero: 'Drama',
    ano: 1993,
    avaliacao: '9.0',
    descricao: 'Na Polônia ocupada pelos alemães durante a Segunda Guerra Mundial, um empresário judeu trata mil refugiados judeus como seus únicos ativos valiosos.',
    plataformas: ['Netflix', 'Disney+'],
    tipo: 'filme',
    capa: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500&h=750&fit=crop',
  },
];

/**
 * Busca filmes top do TMDB
 */
export async function buscarFilmesTop() {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/top_rated`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'pt-BR',
        region: 'BR',
      },
    });

    return response.data.results
      .slice(0, 5)
      .map((filme) => ({
        id: filme.id,
        titulo: filme.title,
        genero: filme.genre_ids[0],
        ano: new Date(filme.release_date).getFullYear(),
        avaliacao: filme.vote_average.toFixed(1),
        descricao: filme.overview,
        plataformas: PLATAFORMAS_FILME[filme.id] || ['Netflix', 'Prime'],
        tipo: 'filme',
        capa: filme.poster_path
          ? `https://image.tmdb.org/t/p/w500${filme.poster_path}`
          : 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500&h=750&fit=crop',
      }));
  } catch (erro) {
    console.error('Erro ao buscar filmes do TMDB:', erro.message);
    // Retorna dados padrão em caso de erro
    return FILMES_PADRAO_TOP;
  }
}

/**
 * Atualiza sugestões no localStorage
 */
export async function atualizarSugestoes() {
  try {
    const filmes = await buscarFilmesTop();
    const dados = {
      filmes,
      ultimaAtualizacao: new Date().toISOString(),
    };
    localStorage.setItem('sugestoesSemanais', JSON.stringify(dados));
    console.log('✓ Sugestões atualizadas com sucesso!');
    return dados;
  } catch (erro) {
    console.error('Erro ao atualizar sugestões:', erro);
    throw erro;
  }
}

/**
 * Obtém sugestões do localStorage
 */
export function obterSugestoes() {
  const dados = localStorage.getItem('sugestoesSemanais');
  if (dados) {
    return JSON.parse(dados);
  }
  // Primeira execução - retorna dados padrão
  return {
    filmes: FILMES_PADRAO_TOP,
    ultimaAtualizacao: new Date().toISOString(),
  };
}

/**
 * Agendador para atualização semanal (toda segunda-feira às 00:00)
 */
export function agendar() {
  try {
    // Calcula próxima segunda-feira às 00:00
    const agora = new Date();
    const proximasegunda = new Date(agora);
    proximasegunda.setDate(agora.getDate() + ((1 - agora.getDay() + 7) % 7));
    proximasegunda.setHours(0, 0, 0, 0);

    // Simula atualização semanal (em produção, usaria node-schedule no backend)
    const intervaloMs = 1000 * 60 * 60 * 24 * 7; // 7 dias
    
    setInterval(() => {
      atualizarSugestoes();
    }, intervaloMs);

    console.log('✓ Agendador de sugestões iniciado!');
  } catch (erro) {
    console.error('Erro ao agendar atualizações:', erro);
  }
}
