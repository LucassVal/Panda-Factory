var CACHE_NAME = "panda-factory-cache-v1";
var urlsToCache = [
  "./",
  "./PandaFactory.html",
  "./manifest.json",
  "./2.system/sdk/repository.js",
  "./2.system/sdk/api.js",
  "./2.system/core/kernel.js",
  "./2.system/core/loader.js",
  "./10.assets/css/pf.theme.css",
  "https://cdn.jsdelivr.net/npm/chart.js",
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("🐼 Panda Cache opened");
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
