/* Shared leader profile expand modal (homepage + leaders page) */
(function (global) {
  'use strict';

  var listenersBound = false;

  function initLeaderModal(options) {
    const opts = options || {};
    const moreSelector = opts.moreSelector || '.team-more, .leaders-more';
    const modal = document.getElementById('leaderModal');
    if (!modal) return;

    const img = document.getElementById('lmImg');
    const name = document.getElementById('lmName');
    const role = document.getElementById('lmRole');
    const bio = document.getElementById('lmBio');
    let lastFocus = null;

    function openFromCard(card) {
      if (!card) return;

      const photo = card.querySelector('.mgmt-photo img, .team-photo img, .leaders-photo img, img');
      const title = card.querySelector('h3');
      const roleEl = card.querySelector('.leaders-role, .team-role, .mgmt-role');
      const bioEl = card.querySelector('.leaders-bio, .team-bio');

      if (img && photo) {
        img.src = photo.currentSrc || photo.src;
        img.alt = photo.alt || '';
      }
      if (name && title) name.textContent = title.textContent.trim();
      if (role && roleEl) role.textContent = roleEl.textContent.trim();
      if (bio && bioEl) bio.textContent = (bioEl.textContent || '').trim();

      lastFocus = document.activeElement;
      modal.hidden = false;
      modal.removeAttribute('hidden');
      modal.classList.add('is-open');
      document.body.classList.add('leader-modal-open');
      modal.querySelector('.leader-modal-close')?.focus();
    }

    function close() {
      modal.classList.remove('is-open');
      modal.hidden = true;
      modal.setAttribute('hidden', '');
      document.body.classList.remove('leader-modal-open');
      if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    }

    if (listenersBound) return;
    listenersBound = true;

    document.addEventListener('click', (e) => {
      const btn = e.target.closest(moreSelector);
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      const card = btn.closest('.mgmt-card, .team-card, .leaders-card, article');
      openFromCard(card);
    }, true);

    modal.querySelectorAll('[data-close]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        close();
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
    });
  }

  global.initLeaderModal = initLeaderModal;
})(window);
