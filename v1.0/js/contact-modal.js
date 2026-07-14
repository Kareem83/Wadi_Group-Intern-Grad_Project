/* Shared Contact Us modal (Grad contact + map, v1 theme) */
(function (global) {
  'use strict';

  var MODAL_ID = 'contactModal';
  var listenersBound = false;

  function ensureModal() {
    var existing = document.getElementById(MODAL_ID);
    if (existing) return existing;

    var html =
      '<div class="contact-modal" id="' + MODAL_ID + '" hidden aria-hidden="true">' +
        '<div class="contact-modal-backdrop" data-contact-close tabindex="-1" aria-hidden="true"></div>' +
        '<div class="contact-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="contactModalTitle">' +
          '<button type="button" class="contact-modal-close" data-contact-close aria-label="Close">✕</button>' +
          '<div class="contact-modal-grid">' +
            '<div class="contact-modal-copy">' +
              '<span class="section-label">Contact Us</span>' +
              '<h2 id="contactModalTitle">Let\'s talk.</h2>' +
              '<p class="contact-modal-lead">For business inquiries, partnerships or press, reach the Wadi Group corporate office directly.</p>' +
              '<div class="contact-row"><div class="dot"></div><div><b>Address</b><span>Wadi Holding Company, Capital Business Park, Building B1, 26th of July Corridor, Sheikh Zayed, 6th October City, Giza, Egypt</span></div></div>' +
              '<div class="contact-row"><div class="dot"></div><div><b>Phone</b><span><a href="tel:+20238278203">+20 2 38278203/4 — 38278213/4</a></span></div></div>' +
              '<div class="contact-row"><div class="dot"></div><div><b>Hotline</b><span><a href="tel:19528">19528</a></span></div></div>' +
              '<div class="contact-row"><div class="dot"></div><div><b>Email</b><span><a href="mailto:wadi@wadigroup.com">wadi@wadigroup.com</a></span></div></div>' +
              '<div class="contact-social">' +
                '<a href="https://www.facebook.com/WadiGroup" target="_blank" rel="noopener" aria-label="Facebook">f</a>' +
                '<a href="https://www.linkedin.com/company/wadi-group" target="_blank" rel="noopener" aria-label="LinkedIn">in</a>' +
                '<a href="https://www.youtube.com/channel/UCzg5iLQRohnfYg97UvDuWWg/videos" target="_blank" rel="noopener" aria-label="YouTube">▶</a>' +
              '</div>' +
            '</div>' +
            '<div class="contact-modal-map">' +
              '<iframe src="https://www.google.com/maps?q=30.024237,31.011088&z=15&hl=en&output=embed" title="Wadi Group location on Google Maps" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.insertAdjacentHTML('beforeend', html);

    /* backdrop fills full screen behind dialog */
    var modal = document.getElementById(MODAL_ID);
    var dialog = modal.querySelector('.contact-modal-dialog');
    if (dialog && !modal.querySelector('.contact-modal-backdrop')) {
      /* backdrop is first child in markup */
    }
    return modal;
  }

  function openModal() {
    var modal = ensureModal();
    modal.hidden = false;
    modal.removeAttribute('hidden');
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('is-open');
    document.body.classList.add('contact-modal-open');
    modal.querySelector('.contact-modal-close')?.focus();
  }

  function closeModal() {
    var modal = document.getElementById(MODAL_ID);
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.hidden = true;
    modal.setAttribute('hidden', '');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('contact-modal-open');
  }

  function isContactTrigger(el) {
    if (!el) return false;
    if (el.matches('[data-contact-open]')) return true;
    if (el.classList.contains('nav-cta')) return true;
    var href = (el.getAttribute('href') || '').trim();
    if (!href) return false;
    if (href === '#contact') return true;
    if (/#(contact)$/i.test(href)) return true;
    return false;
  }

  function bind() {
    if (listenersBound) return;
    listenersBound = true;
    ensureModal();

    document.addEventListener('click', function (e) {
      var closer = e.target.closest('[data-contact-close]');
      if (closer) {
        e.preventDefault();
        closeModal();
        return;
      }

      var trigger = e.target.closest('a, button');
      if (!trigger || !isContactTrigger(trigger)) return;
      e.preventDefault();
      openModal();
    }, true);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.getElementById(MODAL_ID)?.classList.contains('is-open')) {
        closeModal();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }

  global.openContactModal = openModal;
  global.closeContactModal = closeModal;
})(window);
