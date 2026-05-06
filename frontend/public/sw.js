const CACHE_NAME = 'milku-cache-v5';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/logo.jpeg',
  '/logo.svg',
  '/icons.svg',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  const currentCaches = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // 1. BYPASS FOR ADMIN ROUTES: Never let SW touch administrative or internal paths
  if (url.pathname.includes('admin-milku-secure-9281') || url.pathname.startsWith('/api')) {
    return;
  }

  // Only handle same-origin requests — skip API calls and cross-origin media
  if (url.origin !== self.location.origin) {
    return; // Let the browser handle it directly, no SW interference
  }

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/index.html') || caches.match('/');
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(err => {
        console.warn('SW Fetch Failed:', err);
        // Return a custom 404 response instead of null to prevent SW crash
        return new Response('Not found', { status: 404, statusText: 'Not Found' });
      });
    })
  );
});
