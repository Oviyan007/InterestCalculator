const CACHE_NAME = "interest-calculator-cache-v1";
const urlsToCache = [
    "/",
    "/index.html",
    "/styles.css",
    "/app.js",
    "/manifest.json",
    "/percentage.png",
    "/notification.wav",
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});

// ✅ Handle Push Notifications
self.addEventListener("push", event => {
    const data = event.data ? event.data.text() : "Reminder!";
    event.waitUntil(
        self.registration.showNotification("Reminder Alert", {
            body: data,
            icon: "/percentage.png"  // Ensure this file exists in your project
            
        })
    );
});
