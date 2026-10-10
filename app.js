'use strict';
const offlineStatus = document.getElementById('offlineStatus');
if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol) && !window.Capacitor) {
  navigator.serviceWorker.register('./sw.js').then(() => navigator.serviceWorker.ready).then(() => {
    if (offlineStatus) offlineStatus.textContent = '✓ Игра сохранена для занятий без интернета';
  }).catch(() => {
    if (offlineStatus) offlineStatus.textContent = 'Для подготовки офлайн-режима открой игру с интернетом ещё раз.';
  });
}
