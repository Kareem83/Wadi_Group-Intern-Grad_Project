/* Wadi Group — About page */

(function () {
  'use strict';

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  window.addEventListener('DOMContentLoaded', () => {
    window.scrollTo(0, 0);
  });

  const scrollProgress = document.getElementById('scrollProgress');
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  function initCursor() {
    if (!cursorDot || !cursorRing || isTouch || window.innerWidth <= 768) return;
    document.body.classList.add('custom-cursor');

    let mx = innerWidth / 2, my = innerHeight / 2;
    let rx = mx, ry = my, rs = 1, ts = 1;

    const setT = (el, x, y, s = 1) => {
      el.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%) scale(${s})`;
    };

    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    (function tick() {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      rs += (ts - rs) * 0.18;
      setT(cursorDot, mx, my);
      setT(cursorRing, rx, ry, rs);
      requestAnimationFrame(tick);
    })();

    document.querySelectorAll('a, button, .stat-card, .value-card').forEach(el => {
      el.addEventListener('mouseenter', () => { ts = 1.6; });
      el.addEventListener('mouseleave', () => { ts = 1; });
    });
  }

  function initNav() {
    if (navToggle && navMenu) {
      navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        navToggle.classList.toggle('active');
      });

      document.querySelectorAll('.nav-item.has-dropdown').forEach(item => {
        const toggle = item.querySelector('.nav-dropdown-toggle');
        if (!toggle) return;
        toggle.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const willOpen = !item.classList.contains('open');
          document.querySelectorAll('.nav-item.has-dropdown.open').forEach(other => {
            if (other !== item) {
              other.classList.remove('open');
              other.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded', 'false');
            }
          });
          item.classList.toggle('open', willOpen);
          toggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
        });
      });

      document.addEventListener('click', (e) => {
        if (e.target.closest('.nav-item.has-dropdown')) return;
        document.querySelectorAll('.nav-item.has-dropdown.open').forEach(item => {
          item.classList.remove('open');
          item.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded', 'false');
        });
      });

      navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          navMenu.classList.remove('open');
          navToggle.classList.remove('active');
          document.querySelectorAll('.nav-item.has-dropdown.open').forEach(item => {
            item.classList.remove('open');
            item.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded', 'false');
          });
        });
      });
    }
  }

  function initScrollProgress() {
    if (!scrollProgress) return;
    window.addEventListener('scroll', () => {
      const h = document.documentElement.scrollHeight - innerHeight;
      const pct = h > 0 ? (scrollY / h) * 100 : 0;
      scrollProgress.style.width = pct + '%';
    }, { passive: true });
  }

  function initReveals() {
    const items = document.querySelectorAll('.anim-reveal');
    if (!items.length || typeof anime === 'undefined') {
      items.forEach(el => el.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        anime({
          targets: entry.target,
          opacity: [0, 1],
          translateY: [28, 0],
          duration: 800,
          easing: 'easeOutCubic'
        });
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    items.forEach(el => observer.observe(el));
  }

  function initStakeMarquee() {
    const track = document.getElementById('stakeTrack');
    if (!track) return;

    const clone = track.cloneNode(true);
    clone.removeAttribute('id');
    clone.setAttribute('aria-hidden', 'true');
    track.parentElement.appendChild(clone);
  }

  window.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initNav();
    initScrollProgress();
    initReveals();
    initStakeMarquee();
    if (typeof initAboutPageContent === 'function') initAboutPageContent();
  });
})();
