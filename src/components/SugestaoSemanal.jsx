import { useState, useEffect } from 'react';
import { obterSugestoes, atualizarSugestoes, tempoParaProximaAtualizacao } from '../services/SugestaoService';
import './SugestaoSemanal.css';
import { obterURLPlataforma } from '../constants/plataformas';

const CAPA_FALLBACK = '/capa-fallback.svg';

export function SugestaoSemanal() {
  const [sugestoes, setSugestoes] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [filtro, setFiltro] = useState('todas');

  useEffect(() => {
    const dados = obterSugestoes();
    setSugestoes(dados);
  }, []);

  async function handleAtualizar() {
    setCarregando(true);
    setErro(null);
    try {
      const dados = await atualizarSugestoes();
      setSugestoes(dados);
    } catch (e) {
      setErro('Erro ao atualizar sugestões. Verifique sua conexão.');
      console.error(e);
    } finally {
      setCarregando(false);
    }
  }

  function formatarData(iso) {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  if (!sugestoes) {
    return <div className="sugestao-carregando">Carregando sugestões...</div>;
  }

  const filmesFiltrados = sugestoes.filmes.filter((filme) => {
    if (filtro === 'nota-alta') return Number(filme.avaliacao) >= 8.5;
    if (filtro === 'recentes') return Number(filme.ano) >= 2018;
    return true;
  });

  return (
    <section className="sugestao-semanal">
      <div className="sugestao-header">
        <div>
          <h2>🎬 Sugestões Semanais</h2>
          <p className="sugestao-atualizada">
            Atualizado em {formatarData(sugestoes.ultimaAtualizacao)} • Próxima em {tempoParaProximaAtualizacao(sugestoes.ultimaAtualizacao)}
          </p>
          <div className="sugestao-filtros">
            <button
              className={`btn-filtro ${filtro === 'todas' ? 'ativo' : ''}`}
              onClick={() => setFiltro('todas')}
            >
              Todas
            </button>
            <button
              className={`btn-filtro ${filtro === 'nota-alta' ? 'ativo' : ''}`}
              onClick={() => setFiltro('nota-alta')}
            >
              Nota 8.5+
            </button>
            <button
              className={`btn-filtro ${filtro === 'recentes' ? 'ativo' : ''}`}
              onClick={() => setFiltro('recentes')}
            >
              Recentes
            </button>
          </div>
        </div>
        <button
          className="btn-atualizar"
          onClick={handleAtualizar}
          disabled={carregando}
        >
          {carregando ? '⏳ Atualizando...' : '🔄 Atualizar Agora'}
        </button>
      </div>

      {erro && <div className="sugestao-erro">{erro}</div>}

      <div className="sugestoes-grid">
        {filmesFiltrados.map((filme) => (
          <div key={filme.id} className="sugestao-card">
            <div className="sugestao-imagem">
              <img
                src={filme.capa || CAPA_FALLBACK}
                alt={filme.titulo}
                onError={(e) => { e.currentTarget.src = CAPA_FALLBACK; }}
              />
              <span className="sugestao-nota">★ {filme.avaliacao}</span>
              {typeof filme.score === 'number' && (
                <span className="sugestao-score">Score {filme.score}</span>
              )}
            </div>

            <div className="sugestao-info">
              <h3>{filme.titulo}</h3>
              <p className="sugestao-ano">{filme.ano}</p>
              <p className="sugestao-descricao">{filme.descricao.substring(0, 100)}...</p>

              <div className="sugestao-plataformas">
                {filme.plataformas && filme.plataformas.map((plat) => (
                  <a
                    key={plat}
                    href={obterURLPlataforma(plat)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`badge-plataforma badge-${plat.toLowerCase().replace('+', 'plus')} plataforma-badge-link`}
                    title={`Assistir ${filme.titulo} em ${plat}`}
                  >
                    {plat} 🔗
                  </a>
                ))}
              </div>

              <div className="sugestao-acoes">
                {filme.trailerUrl && (
                  <a
                    href={filme.trailerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-sugestao-trailer"
                  >
                    Ver trailer
                  </a>
                )}
                {filme.plataformas?.[0] && (
                  <a
                    href={obterURLPlataforma(filme.plataformas[0])}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-sugestao-watch"
                  >
                    Onde assistir
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="sugestao-info-rodape">
        <p>
          ✨ Sugestões baseadas em filmes top do TMDB (The Movie Database)
        </p>
        <p>🔄 Atualizadas automaticamente toda segunda-feira</p>
      </div>
    </section>
  );
}
