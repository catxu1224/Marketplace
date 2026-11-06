(() => {
  'use strict';
  const dialog = document.querySelector('[data-trial-dialog]');
  if (!dialog) return;

  let opener;
  let previousOverflow;
  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-trial]');
    if (!trigger || dialog.open) return;
    event.preventDefault();
    opener = trigger;
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
  });
  dialog.querySelector('[data-trial-close]').addEventListener('click', () => dialog.close());
  // The close button is this read-only dialog's only interactive control.
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    event.preventDefault();
    dialog.querySelector('[data-trial-close]').focus();
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = previousOverflow;
    opener?.focus({ preventScroll: true });
  });
})();
