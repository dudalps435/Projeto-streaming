import { useState, useEffect } from 'react';
import './PaginaNotificacoes.css';

export default function PaginaNotificacoes() {
  const [preferencias, setPreferencias] = useState({
    email: true,
    push: true,
    telegram: false,
    discord: false,
    diaSemana: 1,
    horaEnvio: 9,
    pais: 'BR',
    emailEndereço: '',
  });

  const [status, setStatus] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [testando, setTestando] = useState(false);

  const diasSemana = [
    'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'
  ];

  const paisesDisponiveis = [
    { code: 'BR', nome: 'Brasil 🇧🇷' },
    { code: 'US', nome: 'Estados Unidos 🇺🇸' },
    { code: 'GB', nome: 'Reino Unido 🇬🇧' },
    { code: 'MX', nome: 'México 🇲🇽' },
  ];

  useEffect(() => {
    carregarPreferencias();
    solicitarPermissaoPush();
  }, []);

  const carregarPreferencias = async () => {
    try {
      const response = await fetch('/api/notificacoes/preferencias/user1');
      if (response.ok) {
        const dados = await response.json();
        setPreferencias(dados);
      }
    } catch (erro) {
      console.error('Erro ao carregar preferências:', erro);
    }
  };

  const solicitarPermissaoPush = async () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
        });

        // Enviar subscription para o servidor
        await fetch('/api/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: 'user1',
            subscription,
          }),
        });

        setStatus('✓ Notificações push ativadas!');
      } catch (erro) {
        console.error('Erro ao solicitar permissão push:', erro);
      }
    }
  };

  const salvarPreferencias = async () => {
    setCarregando(true);
    try {
      const response = await fetch('/api/notificacoes/preferencias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'user1',
          preferencias,
        }),
      });

      if (response.ok) {
        setStatus('✓ Preferências salvas com sucesso!');
        setTimeout(() => setStatus(''), 3000);
      }
    } catch (erro) {
      setStatus('✗ Erro ao salvar: ' + erro.message);
      setTimeout(() => setStatus(''), 3000);
    } finally {
      setCarregando(false);
    }
  };

  const testarNotificacao = async (tipo) => {
    setTestando(true);
    try {
      let endpoint, dados;

      switch (tipo) {
        case 'email':
          endpoint = '/api/email/enviar-sugestoes';
          dados = {
            email: preferencias.emailEndereço || 'teste@example.com',
            filmes: [
              {
                titulo: 'Filme de Teste 🎬',
                avaliacao: 8.5,
                genero: 'Ação',
                plataformas: ['Netflix', 'Prime'],
                descricao: 'Este é um email de teste da sua Watchlist.'
              }
            ]
          };
          break;

        case 'telegram':
          endpoint = '/api/telegram/sugestoes';
          dados = {
            filmes: [
              {
                titulo: 'Filme de Teste 🎬',
                avaliacao: 8.5,
                genero: 'Ação',
                plataformas: ['Netflix'],
              }
            ]
          };
          break;

        case 'discord':
          endpoint = '/api/discord/sugestoes';
          dados = {
            filmes: [
              {
                titulo: 'Filme de Teste 🎬',
                avaliacao: 8.5,
                genero: 'Ação',
                plataformas: ['Netflix'],
              }
            ]
          };
          break;

        case 'push':
          endpoint = '/api/push/notificar-plataforma';
          dados = {
            subscription: {},
            filme: {
              id: 1,
              titulo: 'Filme de Teste 🎬',
              capa: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&h=400&fit=crop',
              plataformas: ['Netflix'],
            }
          };
          break;

        default:
          return;
      }

      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });

      if (response.ok) {
        setStatus(`✓ Teste ${tipo} enviado! Verifique seu ${tipo === 'push' ? 'navegador' : tipo}`);
      } else {
        setStatus(`✗ Erro ao testar ${tipo}`);
      }
      setTimeout(() => setStatus(''), 4000);
    } catch {
      setStatus(`✗ ${tipo} não configurado`);
      setTimeout(() => setStatus(''), 3000);
    } finally {
      setTestando(false);
    }
  };

  return (
    <div className="pagina-notificacoes">
      <div className="container">
        <h1>🔔 Configurar Notificações</h1>
        
        <div className="secao-status">
          {status && <div className={`status ${status.startsWith('✓') ? 'sucesso' : 'erro'}`}>
            {status}
          </div>}
        </div>

        {/* Seção de Email */}
        <div className="bloco-configuracao">
          <div className="opcao-notificacao">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={preferencias.email}
                onChange={(e) => setPreferencias({...preferencias, email: e.target.checked})}
              />
              <span className="checkbox"></span>
              <span className="label">📧 Email Semanal</span>
            </label>
            <p className="descricao">Receba sugestões e alertas por email</p>
          </div>

          {preferencias.email && (
            <div className="inputs-adicionais">
              <input
                type="email"
                placeholder="seu@email.com"
                value={preferencias.emailEndereço}
                onChange={(e) => setPreferencias({...preferencias, emailEndereço: e.target.value})}
                className="input-email"
              />
              <button 
                onClick={() => testarNotificacao('email')}
                disabled={testando}
                className="btn-testar"
              >
                🧪 Enviar Teste
              </button>
            </div>
          )}
        </div>

        {/* Seção de Push */}
        <div className="bloco-configuracao">
          <div className="opcao-notificacao">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={preferencias.push}
                onChange={(e) => setPreferencias({...preferencias, push: e.target.checked})}
              />
              <span className="checkbox"></span>
              <span className="label">📲 Notificações Push</span>
            </label>
            <p className="descricao">Alertas no seu navegador quando filmes chegam a novas plataformas</p>
          </div>

          {preferencias.push && (
            <button 
              onClick={() => testarNotificacao('push')}
              disabled={testando}
              className="btn-testar"
            >
              🧪 Enviar Teste
            </button>
          )}
        </div>

        {/* Seção de Telegram */}
        <div className="bloco-configuracao">
          <div className="opcao-notificacao">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={preferencias.telegram}
                onChange={(e) => setPreferencias({...preferencias, telegram: e.target.checked})}
              />
              <span className="checkbox"></span>
              <span className="label">📱 Telegram</span>
            </label>
            <p className="descricao">Mensagens diretas no Telegram (@watchlist_bot)</p>
          </div>

          {preferencias.telegram && (
            <button 
              onClick={() => testarNotificacao('telegram')}
              disabled={testando}
              className="btn-testar"
            >
              🧪 Enviar Teste
            </button>
          )}
        </div>

        {/* Seção de Discord */}
        <div className="bloco-configuracao">
          <div className="opcao-notificacao">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={preferencias.discord}
                onChange={(e) => setPreferencias({...preferencias, discord: e.target.checked})}
              />
              <span className="checkbox"></span>
              <span className="label">💬 Discord</span>
            </label>
            <p className="descricao">Mensagens no seu servidor Discord</p>
          </div>

          {preferencias.discord && (
            <button 
              onClick={() => testarNotificacao('discord')}
              disabled={testando}
              className="btn-testar"
            >
              🧪 Enviar Teste
            </button>
          )}
        </div>

        {/* Seção de Agendamento */}
        <div className="bloco-configuracao agendamento">
          <h2>⏰ Quando enviar as sugestões semanais?</h2>

          <div className="inputs-agendamento">
            <div className="grupo-input">
              <label>Dia da semana</label>
              <select
                value={preferencias.diaSemana}
                onChange={(e) => setPreferencias({...preferencias, diaSemana: parseInt(e.target.value)})}
                className="input-select"
              >
                {diasSemana.map((dia, idx) => (
                  <option key={idx} value={idx}>{dia}</option>
                ))}
              </select>
            </div>

            <div className="grupo-input">
              <label>Horário</label>
              <select
                value={preferencias.horaEnvio}
                onChange={(e) => setPreferencias({...preferencias, horaEnvio: parseInt(e.target.value)})}
                className="input-select"
              >
                {Array.from({length: 24}, (_, i) => (
                  <option key={i} value={i}>{String(i).padStart(2, '0')}:00</option>
                ))}
              </select>
            </div>

            <div className="grupo-input">
              <label>País (para plataformas locais)</label>
              <select
                value={preferencias.pais}
                onChange={(e) => setPreferencias({...preferencias, pais: e.target.value})}
                className="input-select"
              >
                {paisesDisponiveis.map(pais => (
                  <option key={pais.code} value={pais.code}>{pais.nome}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="botoes-acao">
          <button 
            onClick={salvarPreferencias}
            disabled={carregando}
            className="btn-primario"
          >
            {carregando ? '⏳ Salvando...' : '💾 Salvar Preferências'}
          </button>
          <button 
            onClick={() => window.history.back()}
            className="btn-secundario"
          >
            ← Voltar
          </button>
        </div>

        {/* Info */}
        <div className="info-box">
          <h3>ℹ️ Como configurar cada serviço:</h3>
          <ul>
            <li><strong>Email:</strong> Configure seu email Gmail e gere uma senha de app</li>
            <li><strong>Telegram:</strong> Fale com @BotFather no Telegram para criar um bot</li>
            <li><strong>Discord:</strong> Crie um webhook no seu servidor Discord</li>
            <li><strong>Push:</strong> Gere chaves VAPID em webpush.org</li>
          </ul>
          <p>Veja o arquivo <code>.env.example</code> para instruções detalhadas 📌</p>
        </div>
      </div>
    </div>
  );
}
