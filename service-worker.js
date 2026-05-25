const CACHE_NAME = 'cpaintz-v1.3.1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './assets/images/module1-card-back.webp',
  './assets/images/module2-card-back.webp',
  './assets/sounds/card-flip.wav',
  './assets/sounds/card-redraw.wav'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Network-first: always try network, fall back to cache (offline)
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
