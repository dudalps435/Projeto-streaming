import { createContext, useState, useEffect } from "react";

export const WatchlistContext = createContext();

const CATALOGO_PADRAO = [
  { id: 1,  titulo: "Além do Horizonte",  genero: "Ação",       plataforma: "Netflix",  status: "quero assistir", nota: 0, tipo: "filme", ano: 2024, avaliacao: "9.1", capa: "https://images.unsplash.com/photo-1561825481-06fad5c65b25?w=500&h=750&fit=crop" },
  { id: 2,  titulo: "Ruínas do Amanhã",   genero: "Sci-Fi",     plataforma: "Prime",    status: "quero assistir", nota: 0, tipo: "filme", ano: 2024, avaliacao: "8.4", capa: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&h=750&fit=crop" },
  { id: 3,  titulo: "A Última Fronteira", genero: "Aventura",   plataforma: "Disney+",  status: "quero assistir", nota: 0, tipo: "filme", ano: 2023, avaliacao: "7.9", capa: "https://images.unsplash.com/photo-1585647347385-e29b0a0f3e50?w=500&h=750&fit=crop" },
  { id: 4,  titulo: "Sombra Vermelha",    genero: "Thriller",   plataforma: "Netflix",  status: "assistindo",     nota: 0, tipo: "filme", ano: 2024, avaliacao: "8.7", capa: "https://images.unsplash.com/photo-1520676179915-927b68303c4c?w=500&h=750&fit=crop" },
  { id: 5,  titulo: "Código Fantasma",    genero: "Ação",       plataforma: "Prime",    status: "quero assistir", nota: 0, tipo: "filme", ano: 2023, avaliacao: "7.5", capa: "https://images.unsplash.com/photo-1557983889-3ec0aaff1004?w=500&h=750&fit=crop" },
  { id: 6,  titulo: "Mar de Cinzas",      genero: "Drama",      plataforma: "Netflix",  status: "assistido",      nota: 5, tipo: "filme", ano: 2024, avaliacao: "9.0", capa: "https://images.unsplash.com/photo-1578733471386-f146f56e90f8?w=500&h=750&fit=crop" },
  { id: 7,  titulo: "Pulso",              genero: "Horror",     plataforma: "Disney+",  status: "quero assistir", nota: 0, tipo: "filme", ano: 2023, avaliacao: "8.2", capa: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500&h=750&fit=crop" },
  { id: 8,  titulo: "Vento Norte",        genero: "Drama",      plataforma: "Prime",    status: "assistido",      nota: 4, tipo: "filme", ano: 2022, avaliacao: "8.8", capa: "https://images.unsplash.com/photo-1548689844-b5e0f75c6189?w=500&h=750&fit=crop" },
  { id: 9,  titulo: "Espelho Partido",    genero: "Suspense",   plataforma: "Netflix",  status: "quero assistir", nota: 0, tipo: "filme", ano: 2024, avaliacao: "7.6", capa: "https://images.unsplash.com/photo-1555991841-ca69f55fa619?w=500&h=750&fit=crop" },
  { id: 13, titulo: "Convergência",       genero: "Drama",      plataforma: "Netflix",  status: "assistido",      nota: 5, tipo: "serie", ano: 2024, avaliacao: "9.2", capa: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&h=750&fit=crop" },
  { id: 14, titulo: "Protocolo Zero",     genero: "Espionagem", plataforma: "Prime",    status: "assistindo",     nota: 0, tipo: "serie", ano: 2023, avaliacao: "8.6", capa: "https://images.unsplash.com/photo-1512149160596-da28e73a2e7b?w=500&h=750&fit=crop" },
  { id: 15, titulo: "Neon City",          genero: "Cyberpunk",  plataforma: "Disney+",  status: "quero assistir", nota: 0, tipo: "serie", ano: 2024, avaliacao: "8.9", capa: "https://images.unsplash.com/photo-1560109520-543149ecf16b?w=500&h=750&fit=crop" },
  { id: 16, titulo: "As Filhas do Mar",   genero: "Fantasia",   plataforma: "Netflix",  status: "assistido",      nota: 4, tipo: "serie", ano: 2023, avaliacao: "8.3", capa: "https://images.unsplash.com/photo-1555848368-c8be68a99506?w=500&h=750&fit=crop" },
  { id: 17, titulo: "Verdade Fraturada",  genero: "Thriller",   plataforma: "Prime",    status: "assistido",      nota: 5, tipo: "serie", ano: 2022, avaliacao: "9.0", capa: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&h=750&fit=crop" },
  { id: 18, titulo: "Círculo de Fogo",    genero: "Ação",       plataforma: "Disney+",  status: "quero assistir", nota: 0, tipo: "serie", ano: 2024, avaliacao: "7.8", capa: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500&h=750&fit=crop" },
];

export function WatchlistProvider({ children }) {
  const [watchlist, setWatchlist] = useState(() => {
    const salvo = localStorage.getItem("watchlist");
    return salvo ? JSON.parse(salvo) : CATALOGO_PADRAO;
  });
  const [filtros, setFiltros] = useState({
    genero: "",
    plataforma: "",
    status: "",
  });

  // Salvar no localStorage quando watchlist muda
  useEffect(() => {
    if (watchlist.length > 0) {
      localStorage.setItem("watchlist", JSON.stringify(watchlist));
    }
  }, [watchlist]);

  // Filtrar com .filter() encadeado por múltiplos critérios
  const watchlistFiltrada = watchlist.filter((item) => {
    const passaGenero = filtros.genero ? item.genero === filtros.genero : true;
    const passaPlataforma = filtros.plataforma ? item.plataforma === filtros.plataforma : true;
    const passaStatus = filtros.status ? item.status === filtros.status : true;
    
    return passaGenero && passaPlataforma && passaStatus;
  });

  function adicionarTitulo(titulo) {
    const novoId = Math.max(...watchlist.map(t => t.id), 0) + 1;
    const novoTitulo = {
      id: novoId,
      ...titulo,
      nota: 0,
    };
    setWatchlist([...watchlist, novoTitulo]);
  }

  function removerTitulo(id) {
    setWatchlist(watchlist.filter(t => t.id !== id));
  }

  function atualizarTitulo(id, atualizacoes) {
    setWatchlist(
      watchlist.map(t => t.id === id ? { ...t, ...atualizacoes } : t)
    );
  }

  function atualizarFiltros(novosFiltros) {
    setFiltros(novosFiltros);
  }

  function obterGeneros() {
    return [...new Set(watchlist.map(t => t.genero))].sort();
  }

  function obterPlataformas() {
    return [...new Set(watchlist.map(t => t.plataforma))].sort();
  }

  function obterStatus() {
    return ["quero assistir", "assistindo", "assistido"];
  }

  const value = {
    watchlist,
    watchlistFiltrada,
    filtros,
    adicionarTitulo,
    removerTitulo,
    atualizarTitulo,
    atualizarFiltros,
    obterGeneros,
    obterPlataformas,
    obterStatus,
  };

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
}
