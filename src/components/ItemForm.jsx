import { useState, useEffect } from "react";
import "../Pages/css/form.css";

export default function ItemForm({
  onSalvar,
  filmeEmEdicao,
  setFilmeEmEdicao,
}) {
  // Estados locais para controlar os campos do formulário
  const [titulo, setTitulo] = useState("");
  const [genero, setGenero] = useState("");
  const [ano, setAno] = useState("");
  const [imagem, setImagem] = useState("");

  // useEffect monitora a prop 'filmeEmEdicao'. Se ela mudar, preenchemos o form.
  // Isso acontece quando o usuário clica em "Editar" na lista.
  useEffect(() => {
    if (filmeEmEdicao) {
      setTitulo(filmeEmEdicao.titulo);
      setGenero(filmeEmEdicao.genero);
      setAno(filmeEmEdicao.ano);
      setImagem(filmeEmEdicao.imagem || "");
    }
  }, [filmeEmEdicao]);

  // Função chamada ao enviar o formulário
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita o recarregamento da página

    // Monta o objeto com os dados digitados
    const filmeData = {
      id: filmeEmEdicao ? filmeEmEdicao.id : Date.now(), // Se editando, mantém o ID. Senão, gera um novo.
      titulo,
      genero,
      ano,
      imagem,
    };

    // Envia os dados para o componente pai (Dashboard)
    onSalvar(filmeData);

    // Limpa o formulário após salvar
    setTitulo("");
    setGenero("");
    setAno("");
    setImagem("");
    setFilmeEmEdicao(null);
  };

  return (
    <form className="item-form" onSubmit={handleSubmit}>
      <h2>{filmeEmEdicao ? "Editar Filme" : "Cadastrar Novo Filme"}</h2>

      <label>Título:</label>
      <input
        type="text"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        required
      />

      <label>Gênero:</label>
      <input
        type="text"
        value={genero}
        onChange={(e) => setGenero(e.target.value)}
        required
      />

      <label>Ano de Lançamento:</label>
      <input
        type="number"
        value={ano}
        onChange={(e) => setAno(e.target.value)}
        required
      />

      <label>URL da Imagem da Capa (Opcional):</label>
      <input
        type="url"
        value={imagem}
        onChange={(e) => setImagem(e.target.value)}
        placeholder="https://exemplo.com/capa.jpg"
      />

      <div className="form-actions">
        <button type="submit" className="btn-primary">
          {filmeEmEdicao ? "Atualizar Filme" : "Cadastrar"}
        </button>
        {/* Botão de cancelar só aparece se estivermos editando */}
        {filmeEmEdicao && (
          <button
            type="button"
            onClick={() => setFilmeEmEdicao(null)}
            className="btn-secondary"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
