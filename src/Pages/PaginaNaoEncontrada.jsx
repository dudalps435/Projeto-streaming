import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PaginaNaoEncontrada() {
  const navigate = useNavigate();
  const [contagem, setContagem] = useState(10);

  useEffect(() => {
    if (contagem <= 0) {
      navigate("/");
      return;
    }
    const t = setTimeout(() => setContagem((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [contagem, navigate]);

  return (
    <div className="pagina-404">
      <div className="erro-404">404</div>

      <div className="divisor-404" />

      <h2 className="titulo-404">Página não encontrada</h2>

      <p className="descricao-404">
        O conteúdo que você buscou não existe ou foi removido do catálogo.
        Que tal explorar o que temos disponível?
      </p>

      <p className="contagem-404">
        Redirecionando para o início em <span className="contagem-numero">{contagem}s</span>
      </p>

      <div className="acoes-404">
        <button className="btn-primario" onClick={() => navigate("/")}>
          ▶ Ir para o Início
        </button>
        <button className="btn-secundario" onClick={() => navigate(-1)}>
          ← Voltar
        </button>
      </div>
    </div>
  );
}