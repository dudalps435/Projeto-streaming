import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ItemForm from "../components/ItemForm";
import ItemList from "../components/ItemList";

export default function Dashboard() {
  const navigate = useNavigate();
  const [filmes, setFilmes] = useState([]);
  const [filmeEmEdicao, setFilmeEmEdicao] = useState(null);

  // 1. Proteção de Rota e carregamento de dados
  useEffect(() => {
    const logado = localStorage.getItem("usuarioLogado");
    if (logado !== "true") {
      navigate("/login"); // Expulsa o usuário não autenticado
    } else {
      // Carrega filmes do LocalStorage
      const dadosSalvos = JSON.parse(localStorage.getItem("filmesDB")) || [];
      setFilmes(dadosSalvos);
    }
  }, [navigate]);

  // Função para salvar no LocalStorage sempre que o estado 'filmes' mudar
  const salvarNoStorage = (novaLista) => {
    setFilmes(novaLista); // Atualiza estado na tela
    localStorage.setItem("filmesDB", JSON.stringify(novaLista)); // Salva na memória
  };

  // CRUD: CREATE e UPDATE
  const handleSalvarFilme = (filmeData) => {
    if (filmeEmEdicao) {
      // Editando: encontra o filme antigo pelo ID e substitui pelos dados novos
      const listaAtualizada = filmes.map((f) =>
        f.id === filmeData.id ? filmeData : f,
      );
      salvarNoStorage(listaAtualizada);
    } else {
      // Cadastrando: adiciona o novo filme no final do array
      const novaLista = [...filmes, filmeData];
      salvarNoStorage(novaLista);
    }
  };

  // CRUD: DELETE
  const handleRemoverFilme = (id) => {
    if (window.confirm("Deseja realmente remover este filme?")) {
      const listaFiltrada = filmes.filter((f) => f.id !== id); // Remove o ID selecionado
      salvarNoStorage(listaFiltrada);
    }
  };

  return (
    <div className="page-container dashboard-page">
      <h1>Painel de Controle</h1>
      <p>Gerencie seu catálogo de filmes abaixo.</p>

      <ItemForm
        onSalvar={handleSalvarFilme}
        filmeEmEdicao={filmeEmEdicao}
        setFilmeEmEdicao={setFilmeEmEdicao}
      />
      <ItemList
        filmes={filmes}
        onEditar={setFilmeEmEdicao}
        onRemover={handleRemoverFilme}
      />
    </div>
  );
}
