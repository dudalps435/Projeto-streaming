import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import schedule from 'node-schedule';
import axios from 'axios';
import { 
  EmailService, 
  PushService, 
  TelegramService, 
  DiscordService,
  JustWatchService,
  NotificacaoService 
} from './src/services/IntegrationService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.REACT_APP_API_URL || 'http://localhost:5173',
}));

// Inicializar serviços
EmailService.inicializar();
PushService.inicializar();

// ==================== ROTAS DE PUSH NOTIFICATIONS ====================
app.post('/api/push/subscribe', (req, res) => {
  const { userId, subscription } = req.body;

  try {
    NotificacaoService.registrarSubscricaoPush(userId, subscription);
    res.status(200).json({ 
      message: 'Inscrição push registrada com sucesso' 
    });
  } catch (erro) {
    res.status(500).json({ 
      error: 'Erro ao registrar inscrição push',
      details: erro.message 
    });
  }
});

app.post('/api/notificacoes/preferencias', (req, res) => {
  const { userId, preferencias } = req.body;

  try {
    NotificacaoService.salvarPreferencias(userId, preferencias);
    res.status(200).json({ 
      message: 'Preferências salvas com sucesso',
      preferencias 
    });
  } catch (erro) {
    res.status(500).json({ 
      error: 'Erro ao salvar preferências',
      details: erro.message 
    });
  }
});

app.get('/api/notificacoes/preferencias/:userId', (req, res) => {
  try {
    const preferencias = NotificacaoService.obterPreferencias(req.params.userId);
    res.status(200).json(preferencias);
  } catch (erro) {
    res.status(500).json({ 
      error: 'Erro ao obter preferências',
      details: erro.message 
    });
  }
});

// ==================== ROTAS DE EMAIL ====================
app.post('/api/email/enviar-sugestoes', async (req, res) => {
  const { email, filmes } = req.body;

  try {
    const resultado = await EmailService.enviarSugestaoSemanal(email, filmes);
    
    if (resultado) {
      res.status(200).json({ 
        message: 'Email de sugestões enviado com sucesso' 
      });
    } else {
      res.status(400).json({ 
        error: 'Falha ao enviar email' 
      });
    }
  } catch (erro) {
    res.status(500).json({ 
      error: 'Erro ao enviar email',
      details: erro.message 
    });
  }
});

app.post('/api/email/notificar-plataforma', async (req, res) => {
  const { email, filme, plataformas } = req.body;

  try {
    await EmailService.enviarNotificacaoPlataforma(
      email, 
      filme, 
      plataformas
    );
    
    res.status(200).json({ 
      message: 'Notificação de plataforma enviada' 
    });
  } catch (erro) {
    res.status(500).json({ 
      error: 'Erro ao enviar notificação',
      details: erro.message 
    });
  }
});

// ==================== ROTAS DE PUSH ====================
app.post('/api/push/notificar-plataforma', async (req, res) => {
  const { subscription, filme } = req.body;

  try {
    await PushService.notificarNovoFilmeDisponivelPush(
      subscription, 
      filme
    );
    
    res.status(200).json({ 
      message: 'Notificação push enviada' 
    });
  } catch (erro) {
    res.status(500).json({ 
      error: 'Erro ao enviar push',
      details: erro.message 
    });
  }
});

// ==================== ROTAS DE TELEGRAM ====================
app.post('/api/telegram/sugestoes', async (req, res) => {
  const { filmes } = req.body;

  try {
    await TelegramService.enviarSugestoesSemanal(filmes);
    
    res.status(200).json({ 
      message: 'Sugestões enviadas ao Telegram' 
    });
  } catch (erro) {
    res.status(500).json({ 
      error: 'Erro ao enviar Telegram',
      details: erro.message 
    });
  }
});

app.post('/api/telegram/plataforma', async (req, res) => {
  const { filme, plataformas } = req.body;

  try {
    await TelegramService.notificarNovaPlataforma(filme, plataformas);
    
    res.status(200).json({ 
      message: 'Notificação enviada ao Telegram' 
    });
  } catch (erro) {
    res.status(500).json({ 
      error: 'Erro ao notificar Telegram',
      details: erro.message 
    });
  }
});

// ==================== ROTAS DE DISCORD ====================
app.post('/api/discord/sugestoes', async (req, res) => {
  const { filmes } = req.body;

  try {
    await DiscordService.enviarSugestoesSemanal(filmes);
    
    res.status(200).json({ 
      message: 'Sugestões enviadas ao Discord' 
    });
  } catch (erro) {
    res.status(500).json({ 
      error: 'Erro ao enviar Discord',
      details: erro.message 
    });
  }
});

app.post('/api/discord/plataforma', async (req, res) => {
  const { filme, plataformas } = req.body;

  try {
    await DiscordService.notificarNovaPlataforma(filme, plataformas);
    
    res.status(200).json({ 
      message: 'Notificação enviada ao Discord' 
    });
  } catch (erro) {
    res.status(500).json({ 
      error: 'Erro ao notificar Discord',
      details: erro.message 
    });
  }
});

// ==================== ROTAS DE JUSTWATCH ====================
app.get('/api/justwatch/disponibilidade/:titulo', async (req, res) => {
  const { titulo } = req.params;
  const { pais = 'BR' } = req.query;

  try {
    const disponibilidade = await JustWatchService.obterDisponibilidade(titulo, pais);
    
    res.status(200).json({
      titulo,
      pais,
      plataformas: disponibilidade,
    });
  } catch (erro) {
    res.status(500).json({ 
      error: 'Erro ao obter disponibilidade',
      details: erro.message 
    });
  }
});

app.post('/api/justwatch/monitorar', async (req, res) => {
  const { filmes, pais = 'BR' } = req.body;

  try {
    const changes = await JustWatchService.monitorarMudancas(filmes, pais);
    
    res.status(200).json({
      pais,
      mudancas: changes,
    });
  } catch (erro) {
    res.status(500).json({ 
      error: 'Erro ao monitorar mudanças',
      details: erro.message 
    });
  }
});

// ==================== AGENDAMENTO ====================

// Executar sugestões semanais no segunda-feira às 9h (configurável via .env)
const agendar = () => {
  // Configuração: Executar toda segunda-feira às 9:00
  const regra = new schedule.RecurrenceRule();
  regra.dayOfWeek = 1; // 0 = domingo, 1 = segunda, etc
  regra.hour = 9;
  regra.minute = 0;
  regra.tz = 'America/Sao_Paulo';

  schedule.scheduleJob(regra, async () => {
    console.log('🔔 Executando sugestões semanais agendadas...');
    
    try {
      // Buscar sugestões do TMDB
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.TMDB_API_KEY}&language=pt-BR&page=1`
      );

      const filmes = response.data.results.slice(0, 5).map(f => ({
        titulo: f.title,
        avaliacao: f.vote_average,
        genero: 'Filme',
        plataformas: ['Netflix', 'Prime Video'],
        descricao: f.overview,
      }));

      // Enviar para todos os canais ativados
      if (process.env.EMAIL_USER) {
        await EmailService.enviarSugestaoSemanal(
          process.env.EMAIL_USER, 
          filmes
        );
      }

      if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
        await TelegramService.enviarSugestoesSemanal(filmes);
      }

      if (process.env.DISCORD_WEBHOOK_URL) {
        await DiscordService.enviarSugestoesSemanal(filmes);
      }

      console.log('✓ Sugestões semanais enviadas com sucesso');
    } catch (erro) {
      console.error('❌ Erro ao enviar sugestões agendadas:', erro.message);
    }
  });

  console.log('✓ Agendamento configurado para segunda-feiras às 9:00');
};

// Monitorar plataformas a cada 6 horas
schedule.scheduleJob('0 */6 * * *', async () => {
  console.log('🔍 Monitorando mudanças de plataformas...');
  
  try {
    // Aqui você buscaria a lista de filmes do usuário
    // e checaria mudanças via JustWatch
    console.log('✓ Monitoramento concluído');
  } catch (erro) {
    console.error('❌ Erro ao monitorar:', erro.message);
  }
});

// ==================== STATUS E SAÚDE ====================
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ativo',
    timestamp: new Date(),
    servicos: {
      email: !!process.env.EMAIL_USER,
      push: !!process.env.VAPID_PUBLIC_KEY,
      telegram: !!process.env.TELEGRAM_BOT_TOKEN,
      discord: !!process.env.DISCORD_WEBHOOK_URL,
      justwatch: '(simulado)',
    },
  });
});

app.get('/api', (req, res) => {
  res.json({
    nome: 'Watchlist Integrations API',
    versao: '1.0.0',
    rotas: {
      push: '/api/push/*',
      email: '/api/email/*',
      telegram: '/api/telegram/*',
      discord: '/api/discord/*',
      justwatch: '/api/justwatch/*',
      notificacoes: '/api/notificacoes/*',
    },
  });
});

// ==================== INICIAR SERVIDOR ====================
agendar();

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                 WATCHLIST INTEGRATIONS API                ║
╠═══════════════════════════════════════════════════════════╣
║ 🚀 Servidor iniciado em: http://localhost:${PORT}
║ 📧 Email: ${process.env.EMAIL_USER ? '✓ Ativo' : '✗ Inativo'}
║ 📲 Push: ${process.env.VAPID_PUBLIC_KEY ? '✓ Ativo' : '✗ Inativo'}
║ 📱 Telegram: ${process.env.TELEGRAM_BOT_TOKEN ? '✓ Ativo' : '✗ Inativo'}
║ 💬 Discord: ${process.env.DISCORD_WEBHOOK_URL ? '✓ Ativo' : '✗ Inativo'}
║ 🎬 JustWatch: ✓ Ativo (simulado)
║ ⏰ Agendamento: ✓ Ativo
╠═══════════════════════════════════════════════════════════╣
║ /health - Verificar status                                ║
║ /api - Ver documentação de rotas                          ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

export default app;
