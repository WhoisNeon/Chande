const CACHE_NAME = 'chand-app-v1';

self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
});

self.addEventListener('fetch', (event) => {
  // no cache
  event.respondWith(fetch(event.request));
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');

});