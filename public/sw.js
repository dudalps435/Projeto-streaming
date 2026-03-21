// Service Worker para Web Push Notifications
// Arquivo: public/sw.js

self.addEventListener('push', function(event) {
  console.log('🔔 Push notification recebida:', event);

  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: data.icon || '/icon-192x192.png',
    badge: data.badge || '/badge-72x72.png',
    tag: data.tag || 'notificacao',
    requireInteraction: data.requireInteraction !== false,
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/',
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Listener para cliques na notificação
self.addEventListener('notificationclick', function(event) {
  console.log('👆 Notificação clicada:', event.notification.tag);

  event.notification.close();

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // Procurar por window aberta com a URL
      for (let client of clientList) {
        if (client.url === event.notification.data.url && 'focus' in client) {
          return client.focus();
        }
      }
      // Se não encontrar, abrir nova janela
      if (self.clients.openWindow) {
        return self.clients.openWindow(event.notification.data.url);
      }
    })
  );
});

// Fechar a notificação ao clicar no botão "X"
self.addEventListener('notificationclose', function(event) {
  console.log('❌ Notificação fechada:', event.notification.tag);
});

// Atualização do service worker
self.addEventListener('activate', function(event) {
  console.log('⚡ Service Worker ativado');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('install', function() {
  console.log('📦 Service Worker instalado');
  self.skipWaiting();
});
