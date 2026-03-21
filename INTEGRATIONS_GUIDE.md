# 🎬 Watchlist App - Integrations Guide

## 📋 Visão Geral

Este é um aplicativo completo de watchlist com React + Vite que integra múltiplos canais de notificação:

- ✉️ **Email** (Nodemailer/Gmail)
- 📲 **Push Notifications** (Web Push)
- 📱 **Telegram** (Bot API)
- 💬 **Discord** (Webhooks)
- 🎬 **JustWatch** (Disponibilidade de plataformas)

---

## 🚀 Início Rápido

### 1. **Front-end (React + Vite)**
```bash
npm install           # Instalar dependências
npm run dev          # Rodar em http://localhost:5173
```

### 2. **Back-end (Express API)**
```bash
npm run server       # Rodar em http://localhost:5000
```

### 3. **Ambos simultaneamente** (com concurrently)
```bash
npm install concurrently --save-dev
npm run dev:full
```

---

## ⚙️ Configuração do .env

Copie o `.env.example` para `.env` e preencha suas credenciais:

```bash
cp .env.example .env
```

### Variáveis necessárias:

```env
# Email (Gmail)
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-de-app-google
EMAIL_FROM=Watchlist App <seu-email@gmail.com>

# Push Notifications
VAPID_PUBLIC_KEY=sua-chave-publica-vapid
VAPID_PRIVATE_KEY=sua-chave-privada-vapid
VAPID_SUBJECT=mailto:seu-email@gmail.com

# Telegram
TELEGRAM_BOT_TOKEN=seu-token-do-bot
TELEGRAM_CHAT_ID=seu-chat-id

# Discord
DISCORD_WEBHOOK_URL=sua-webhook-url-discord

# TMDB API
TMDB_API_KEY=sua-chave-tmdb

# Configuração
PORT=5000
NODE_ENV=development
REACT_APP_API_URL=http://localhost:5173
```

---

## 🔧 Como Obter Cada Credencial

### 📧 Gmail (Email)

1. **Habilitar 2FA:**
   - Vá para [myaccount.google.com/security](https://myaccount.google.com/security)
   - Ative "Verificação em duas etapas"

2. **Gerar Senha de App:**
   - Acesse [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Selecione "Email" e "Windows/Linux/Mac"
   - Copie a senha gerada (16 caracteres)
   - Cole em `EMAIL_PASS`

### 🤖 Telegram Bot

1. **Criar bot:**
   - Procure @BotFather no Telegram
   - Envie `/start`
   - Envie `/newbot`
   - Nomeie seu bot (ex: "WatchlistApp")
   - Copie o token gerado

2. **Obter Chat ID:**
   - Envie uma mensagem para seu bot (clique no link fornecido)
   - Acesse `https://api.telegram.org/bot<SEU_TOKEN>/getUpdates`
   - Procure por `"id": XXXXX` na resposta

### 💬 Discord Webhook

1. **Criar webhook:**
   - Abra seu servidor Discord
   - Server Settings → Webhooks
   - Clique em "New Webhook"
   - Configure nome e canal
   - Clique em "Copy Webhook URL"

2. **Teste rápido:**
   ```bash
   curl -X POST https://discordapp.com/api/webhooks/ID/TOKEN \
     -H 'Content-Type: application/json' \
     -d '{"content":"🎬 Teste funcionando!"}'
   ```

### 📲 Web Push VAPID

1. **Gerar chaves:**
   - Acesse [webpush.org](https://webpush.org)
   - Clique em "Generate New Keys"
   - O email pode ser qualquer um: `mailto:seu@email.com`

2. **Copie:**
   - Public Key → `VAPID_PUBLIC_KEY`
   - Private Key → `VAPID_PRIVATE_KEY`

### 🎬 TMDB API

1. **Registre-se:**
   - Acesse [themoviedb.org](https://www.themoviedb.org)
   - Crie uma conta
   - Vá para Settings → API
   - Copie sua API Key

---

## 📱 Usando a Página de Notificações

### Acessar: `/notificacoes`

**Recursos:**
- ✅ Ativar/desativar cada canal
- ⏰ Configurar dia e horário das sugestões semanais
- 🌍 Selecionar país (para plataformas locais)
- 🧪 Testar cada serviço antes de configurar
- 💾 Salvar preferências em localStorage

**Exemplo:**
```javascript
// Suas preferências são salvas como:
{
  email: true,
  push: true,
  telegram: false,
  discord: false,
  diaSemana: 1,      // segunda
  horaEnvio: 9,      // 9:00 AM
  pais: 'BR',
  emailEndereço: 'seu@email.com'
}
```

---

## 🔔 Rotas da API Backend

### Email
```bash
POST /api/email/enviar-sugestoes
Content-Type: application/json

{
  "email": "usuario@gmail.com",
  "filmes": [
    {
      "titulo": "Inception",
      "avaliacao": 8.8,
      "genero": "Ficção Científica",
      "plataformas": ["Netflix", "Prime"]
    }
  ]
}
```

### Push
```bash
POST /api/push/notificar-plataforma
{
  "subscription": { /* objeto de subscription */ },
  "filme": {
    "id": 1,
    "titulo": "Inception",
    "capa": "url-da-imagem",
    "plataformas": ["Netflix"]
  }
}
```

### Telegram
```bash
POST /api/telegram/sugestoes
{
  "filmes": [{ /* dados do filme */ }]
}
```

### Discord
```bash
POST /api/discord/sugestoes
{
  "filmes": [{ /* dados do filme */ }]
}
```

### JustWatch (Monitoramento de Plataformas)
```bash
GET /api/justwatch/disponibilidade/Inception?pais=BR

POST /api/justwatch/monitorar
{
  "filmes": [{ "titulo": "Inception" }],
  "pais": "BR"
}
```

---

## ⏰ Agendamento Automático

O servidor executa automaticamente:

- **Toda segunda-feira às 9:00 AM:**
  - Busca sugestões no TMDB
  - Envia para Email, Telegram e Discord
  
- **A cada 6 horas:**
  - Monitora mudanças de plataformas via JustWatch

Você pode modificar os horários em `server.js`:

```javascript
const regra = new schedule.RecurrenceRule();
regra.dayOfWeek = 1;  // 0=domingo, 1=segunda, etc
regra.hour = 9;
regra.minute = 0;
```

---

## 🧪 Testes

### Testar Email
```bash
curl -X POST http://localhost:5000/api/email/enviar-sugestoes \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seu@email.com",
    "filmes": [{
      "titulo": "Teste",
      "avaliacao": 8,
      "genero": "Ação",
      "plataformas": ["Netflix"],
      "descricao": "Film de teste"
    }]
  }'
```

### Testar Telegram
```bash
curl -X POST http://localhost:5000/api/telegram/sugestoes \
  -H "Content-Type: application/json" \
  -d '{
    "filmes": [{
      "titulo": "Inception",
      "avaliacao": 8.8,
      "genero": "Ficção Científica",
      "plataformas": ["Netflix"]
    }]
  }'
```

### Testar Discord
```bash
curl -X POST http://localhost:5000/api/discord/sugestoes \
  -H "Content-Type: application/json" \
  -d '{
    "filmes": [{
      "titulo": "Inception",
      "avaliacao": 8.8,
      "genero": "Ficção Científica"
    }]
  }'
```

---

## 📖 Estrutura de Arquivos

```
Projeto-Modulo-4-main/
├── server.js                              # API Express
├── vite.config.js
├── package.json
├── .env.example                           # Template de config
└── src/
    ├── App.jsx                            # Routes
    ├── main.jsx
    ├── Pages/
    │   ├── PaginaInicio.jsx
    │   ├── PaginaWatchlist.jsx
    │   ├── PaginaDetalhes.jsx
    │   ├── PaginaNotificacoes.jsx         # 🆕 Configuração de notificações
    │   ├── PaginaNotificacoes.css
    │   └── PaginaNaoEncontrada.jsx
    ├── contexts/
    │   └── WatchlistContext.jsx            # Estado global
    ├── services/
    │   ├── IntegrationService.js          # 🆕 JustWatch, Email, Push, Telegram, Discord
    │   └── SugestaoService.js             # TMDB
    └── components/
        ├── TituloCard.jsx
        ├── FiltroBar.jsx
        ├── FormNovoTitulo.jsx
        └── SugestaoSemanal.jsx
```

---

## 🐛 Troubleshooting

### ❌ "Cannot find module 'nodemailer'"
```bash
npm install nodemailer web-push express cors dotenv axios node-schedule
```

### ❌ CORS Error
Certifique-se que o `server.js` tem CORS habilitado:
```javascript
app.use(cors({
  origin: 'http://localhost:5173'
}));
```

### ❌ Email não funciona
- ✅ Verifique se 2FA está ativado na conta Google
- ✅ Use a senha de APP (16 caracteres), não a senha normal
- ✅ Teste via `curl` primeiro (sem React)

### ❌ Telegram não envia
- ✅ Verifique se o token está correto (`/start` no bot)
- ✅ Confirme o CHAT_ID (execute `/getUpdates`)
- ✅ Teste: `https://api.telegram.org/botSEU_TOKEN/getMe`

### ❌ Notificações Push não funcionam
- ✅ VAPID keys devem ser um par válido
- ✅ Browser precisa ter permissão de notificações
- ✅ Service Worker deve estar registrado

---

## 🎯 Próximos Passos

1. **Preencha o `.env`** com suas credenciais
2. **Rode o backend:** `npm run server`
3. **Acesse `/notificacoes`** e configure sua preferências
4. **Teste cada serviço** antes de usar em produção
5. **Configure agendamento** conforme necessário

---

## 📞 Suporte

Para mais informações:
- [TMDB API Docs](https://developer.themoviedb.org)
- [Nodemailer](https://nodemailer.com)
- [Web Push](https://github.com/web-push-libs/web-push)
- [Discord Webhooks](https://discord.com/developers/docs/resources/webhook)
- [Telegram Bot API](https://core.telegram.org/bots/api)

---

**Happy watching! 🎬✨**
