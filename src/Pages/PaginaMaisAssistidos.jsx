import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getWeeklyMostWatched } from '../services/TMDBService';
import { getPlatformLink, getRentBuyLink } from '../constants/marketLinks';

const CAPA_FALLBACK = '/capa-fallback.svg';

const PAISES = [
  { code: 'BR', nome: 'Brasil' },
  { code: 'US', nome: 'Estados Unidos' },
  { code: 'GB', nome: 'Reino Unido' },
  { code: 'MX', nome: 'Mexico' },
];

export default function PaginaMaisAssistidos() {
  const [pais, setPais] = useState('BR');
  const [catalogo, setCatalogo] = useState({
    filmesByPlatform: [],
    seriesByPlatform: [],
    sugestoesMistas: [],
  });
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      setCarregando(true);
      setErro('');
      try {
        const dados = await getWeeklyMostWatched(pais);
        if (ativo) setCatalogo(dados);
      } catch (e) {
        if (ativo) setErro('Nao foi possivel carregar os filmes da semana.');
        console.error(e);
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregar();
    const intervalo = setInterval(carregar, 1000 * 60 * 60 * 6);

    return () => {
      ativo = false;
      clearInterval(intervalo);
    };
  }, [pais]);

  function CardItem(item, chavePrefixo) {
    return (
      <article className="semana-card" key={`${chavePrefixo}-${pais}-${item.mediaType}-${item.id}`}>
        <img
          src={item.capa || CAPA_FALLBACK}
          alt={item.titulo}
          className="semana-poster"
          onError={(e) => { e.currentTarget.src = CAPA_FALLBACK; }}
        />
        <div className="semana-info">
          <h3>{item.titulo}</h3>
          <p className="semana-meta">{item.mediaType === 'tv' ? 'Serie' : 'Filme'} • ★ {item.avaliacao} • {item.ano}</p>
          <p className="semana-desc">{item.descricao?.slice(0, 140)}...</p>

          <div className="semana-tags">
            {(item.watchPlatforms || []).map((p) => (
              <a key={p} href={getPlatformLink(p)} target="_blank" rel="noopener noreferrer" className="tag-watch">
                {p}
              </a>
            ))}
          </div>

          <div className="semana-botoes">
            <a
              href={(item.watchPlatforms && item.watchPlatforms[0]) ? getPlatformLink(item.watchPlatforms[0]) : '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-semana btn-watch"
            >
              Onde assistir
            </a>
            <a href={item.trailerUrl} target="_blank" rel="noopener noreferrer" className="btn-semana btn-trailer">
              Assistir trailer
            </a>
            <a
              href={(item.rentBuyPlatforms && item.rentBuyPlatforms[0])
                ? getRentBuyLink(item.rentBuyPlatforms[0], item.titulo)
                : getRentBuyLink('', item.titulo)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-semana btn-rent"
            >
              Alugar/Comprar
            </a>
          </div>
        </div>
      </article>
    );
  }

  return (
    <div className="pagina-semana">
      <div className="semana-topo">
        <div>
          <h1>Mais Assistidos da Semana</h1>
          <p>Atualizacao automatica a cada 6 horas com links oficiais.</p>
        </div>

        <div className="semana-acoes-topo">
          <select value={pais} onChange={(e) => setPais(e.target.value)}>
            {PAISES.map((p) => (
              <option key={p.code} value={p.code}>{p.nome}</option>
            ))}
          </select>
          <Link to="/" className="btn-voltar-semana">Voltar</Link>
        </div>
      </div>

      {carregando && <div className="semana-loading">Carregando filmes e series...</div>}
      {erro && <div className="semana-erro">{erro}</div>}

      <section className="semana-secao">
        <h2>Filmes por plataforma</h2>
        {catalogo.filmesByPlatform.map((grupo) => (
          <div key={`filmes-${grupo.plataforma}`} className="semana-grupo">
            <h3 className="semana-grupo-titulo">{grupo.plataforma}</h3>
            <div className="semana-grid">
              {grupo.itens.map((item) => CardItem(item, `filme-${grupo.plataforma}`))}
            </div>
          </div>
        ))}
      </section>

      <section className="semana-secao">
        <h2>Series por plataforma</h2>
        {catalogo.seriesByPlatform.map((grupo) => (
          <div key={`series-${grupo.plataforma}`} className="semana-grupo">
            <h3 className="semana-grupo-titulo">{grupo.plataforma}</h3>
            <div className="semana-grid">
              {grupo.itens.map((item) => CardItem(item, `serie-${grupo.plataforma}`))}
            </div>
          </div>
        ))}
      </section>

      <section className="semana-secao">
        <h2>Sugestoes mistas (filmes + series)</h2>
        <div className="semana-grid">
          {catalogo.sugestoesMistas.map((item) => CardItem(item, 'mix'))}
        </div>
      </section>
    </div>
  );
}
