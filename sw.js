const CACHE_NAME = 'my-finances-v10.64';
const APP_FILES = ["./", "./index.html", "./manifest.json", "./icons/app-wallet-180.png", "./icons/app-money-180.png", "./icons/app-bank-180.png", "./icons/app-chart-180.png", "./icons/app-wallet-192.png", "./icons/app-money-192.png", "./icons/app-bank-192.png", "./icons/app-chart-192.png", "./icons/app-wallet-512.png", "./icons/app-money-512.png", "./icons/app-bank-512.png", "./icons/app-chart-512.png"];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => (key.startsWith('my-finances-v10.') || key.startsWith('my-finances-v10-')) && key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    if (response && response.ok) { const copy = response.clone(); caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)); }
    return response;
  }).catch(() => caches.match('./index.html'))));
});
