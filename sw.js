'use strict';
const CACHE = 'vasilisa-offline-v020';
const FILES = ['./','./index.html','./style.css','./game.js','./app.js','./audio-storage.js','./install.html','./install.js','./install.css','./manifest.webmanifest','./img/friends-v2.png','./img/vasilisa-toy-avatar.png','./img/icon-192.png','./img/icon-512.png','./img/apple-touch-icon.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('vasilisa-offline-') && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;
  const pathname = url.pathname;
  if (!FILES.some(file => new URL(file, self.registration.scope).pathname === pathname)) return;
  event.respondWith(caches.open(CACHE).then(async cache => {
    const hit = await cache.match(event.request, {ignoreSearch:true});
    if (hit) return hit;
    return fetch(event.request);
  }));
});
