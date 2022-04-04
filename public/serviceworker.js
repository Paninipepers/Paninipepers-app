const version = "1.2.1";
const cacheName =  `paninipepers-cache-v${version}`;
const assets = [
    '/index.html',
    '/style.css',
    '/app.bundle.js',
    '/pdf.worker.bundle.js',
    '/images/icon_x192.png',
    '/images/icon_x512.png',
    '/images/panipeper.jpeg'
];

const staticAssets = [
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&display=swap',
    'https://fonts.gstatic.com/s/materialicons/v126/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2'
];

self.addEventListener('install', event => {
    // Omzeil de browser cache wanneer er een nieuwe service-worker versie is
    let headers = new Headers();
    headers.append('pragma', 'no-cache');
    headers.append('cache-control', 'no-cache');

    event.waitUntil(caches.open(cacheName).then(cache => {
        return Promise.all([
            assets.map(asset => {
                fetch(asset, { method: 'GET', headers, mode: 'no-cors' }).then(response => {
                    return cache.put(asset, response);
                });
            }),
            // Doe de CORS request 'normaal'
            cache.addAll(staticAssets)
        ]);
    }));
});

self.addEventListener('activate', event => {
    // Verwijder de cache van de oude versie
    event.waitUntil(caches.keys().then(keys => {
        return Promise.all(
            keys.filter(key => key !== cacheName).map(key => caches.delete(key))
        );
    }));
});

self.addEventListener('fetch', event => {
    // Vraag de cache op, haal anders de request op van de server en voeg deze toe aan de cache als het een pdf is
    event.respondWith(caches.match(event.request).then(response => {
        return response || fetch(event.request).then(res => {
            if (res.headers.get("content-type") !== "application/pdf") return res;
            else return caches.open(cacheName).then(cache => {
                cache.put(event.request, res.clone());
                return res;
            });
        });
    }));
});
