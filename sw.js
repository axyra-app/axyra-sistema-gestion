/**
 * AXYRA - Service Worker para Notificaciones Push
 */

const CACHE_NAME = 'axyra-v5';
const urlsToCache = ['/', '/static/axyra-styles.css', '/static/firebase-config.js', '/static/notifications-system.js'];

// Instalar Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activar Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptar requests
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});

// Manejar notificaciones push
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nueva notificación de AXYRA',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    tag: 'axyra-notification',
    requireInteraction: true,
    actions: [
      {
        action: 'open',
        title: 'Abrir',
        icon: '/icon-192x192.png',
      },
      {
        action: 'close',
        title: 'Cerrar',
        icon: '/icon-192x192.png',
      },
    ],
  };

  event.waitUntil(self.registration.showNotification('AXYRA', options));
});

// Manejar clics en notificaciones
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});

// Manejar cierre de notificaciones
self.addEventListener('notificationclose', (event) => {
  console.log('Notificación cerrada:', event.notification);
});
