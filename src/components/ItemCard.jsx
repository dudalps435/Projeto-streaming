export default function ItemCard({ filme }) {
  // Componente simples de apresentação (Dumb Component)
  // Ele apenas recebe os dados via props (filme) e os exibe
  return (
    <div className="item-card">
      {filme.imagem ? (
        <img
          src={filme.imagem}
          alt={`Capa do filme ${filme.titulo}`}
          style={{
            width: "100%",
            height: "250px",
            objectFit: "cover",
            borderRadius: "8px",
            marginBottom: "15px",
          }}
        />
      ) : (
        <div className="card-image-placeholder">🎥</div>
      )}

      <h3>{filme.titulo}</h3>
      <p>
        <strong>Gênero:</strong> {filme.genero}
      </p>
      <p>
        <strong>Ano:</strong> {filme.ano}
      </p>
    </div>
  );
}
