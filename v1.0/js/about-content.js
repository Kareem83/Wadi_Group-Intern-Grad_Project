/* About page — KPIs carousel, marquee, heartbeat about, values (ported from homepage) */
(function (global) {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animateCounter(el, delay, onDone) {
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
      delay: delay || 0,
      round: 1,
      update: () => {
        const num = group ? obj.val.toLocaleString() : String(obj.val);
        el.textContent = prefix + num + suffix;
      },
      complete: () => { if (onDone) onDone(); }
    });
  }

  function initMarquee() {
    const track = document.getElementById('marqueeTrack');
    if (!track || typeof anime === 'undefined') return;

    const brands = [
      { en: 'Katkoot El Wadi', ar: 'كتكوت الوادي' },
      { en: 'Wadi Food', ar: 'وادي فود' },
      { en: 'Tabreed', ar: 'تبريد' },
      { en: "A'laf Al Wadi", ar: 'أعلاف الوادي' },
      { en: 'Rula Farms', ar: 'مزارع رولا' },
      { en: 'Hi-Tec', ar: 'هاي تك' },
      { en: 'Haditha', ar: 'حديثة' },
      { en: 'Inmaa Sudan', ar: 'إنماء السودان' }
    ];

    const items = brands.map(brand => (
      `<span class="marquee-en">${brand.en}</span><span class="marquee-dot">◆</span>` +
      `<span class="marquee-ar" lang="ar">${brand.ar}</span><span class="marquee-dot">◆</span>`
    )).join('');

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

  function initStatsCarousel() {
    const carousel = document.getElementById('statsCarousel');
    const ring = document.getElementById('statsRing');
    if (!carousel || !ring || typeof anime === 'undefined') return;

    const cards = [...ring.querySelectorAll('.stat-card')];
    const count = cards.length;
    if (!count) return;

    const anglePer = 360 / count;
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');

    let radius = 260;
    let currentAngle = 0;
    let autoRotate = false;
    let hovering = false;
    let tweenState = null;
    let resumeTimer = null;
    let lastTime = null;
    const SPEED = prefersReducedMotion ? 0 : 6;

    function computeRadius() {
      const w = cards[0].getBoundingClientRect().width || 210;
      const compact = document.body.classList.contains('about-page');
      radius = Math.round((w / 2) / Math.tan(Math.PI / count)) + (compact ? 28 : 60);
    }

    function normalize(a) {
      let n = a % 360;
      if (n > 180) n -= 360;
      if (n < -180) n += 360;
      return n;
    }

    function applyRingTransform() {
      ring.style.transform = `translateZ(-${radius}px) rotateY(${currentAngle}deg)`;
      cards.forEach((card, i) => {
        const baseAngle = i * anglePer;
        const eff = normalize(baseAngle + currentAngle);
        const absEff = Math.abs(eff);
        card.classList.toggle('is-front', absEff < anglePer / 2 + 0.5);
        card.classList.toggle('is-back', absEff > 89);
        card.style.opacity = String(Math.max(0.16, 1 - absEff / 130));
      });
    }

    function layoutCards() {
      computeRadius();
      cards.forEach((card, i) => {
        card.style.transform = `translate(-50%, -50%) rotateY(${i * anglePer}deg) translateZ(${radius}px)`;
      });
      applyRingTransform();
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
      const wrapped = ((index % count) + count) % count;
      const desired = -(wrapped * anglePer);
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

    cards.forEach((card, i) => card.addEventListener('click', () => goTo(i)));
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
    window.addEventListener('resize', () => {
      clearTimeout(window.__aboutStatsResize);
      window.__aboutStatsResize = setTimeout(layoutCards, 200);
    });

    let revealed = false;
    const reveal = () => {
      if (revealed) return;
      revealed = true;
      anime({
        targets: carousel,
        opacity: [0, 1],
        translateY: [40, 0],
        duration: 900,
        easing: 'easeOutExpo'
      });
      document.querySelectorAll('.stat-number').forEach((el, i) => {
        animateCounter(el, 250 + i * 90);
      });
      setTimeout(() => {
        if (!hovering) autoRotate = true;
      }, 900);
    };

    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        reveal();
        obs.disconnect();
      });
    }, { threshold: 0.2 });
    obs.observe(carousel);
  }

  function animateAboutSection() {
    if (typeof anime === 'undefined') return;

    anime({
      targets: '.about-content',
      opacity: [0, 1],
      translateY: [36, 0],
      duration: 900,
      easing: 'easeOutCubic'
    });
    anime({
      targets: '.about-content .title-underline',
      scaleX: [0, 1],
      duration: 700,
      easing: 'easeInOutQuad',
      delay: 280
    });
    anime({
      targets: '.pillar',
      opacity: [0, 1],
      translateY: [24, 0],
      duration: 700,
      easing: 'easeOutCubic',
      delay: anime.stagger(120, { start: 360 })
    });
    anime({
      targets: '.pillar-icon',
      scale: [0, 1],
      rotate: [-180, 0],
      duration: 600,
      easing: 'easeOutElastic(1, .5)',
      delay: anime.stagger(120, { start: 450 })
    });
  }

  function initAboutSection() {
    const grid = document.querySelector('.about-grid');
    if (!grid) return;
    let done = false;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || done) return;
        done = true;
        animateAboutSection();
        obs.disconnect();
      });
    }, { threshold: 0.15 });
    obs.observe(grid);
  }

  function initValuesSection() {
    const valuesSection = document.querySelector('.values');
    if (!valuesSection || typeof anime === 'undefined') return;

    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
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
        obs.disconnect();
      });
    }, { threshold: 0.15 });
    obs.observe(valuesSection);
  }

  global.initAboutPageContent = function initAboutPageContent() {
    initMarquee();
    initStatsCarousel();
    initAboutSection();
    initValuesSection();
  };
})(window);
