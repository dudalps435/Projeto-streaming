import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { WatchlistContext } from "../contexts/WatchlistContext";
import { FiltroBar } from "../components/FiltroBar";
import { TituloCard } from "../components/TituloCard";
import { FormNovoTitulo } from "../components/FormNovoTitulo";

export default function PaginaWatchlist() {
  const navigate = useNavigate();
  const { watchlistFiltrada, watchlist } = useContext(WatchlistContext);

  return (
    <div className="pagina-watchlist">
      <div className="watchlist-header">
        <button className="btn-voltar" onClick={() => navigate(-1)}>
          ← Voltar
        </button>
        <h1>Minha Watchlist</h1>
        <p className="watchlist-resumo">
          {watchlist.length} títulos • {watchlistFiltrada.length} visível
          {watchlistFiltrada.length !== watchlist.length ? "s filtrados" : "s"}
        </p>
      </div>

      <FormNovoTitulo />

      <FiltroBar />

      {watchlistFiltrada.length > 0 ? (
        <div className="watchlist-container">
          {watchlistFiltrada.map((titulo) => (
            <TituloCard key={titulo.id} titulo={titulo} />
          ))}
        </div>
      ) : (
        <div className="watchlist-vazia">
          <h2>Nenhum título encontrado</h2>
          <p>
            {watchlist.length === 0
              ? "Sua watchlist está vazia. Adicione alguns títulos!"
              : "Nenhum título corresponde aos filtros selecionados."}
          </p>
          <button className="btn-primario" onClick={() => window.location.reload()}>
            Limpar filtros
          </button>
        </div>
      )}
    </div>
  );
}