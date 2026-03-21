import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Header() {
  // Estado para controlar se o usuário está logado, para mudar os botões do menu
  const [isLogged, setIsLogged] = useState(false);

  // O useEffect verifica o localStorage sempre que o componente é montado.
  // Como o Header não recarrega entre navegações simples (React Router),
  // usamos um pequeno truque de ouvir o evento 'storage' ou checar a cada clique (simples).
  useEffect(() => {
    const checkLogin = () => {
      const logged = localStorage.getItem("usuarioLogado") === "true";
      setIsLogged(logged);
    };

    checkLogin();
    // Adicionamos um listener de clique para reavaliar o menu ao mudar de tela
    window.addEventListener("click", checkLogin);
    return () => window.removeEventListener("click", checkLogin);
  }, []);

  return (
    <header className="main-header">
      <div className="logo">
        <Link to="/">🎬 CineEstudo</Link>
      </div>
      <nav className="main-nav">
        <Link to="/">Início</Link>
        {isLogged ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/logout" className="btn-logout">
              Sair
            </Link>
          </>
        ) : (
          <Link to="/login" className="btn-login">
            Login
          </Link>
        )}
      </nav>
    </header>
  );
}
