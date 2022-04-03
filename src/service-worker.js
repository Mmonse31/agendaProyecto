const SW_VERSION = "0.0.1"
const CACHE_VERSION = "v1"
const CACHE_RESOURCES = ["/apple-touch-icon.png"]

self.addEventListener("install", (event) => {
  console.log(`Installing service worker ${SW_VERSION}`);
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache => {
        return cache.addAll(CACHE_RESOURCES)
    })
  );
});
self.addEventListener("activate", event => {
   console.log("Service worker activated");
});

self.addEventListener('fetch', (event) => {
  console.log(`Intercepting a fetch request`);
  event.respondWith(fetch(event.request));
});
