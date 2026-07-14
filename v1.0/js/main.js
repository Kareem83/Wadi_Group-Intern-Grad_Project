/* Wadi Group — Enhanced Anime.js Experience */

(function () {
  'use strict';

  /* Always start at the top on reload — browsers otherwise restore scroll position */
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  const navEntry = performance.getEntriesByType('navigation')[0];
  const isReload = navEntry && navEntry.type === 'reload';

  if (isReload) {
    if (location.hash) {
      history.replaceState(null, '', location.pathname + location.search);
    }
    window.scrollTo(0, 0);
  } else if (!location.hash) {
    window.scrollTo(0, 0);
  }

  const preloader = document.getElementById('preloader');
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroDots = document.getElementById('heroDots');
  const heroSlideLabel = document.getElementById('heroSlideLabel');
  const scrollProgress = document.getElementById('scrollProgress');
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');

  let currentSlide = 0;
  let statsAnimated = false;
  let aboutAnimated = false;
  let slideInterval = null;
  let lenis = null;
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ===================== UTILITIES ===================== */

  function splitIntoChars(selector, className = 'split-char') {
    document.querySelectorAll(selector).forEach(el => {
      const walk = (node, parent) => {
        if (node.nodeType === Node.TEXT_NODE) {
          [...node.textContent].forEach(char => {
            const span = document.createElement('span');
            span.className = className;
            span.textContent = char === ' ' ? '\u00A0' : char;
            parent.appendChild(span);
          });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const wrapper = document.createElement(node.tagName.toLowerCase());
          [...node.attributes].forEach(attr => wrapper.setAttribute(attr.name, attr.value));
          if (node.classList.contains('highlight-word')) wrapper.classList.add('highlight-word');
          parent.appendChild(wrapper);
          [...node.childNodes].forEach(child => walk(child, wrapper));
        }
      };
      const frag = document.createDocumentFragment();
      [...el.childNodes].forEach(child => walk(child, frag));
      el.innerHTML = '';
      el.appendChild(frag);
    });
  }

  function splitIntoWords(selector) {
    document.querySelectorAll(selector).forEach(el => {
      const words = el.textContent.trim().split(/\s+/);
      el.innerHTML = words.map(w => `<span class="split-word">${w}</span>`).join(' ');
    });
  }

  function splitIntoLines(selector) {
    document.querySelectorAll(selector).forEach(el => {
      const text = el.textContent.trim();
      el.innerHTML = `<span class="split-line"><span class="split-line-inner">${text}</span></span>`;
    });
  }

  function animateCounter(el, delay = 0, onDone) {
    const target = parseInt(el.dataset.target, 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const group = !('plain' in el.dataset);
    const obj = { val: 0 };

    anime({
      targets: obj,
      val: target,
      duration: 1900,
      easing: 'easeOutExpo',
      delay,
      round: 1,
      update: () => {
        const num = group ? obj.val.toLocaleString() : String(obj.val);
        el.textContent = prefix + num + suffix;
      },
      complete: () => { if (onDone) onDone(); }
    });
  }

  /* Build a mechanical odometer out of a .stat-number: prefix + digit reels + suffix.
     Returns the list of reels (with their target digit) so they can be rolled. */
  function buildOdometer(el) {
    const target = parseInt(el.dataset.target, 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const group = !('plain' in el.dataset);
    const str = group ? target.toLocaleString() : String(target);

    const fix = (cls, text) => {
      const s = document.createElement('span');
      s.className = cls;
      s.textContent = text;
      return s;
    };

    el.textContent = '';
    el.classList.add('odometer');
    if (prefix) el.appendChild(fix('odo-fix', prefix));

    const reels = [];
    [...str].forEach(ch => {
      if (ch >= '0' && ch <= '9') {
        const col = document.createElement('span');
        col.className = 'odo-digit';
        const reel = document.createElement('span');
        reel.className = 'odo-reel';
        reel.appendChild(fix('', '0'));
        col.appendChild(reel);
        el.appendChild(col);
        reels.push({ reel, digit: +ch });
      } else {
        el.appendChild(fix('odo-sep', ch));
      }
    });

    if (suffix) el.appendChild(fix('odo-fix', suffix));
    return reels;
  }

  function rollOdometer(reels, baseDelay) {
    const loops = 2; // full 0-9 spins before landing
    reels.forEach((r, col) => {
      const finalIndex = loops * 10 + r.digit;
      let html = '';
      for (let k = 0; k <= finalIndex; k++) html += `<span>${k % 10}</span>`;
      r.reel.innerHTML = html;
      anime({
        targets: r.reel,
        translateY: `-${finalIndex}em`,
        duration: 1900 + col * 130,
        easing: 'easeOutExpo',
        delay: baseDelay + col * 140
      });
    });
  }

  /* ===================== INIT SPLITS ===================== */

  splitIntoChars('[data-split]');
  splitIntoWords('[data-split-words]');
  splitIntoLines('[data-split-lines]');

  /* ===================== CUSTOM CURSOR ===================== */

  function initCustomCursor() {
    if (!cursorDot || !cursorRing) return;
    if (isTouch || window.innerWidth <= 768) return;

    document.body.classList.add('custom-cursor');

    // Stay hidden until the pointer actually moves, so the cursor appears at the
    // real pointer position instead of flashing in the middle of the screen.
    cursorDot.style.opacity = '0';
    cursorRing.style.opacity = '0';
    let hasMoved = false;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let ringScale = 1;
    let targetScale = 1;

    const setTransform = (el, x, y, scale = 1) => {
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`;
    };

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!hasMoved) {
        hasMoved = true;
        ringX = mouseX;
        ringY = mouseY;
        cursorDot.style.opacity = '1';
        cursorRing.style.opacity = '1';
      }
    });

    const tick = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ringScale += (targetScale - ringScale) * 0.18;

      setTransform(cursorDot, mouseX, mouseY);
      setTransform(cursorRing, ringX, ringY, ringScale);

      requestAnimationFrame(tick);
    };

    tick();

    document.querySelectorAll('a, button, .sector-panel, .stat-card, .team-card, .hero-dot, .magnetic-btn').forEach(el => {
      el.addEventListener('mouseenter', () => { targetScale = 1.6; });
      el.addEventListener('mouseleave', () => { targetScale = 1; });
    });

    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0';
      cursorRing.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      if (document.body.classList.contains('custom-cursor') && hasMoved) {
        cursorDot.style.opacity = '1';
        cursorRing.style.opacity = '1';
      }
    });
  }

  /* ===================== SCROLL PROGRESS ===================== */

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';

    navbar.classList.toggle('scrolled', scrollTop > 60);
    updateActiveNav();
    parallaxHero(scrollTop);
  }, { passive: true });

  /* ===================== PRELOADER ===================== */

  const LOADER_SESSION_KEY = 'wadiHomeLoaderSeen';

  function getNavType() {
    const entry = performance.getEntriesByType('navigation')[0];
    return entry ? entry.type : 'navigate';
  }

  function shouldShowPreloader() {
    if (document.documentElement.classList.contains('skip-preloader')) return false;
    const type = getNavType();
    if (type === 'reload') return true;
    if (type === 'back_forward') return false;
    try {
      if (sessionStorage.getItem(LOADER_SESSION_KEY)) return false;
    } catch (_) {}
    try {
      if (document.referrer && new URL(document.referrer).origin === location.origin) {
        return false;
      }
    } catch (_) {}
    return true;
  }

  function markLoaderSeen() {
    try {
      sessionStorage.setItem(LOADER_SESSION_KEY, '1');
    } catch (_) {}
  }

  function hidePreloaderShell() {
    if (preloader) {
      preloader.style.display = 'none';
      preloader.style.opacity = '0';
    }
    document.body.classList.remove('preloader-active');
    document.body.style.overflow = '';
    document.documentElement.classList.add('skip-preloader');
  }

  function runPreloader() {
    const percentEl = document.querySelector('.preloader-percent');
    const counter = { val: 0 };

    markLoaderSeen();

    const tl = anime.timeline({ easing: 'easeOutExpo' });

    tl.add({
      targets: '.preloader-logo',
      opacity: [0, 1],
      scale: [0.8, 1],
      translateY: [30, 0],
      duration: 900
    })
    .add({
      targets: '.preloader-text',
      opacity: [0, 1],
      translateY: [10, 0],
      duration: 600
    }, '-=500')
    .add({
      targets: '.preloader-percent',
      opacity: [0, 1],
      duration: 400
    }, '-=400')
    .add({
      targets: '.preloader-bar span',
      width: ['0%', '100%'],
      duration: 1400,
      easing: 'easeInOutQuad'
    }, '-=300')
    .add({
      targets: counter,
      val: 100,
      duration: 1400,
      easing: 'easeInOutQuad',
      round: 1,
      update: () => { percentEl.textContent = counter.val + '%'; }
    }, '-=1400')
    .add({
      targets: '.preloader-inner',
      opacity: 0,
      scale: 1.1,
      duration: 500,
      easing: 'easeInQuad'
    })
    .add({
      targets: '.preloader-curtain--left',
      scaleX: [1, 0],
      duration: 900,
      easing: 'easeInOutQuart'
    }, '-=200')
    .add({
      targets: '.preloader-curtain--right',
      scaleX: [1, 0],
      duration: 900,
      easing: 'easeInOutQuart'
    }, '-=900')
    .add({
      targets: preloader,
      opacity: 0,
      duration: 400,
      complete: () => {
        preloader.style.display = 'none';
        document.body.style.overflow = '';
        initPage();
      }
    });
  }

  if (shouldShowPreloader()) {
    document.body.classList.add('preloader-active');
    document.body.style.overflow = 'hidden';
    window.addEventListener('load', runPreloader);
  } else {
    hidePreloaderShell();
    markLoaderSeen();
    const startWithoutLoader = () => initPage();
    if (document.readyState === 'complete') {
      setTimeout(startWithoutLoader, 0);
    } else {
      window.addEventListener('load', startWithoutLoader);
    }
  }

  /* ===================== PAGE INIT ===================== */

  function initPage() {
    document.body.classList.remove('preloader-active');
    window.scrollTo(0, 0);
    initSmoothScroll();
    initCustomCursor();
    initSectionPresence();
    initNavbar();
    initHeroAnimations();
    initParticles();
    initWaveAnimation();
    initMarquee();
    initHeroDots();
    initMagneticButtons();
    initInteractiveGlow();
    initStatsCarousel();
    startHeroSlideshow();
    if (typeof initLeaderModal === 'function') initLeaderModal();
    initSectorPanels();
    initBoardCarousel();
  }

  function initSectionPresence() {
    const sections = document.querySelectorAll('.about, .sectors, .values, .team, .footer');
    if (!sections.length) return;

    sections.forEach(section => section.classList.add('motion-section'));

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-inview');
          sectionObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -6% 0px' });

    sections.forEach(section => sectionObserver.observe(section));
  }

  /* Lenis smooth / inertia scrolling (studio-grade feel) */
  function initSmoothScroll() {
    if (prefersReducedMotion || typeof Lenis === 'undefined') return;
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  function initInteractiveGlow() {
    if (isTouch) return;

    document.querySelectorAll('.value-card, .team-card, .stat-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mx', `${x}%`);
        card.style.setProperty('--my', `${y}%`);
      });
    });
  }

  function initNavbar() {
    anime({
      targets: navbar,
      opacity: [0, 1],
      translateY: [-72, 0],
      duration: 900,
      easing: 'easeOutExpo',
      delay: 200
    });

    anime({
      targets: '.nav-link',
      opacity: [0, 1],
      translateY: [-15, 0],
      duration: 600,
      easing: 'easeOutCubic',
      delay: anime.stagger(80, { start: 400 })
    });
  }

  /* ===================== HERO ANIMATIONS ===================== */

  function initHeroAnimations() {
    const hero = document.querySelector('.hero');
    const heroOverlay = document.querySelector('.hero-overlay');
    const heroContent = document.querySelector('.hero-content');
    const heroTitle = document.querySelector('.hero-title');
    const heroTagline = document.getElementById('heroTagline');

    // Slide the "Est. 1984" label up to the top and dim the content so the
    // animated slideshow behind it becomes the star of the scene.
    function settleEstToTop() {
      // Fades the dark overlay down smoothly so the animated slideshow shows.
      hero?.classList.add('intro-done');

      const navH = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-height')
      ) || 72;
      const estEl = document.getElementById('heroEst');
      const rect = estEl.getBoundingClientRect();
      const shift = -(rect.top - (navH + 22));

      // ONLY Est. 1984 moves — it glides up, shrinks a touch, and stays there.
      // (The slogan keeps its reserved space so nothing reflows underneath it.)
      anime({
        targets: estEl,
        translateY: shift,
        scale: 0.82,
        duration: 800,
        easing: 'easeInOutCubic'
      });
      anime({
        targets: '.scroll-indicator',
        opacity: [0, 1],
        translateX: '-50%',
        translateY: [15, 0],
        duration: 600,
        delay: 350,
        easing: 'easeOutExpo'
      });
      anime({
        targets: '.hero-controls',
        opacity: [0, 1],
        translateX: [-16, 0],
        translateY: '-50%',
        duration: 700,
        delay: 250,
        easing: 'easeOutExpo'
      });
    }

    // Reduced motion: skip the cinematic intro, jump straight to resting state.
    if (prefersReducedMotion) {
      if (heroTitle) heroTitle.style.display = 'none';
      if (heroTagline) heroTagline.style.display = 'none';
      anime.set('#heroEst', { opacity: 1 });
      settleEstToTop();
      anime({
        targets: '.scroll-wheel',
        translateY: [0, 7],
        duration: 1100,
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutSine'
      });
      return;
    }

    // Themed blue hue washes over the pictures while the statement is shown.
    hero?.classList.add('intro-active');

    const tl = anime.timeline({ easing: 'easeOutExpo' });

    // ---- INTRO: full statement, centered and prominent (< 3s on screen) ----
    tl.add({
      targets: '#heroEst',
      opacity: [0, 1],
      translateY: [16, 0],
      duration: 700
    })
    .add({
      targets: '.hero-title .split-char',
      opacity: [0, 1],
      translateY: ['110%', '0%'],
      rotateX: [-80, 0],
      duration: 900,
      delay: anime.stagger(24),
      easing: 'easeOutCubic'
    }, '-=350')
    .add({
      targets: '#heroTagline',
      opacity: [0, 1],
      translateY: [22, 0],
      duration: 700
    }, '-=300')
    // ---- HOLD on the full statement (keeps total under ~3s) ----
    .add({ duration: 700 })
    // ---- Est. 1984 rises + shrinks WHILE the slogan fades in place ----
    .add({
      targets: [heroTitle, heroTagline],
      opacity: 0,
      duration: 700,
      easing: 'easeInOutQuad',
      begin: settleEstToTop,
      complete: () => {
        // Keep the space reserved (visibility, not display) so Est. 1984 stays put.
        if (heroTitle) heroTitle.style.visibility = 'hidden';
        if (heroTagline) heroTagline.style.visibility = 'hidden';
      }
    });

    anime({
      targets: '.scroll-wheel',
      translateY: [0, 7],
      duration: 1100,
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine'
    });
  }

  /* ===================== HERO PARTICLES ===================== */

  function initParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;

    const count = window.innerWidth < 768 ? 6 : 10;

    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = anime.random(3, 8);
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.left = anime.random(0, 100) + '%';
      p.style.top = anime.random(0, 100) + '%';
      container.appendChild(p);

      anime({
        targets: p,
        translateX: () => anime.random(-80, 80),
        translateY: () => anime.random(-120, 120),
        opacity: [0.2, 0.7],
        scale: [0.5, 1.2],
        duration: () => anime.random(4000, 9000),
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutSine',
        delay: anime.random(0, 2000)
      });
    }
  }

  /* ===================== HERO PRODUCT MONTAGE ===================== */

  function initHeroProducts() {
    const tiles = document.querySelectorAll('.hp-tile');
    if (!tiles.length) return;

    // Fade the tiles in (opacity only — the float owns the transform)
    anime({
      targets: tiles,
      opacity: [0, 0.3],
      duration: 1500,
      easing: 'easeOutCubic',
      delay: anime.stagger(150, { start: 500 })
    });

    // Each tile drifts gently and independently
    tiles.forEach((t, i) => {
      anime({
        targets: t,
        translateY: (i % 2 ? 1 : -1) * (12 + i * 3),
        translateX: (i % 2 ? -1 : 1) * 8,
        rotate: (i % 2 ? 1.2 : -1.2),
        duration: 4200 + i * 500,
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutSine'
      });
    });
  }

  /* ===================== HERO SLIDESHOW ===================== */

  function initHeroDots() {
    heroSlides.forEach((slide, i) => {
      const dot = document.createElement('button');
      dot.className = 'hero-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      heroDots.appendChild(dot);
    });
  }

  function goToSlide(index) {
    if (index === currentSlide) return;

    const outgoing = heroSlides[currentSlide];
    const incoming = heroSlides[index];

    anime({
      targets: outgoing,
      opacity: [1, 0],
      scale: [1, 1.06],
      duration: 1500,
      easing: 'easeInOutSine',
      complete: () => {
        outgoing.classList.remove('active');
        outgoing.style.transform = 'scale(1.12)';
      }
    });

    incoming.classList.add('active');
    anime({
      targets: incoming,
      opacity: [0, 1],
      scale: [1.12, 1],
      duration: 1700,
      easing: 'easeOutQuart'
    });

    // Slow Ken Burns drift — starts only after the cross-dissolve settles
    // so it no longer fights the incoming zoom (which caused a jumpy feel).
    anime({
      targets: incoming,
      scale: [1, 1.08],
      duration: 8000,
      easing: 'linear',
      delay: 1700
    });

    document.querySelectorAll('.hero-dot').forEach((d, i) => {
      d.classList.toggle('active', i === index);
    });

    anime({
      targets: heroSlideLabel,
      opacity: [1, 0],
      translateX: [0, -8],
      duration: 250,
      easing: 'easeInQuad',
      complete: () => {
        heroSlideLabel.textContent = incoming.dataset.label || '';
        anime({
          targets: heroSlideLabel,
          opacity: [0, 1],
          translateX: [8, 0],
          duration: 400,
          easing: 'easeOutCubic'
        });
      }
    });

    currentSlide = index;
    resetSlideInterval();
  }

  function startHeroSlideshow() {
    if (heroSlides.length < 2) return;
    heroSlides.forEach((slide, i) => {
      if (i === 0) {
        anime({ targets: slide, scale: [1.15, 1], duration: 1800, easing: 'easeOutCubic' });
        anime({ targets: slide, scale: [1, 1.08], duration: 8000, easing: 'linear', delay: 1800 });
      }
    });
    resetSlideInterval();
  }

  function resetSlideInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(() => {
      goToSlide((currentSlide + 1) % heroSlides.length);
    }, 7000);
  }

  /* ===================== WAVE ===================== */

  function initWaveAnimation() {
    anime({
      targets: '.wave-path',
      d: [
        { value: 'M0,80 C200,120 400,40 600,70 C800,100 1000,30 1200,60 C1350,80 1400,90 1440,85 L1440,120 L0,120 Z' },
        { value: 'M0,70 C180,100 420,30 620,80 C820,110 1020,20 1220,55 C1360,75 1410,95 1440,78 L1440,120 L0,120 Z' }
      ],
      duration: 5000,
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine'
    });

    anime({
      targets: '.wave-path-2',
      d: [
        { value: 'M0,90 C250,60 450,110 700,80 C950,50 1150,100 1440,75 L1440,120 L0,120 Z' },
        { value: 'M0,88 C280,55 480,100 720,72 C960,45 1180,95 1440,82 L1440,120 L0,120 Z' }
      ],
      duration: 6500,
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine'
    });
  }

  /* ===================== MARQUEE ===================== */

  const MARQUEE_BRANDS = [
    { en: 'Katkoot El Wadi', ar: 'كتكوت الوادي' },
    { en: 'Wadi Food', ar: 'وادي فود' },
    { en: 'Tabreed', ar: 'تبريد' },
    { en: "A'laf Al Wadi", ar: 'أعلاف الوادي' },
    { en: 'Rula Farms', ar: 'مزارع رولا' },
    { en: 'Hi-Tec', ar: 'هاي تك' },
    { en: 'Haditha', ar: 'حديثة' },
    { en: 'Inmaa Sudan', ar: 'إنماء السودان' }
  ];

  function buildMarqueeItems() {
    return MARQUEE_BRANDS.map(brand => (
      `<span class="marquee-en">${brand.en}</span><span class="marquee-dot">◆</span>` +
      `<span class="marquee-ar" lang="ar">${brand.ar}</span><span class="marquee-dot">◆</span>`
    )).join('');
  }

  function initMarquee() {
    const track = document.getElementById('marqueeTrack');
    if (!track) return;

    const items = buildMarqueeItems();
    track.innerHTML = items + items;

    const trackWidth = track.scrollWidth / 2;

    anime({
      targets: track,
      translateX: [0, -trackWidth],
      duration: 45000,
      loop: true,
      easing: 'linear'
    });
  }

  /* ===================== MAGNETIC BUTTONS ===================== */

  function initMagneticButtons() {
    if (isTouch) return;

    document.querySelectorAll('.magnetic-btn').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Glow follows the cursor within the button
        btn.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
        btn.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);

        anime({
          targets: btn,
          translateX: x * 0.35,
          translateY: y * 0.35,
          duration: 300,
          easing: 'easeOutQuad'
        });
      });

      btn.addEventListener('mouseleave', () => {
        anime({
          targets: btn,
          translateX: 0,
          translateY: 0,
          duration: 550,
          easing: 'easeOutElastic(1, .45)'
        });
      });
    });
  }

  /* ===================== NAV ===================== */

  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.classList.toggle('active');

    if (isOpen) {
      anime({
        targets: '.nav-menu .nav-link',
        opacity: [0, 1],
        translateX: [-20, 0],
        duration: 400,
        easing: 'easeOutCubic',
        delay: anime.stagger(60)
      });
    }
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

  function scrollToTarget(target) {
    if (!target) return;

    const isFullPanel = target.classList.contains('hero') || target.classList.contains('stats-band');
    const offset = isFullPanel ? 0 : -navbar.offsetHeight;

    if (lenis) {
      lenis.scrollTo(target, { offset, duration: 1.2 });
    } else {
      const top = target.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top + offset, behavior: 'smooth' });
    }
  }

  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id], .stats-band[id], footer[id]');
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }

  /* ===================== SCROLL REVEAL ===================== */

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;

      if (el.classList.contains('stats-carousel') && !statsAnimated) {
        statsAnimated = true;
        animateStats();
      }

      if (el.closest('.about-grid') && !aboutAnimated) {
        aboutAnimated = true;
        animateAboutSection();
      } else if (el.closest('.section-header') && el.querySelector('[data-split-lines]')) {
        animateSectionHeader(el);
      } else if (!el.closest('.about-grid') && !el.classList.contains('stats-carousel')) {
        anime({
          targets: el,
          opacity: [0, 1],
          translateY: [30, 0],
          duration: 800,
          easing: 'easeOutCubic',
          delay: getStaggerDelay(el)
        });
      }

      el.classList.add('revealed');
      revealObserver.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.anim-reveal').forEach(el => revealObserver.observe(el));

  function getStaggerDelay(el) {
    const parent = el.parentElement;
    if (!parent) return 0;
    return [...parent.querySelectorAll('.anim-reveal')].indexOf(el) * 100;
  }

  /* ===================== SECTION HEADER ===================== */

  function animateSectionHeader(header) {
    anime({
      targets: header.querySelector('.section-label'),
      opacity: [0, 1],
      translateY: [15, 0],
      duration: 600,
      easing: 'easeOutCubic'
    });

    anime({
      targets: header.querySelectorAll('.split-line-inner'),
      translateY: ['100%', '0%'],
      duration: 900,
      easing: 'easeOutCubic',
      delay: 150
    });

    anime({
      targets: header.querySelector('.title-underline'),
      scaleX: [0, 1],
      duration: 700,
      easing: 'easeInOutQuad',
      delay: 400
    });

    anime({
      targets: header.querySelector('.section-text'),
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 700,
      easing: 'easeOutCubic',
      delay: 500
    });
  }

  /* ===================== ABOUT ===================== */

  function animateAboutSection() {
    anime({
      targets: '.about-visual',
      opacity: [0, 1],
      translateX: [-60, 0],
      duration: 1100,
      easing: 'easeOutCubic'
    });

    anime({
      targets: '.about-scene',
      clipPath: ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'],
      duration: 1400,
      easing: 'easeInOutQuart',
      delay: 200
    });

    anime({
      targets: '.about-scene-img',
      scale: [1.1, 1.02],
      duration: 1600,
      easing: 'easeOutCubic',
      delay: 200
    });

    anime({
      targets: '.about-scene-content',
      opacity: [0, 1],
      translateX: [30, 0],
      duration: 1200,
      easing: 'easeOutCubic',
      delay: 700
    });

    anime({
      targets: '.about-accent',
      scale: [0.5, 1],
      opacity: [0, 0.3],
      rotate: [-10, 0],
      duration: 1000,
      easing: 'easeOutElastic(1, .5)',
      delay: 600
    });

    anime({
      targets: '.about-badge',
      scale: [0, 1],
      opacity: [0, 1],
      duration: 800,
      easing: 'easeOutElastic(1, .4)',
      delay: 900
    });

    const badgeNum = document.querySelector('.badge-number');
    if (badgeNum) animateCounter(badgeNum, 1000);

    anime({
      targets: '.about-content',
      opacity: [0, 1],
      translateX: [50, 0],
      duration: 1000,
      easing: 'easeOutCubic',
      delay: 300
    });

    anime({
      targets: '.about-content .split-line-inner',
      translateY: ['100%', '0%'],
      duration: 900,
      easing: 'easeOutCubic',
      delay: 500
    });

    anime({
      targets: '.about-content .title-underline',
      scaleX: [0, 1],
      duration: 700,
      easing: 'easeInOutQuad',
      delay: 700
    });

    anime({
      targets: '.pillar',
      opacity: [0, 1],
      translateX: [-30, 0],
      duration: 700,
      easing: 'easeOutCubic',
      delay: anime.stagger(120, { start: 800 })
    });

    anime({
      targets: '.pillar-icon',
      scale: [0, 1],
      rotate: [-180, 0],
      duration: 600,
      easing: 'easeOutElastic(1, .5)',
      delay: anime.stagger(120, { start: 900 })
    });
  }

  /* ===================== STATS — 3D rotating KPI carousel ===================== */

  let statsCarouselReveal = null; // set by initStatsCarousel(); called once the section scrolls into view

  function initStatsCarousel() {
    const carousel = document.getElementById('statsCarousel');
    const ring = document.getElementById('statsRing');
    if (!carousel || !ring) return;

    const cards = [...ring.querySelectorAll('.stat-card')];
    const count = cards.length;
    if (!count) return;

    const anglePer = 360 / count;
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');

    let radius = 260;
    let currentAngle = 0;
    let autoRotate = false; // stays off until the section is revealed
    let hovering = false;
    let tweenState = null;
    let resumeTimer = null;
    let lastTime = null;
    const SPEED = prefersReducedMotion ? 0 : 6; // degrees / second while idling

    function computeRadius() {
      const w = cards[0].getBoundingClientRect().width || 210;
      radius = Math.round((w / 2) / Math.tan(Math.PI / count)) + 60;
    }

    function normalize(a) {
      let n = a % 360;
      if (n > 180) n -= 360;
      if (n < -180) n += 360;
      return n;
    }

    function layoutCards() {
      computeRadius();
      cards.forEach((card, i) => {
        const baseAngle = i * anglePer;
        card.style.transform = `translate(-50%, -50%) rotateY(${baseAngle}deg) translateZ(${radius}px)`;
      });
      applyRingTransform();
    }

    function applyRingTransform() {
      ring.style.transform = `translateZ(-${radius}px) rotateY(${currentAngle}deg)`;

      cards.forEach((card, i) => {
        const baseAngle = i * anglePer;
        const eff = normalize(baseAngle + currentAngle);
        const absEff = Math.abs(eff);
        const isFront = absEff < anglePer / 2 + 0.5;

        card.classList.toggle('is-front', isFront);
        card.classList.toggle('is-back', absEff > 89);
        card.style.opacity = String(Math.max(0.16, 1 - absEff / 130));
      });
    }

    function getFrontIndex() {
      let best = 0;
      let bestDiff = 361;
      cards.forEach((card, i) => {
        const diff = Math.abs(normalize(i * anglePer + currentAngle));
        if (diff < bestDiff) { bestDiff = diff; best = i; }
      });
      return best;
    }

    function goTo(index) {
      const target = i => i * anglePer;
      const wrapped = ((index % count) + count) % count;
      const desired = -target(wrapped);
      const delta = normalize(desired - normalize(currentAngle));
      const finish = currentAngle + delta;

      autoRotate = false;
      clearTimeout(resumeTimer);
      if (tweenState) tweenState.pause();

      const state = { angle: currentAngle };
      tweenState = anime({
        targets: state,
        angle: finish,
        duration: 700,
        easing: 'easeInOutCubic',
        update: () => {
          currentAngle = state.angle;
          applyRingTransform();
        },
        complete: () => {
          resumeTimer = setTimeout(() => {
            if (!hovering) { autoRotate = true; lastTime = null; }
          }, 3200);
        }
      });
    }

    cards.forEach((card, i) => {
      card.addEventListener('click', () => goTo(i));
    });
    if (prevBtn) prevBtn.addEventListener('click', () => goTo(getFrontIndex() - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(getFrontIndex() + 1));

    carousel.addEventListener('mouseenter', () => {
      hovering = true;
      autoRotate = false;
      clearTimeout(resumeTimer);
    });
    carousel.addEventListener('mouseleave', () => {
      hovering = false;
      resumeTimer = setTimeout(() => { autoRotate = true; lastTime = null; }, 600);
    });

    function loop(time) {
      if (autoRotate && SPEED > 0) {
        if (lastTime == null) lastTime = time;
        const dt = (time - lastTime) / 1000;
        lastTime = time;
        currentAngle += SPEED * dt;
        applyRingTransform();
      } else {
        lastTime = null;
      }
      requestAnimationFrame(loop);
    }

    layoutCards();
    requestAnimationFrame(loop);

    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(layoutCards, 200);
    });

    statsCarouselReveal = () => {
      anime({
        targets: carousel,
        opacity: [0, 1],
        translateY: [40, 0],
        duration: 900,
        easing: 'easeOutExpo'
      });

      document.querySelectorAll('.stat-number').forEach((el, i) => {
        animateCounter(el, 250 + i * 90, () => {
          anime({
            targets: el,
            scale: [1, 1.14, 1],
            duration: 480,
            easing: 'easeOutBack',
            complete: () => { el.style.transform = ''; }
          });
        });
      });

      setTimeout(() => {
        if (!hovering) autoRotate = true;
      }, 900);
    };
  }

  function animateStats() {
    if (statsCarouselReveal) statsCarouselReveal();
  }

  /* ===================== SECTORS ===================== */

  function hexToRgba(hex, alpha) {
    const n = parseInt(String(hex || '').replace('#', ''), 16);
    if (Number.isNaN(n)) return `rgba(102, 142, 61, ${alpha})`;
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
  }

  function initSectorPanels() {
    const panels = document.querySelectorAll('.sector-panel');
    if (!panels.length) return;

    const finePointer = window.matchMedia('(pointer: fine)').matches
      && window.matchMedia('(min-width: 901px)').matches;

    panels.forEach(panel => {
      const color = panel.dataset.color || '#668E3D';
      const img = panel.querySelector('.sector-panel-img');
      const tint = panel.querySelector('.sector-panel-tint');

      if (!finePointer) return;

      panel.addEventListener('mouseenter', () => {
        panels.forEach(p => p.classList.toggle('is-active', p === panel));
        if (tint) {
          tint.style.background =
            `linear-gradient(180deg, rgba(20,24,29,.15), ${hexToRgba(color, 0.55)} 90%)`;
        }
      });

      panel.addEventListener('mouseleave', () => {
        panels.forEach(p => p.classList.remove('is-active'));
        if (tint) {
          tint.style.background =
            'linear-gradient(180deg, rgba(20,24,29,.2), rgba(20,24,29,.85))';
        }
        if (img) {
          img.style.filter = '';
          img.style.transform = '';
        }
      });
    });
  }

  /* ===================== VALUES ===================== */

  const valuesSection = document.querySelector('.values');
  if (valuesSection) {
    const valuesObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const header = entry.target.querySelector('.section-header');
        if (header) animateSectionHeader(header);

        anime({
          targets: '.values-bg',
          scale: [1.1, 1],
          duration: 2000,
          easing: 'easeOutCubic'
        });

        anime({
          targets: '.value-card',
          opacity: [0, 1],
          rotateX: [20, 0],
          translateY: [50, 0],
          duration: 900,
          easing: 'easeOutCubic',
          delay: anime.stagger(120, { start: 300 })
        });

        anime({
          targets: '.value-num',
          scale: [0, 1],
          opacity: [0, 0.5],
          duration: 600,
          easing: 'easeOutElastic(1, .5)',
          delay: anime.stagger(120, { start: 500 })
        });

        valuesObserver.unobserve(entry.target);
      });
    }, { threshold: 0.15 });

    valuesObserver.observe(valuesSection);
  }

  /* ===================== TEAM ===================== */

  const teamSection = document.querySelector('.team');
  if (teamSection) {
    const teamObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const header = entry.target.querySelector('.section-header');
        if (header) animateSectionHeader(header);

        anime({
          targets: '.mgmt-head, .mgmt-rail, .team-cta',
          opacity: [0, 1],
          translateY: [40, 0],
          duration: 800,
          easing: 'easeOutCubic',
          delay: anime.stagger(120, { start: 160 })
        });

        teamObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    teamObserver.observe(teamSection);
  }

  /* ===================== BOARD (horizontal left / right scroll) ===================== */

  function initBoardCarousel() {
    const section = document.getElementById('team');
    if (!section || !section.classList.contains('mgmt')) return;

    const viewport = section.querySelector('#mgmtViewport') || section.querySelector('.mgmt-viewport');
    const track = section.querySelector('.mgmt-track');
    const prevBtn = section.querySelector('.mgmt-prev');
    const nextBtn = section.querySelector('.mgmt-next');
    if (!viewport || !track) return;

    const cards = Array.from(track.querySelectorAll('.mgmt-card'));
    if (!cards.length) return;

    const founder = track.querySelector('[data-founder="true"]') || cards[Math.floor(cards.length / 2)];
    let ticking = false;

    function sidePad() {
      const card = cards[0];
      const w = card ? card.getBoundingClientRect().width : 260;
      return Math.max(16, (viewport.clientWidth - w) / 2);
    }

    function applyPadding() {
      const pad = sidePad();
      track.style.paddingLeft = pad + 'px';
      track.style.paddingRight = pad + 'px';
    }

    function centerOn(card, smooth) {
      if (!card) return;
      const left = card.offsetLeft - (viewport.clientWidth - card.offsetWidth) / 2;
      viewport.scrollTo({ left: Math.max(0, left), behavior: smooth ? 'smooth' : 'auto' });
    }

    function updateFocus() {
      const cx = viewport.getBoundingClientRect().left + viewport.clientWidth / 2;
      let nearest = null;
      let nearestD = Infinity;

      cards.forEach(card => {
        const r = card.getBoundingClientRect();
        const d = Math.abs((r.left + r.width / 2) - cx);
        if (d < nearestD) {
          nearestD = d;
          nearest = card;
        }
      });

      cards.forEach(card => {
        card.classList.toggle('is-focus', card === nearest);
      });

      if (prevBtn && nextBtn) {
        const maxScroll = viewport.scrollWidth - viewport.clientWidth;
        prevBtn.disabled = viewport.scrollLeft <= 8;
        nextBtn.disabled = viewport.scrollLeft >= maxScroll - 8;
      }
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        updateFocus();
      });
    }

    function step(dir) {
      const cx = viewport.getBoundingClientRect().left + viewport.clientWidth / 2;
      let current = 0;
      let best = Infinity;
      cards.forEach((card, i) => {
        const r = card.getBoundingClientRect();
        const d = Math.abs((r.left + r.width / 2) - cx);
        if (d < best) {
          best = d;
          current = i;
        }
      });
      const next = Math.max(0, Math.min(cards.length - 1, current + dir));
      centerOn(cards[next], true);
    }

    prevBtn?.addEventListener('click', () => step(-1));
    nextBtn?.addEventListener('click', () => step(1));

    // Vertical wheel → horizontal browse while hovering the rail
    viewport.addEventListener('wheel', (e) => {
      const dominant = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(dominant) < 1) return;
      // Always convert to horizontal movement inside this carousel
      e.preventDefault();
      viewport.scrollLeft += dominant;
    }, { passive: false });

    // Drag to scroll (ignore interactive controls like See more)
    let dragging = false;
    let startX = 0;
    let startScroll = 0;
    let moved = false;

    function isInteractiveTarget(target) {
      return !!(target && target.closest && target.closest('.team-more, .leaders-more, .mgmt-nav, a, button'));
    }

    viewport.addEventListener('pointerdown', (e) => {
      if (e.button && e.button !== 0) return;
      if (isInteractiveTarget(e.target)) return;
      dragging = true;
      moved = false;
      startX = e.clientX;
      startScroll = viewport.scrollLeft;
      viewport.classList.add('is-dragging');
      viewport.setPointerCapture?.(e.pointerId);
    });

    viewport.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      viewport.scrollLeft = startScroll - dx;
    });

    function endDrag() {
      if (!dragging) return;
      dragging = false;
      viewport.classList.remove('is-dragging');
      updateFocus();
      // Snap to nearest after drag
      const focused = track.querySelector('.mgmt-card.is-focus');
      if (focused && moved) centerOn(focused, true);
    }

    viewport.addEventListener('pointerup', endDrag);
    viewport.addEventListener('pointercancel', endDrag);

    viewport.addEventListener('click', (e) => {
      if (isInteractiveTarget(e.target)) {
        moved = false;
        return;
      }
      if (!moved) return;
      e.preventDefault();
      e.stopPropagation();
      moved = false;
    }, true);

    viewport.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
      applyPadding();
      const focused = track.querySelector('.mgmt-card.is-focus') || founder;
      centerOn(focused, false);
      updateFocus();
    });

    applyPadding();
    // Start with founder centered so cards show on left and right
    requestAnimationFrame(() => {
      centerOn(founder, false);
      updateFocus();
      // second pass after images/layout settle
      setTimeout(() => {
        applyPadding();
        centerOn(founder, false);
        updateFocus();
      }, 120);
    });
  }

  /* ===================== FOOTER ===================== */

  const footer = document.querySelector('.footer');
  if (footer) {
    const footerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        anime({
          targets: '.footer-grid > *',
          opacity: [0, 1],
          translateY: [30, 0],
          duration: 700,
          easing: 'easeOutCubic',
          delay: anime.stagger(100)
        });

        anime({
          targets: '.footer-note',
          opacity: [0, 1],
          letterSpacing: ['0.3em', '0.05em'],
          duration: 1000,
          easing: 'easeOutCubic',
          delay: 600
        });

        footerObserver.unobserve(entry.target);
      });
    }, { threshold: 0.1 });

    footerObserver.observe(footer);
  }

  /* ===================== SMOOTH SCROLL ===================== */

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      navMenu.classList.remove('open');
      navToggle.classList.remove('active');
      scrollToTarget(target);

      if (history.pushState) {
        history.pushState(null, '', targetId);
      } else {
        location.hash = targetId;
      }
    });
  });

  /* ===================== PARALLAX ===================== */

  function parallaxHero(scrolled) {
    const heroInner = document.querySelector('.hero-inner');
    if (!heroInner || scrolled >= window.innerHeight) return;

    heroInner.style.transform = `translateY(${scrolled * 0.2}px)`;
    heroInner.style.opacity = 1 - (scrolled / window.innerHeight) * 0.6;
  }

})();
