// Guarda o app no iPhone para funcionar mesmo sem internet.
// Ao mudar qualquer arquivo, aumente o número da versão abaixo.
var CACHE = "estudo-biblico-v2";
var FILES = [
  "./",
  "index.html",
  "styles.css",
  "app.js",
  "stories.js",
  "manifest.webmanifest",
  "icons/apple-touch-icon.png",
  "icons/icon-192.png",
  "icons/icon-512.png"
];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }));
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

// Tenta a internet primeiro (para pegar histórias novas); sem internet, usa a cópia guardada.
// "no-cache" faz o iPhone sempre perguntar ao GitHub se há versão nova,
// em vez de usar a cópia de até 10 minutos que o navegador guarda.
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request.url, { cache: "no-cache", credentials: "same-origin" }).then(function (res) {
      var copy = res.clone();
      caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
      return res;
    }).catch(function () {
      return caches.match(e.request, { ignoreSearch: true });
    })
  );
});
