# 📁 Estrutura Completa do Projeto - Watchlist App

```
Projeto-Modulo-4-main/
│
├─ 📄 server.js ⭐ NOVO
│  └─ Express API com todas as integrações
│     ├─ Rotas de Email, Push, Telegram, Discord
│     ├─ Agendamento automático (node-schedule)
│     └─ Health check endpoints
│
├─ 📄 package.json ✏️ MODIFICADO
│  ├─ Scripts: dev, server, dev:full, build, lint
│  └─ Dependências: nodemailer, web-push, express, cors, dotenv, axios, node-schedule
│
├─ 📄 .env.example ✏️ ATUALIZADO
│  ├─ EMAIL_USER, EMAIL_PASS (Gmail)
│  ├─ VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY (Push)
│  ├─ TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
│  ├─ DISCORD_WEBHOOK_URL
│  └─ TMDB_API_KEY
│
├─ 📄 vite.config.js
│
├─ 📄 eslint.config.js
│
├─ 📄 index.html
│
├─ 📄 README.md
│
├─ 📄 QUICK_START.md ⭐ NOVO
│  └─ Guia rápido de setup (5 min)
│
├─ 📄 INTEGRATIONS_GUIDE.md ⭐ NOVO
│  └─ Guia completo das integrações (referência)
│
├─ 📄 IMPLEMENTATION_SUMMARY.md ⭐ NOVO
│  └─ Resumo técnico do que foi implementado
│
├─ 📁 public/
│  └─ 📄 sw.js ⭐ NOVO
│     └─ Service Worker para Web Push Notifications
│        ├─ Listener de push
│        ├─ Handler de clique
│        └─ Redirect após notificação
│
├─ 📁 src/
│  │
│  ├─ 📄 App.jsx ✏️ MODIFICADO
│  │  ├─ Rota: / → PaginaInicio
│  │  ├─ Rota: /watchlist → PaginaWatchlist
│  │  ├─ Rota: /titulo/:id → PaginaDetalhes
│  │  ├─ Rota: /notificacoes → PaginaNotificacoes ⭐ NOVO
│  │  └─ Rota: * → PaginaNaoEncontrada
│  │
│  ├─ 📄 App.css ✏️ MODIFICADO
│  │  └─ Novo: .btn-notificacoes-flutuante
│  │     ├─ Botão circular azul 🔔
│  │     ├─ Posicionado top-right
│  │     └─ Responsivo para mobile
│  │
│  ├─ 📄 main.jsx
│  │  └─ BrowserRouter + WatchlistProvider
│  │
│  ├─ 📄 index.css
│
│  ├─ 📁 Pages/
│  │  │
│  │  ├─ 📄 PaginaInicio.jsx ✏️ MODIFICADO
│  │  │  ├─ Banner com filme em destaque
│  │  │  ├─ Catálogo de filmes/séries
│  │  │  ├─ Componente SugestaoSemanal
│  │  │  ├─ Botão flutuante watchlist (verde)
│  │  │  └─ Botão flutuante notificacoes (azul) ⭐ NOVO
│  │  │
│  │  ├─ 📄 PaginaWatchlist.jsx
│  │  │  ├─ Lista de filmes salvos
│  │  │  ├─ FiltroBar (gênero, plataforma, status)
│  │  │  ├─ Edição inline
│  │  │  └─ Remoção de títulos
│  │  │
│  │  ├─ 📄 PaginaDetalhes.jsx
│  │  │  ├─ Poster do filme
│  │  │  ├─ Informações completas
│  │  │  ├─ Avaliação e descrição
│  │  │  └─ Botão "Adicionar à Watchlist"
│  │  │
│  │  ├─ 📄 PaginaNotificacoes.jsx ⭐ NOVO
│  │  │  ├─ Checkboxes para cada canal
│  │  │  │  ├─ Email
│  │  │  │  ├─ Push
│  │  │  │  ├─ Telegram
│  │  │  │  └─ Discord
│  │  │  ├─ Configuração de agendamento
│  │  │  │  ├─ Dia da semana
│  │  │  │  ├─ Horário
│  │  │  │  └─ País
│  │  │  ├─ Botões de teste (🧪)
│  │  │  ├─ Status de sucesso/erro
│  │  │  └─ localStorage para persistência
│  │  │
│  │  ├─ 📄 PaginaNotificacoes.css ⭐ NOVO
│  │  │  ├─ Dark theme (azul/cinza)
│  │  │  ├─ Checkboxes customizados
│  │  │  ├─ Inputs de email/selects
│  │  │  ├─ Botões primário/secundário
│  │  │  └─ Responsivo (mobile-first)
│  │  │
│  │  ├─ 📄 PaginaNaoEncontrada.jsx
│  │  │  └─ Página 404
│  │  │
│  │  └─ 📄 App.css (global)
│  │     └─ Tema dark oficial (--primary-bg, --primary-color, etc)
│  │
│  ├─ 📁 services/
│  │  │
│  │  ├─ 📄 IntegrationService.js ⭐ NOVO
│  │  │  ├─ JustWatchService
│  │  │  │  ├─ obterDisponibilidade(titulo, pais)
│  │  │  │  └─ monitorarMudancas(filmes, pais)
│  │  │  │
│  │  │  ├─ EmailService
│  │  │  │  ├─ inicializar()
│  │  │  │  ├─ enviarSugestaoSemanal(email, filmes)
│  │  │  │  └─ enviarNotificacaoPlataforma(email, filme, plataformas)
│  │  │  │
│  │  │  ├─ PushService
│  │  │  │  ├─ inicializar()
│  │  │  │  ├─ enviarNotificacao(subscription, options)
│  │  │  │  └─ notificarNovoFilmeDisponivelPush(subscription, filme)
│  │  │  │
│  │  │  ├─ TelegramService
│  │  │  │  ├─ enviarSugestoesSemanal(filmes)
│  │  │  │  └─ notificarNovaPlataforma(filme, plataformas)
│  │  │  │
│  │  │  ├─ DiscordService
│  │  │  │  ├─ enviarSugestoesSemanal(filmes)
│  │  │  │  └─ notificarNovaPlataforma(filme, plataformas)
│  │  │  │
│  │  │  └─ NotificacaoService
│  │  │     ├─ salvarPreferencias(userId, preferencias)
│  │  │     ├─ obterPreferencias(userId)
│  │  │     └─ registrarSubscricaoPush(userId, subscription)
│  │  │
│  │  └─ 📄 SugestaoService.js
│  │     ├─ Integração TMDB
│  │     ├─ buscarFilmesTop()
│  │     ├─ atualizarSugestoes()
│  │     ├─ obterSugestoes()
│  │     └─ agendar() [node-schedule]
│  │
│  ├─ 📁 contexts/
│  │  └─ 📄 WatchlistContext.jsx
│  │     ├─ useState: catálogo, filtros
│  │     ├─ useEffect: localStorage sync
│  │     ├─ Métodos: adicionarTitulo, removerTitulo, atualizarTitulo
│  │     └─ Filtragem: .filter() chaining
│  │
│  ├─ 📁 components/
│  │  ├─ 📄 TituloCard.jsx
│  │  │  ├─ Poster + avaliação
│  │  │  ├─ Hover overlay
│  │  │  └─ Modal de edição
│  │  │
│  │  ├─ 📄 TituloCard.css
│  │  │  └─ Card responsivo com transições
│  │  │
│  │  ├─ 📄 FiltroBar.jsx
│  │  │  ├─ Multi-select dropdowns
│  │  │  ├─ Botão "Limpar filtros"
│  │  │  └─ Contador de resultados
│  │  │
│  │  ├─ 📄 FiltroBar.css
│  │  │  └─ Selects customizados
│  │  │
│  │  ├─ 📄 FormNovoTitulo.jsx
│  │  │  ├─ Modal form
│  │  │  ├─ Inputs: titulo, genero, plataforma, status, ano
│  │  │  └─ Botões: Adicionar, Cancelar
│  │  │
│  │  ├─ 📄 FormNovoTitulo.css
│  │  │  └─ Modal styling
│  │  │
│  │  ├─ 📄 SugestaoSemanal.jsx
│  │  │  ├─ Grid de 5 filmes
│  │  │  ├─ Botão "Atualizar Agora"
│  │  │  ├─ Badge de plataformas
│  │  │  └─ Posters de Unsplash
│  │  │
│  │  └─ 📄 SugestaoSemanal.css
│  │     └─ Grid responsivo
│  │
│  ├─ 📁 assets/
│  │  └─ (imagens, ícons)
│  │
│  ├─ 📄 App.css (visto acima)
│  │
│  └─ 📄 index.css
│     └─ Reset global + fonts
│
└─ 📁 node_modules/
   ├─ react@19.2.4
   ├─ react-dom@19.2.4
   ├─ react-router-dom@7.13.1
   ├─ vite@8.0.1
   ├─ express@5.2.1 ⭐ NOVO
   ├─ nodemailer@8.0.3 ⭐ NOVO
   ├─ web-push@3.6.7 ⭐ NOVO
   ├─ axios@1.13.6 ⭐ NOVO
   ├─ node-schedule@2.1.1 ⭐ NOVO
   ├─ dotenv@17.3.1 ⭐ NOVO
   ├─ cors@2.8.6 ⭐ NOVO
   └─ ... (258 packages total)
```

---

## 📊 Resumo de Mudanças

### 🆕 Novos Arquivos (8)
```
✅ server.js                              # API backend
✅ src/services/IntegrationService.js     # Serviços de notificação
✅ src/Pages/PaginaNotificacoes.jsx       # UI de configuração
✅ src/Pages/PaginaNotificacoes.css       # Estilos
✅ public/sw.js                           # Service Worker
✅ QUICK_START.md                         # Guia rápido
✅ INTEGRATIONS_GUIDE.md                  # Guia detalhado
✅ IMPLEMENTATION_SUMMARY.md              # Resumo técnico
```

### ✏️ Arquivos Modificados (4)
```
✏️ src/App.jsx                            # +1 rota, +1 import
✏️ src/App.css                            # +.btn-notificacoes-flutuante
✏️ src/Pages/PaginaInicio.jsx             # +botão 🔔
✏️ package.json                           # +scripts e dependências
```

---

## 🎯 Fluxo de Dados

```
User (Frontend)
     ↓
PaginaNotificacoes.jsx
     ├─ Checkbox: email, push, telegram, discord
     ├─ Select: dia, hora, país
     └─ Button: Salvar / Testar
          ↓
    fetch('/api/...')
          ↓
    server.js (Express)
          ├─ Email → Nodemailer → Gmail SMTP
          ├─ Push → web-push → Browser Service Worker
          ├─ Telegram → axios → Bot API
          ├─ Discord → axios → Webhook
          └─ JustWatch → Simulado (dados)
               ↓
          Notificações ao usuário!
```

---

## 🔄 Agendamento (node-schedule)

```javascript
// Segunda-feira às 9:00 AM (Sao Paulo timezone)
┌─────────────────────────────────────────┐
│ Buscar sugestões TMDB                   │
│ ↓                                       │
│ Enviar Email (se ativo)                 │
│ Enviar Telegram (se ativo)              │
│ Enviar Discord (se ativo)               │
│ Enviar Push (se ativo)                  │
└─────────────────────────────────────────┘

// A cada 6 horas
┌─────────────────────────────────────────┐
│ Monitorar mudanças JustWatch            │
│ Notificar se nova plataforma disponível │
└─────────────────────────────────────────┘
```

---

## 🚀 Como Rodar

```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
npm run server

# OU ambos juntos
npm run dev:full
```

---

**Estrutura completa e pronta para uso!** 🎬✨
