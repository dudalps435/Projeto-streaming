import { useContext } from "react";
import { WatchlistContext } from "../contexts/WatchlistContext";
import "./FiltroBar.css";

export function FiltroBar() {
  const {
    filtros,
    atualizarFiltros,
    obterGeneros,
    obterPlataformas,
    obterStatus,
    watchlist,
    watchlistFiltrada,
  } = useContext(WatchlistContext);

  function handleMudar(e) {
    const { name, value } = e.target;
    atualizarFiltros({
      ...filtros,
      [name]: value,
    });
  }

  function limparFiltros() {
    atualizarFiltros({
      genero: "",
      plataforma: "",
      status: "",
    });
  }

  return (
    <div className="filtro-bar">
      <div className="filtro-bar-container">
        <h3 className="filtro-bar-titulo">Filtrar por:</h3>

        <div className="filtro-bar-controles">
          <div className="filtro-grupo">
            <label htmlFor="filtro-genero">Gênero</label>
            <select
              id="filtro-genero"
              name="genero"
              value={filtros.genero}
              onChange={handleMudar}
            >
              <option value="">Todos</option>
              {obterGeneros().map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div className="filtro-grupo">
            <label htmlFor="filtro-plataforma">Plataforma</label>
            <select
              id="filtro-plataforma"
              name="plataforma"
              value={filtros.plataforma}
              onChange={handleMudar}
            >
              <option value="">Todas</option>
              {obterPlataformas().map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="filtro-grupo">
            <label htmlFor="filtro-status">Status</label>
            <select
              id="filtro-status"
              name="status"
              value={filtros.status}
              onChange={handleMudar}
            >
              <option value="">Todos</option>
              {obterStatus().map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <button className="btn-limpar" onClick={limparFiltros}>
            Limpar filtros
          </button>
        </div>

        <div className="filtro-bar-resumo">
          <p>
            Mostrando <strong>{watchlistFiltrada.length}</strong> de{" "}
            <strong>{watchlist.length}</strong> títulos
            {filtros.genero && ` • Gênero: ${filtros.genero}`}
            {filtros.plataforma && ` • Plataforma: ${filtros.plataforma}`}
            {filtros.status && ` • Status: ${filtros.status}`}
          </p>
        </div>
      </div>
    </div>
  );
}
