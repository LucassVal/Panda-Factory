var CACHE_NAME = "titan-gestao-v2-cache-v1";
var urlsToCache = [
  "./",
  "./CRM.html",
  "./manifest.json",
  "./js/core/Repository.js",
  "https://cdn.jsdelivr.net/npm/chart.js",
];

self.addEventListener("install", function (event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    }),
  );
});

self.addEventListener("fetch", function (event) {
  // Stale-While-Revalidate Strategy
  event.respondWith(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.match(event.request).then(function (response) {
        var fetchPromise = fetch(event.request).then(
          function (networkResponse) {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          },
        );
        return response || fetchPromise;
      });
    }),
  );
});

self.addEventListener("activate", function (event) {
  var cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});
