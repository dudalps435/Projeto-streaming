import axios from 'axios';
import nodemailer from 'nodemailer';
import webpush from 'web-push';

const preferenciasPorUsuario = new Map();
const pushSubscricoesPorUsuario = new Map();

// Simulação JustWatch API (para produção, use a API real)
export const JustWatchService = {
  async obterDisponibilidade(titulo, pais = 'BR') {
    try {
      // Em produção: usar API real do JustWatch
      // const response = await axios.get(`https://apis.justwatch.com/content/titles/...`);
      
      // Para agora, retorna dados simulados
      const disponibilidades = {
        'Clube da Luta': {
          BR: ['Netflix', 'Prime Video'],
          US: ['Netflix'],
          GB: ['Now TV', 'Sky Go'],
        },
        'Inception': {
          BR: ['Disney+', 'Prime Video'],
          US: ['Max'],
          GB: ['NOW', 'Sky Cinema'],
        },
      };
      
      return disponibilidades[titulo]?.[pais] || ['Netflix'];
    } catch (erro) {
      console.error('Erro ao obter disponibilidade:', erro);
      return [];
    }
  },

  async monitorarMudancas(filmes, pais = 'BR') {
    const resultado = {};
    
    for (const filme of filmes) {
      const plataformasAtuais = await this.obterDisponibilidade(filme.titulo, pais);
      resultado[filme.titulo] = {
        novo: plataformasAtuais,
        anterior: filme.plataformas || [],
        adicionadas: plataformasAtuais.filter(p => !filme.plataformas.includes(p)),
        removidas: filme.plataformas.filter(p => !plataformasAtuais.includes(p)),
      };
    }
    
    return resultado;
  },
};

// Serviço de Email
export const EmailService = {
  transporter: null,

  async inicializar() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  },

  async enviarSugestaoSemanal(email, filmes) {
    if (!this.transporter) await this.inicializar();

    const html = `
      <h2>🎬 Suas Sugestões Semanais de Filmes</h2>
      <p>Olá! Aqui estão as melhores sugestões para você assistir essa semana:</p>
      
      <div style="margin-top: 20px;">
        ${filmes.map(f => `
          <div style="border: 1px solid #ddd; padding: 15px; margin-bottom: 10px; border-radius: 8px;">
            <h3>${f.titulo}</h3>
            <p><strong>Avaliação:</strong> ⭐ ${f.avaliacao}</p>
            <p><strong>Gênero:</strong> ${f.genero}</p>
            <p><strong>Sinopse:</strong> ${f.descricao.substring(0, 100)}...</p>
            <p><strong>Disponível em:</strong> ${f.plataformas?.join(', ') || 'Verifique no app'}</p>
          </div>
        `).join('')}
      </div>

      <p style="margin-top: 30px; text-align: center; color: #666;">
        <a href="${process.env.REACT_APP_API_URL || 'http://localhost:5173'}/watchlist" 
           style="background: #4a7fd7; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none;">
          Ver Watchlist Completa
        </a>
      </p>

      <hr style="margin: 30px 0;">
      <p style="font-size: 12px; color: #999;">
        © 2024 Watchlist App. 
        <a href="#">Configurar Notificações</a> | 
        <a href="#">Desinscrever</a>
      </p>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: '🎬 Suas Sugestões Semanais - Watchlist',
        html,
      });
      console.log(`✓ Email enviado para ${email}`);
      return true;
    } catch (erro) {
      console.error('Erro ao enviar email:', erro);
      return false;
    }
  },

  async enviarNotificacaoPlataforma(email, filme, plataformas) {
    if (!this.transporter) await this.inicializar();

    const html = `
      <h2>🎯 ${filme.titulo} agora está disponível!</h2>
      <p>Ótimas notícias! O filme que você salvou entrou em uma nova plataforma:</p>
      
      <div style="background: #f0f0f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>${filme.titulo}</h3>
        <p><strong>Novas plataformas:</strong></p>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          ${plataformas.map(p => `
            <span style="background: #4a7fd7; color: white; padding: 8px 16px; border-radius: 20px;">
              ${p}
            </span>
          `).join('')}
        </div>
      </div>

      <p><a href="${process.env.REACT_APP_API_URL || 'http://localhost:5173'}/titulo/${filme.id}">
        Ver detalhes do filme →
      </a></p>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `🎬 ${filme.titulo} entrou em nova plataforma!`,
        html,
      });
      return true;
    } catch (erro) {
      console.error('Erro ao enviar notificação de plataforma:', erro);
      return false;
    }
  },
};

// Serviço de Push Notifications
export const PushService = {
  inicializar() {
    webpush.setVapidDetails(
      process.env.VAPID_SUBJECT,
      process.env.VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    );
  },

  async enviarNotificacao(subscription, options) {
    try {
      await webpush.sendNotification(
        subscription,
        JSON.stringify({
          title: options.title,
          body: options.body,
          icon: options.icon || '/icon-192x192.png',
          badge: '/badge-72x72.png',
          tag: options.tag || 'notificacao',
          requireInteraction: true,
        })
      );
      console.log('✓ Push notification enviada');
      return true;
    } catch (erro) {
      console.error('Erro ao enviar push:', erro);
      return false;
    }
  },

  async notificarNovoFilmeDisponivelPush(subscription, filme) {
    return this.enviarNotificacao(subscription, {
      title: `🎬 ${filme.titulo} disponível!`,
      body: `Agora em ${filme.plataformas?.join(', ') || 'uma nova plataforma'}`,
      icon: filme.capa,
      tag: `filme-${filme.id}`,
    });
  },
};

// Serviço Telegram
export const TelegramService = {
  async enviarSugestoesSemanal(filmes) {
    try {
      const mensagem = `
🎬 *Sugestões Semanais de Filmes*

${filmes
  .map(f => `
📽️ *${f.titulo}*
⭐ Avaliação: ${f.avaliacao}
🎭 Gênero: ${f.genero}
📍 Disponível em: ${f.plataformas?.join(', ') || 'Múltiplas plataformas'}
`)
  .join('\n')}

[Ver mais na Watchlist](https://watchlist.app/watchlist)
      `;

      await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: mensagem,
        parse_mode: 'Markdown',
      });

      console.log('✓ Mensagem Telegram enviada');
      return true;
    } catch (erro) {
      console.error('Erro ao enviar Telegram:', erro.message);
      return false;
    }
  },

  async notificarNovaPlataforma(filme, plataformas) {
    try {
      const mensagem = `
🎯 *${filme.titulo}* entrou em nova plataforma!

${plataformas.map(p => `✅ ${p}`).join('\n')}

[Ver detalhes](https://watchlist.app/titulo/${filme.id})
      `;

      await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: mensagem,
        parse_mode: 'Markdown',
      });

      return true;
    } catch (erro) {
      console.error('Erro ao notificar Telegram:', erro.message);
      return false;
    }
  },
};

// Serviço Discord
export const DiscordService = {
  async enviarSugestoesSemanal(filmes) {
    try {
      const embed = {
        title: '🎬 Sugestões Semanais de Filmes',
        color: 0x4a7fd7,
        fields: filmes.map(f => ({
          name: f.titulo,
          value: `⭐ ${f.avaliacao} | ${f.genero} | ${f.plataformas?.join(', ') || 'Múltiplas'}`,
          inline: false,
        })),
        timestamp: new Date(),
        footer: {
          text: 'Watchlist App',
        },
      };

      await axios.post(process.env.DISCORD_WEBHOOK_URL, {
        embeds: [embed],
      });

      console.log('✓ Mensagem Discord enviada');
      return true;
    } catch (erro) {
      console.error('Erro ao enviar Discord:', erro.message);
      return false;
    }
  },

  async notificarNovaPlataforma(filme, plataformas) {
    try {
      const embed = {
        title: `🎯 ${filme.titulo} em nova plataforma!`,
        description: plataformas.join(' • '),
        color: 0x6bcf7f,
        thumbnail: {
          url: filme.capa,
        },
        url: `https://watchlist.app/titulo/${filme.id}`,
      };

      await axios.post(process.env.DISCORD_WEBHOOK_URL, {
        embeds: [embed],
      });

      return true;
    } catch (erro) {
      console.error('Erro ao notificar Discord:', erro.message);
      return false;
    }
  },
};

// Serviço de Configuração de Notificações
export const NotificacaoService = {
  async salvarPreferencias(userId, preferencias) {
    preferenciasPorUsuario.set(userId, preferencias);
    return preferencias;
  },

  async obterPreferencias(userId) {
    const dados = preferenciasPorUsuario.get(userId);
    return dados || {
      email: true,
      push: true,
      telegram: false,
      discord: false,
      diaSemana: 1, // segunda
      horaEnvio: 9,
      pais: 'BR',
    };
  },

  async registrarSubscricaoPush(userId, subscription) {
    pushSubscricoesPorUsuario.set(userId, subscription);
    return true;
  },
};
