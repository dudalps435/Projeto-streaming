import { useState, useContext } from "react";
import { WatchlistContext } from "../contexts/WatchlistContext";
import "./FormNovoTitulo.css";

export function FormNovoTitulo() {
  const { adicionarTitulo } = useContext(WatchlistContext);
  const [abrindo, setAbrindo] = useState(false);
  const [dados, setDados] = useState({
    titulo: "",
    genero: "",
    plataforma: "Netflix",
    status: "quero assistir",
    tipo: "filme",
    ano: new Date().getFullYear(),
  });

  function handleMudar(e) {
    const { name, value } = e.target;
    setDados({ ...dados, [name]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    
    if (!dados.titulo.trim()) {
      alert("Por favor, digite o título!");
      return;
    }

    adicionarTitulo({
      ...dados,
      ano: Number(dados.ano),
    });

    // Limpar formulário
    setDados({
      titulo: "",
      genero: "",
      plataforma: "Netflix",
      status: "quero assistir",
      tipo: "filme",
      ano: new Date().getFullYear(),
    });
    
    setAbrindo(false);
    alert("✓ Título adicionado com sucesso!");
  }

  return (
    <div className="form-novo-titulo">
      {!abrindo ? (
        <button className="btn-adicionar" onClick={() => setAbrindo(true)}>
          + Adicionar Título
        </button>
      ) : (
        <div className="form-novo-titulo-container">
          <h3>Novo Título</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="form-grupo">
              <label>Título *</label>
              <input
                type="text"
                name="titulo"
                value={dados.titulo}
                onChange={handleMudar}
                placeholder="Ex: O Poder do Hábito"
                required
              />
            </div>

            <div className="form-grupo">
              <label>Tipo</label>
              <select name="tipo" value={dados.tipo} onChange={handleMudar}>
                <option value="filme">Filme</option>
                <option value="serie">Série</option>
              </select>
            </div>

            <div className="form-grupo">
              <label>Gênero</label>
              <input
                type="text"
                name="genero"
                value={dados.genero}
                onChange={handleMudar}
                placeholder="Ex: Drama"
              />
            </div>

            <div className="form-grupo">
              <label>Plataforma</label>
              <select name="plataforma" value={dados.plataforma} onChange={handleMudar}>
                <option value="Netflix">Netflix</option>
                <option value="Prime">Prime Video</option>
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
              <label>Ano</label>
              <input
                type="number"
                name="ano"
                value={dados.ano}
                onChange={handleMudar}
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>

            <div className="form-novo-titulo-acoes">
              <button type="submit" className="btn-primario">
                Adicionar
              </button>
              <button
                type="button"
                className="btn-secundario"
                onClick={() => setAbrindo(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
