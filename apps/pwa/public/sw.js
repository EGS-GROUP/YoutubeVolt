const CACHE_NAME = 'youtube-volt-pwa-v2';
const ASSETS_TO_CACHE = [
  '/app/',
  '/app/index.html',
  '/app/manifest.json',
  '/app/icon-192.svg'
];

// 1. Install: Pre-cachear shell básica y forzar activación inmediata
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('📱 [Service Worker] Pre-cacheando shell de YouTubeVolt PWA');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// 2. Activate: Limpiar inmediatamente cachés de versiones anteriores
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('📱 [Service Worker] Purgando caché obsoleta:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch: Estrategia híbrida Network-First para HTML y Cache-First para assets estáticos
self.addEventListener('fetch', (event) => {
  // Ignorar llamadas API backend
  if (event.request.url.includes('/api/')) {
    return;
  }

  // A) NAVEGACIÓN (documentos HTML): NETWORK FIRST con fallback a caché
  // Esto evita que un index.html viejo quede atrapado en el navegador tras un nuevo despliegue
  if (event.request.mode === 'navigate' || event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match('/app/index.html') || caches.match('/app/');
        })
    );
    return;
  }

  // B) ASSETS ESTÁTICOS (JS, CSS, imágenes): Cache-First con fallback a red
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return networkResponse;
      });
    })
  );
});
