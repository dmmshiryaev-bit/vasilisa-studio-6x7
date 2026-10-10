'use strict';
let installPrompt;
const installButton = document.getElementById('installPwa');
window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault(); installPrompt = event; installButton.hidden = false;
});
installButton.addEventListener('click', async () => {
  if (!installPrompt) return;
  await installPrompt.prompt();
  const choice = await installPrompt.userChoice;
  document.getElementById('installFeedback').textContent = choice.outcome === 'accepted' ? 'Установка подтверждена.' : 'Можно установить позже через меню браузера.';
  installPrompt = null; installButton.hidden = true;
});
window.addEventListener('appinstalled', () => {
  document.getElementById('installFeedback').textContent = 'Игра установлена. Ищи значок Василисы на своём устройстве!';
  installButton.hidden = true;
});
