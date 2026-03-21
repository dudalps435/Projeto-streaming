import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { WatchlistContext } from "../contexts/WatchlistContext";
import { obterURLPlataforma } from "../constants/plataformas";
import "./TituloCard.css";

export function TituloCard({ titulo }) {
  const navigate = useNavigate();
  const { removerTitulo, atualizarTitulo } = useContext(WatchlistContext);
  const [editando, setEditando] = useState(false);
  const [confirmandoRemocao, setConfirmandoRemocao] = useState(false);
  const [dados, setDados] = useState(titulo);

  function handleSalvar() {
    atualizarTitulo(titulo.id, dados);
    setEditando(false);
  }

  function handleRemover() {
    if (confirmandoRemocao) {
      removerTitulo(titulo.id);
    } else {
      setConfirmandoRemocao(true);
      setTimeout(() => setConfirmandoRemocao(false), 2500);
    }
  }

  function handleMudar(e) {
    const { name, value } = e.target;
    setDados({ ...dados, [name]: value });
  }

  const statusCores = {
    "quero assistir": "#ff6b6b",
    "assistindo": "#ffd93d",
    "assistido": "#6bcf7f",
  };

  return (
    <div className="titulo-card">
      <div className="titulo-card-header">
        <h3 className="titulo-card-titulo">{titulo.titulo}</h3>
        <span className="titulo-card-tipo">{titulo.tipo === "serie" ? "Série" : "Filme"}</span>
      </div>

      {!editando ? (
        <div className="titulo-card-info">
          <div className="titulo-card-meta">
            <span><strong>Gênero:</strong> {titulo.genero}</span>
              <span>
                <strong>Plataforma:</strong>{" "}
                <a 
                  href={obterURLPlataforma(titulo.plataforma)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="plataforma-link"
                >
                  {titulo.plataforma} 🔗
                </a>
              </span>
            <span><strong>Ano:</strong> {titulo.ano}</span>
          </div>

          <div className="titulo-card-status">
            <span
              className="titulo-card-status-badge"
              style={{ backgroundColor: statusCores[titulo.status] }}
            >
              {titulo.status}
            </span>
            <span className="titulo-card-nota">
              ★ {titulo.nota > 0 ? titulo.nota : "—"} / 5
            </span>
          </div>

          <div className="titulo-card-acoes">
            <button
              className="btn-sm btn-primario"
              onClick={() => navigate(`/titulo/${titulo.id}`)}
            >
              Ver detalhes
            </button>
            <button
              className="btn-sm btn-secundario"
              onClick={() => setEditando(true)}
            >
              Editar
            </button>
            <button
              className={`btn-sm btn-remover ${confirmandoRemocao ? "btn-remover-confirmando" : ""}`}
              onClick={handleRemover}
            >
              {confirmandoRemocao ? "Confirmar?" : "Remover"}
            </button>
          </div>
        </div>
      ) : (
        <div className="titulo-card-editar">
          <div className="form-grupo">
            <label>Gênero</label>
            <input
              type="text"
              name="genero"
              value={dados.genero}
              onChange={handleMudar}
            />
          </div>

          <div className="form-grupo">
            <label>Plataforma</label>
            <select name="plataforma" value={dados.plataforma} onChange={handleMudar}>
              <option value="Netflix">Netflix</option>
              <option value="Prime">Prime</option>
              <option value="Disney+">Disney+</option>
            </select>
          </div>

          <div className="form-grupo">
            <label>Status</label>
            <select name="status" value={dados.status} onChange={handleMudar}>
              <option value="quero assistir">Quero assistir</option>
              <option value="assistindo">Assistindo</option>
              <option value="assistido">Assistido</option>
            </select>
          </div>

          <div className="form-grupo">
            <label>Nota (1-5)</label>
            <select name="nota" value={dados.nota} onChange={handleMudar}>
              <option value="0">Sem nota</option>
              <option value="1">1 - Ruim</option>
              <option value="2">2 - Fraco</option>
              <option value="3">3 - Bom</option>
              <option value="4">4 - Muito bom</option>
              <option value="5">5 - Excelente</option>
            </select>
          </div>

          <div className="titulo-card-editar-acoes">
            <button className="btn-sm btn-primario" onClick={handleSalvar}>
              Salvar
            </button>
            <button className="btn-sm btn-secundario" onClick={() => setEditando(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
