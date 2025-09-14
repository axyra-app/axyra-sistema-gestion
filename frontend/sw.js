// ========================================
// SERVICE WORKER AXYRA - CACHE OPTIMIZATION
// ========================================

const CACHE_NAME = 'axyra-cache-v1';
const STATIC_CACHE = 'axyra-static-v1';
const DYNAMIC_CACHE = 'axyra-dynamic-v1';

// Recursos críticos para cache
const CRITICAL_RESOURCES = [
  '/',
  '/admin-brutal.html',
  '/static/firebase-config-secure.js',
  '/static/admin-brutal-functions.js',
  '/static/admin-god-mode.js',
  '/static/user-management-god.js',
  '/static/form-validation-system.js',
  '/static/lazy-loading-system.js',
  '/static/cleanup-system.js',
  '/static/optimization-system.js',
  '/nomina.ico',
  '/logo.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  'https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

// Recursos estáticos para cache
const STATIC_RESOURCES = [
  '/static/',
  '/modulos/',
  '/plantillas/',
  '.css',
  '.js',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
  '.ico',
  '.woff',
  '.woff2',
  '.ttf',
  '.eot'
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker instalando...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Cacheando recursos críticos...');
        return cache.addAll(CRITICAL_RESOURCES);
      })
      .then(() => {
        console.log('✅ Service Worker instalado correctamente');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Error instalando Service Worker:', error);
      })
  );
});

// Activar Service Worker
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activando...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('🧹 Eliminando cache antiguo:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker activado correctamente');
        return self.clients.claim();
      })
  );
});

// Interceptar requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Estrategia de cache según el tipo de recurso
  if (isStaticResource(request)) {
    event.respondWith(cacheFirst(request));
  } else if (isAPIRequest(request)) {
    event.respondWith(networkFirst(request));
  } else if (isHTMLRequest(request)) {
    event.respondWith(staleWhileRevalidate(request));
  } else {
    event.respondWith(networkFirst(request));
  }
});

// ESTRATEGIA: Cache First (para recursos estáticos)
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('📦 Sirviendo desde cache:', request.url);
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('❌ Error en cacheFirst:', error);
    return new Response('Recurso no disponible', { status: 404 });
  }
}

// ESTRATEGIA: Network First (para APIs)
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('🌐 Red no disponible, sirviendo desde cache:', request.url);
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Recurso no disponible', { status: 404 });
  }
}

// ESTRATEGIA: Stale While Revalidate (para HTML)
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => cachedResponse);
  
  return cachedResponse || fetchPromise;
}

// VERIFICAR SI ES RECURSO ESTÁTICO
function isStaticResource(request) {
  const url = new URL(request.url);
  return STATIC_RESOURCES.some(resource => 
    url.pathname.includes(resource) || 
    url.pathname.endsWith(resource)
  );
}

// VERIFICAR SI ES REQUEST DE API
function isAPIRequest(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/') || 
         url.hostname.includes('firebase') ||
         url.hostname.includes('googleapis');
}

// VERIFICAR SI ES REQUEST DE HTML
function isHTMLRequest(request) {
  return request.headers.get('accept')?.includes('text/html');
}

// LIMPIAR CACHE PERIÓDICAMENTE
setInterval(() => {
  cleanOldCache();
}, 24 * 60 * 60 * 1000); // Cada 24 horas

// LIMPIAR CACHE ANTIGUO
async function cleanOldCache() {
  try {
    const cacheNames = await caches.keys();
    const oldCaches = cacheNames.filter(name => 
      name !== CACHE_NAME && 
      name !== STATIC_CACHE && 
      name !== DYNAMIC_CACHE
    );
    
    await Promise.all(
      oldCaches.map(cacheName => caches.delete(cacheName))
    );
    
    console.log('🧹 Cache limpiado:', oldCaches);
  } catch (error) {
    console.error('❌ Error limpiando cache:', error);
  }
}

// MANEJO DE MENSAJES
self.addEventListener('message', (event) => {
  const { action, data } = event.data;
  
  switch (action) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches();
      break;
      
    case 'GET_CACHE_STATUS':
      getCacheStatus().then(status => {
        event.ports[0].postMessage(status);
      });
      break;
      
    default:
      console.log('📨 Mensaje no reconocido:', action);
  }
});

// LIMPIAR TODOS LOS CACHES
async function clearAllCaches() {
  try {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
    console.log('🧹 Todos los caches limpiados');
  } catch (error) {
    console.error('❌ Error limpiando todos los caches:', error);
  }
}

// OBTENER ESTADO DEL CACHE
async function getCacheStatus() {
  try {
    const cacheNames = await caches.keys();
    const status = {};
    
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const keys = await cache.keys();
      status[cacheName] = {
        size: keys.length,
        urls: keys.map(request => request.url)
      };
    }
    
    return status;
  } catch (error) {
    console.error('❌ Error obteniendo estado del cache:', error);
    return {};
  }
}

// MANEJO DE ERRORES
self.addEventListener('error', (event) => {
  console.error('❌ Error en Service Worker:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Promesa rechazada en Service Worker:', event.reason);
});

console.log('🔧 Service Worker AXYRA cargado correctamente');