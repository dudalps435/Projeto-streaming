# 🚀 Guia Rápido de Setup - Watchlist Integrations

## 1️⃣ Configurar Variáveis de Ambiente

Primeiro, crie um arquivo `.env` na raiz do projeto (copie do `.env.example`):

```bash
# No Windows (PowerShell)
Copy-Item .env.example .env

# No Linux/Mac
cp .env.example .env
```

**Edite o `.env` com suas credenciais** (veja `INTEGRATIONS_GUIDE.md` para como obter cada uma)

---

## 2️⃣ Rodar o Projeto

### **Apenas Frontend (React)**
```bash
npm run dev
# Acesse: http://localhost:5173
```

### **Apenas Backend (Node.js)**
```bash
npm run server
# Acesse: http://localhost:5000
# Verificar status: http://localhost:5000/health
```

### **Ambos Simultaneamente** (Recomendado)
```bash
npm install concurrently --save-dev  # Se ainda não tiver
npm run dev:full
# Frontend: http://localhost:5173
# Backend: http://localhost:5000
```

---

## 3️⃣ Primeiras Ações

1. **Abra** http://localhost:5173 no navegador
2. **Clique no botão 🔔** no topo da página
3. **Configure suas preferências:**
   - Ative os canais desejados (Email/Push/Telegram/Discord)
   - Defina dia e horário para sugestões
   - Clique em cada botão **🧪 Enviar Teste**

---

## 🔑 Credenciais Necessárias (Ordem de Prioridade)

### 🟢 Alto (Altamente Recomendado)
| Serviço | Parar | Como Obter |
|---------|-------|-----------|
| **Gmail** | Email semanal | [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords) |
| **TMDB** | Sugestões de filmes | [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api) |

### 🟡 Médio (Bacana ter)
| Serviço | Parar | Como Obter |
|---------|-------|-----------|
| **Telegram** | Notificações via bot | [t.me/BotFather](https://t.me/BotFather) |
| **Discord** | Mensagens em servidor | Discord Server → Integrations → Webhooks |

### 🔵 Baixo (Opcional)
| Serviço | Parar | Como Obter |
|---------|-------|-----------|
| **Web Push** | Notificações do navegador | [webpush.org](https://webpush.org) |
| **JustWatch** | Plataformas locais | Simulado por padrão |

---

## ✅ Checklist de Setup

```
□ Copiei o .env.example para .env
□ Preenchi EMAIL_USER e EMAIL_PASS (Gmail)
□ Executei: npm install
□ Executei: npm run dev:full
□ Acessei http://localhost:5173
□ Cliquei no botão 🔔 nas sugestões
□ Configurei minhas preferências
□ Testei pelo menos um serviço (Email/Telegram/Discord)
□ Vi mensagens no console (sucesso/erro)
```

---

## 🧪 Testando Sem SSH (Mock)

Se não quiser configurar APIs agora, o app **funciona com dados simulados**:

```javascript
// Os dados vêm de CATALOGO_PADRAO + FILMES_PADRAO_TOP
// Você pode adicionar filmes manualmente via interface
// Sugestões semanais vêm do TMDB (real) ou fallback simulado
```

---

## 📊 Estrutura de Rotas Disponíveis

### Frontend (React)
- `/` - Página inicial com catálogo
- `/watchlist` - Sua lista de filmes/séries
- `/titulo/:id` - Detalhes de um título
- `/notificacoes` - Configuração de notificações (🆕)
- `/*` - Página 404

### Backend (Express)
- `GET /health` - Verificar status dos serviços
- `GET /api` - Lista de rotas disponíveis
- `POST /api/email/*` - Enviar emails
- `POST /api/push/*` - Web push notifications
- `POST /api/telegram/*` - Telegram
- `POST /api/discord/*` - Discord
- `GET /api/justwatch/*` - Disponibilidade

---

## 🐛 Troubleshooting Rápido

### Erro: "Cannot find module 'nodemailer'"
```bash
npm install
```

### Backend não inicia na porta 5000
```bash
# Verificar se porta está em uso:
netstat -ano | findstr :5000  # Windows
lsof -i :5000                 # Mac/Linux

# Mudar porta no .env:
PORT=3001
```

### Email não funciona
```bash
# 1. Verifique se ativou 2FA no Google
# 2. Use SENHA DE APP (16 caracteres), não sua senha normal
# 3. Teste via curl:
curl -X POST http://localhost:5000/api/email/enviar-sugestoes ...
```

### Push não funciona
```bash
# Verifique:
# 1. VAPID keys são válidas (par)
# 2. Browser deu permissão de notificação
# 3. Service Worker está registrado (Open DevTools → Application)
```

---

## 📚 Próximas Etapas (Avançado)

1. **Banco de Dados:**
   - Troque localStorage por MongoDB/PostgreSQL
   - Salve histórico de notificações

2. **Autenticação:**
   - Implemente login com JWT
   - Cada usuário tem suas preferências

3. **Frontend Avançado:**
   - Dark/Light theme toggle
   - Histórico de filmes assistidos
   - Reviews e ratings

4. **Backend Avançado:**
   - Webhook de atualização em tempo real
   - Cache com Redis
   - Rate limiting para APIs

---

## 💬 Dúvidas Frequentes

**P: Preciso configurar tudo?**
R: Não! Comece com Gmail (email), o resto é opcional.

**P: Posso usar sem .env?**
R: O app funcionará parcialmente com dados simulados, mas notificações precisam de .env.

**P: Como resetar tudo?**
R: Abra DevTools → Application → Local Storage → limpe "sugestoes semanais" e "watchlist"

**P: Posso rodar apenas o front-end?**
R: Sim! Mas notificações não funcionarão (exceto dados simulados).

---

## 📞 Links Úteis

- [TMDB API Docs](https://developer.themoviedb.org)
- [Gmail API](https://support.google.com/accounts/answer/185833)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Discord Webhooks](https://discord.com/developers/docs/resources/webhook)
- [Web Push Spec](https://www.w3.org/TR/push-api/)

---

**Pronto para começar? Execute:** `npm run dev:full` 🎬✨
