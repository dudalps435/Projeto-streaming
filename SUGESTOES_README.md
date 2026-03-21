# Sistema de Sugestões Semanais

## 📋 Descripção
Sistema automático que atualiza sugestões de filmes toda semana baseado em:
- **TMDB API** (The Movie Database) - Top 250 filmes
- **Plataformas de Streaming** - Netflix, Prime, Disney+, HBO Max
- **LocalStorage** - Sincronização automática

## 🚀 Como Funciona

### 1. Serviço de Sugestões (`SugestaoService.js`)
```javascript
// Busca filmes top do TMDB
buscarFilmesTop()

// Atualiza sugestões no localStorage
atualizarSugestoes()

// Obtém sugestões de cache
obterSugestoes()

// Agenda atualização semanal
agendar()
```

### 2. Componente (`SugestaoSemanal.jsx`)
- Exibe 5 filmes tops da semana
- Mostra plataformas onde estão disponíveis
- Botão para atualizar manualmente
- Responsivo para todos os tamanhos

### 3. Agendamento Automático
- **Frequência**: Toda segunda-feira às 00:00 (automático)
- **Dados**: Sincronizados no localStorage
- **Fallback**: Dados padrão em caso de erro

## 🔑 Configuração da API TMDB

1. **Obter chave gratuita** em: https://www.themoviedb.org/settings/api
2. **Substituir em `SugestaoService.js`**:
```javascript
const TMDB_API_KEY = 'sua-chave-aqui';
```

## 📊 Dados de Plataformas

Atualmente:
- **Netflix**: Filmes top e exclusivos
- **Prime Video**: Acervo expansivo
- **Disney+**: Filmes Disney, Marvel, Pixar
- **HBO Max**: Conteúdo HBO

**Nota**: Para dados em tempo real, integrar com JustWatch API ou similar.

## 💾 LocalStorage

Estrutura dos dados salvos:
```json
{
  "sugestoesSemanais": {
    "filmes": [
      {
        "id": 550,
        "titulo": "Clube da Luta",
        "genero": "Drama",
        "ano": 1999,
        "avaliacao": "8.8",
        "plataformas": ["Netflix", "Prime"],
        "capa": "url"
      }
    ],
    "ultimaAtualizacao": "2024-03-19T00:00:00Z"
  }
}
```

## 🔔 Notificações (Planejado)

Implementar notificações via:
- Email com novos filmes
- Push notifications do navegador
- Webhook para integração external

## 📱 Responsividade

- Desktop: Grid 1-3 colunas
- Tablet: Grid 2x2
- Mobile: Grid de 2 colunas

## 🐛 Troubleshooting

### Erro de API
→ Verifique a chave TMDB_API_KEY
→ Confira limite de requisições (40 req/10s)

### Dados Não Atualizam
→ Verificar localStorage (DevTools → Storage)
→ Clicar em "Atualizar Agora"

### Imagens Não Carregam
→ Verificar conexão com TMDB image server
→ Pode usar URLs fallback do Unsplash

## 📝 Próximas Melhorias

- [ ] JustWatch API para disponibilidade real
- [ ] Banco de dados para histórico
- [ ] Sistema de favoritos por país
- [ ] Email digest semanal
- [ ] Integração com Telegram/Discord
