import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Pages/css/form.css";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  // Hook do react-router-dom usado para redirecionar o usuário via código
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Validação com credenciais fixas, conforme requisito do exercício
    if (usuario === "admin" && senha === "123") {
      localStorage.setItem("usuarioLogado", "true"); // Persiste o login no navegador
      navigate("/dashboard"); // Redireciona para o painel restrito
    } else {
      setErro("Usuário ou senha inválidos. Dica: admin / 123");
    }
  };

  return (
    <div className="page-container login-page">
      <form className="item-form login-form" onSubmit={handleLogin}>
        <h2>Acesso Restrito</h2>
        {erro && <p className="error-message">{erro}</p>}

        <label>Usuário:</label>
        <input
          type="text"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          required
        />

        <label>Senha:</label>
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <button type="submit" className="btn-primary">
          Entrar
        </button>
      </form>
    </div>
  );
}
