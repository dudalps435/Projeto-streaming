export default function ItemList({ filmes, onEditar, onRemover }) {
  // Verifica se a lista está vazia
  if (filmes.length === 0) {
    return (
      <p className="empty-message">
        Nenhum filme cadastrado. Adicione um acima!
      </p>
    );
  }

  return (
    <div className="item-list">
      <h2>Filmes Cadastrados</h2>
      <table className="list-table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Gênero</th>
            <th>Ano</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filmes.map((filme) => (
            <tr key={filme.id}>
              <td>{filme.titulo}</td>
              <td>{filme.genero}</td>
              <td>{filme.ano}</td>
              <td>
                <button onClick={() => onEditar(filme)} className="btn-edit">
                  Editar
                </button>
                <button
                  onClick={() => onRemover(filme.id)}
                  className="btn-delete"
                >
                  Remover
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
