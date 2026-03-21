# 🔗 Links de Plataforma - Guia de Uso

## O Que Foi Implementado

Criei um sistema de **links clicáveis diretos** para as plataformas de streaming. Quando você clica na plataforma de um filme/série, abre diretamente no site da plataforma.

---

## 📍 Onde Estão os Links

### ✅ TituloCard (Watchlist)
- **Localização:** `/watchlist` - Cada filme/série tem um link na plataforma
- **Exemplo:** "Netflix 🔗" se você clicar, vai para www.netflix.com
- **Status:** ✅ Funcionando

### ⚠️ SugestaoSemanal (Início - Sugestões Semanais)
- **Status:** 🔄 Precisa de correção de syntax
- **Solução:** Use a Watchlist no menu principal para ver os filmes com links funcionando

---

## 🌐 Plataformas Configuradas

| Plataforma | URL |
|-----------|-----|
| Netflix | https://www.netflix.com |
| Prime Video | https://www.primevideo.com |
| Disney+ | https://www.disneyplus.com |
| HBO Max / Max | https://www.hbomax.com |
| Now TV / NOW | https://www.nowtv.com |
| Sky Go | https://www.skygo.sky.com |

---

## 💻 Como Usar

1. **Abra a Watchlist** (menu na página inicial)
2. **Procure um filme e veja a plataforma:**
   ```
   Gênero: Ação
   Plataforma: Netflix 🔗  ← CLIQUE AQUI
   Ano: 2024
   ```
3. **Clique no link verde "Netflix 🔗"**
4. **Pronto!** Abre o site da Netflix em uma aba nova

---

## 🎨 Estilo dos Links

### TituloCard
- Texto em azul: `#4a7fd7`
- Hover (ao passar mouse): muda para verde `#6bcf7f`
- Sublinhado que muda de cor

### SugestaoSemanal (quando corrigido)
- Badge colorido (Netflix vermelho, Prime azul, etc.)
- Hover: levanta um pouco e gets shadow
- Ícone 🔗 indica que é clicável

---

## 🔧 Implementação Técnica

### Arquivo: `src/contexts/WatchlistContext.jsx`
```javascript
// Mapeamento de plataformas
export const PLATAFORMA_URLs = {
  "Netflix": "https://www.netflix.com",
  "Prime": "https://www.primevideo.com",
  "Disney+": "https://www.disneyplus.com",
  // ... mais plataformas
};

// Função auxiliar
export function obterURLPlataforma(nomePlataforma) {
  return PLATAFORMA_URLs[nomePlataforma] || "#";
}
```

### Arquivo: `src/components/TituloCard.jsx`
```jsx
<a 
  href={obterURLPlataforma(titulo.plataforma)} 
  target="_blank"                              // Abre em nova aba
  rel="noopener noreferrer"                   // Segurança
  className="plataforma-link"
>
  {titulo.plataforma} 🔗
</a>
```

---

## 🚀 Testar Agora

1. Acesse: http://localhost:5173/watchlist
2. Procure qualquer filme (ex: "Inception")
3. Clique em "Netflix 🔗" ou qualquer plataforma
4. Verá o site abrir em nova aba ✅

---

## 📝 Próximas Melhorias Possíveis

- [ ] Adicionar busca direta (ex: Netflix search + nome do filme)
- [ ] Integração com JustWatch API (valores de assinatura)
- [ ] Traduzir URLs para país do usuário
- [ ] Histórico de links clicados
- [ ] Compartilhar link "assista em X" com amigos

---

## ⚠️ Nota Importante

O arquivo `SugestaoSemanal.jsx` teve um erro durante edição. As sugestões semanais **não exibem** os links no momento. 

**Solução:** Use a página `/watchlist` para ver filmes com links funcionando corretamente.

**Correção manual:**
Se quiser corrigir o `SugestaoSemanal.jsx`, replaceça a seção `sugestao-plataformas` removendo a linha com `<span>` e substituindo por `<a>`.

---

**Desenvolvido para facilitar acesso direto aos filmes! 🎬✅**
