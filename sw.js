const CACHE_NAME = 'myplanner-v2';
const ASSETS = [
    './',
    './index.html',
    'https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@400;500;600;700&display=swap&subset=cyrillic,cyrillic-ext',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
    );
});

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // Для API погоды используем network-first
    if (url.hostname === 'api.open-meteo.com') {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                    return response;
                })
                .catch(() => caches.match(event.request))
        );
    } else {
        // Для остальных ресурсов — cache-first
        event.respondWith(
            caches.match(event.request).then(response => response || fetch(event.request))
        );
    }
});