const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
const TVMAZE_BASE_URL = 'https://api.tvmaze.com';
const CAPA_FALLBACK_URL = '/capa-fallback.svg';

const GENEROS = {
  28: 'Acao',
  12: 'Aventura',
  16: 'Animacao',
  35: 'Comedia',
  80: 'Crime',
  99: 'Documentario',
  18: 'Drama',
  10751: 'Familia',
  14: 'Fantasia',
  36: 'Historia',
  27: 'Horror',
  10402: 'Musica',
  9648: 'Misterio',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Suspense',
  10752: 'Guerra',
  37: 'Western',
};

function getApiKey() {
  return import.meta.env.VITE_TMDB_API_KEY || '';
}

function limparHtml(texto = '') {
  return texto.replace(/<[^>]*>/g, '').trim();
}

function trailerBuscaYouTube(titulo = '') {
  const query = encodeURIComponent(`${titulo} trailer oficial`);
  return `https://www.youtube.com/results?search_query=${query}`;
}

async function getWatchProvidersByType(id, mediaType = 'movie', country = 'BR') {
  const apiKey = getApiKey();
  if (!apiKey) {
    return { watch: ['Netflix', 'Prime Video'], rentBuy: ['Apple TV', 'YouTube Movies'] };
  }

  const route = mediaType === 'tv' ? 'tv' : 'movie';
  const url = new URL(`${TMDB_BASE_URL}/${route}/${id}/watch/providers`);
  url.searchParams.set('api_key', apiKey);

  const response = await fetch(url.toString());
  if (!response.ok) {
    return { watch: [], rentBuy: [] };
  }

  const data = await response.json();
  const region = data.results?.[country] || data.results?.BR || data.results?.US;

  const watch = (region?.flatrate || []).map((p) => p.provider_name);
  const rent = (region?.rent || []).map((p) => p.provider_name);
  const buy = (region?.buy || []).map((p) => p.provider_name);

  return {
    watch: [...new Set(watch)].slice(0, 4),
    rentBuy: [...new Set([...rent, ...buy])].slice(0, 4),
  };
}

async function getTrailerByType(id, mediaType = 'movie', titulo = '') {
  const apiKey = getApiKey();
  if (!apiKey) return trailerBuscaYouTube(titulo);

  const route = mediaType === 'tv' ? 'tv' : 'movie';
  const data = await tmdbRequest(`/${route}/${id}/videos`);
  const trailer = (data.results || []).find(
    (video) => video.site === 'YouTube' && video.type === 'Trailer'
  );

  return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : trailerBuscaYouTube(titulo);
}

function agruparPorPlataforma(lista) {
  const mapa = {};

  for (const item of lista) {
    const plataformas = item.watchPlatforms?.length ? item.watchPlatforms : ['Sem plataforma'];
    for (const plataforma of plataformas) {
      if (!mapa[plataforma]) mapa[plataforma] = [];
      if (!mapa[plataforma].some((m) => m.id === item.id)) {
        mapa[plataforma].push(item);
      }
    }
  }

  return Object.entries(mapa)
    .sort((a, b) => b[1].length - a[1].length)
    .map(([plataforma, itens]) => ({ plataforma, itens: itens.slice(0, 8) }));
}

function plataformasMock(idx) {
  const all = [
    ['Netflix', 'Prime Video'],
    ['Disney+', 'Prime Video'],
    ['Max', 'Netflix'],
    ['Prime Video', 'Apple TV+'],
  ];
  return all[idx % all.length];
}

async function tmdbRequest(path, params = {}) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('VITE_TMDB_API_KEY nao configurada');
  }

  const url = new URL(`${TMDB_BASE_URL}${path}`);
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('language', 'pt-BR');

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  });

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`TMDB error ${response.status}`);
  }

  return response.json();
}

export function getPosterUrl(posterPath, size = 'w500') {
  return posterPath ? `${TMDB_IMAGE_BASE_URL}/${size}${posterPath}` : CAPA_FALLBACK_URL;
}

export function getBackdropUrl(backdropPath, size = 'w1280') {
  return backdropPath ? `${TMDB_IMAGE_BASE_URL}/${size}${backdropPath}` : '';
}

export async function getPopularMovies(page = 1) {
  const apiKey = getApiKey();

  if (apiKey) {
    const data = await tmdbRequest('/movie/popular', { page, region: 'BR' });

    return (data.results || []).map((movie) => ({
      id: movie.id,
      titulo: movie.title,
      genero: GENEROS[movie.genre_ids?.[0]] || 'Filme',
      categoria: (movie.genre_ids || [])
        .slice(0, 2)
        .map((id) => GENEROS[id] || 'Filme')
        .join(' • '),
      ano: movie.release_date ? Number(movie.release_date.slice(0, 4)) : 0,
      avaliacao: Number(movie.vote_average || 0).toFixed(1),
      descricao: movie.overview || 'Sem descricao.',
      capa: getPosterUrl(movie.poster_path),
      backdrop: getBackdropUrl(movie.backdrop_path),
      trailerUrl: trailerBuscaYouTube(movie.title),
    }));
  }

  const response = await fetch(`${TVMAZE_BASE_URL}/shows?page=${Math.max(0, page - 1)}`);
  if (!response.ok) {
    throw new Error(`TVMaze error ${response.status}`);
  }

  const shows = await response.json();

  return (shows || []).slice(0, 12).map((show) => ({
    id: show.id,
    titulo: show.name,
    genero: show.genres?.[0] || 'Serie',
    categoria: (show.genres || []).slice(0, 2).join(' • ') || 'Serie',
    ano: show.premiered ? Number(String(show.premiered).slice(0, 4)) : 0,
    avaliacao: Number(show.rating?.average || 7.5).toFixed(1),
    descricao: limparHtml(show.summary) || 'Sem descricao.',
    capa: show.image?.medium || CAPA_FALLBACK_URL,
    backdrop: show.image?.original || show.image?.medium || '',
    trailerUrl: trailerBuscaYouTube(show.name),
  }));
}

export async function getTopRatedMovies(page = 1) {
  const apiKey = getApiKey();

  if (apiKey) {
    const data = await tmdbRequest('/movie/top_rated', { page, region: 'BR' });
    return (data.results || []).map((movie) => ({
      id: movie.id,
      titulo: movie.title,
      genero: GENEROS[movie.genre_ids?.[0]] || 'Filme',
      categoria: (movie.genre_ids || [])
        .slice(0, 2)
        .map((id) => GENEROS[id] || 'Filme')
        .join(' • '),
      ano: movie.release_date ? Number(movie.release_date.slice(0, 4)) : 0,
      avaliacao: Number(movie.vote_average || 0).toFixed(1),
      descricao: movie.overview || 'Sem descricao.',
      capa: getPosterUrl(movie.poster_path),
      backdrop: getBackdropUrl(movie.backdrop_path),
      trailerUrl: trailerBuscaYouTube(movie.title),
    }));
  }

  const response = await fetch(`${TVMAZE_BASE_URL}/shows?page=${Math.max(0, page - 1)}`);
  if (!response.ok) {
    throw new Error(`TVMaze error ${response.status}`);
  }
  const shows = await response.json();

  return (shows || [])
    .filter((show) => show.image?.medium)
    .sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0))
    .slice(0, 20)
    .map((show) => ({
      id: show.id,
      titulo: show.name,
      genero: show.genres?.[0] || 'Serie',
      categoria: (show.genres || []).slice(0, 2).join(' • ') || 'Serie',
      ano: show.premiered ? Number(String(show.premiered).slice(0, 4)) : 0,
      avaliacao: Number(show.rating?.average || 7.5).toFixed(1),
      descricao: limparHtml(show.summary) || 'Sem descricao.',
      capa: show.image?.medium || CAPA_FALLBACK_URL,
      backdrop: show.image?.original || show.image?.medium || '',
      trailerUrl: trailerBuscaYouTube(show.name),
    }));
}

export async function getPopularSeries(page = 1) {
  const apiKey = getApiKey();

  if (apiKey) {
    const data = await tmdbRequest('/tv/popular', { page, region: 'BR' });

    return (data.results || [])
      .map((serie) => ({
        id: serie.id,
        titulo: serie.name,
        genero: GENEROS[serie.genre_ids?.[0]] || 'Serie',
        categoria: (serie.genre_ids || [])
          .slice(0, 2)
          .map((id) => GENEROS[id] || 'Serie')
          .join(' • '),
        ano: serie.first_air_date ? Number(String(serie.first_air_date).slice(0, 4)) : 0,
        avaliacao: Number(serie.vote_average || 0).toFixed(1),
        descricao: serie.overview || 'Sem descricao.',
        capa: getPosterUrl(serie.poster_path),
        backdrop: getBackdropUrl(serie.backdrop_path),
        trailerUrl: trailerBuscaYouTube(`${serie.name} serie`),
        tipo: 'serie',
      }))
      .sort((a, b) => b.ano - a.ano);
  }

  const response = await fetch(`${TVMAZE_BASE_URL}/shows?page=${Math.max(0, page - 1)}`);
  if (!response.ok) {
    throw new Error(`TVMaze error ${response.status}`);
  }

  const shows = await response.json();

  return (shows || [])
    .filter((show) => show.image?.medium)
    .map((show) => ({
      id: show.id,
      titulo: show.name,
      genero: show.genres?.[0] || 'Serie',
      categoria: (show.genres || []).slice(0, 2).join(' • ') || 'Serie',
      ano: show.premiered ? Number(String(show.premiered).slice(0, 4)) : 0,
      avaliacao: Number(show.rating?.average || 7.5).toFixed(1),
      descricao: limparHtml(show.summary) || 'Sem descricao.',
      capa: show.image?.medium || CAPA_FALLBACK_URL,
      backdrop: show.image?.original || show.image?.medium || '',
      trailerUrl: trailerBuscaYouTube(`${show.name} serie`),
      tipo: 'serie',
    }))
    .sort((a, b) => b.ano - a.ano);
}

export async function searchMovieByTitle(title) {
  const apiKey = getApiKey();

  if (apiKey) {
    const data = await tmdbRequest('/search/movie', {
      query: title,
      include_adult: false,
      page: 1,
    });

    return data.results?.[0] || null;
  }

  const response = await fetch(`${TVMAZE_BASE_URL}/search/shows?q=${encodeURIComponent(title)}`);
  if (!response.ok) {
    throw new Error(`TVMaze search error ${response.status}`);
  }

  const data = await response.json();
  return data?.[0]?.show || null;
}

export async function getMovieVideos(movieId) {
  const apiKey = getApiKey();
  if (!apiKey) {
    return { results: [] };
  }
  return tmdbRequest(`/movie/${movieId}/videos`);
}

export async function getMovieCredits(movieId) {
  const apiKey = getApiKey();
  if (apiKey) {
    return tmdbRequest(`/movie/${movieId}/credits`);
  }

  const response = await fetch(`${TVMAZE_BASE_URL}/shows/${movieId}/cast`);
  if (!response.ok) {
    return { cast: [] };
  }

  const data = await response.json();
  return {
    cast: data.map((item) => ({ name: item.person?.name })).filter((item) => item.name),
  };
}

export async function getMovieTrailerUrl(movieId) {
  const videos = await getMovieVideos(movieId);
  const trailer = (videos.results || []).find(
    (video) => video.site === 'YouTube' && video.type === 'Trailer'
  );

  return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : '';
}

export async function getWeeklyMostWatched(country = 'BR') {
  const apiKey = getApiKey();

  if (apiKey) {
    const data = await tmdbRequest('/trending/all/week');
    const base = (data.results || [])
      .filter((item) => item.media_type === 'movie' || item.media_type === 'tv')
      .slice(0, 24);

    const itens = await Promise.all(
      base.map(async (item) => {
        const mediaType = item.media_type;
        const titulo = item.title || item.name;
        const providers = await getWatchProvidersByType(item.id, mediaType, country);
        const trailerUrl = await getTrailerByType(item.id, mediaType, titulo);

        return {
          id: item.id,
          mediaType,
          titulo,
          ano: item.release_date || item.first_air_date
            ? Number(String(item.release_date || item.first_air_date).slice(0, 4))
            : 0,
          avaliacao: Number(item.vote_average || 0).toFixed(1),
          descricao: item.overview || 'Sem descricao.',
          capa: getPosterUrl(item.poster_path),
          watchPlatforms: providers.watch,
          rentBuyPlatforms: providers.rentBuy,
          trailerUrl,
        };
      })
    );

    const filmes = itens.filter((i) => i.mediaType === 'movie');
    const series = itens.filter((i) => i.mediaType === 'tv');

    return {
      filmesByPlatform: agruparPorPlataforma(filmes),
      seriesByPlatform: agruparPorPlataforma(series),
      sugestoesMistas: itens.slice(0, 12),
    };
  }

  const [tvResponse, movieResponse] = await Promise.all([
    fetch(`${TVMAZE_BASE_URL}/shows?page=1`),
    fetch('https://itunes.apple.com/search?term=popular&media=movie&limit=20'),
  ]);

  const shows = tvResponse.ok ? await tvResponse.json() : [];
  const movieData = movieResponse.ok ? await movieResponse.json() : { results: [] };

  const series = [...shows]
    .filter((s) => s.image?.medium)
    .sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0))
    .slice(0, 12)
    .map((show, idx) => ({
      id: show.id,
      mediaType: 'tv',
      titulo: show.name,
      ano: show.premiered ? Number(String(show.premiered).slice(0, 4)) : 0,
      avaliacao: Number(show.rating?.average || 7.5).toFixed(1),
      descricao: limparHtml(show.summary) || 'Sem descricao.',
      capa: show.image?.medium || CAPA_FALLBACK_URL,
      watchPlatforms: plataformasMock(idx),
      rentBuyPlatforms: ['Apple TV', 'YouTube Movies'],
      trailerUrl: trailerBuscaYouTube(show.name),
    }));

  const filmes = (movieData.results || []).slice(0, 12).map((movie, idx) => ({
    id: movie.trackId || idx + 1000,
    mediaType: 'movie',
    titulo: movie.trackName || movie.collectionName || `Filme ${idx + 1}`,
    ano: movie.releaseDate ? Number(String(movie.releaseDate).slice(0, 4)) : 0,
    avaliacao: '7.8',
    descricao: movie.longDescription || movie.shortDescription || 'Sem descricao.',
    capa: movie.artworkUrl100 ? movie.artworkUrl100.replace('100x100bb', '600x900bb') : CAPA_FALLBACK_URL,
    watchPlatforms: plataformasMock(idx + 1),
    rentBuyPlatforms: ['Apple TV', 'Google Play Movies', 'YouTube Movies'],
    trailerUrl: movie.previewUrl || trailerBuscaYouTube(movie.trackName || 'Filme'),
  }));

  const sugestoesMistas = [...filmes.slice(0, 6), ...series.slice(0, 6)];

  return {
    filmesByPlatform: agruparPorPlataforma(filmes),
    seriesByPlatform: agruparPorPlataforma(series),
    sugestoesMistas,
  };
}
