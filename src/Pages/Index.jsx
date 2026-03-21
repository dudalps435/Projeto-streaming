import { useState, useEffect } from "react";
import ItemCard from "../components/ItemCard";
import "../Pages/css/index.css";

export default function Index() {
  const [filmes, setFilmes] = useState([]);
  const [indiceAtual, setIndiceAtual] = useState(0);

  // Carrega os filmes do localStorage ao montar o componente
  useEffect(() => {
    const filmesSalvos = JSON.parse(localStorage.getItem("filmesDB")) || [];
    setFilmes(filmesSalvos);
  }, []);

  // Funções do Carrossel Didático
  const proximoSlide = () => {
    // Se chegar no final, volta para o primeiro (0)
    setIndiceAtual((prev) => (prev === filmes.length - 1 ? 0 : prev + 1));
  };

  const slideAnterior = () => {
    // Se estiver no primeiro, vai para o último
    setIndiceAtual((prev) => (prev === 0 ? filmes.length - 1 : prev - 1));
  };

  return (
    <div className="page-container index-page">
      <h1>Catálogo de Filmes</h1>
      <p>Bem-vindo ao sistema didático de cadastro de filmes!</p>

      {filmes.length === 0 ? (
        <p className="empty-catalog">
          Nenhum filme disponível. Faça login e acesse o Dashboard para
          cadastrar.
        </p>
      ) : (
        <div className="carousel-container">
          <button className="carousel-btn" onClick={slideAnterior}>
            {"<"}
          </button>

          {/* Container que esconde os itens fora da visão */}
          <div className="carousel-viewport">
            {/* A trilha que se movimenta usando transformX do CSS */}
            <div
              className="carousel-track"
              style={{ transform: `translateX(-${indiceAtual * 100}%)` }}
            >
              {filmes.map((filme) => (
                <div className="carousel-slide" key={filme.id}>
                  <ItemCard filme={filme} />
                </div>
              ))}
            </div>
          </div>

          <button className="carousel-btn" onClick={proximoSlide}>
            {">"}
          </button>
        </div>
      )}
    </div>
  );
}
