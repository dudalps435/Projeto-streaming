import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Limpa os dados de autenticação do LocalStorage
    localStorage.removeItem("usuarioLogado");

    // Opcional: localStorage.clear(); se quiser apagar os filmes também
    // Mas como o requisito é simular o encerramento da sessão, limpamos apenas o login.

    navigate("/"); // Redireciona para a tela inicial
  }, [navigate]);

  return <p>Saindo...</p>; // Mensagem temporária enquanto o useEffect roda
}
