// Cache de la app para usarla sin conexión. Subir VERSION al cambiar archivos si se quiere forzar la limpieza.
const VERSION = 'compra-v1';
const SHELL = ['./', 'index.html', 'src/css/main.css', 'src/js/main.js'];
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', function (event) {
  event.waitUntil(caches.open(VERSION).then(function (cache) { return cache.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (event) {
  event.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (key) { return key !== VERSION; }).map(function (key) { return caches.delete(key); }));
  }).then(function () { return self.clients.claim(); }));
});

// Promos y Supabase no pasan por aquí: main.js ya guarda su propia copia local.
self.addEventListener('fetch', function (event) {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET') return;
  if (url.origin !== self.location.origin && FONT_HOSTS.indexOf(url.hostname) === -1) return;
  event.respondWith(caches.open(VERSION).then(function (cache) {
    return cache.match(event.request, { ignoreSearch: event.request.mode === 'navigate' }).then(function (cached) {
      const network = fetch(event.request).then(function (response) {
        if (response.ok || response.type === 'opaque') cache.put(event.request, response.clone());
        return response;
      }).catch(function () { return cached || (event.request.mode === 'navigate' ? cache.match('index.html') : Response.error()); });
      return cached || network;
    });
  }));
});
