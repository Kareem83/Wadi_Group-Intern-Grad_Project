/* ============================================
   Wadi Group — Sector detail page engine
   Data-driven: /sector.html?s=dawagen|mazareh|sinat
   ============================================ */
(function () {
  'use strict';
  const anime = window.anime;

  /* ---------------- Sector content ---------------- */
  const SECTORS = {
    dawagen: {
      name: 'Dawagen',
      subtitle: 'Poultry Operations',
      index: '01',
      scene: 'poultry',
      headline: ['Raising the', 'standard, flock', 'by <em>flock.</em>'],
      tagline: 'Genetics · Nutrition · Care',
      lead: 'Dawagen is Wadi Group’s semi-integrated poultry arm — breeding, hatching and delivering day-old chicks with superior genetics, backed by advanced veterinary science and half a century of expertise across Egypt and Sudan.',
      stats: [{ n: '90M', l: 'Broiler chicks / yr' }, { n: '30%', l: 'Layer chick demand' }, { n: '2', l: 'Countries' }],
      products: [
        { name: 'Katkoot El Wadi', kind: 'Day-Old Chicks', img: 'assets/images/katkoot-toshka.jpg', metric: { v: '30%', l: 'Layer chick demand' }, desc: 'Semi-vertically integrated producer supplying day-old chicks to Egyptian growers — over 30% of layer demand and 10% of the broiler market since 1986.' },
        { name: 'Inmaa Sudan', kind: 'Regional Operations', img: '', metric: { v: '45%', l: 'Sudan broiler share' }, desc: 'Sudan’s sole poultry grandparent operation — broiler parents, commercial broilers and layers across four locations.' },
        { name: 'Hi-Tec', kind: 'Veterinary Lab', img: 'assets/images/inner-katkoot.jpg', metric: { v: 'Lab', l: 'Diagnostics & immunity' }, desc: 'Advanced veterinary laboratory running disease diagnostics, immunity assessments and vaccination-program evaluation to international protocols.' }
      ]
    },
    mazareh: {
      name: 'Mazareh',
      subtitle: 'Agri-Business',
      index: '02',
      scene: 'agri',
      headline: ['From desert', 'soil to your', '<em>table.</em>'],
      tagline: 'Cultivated · Processed · Delivered',
      lead: 'Mazareh turns reclaimed desert into fertile, productive land — cultivating over 2,900 hectares of organic crops, processing premium foods and farming fish, delivering true farm-to-table quality.',
      stats: [{ n: '2,900', l: 'Hectares organic' }, { n: '1986', l: 'Wadi Food est.' }, { n: '100%', l: 'Grown in Egypt' }],
      products: [
        { name: 'Wadi Food', kind: 'Food Products', img: 'assets/images/wadi-food.jpg', metric: { v: '1986', l: 'Established' }, desc: 'Agro-food manufacturer since 1986 — premium olive oil, olives, pickles and preserved vegetables, sourced directly from integrated farms for true farm-to-table quality.' },
        { name: 'Rula Farms', kind: 'Farming & Produce', img: 'assets/images/inner-wadi-food.jpg', metric: { v: '2,900 ha', l: 'Organic cultivation' }, desc: 'Over 2,900 hectares of organic olives, grapes, fruits, vegetables and marine fish across desert locations including Wadi El Natrun.' }
      ]
    },
    sinat: {
      name: 'Sina’at',
      subtitle: 'Industrial Division',
      index: '03',
      scene: 'industrial',
      headline: ['The industry', 'behind the', '<em>harvest.</em>'],
      tagline: 'Engineered for the value chain',
      lead: 'Sina’at is the industrial backbone of Wadi Group — feed milling, evaporative cooling, soybean processing, feed additives, grain storage and logistics that keep the entire value chain moving.',
      stats: [{ n: '6', l: 'Industrial brands' }, { n: '1,200', l: 'Tons / hr grain' }, { n: '44%', l: 'Feed protein' }],
      products: [
        { name: 'Tabreed', kind: 'Cooling Systems', img: 'assets/images/tabreed.jpg', metric: { v: '15–20°C', l: 'Temperature drop' }, desc: 'Evaporative cooling cell pads that cut poultry-house temperatures by 15–20°C and lift facility capacity by up to 25–40%.', href: 'tabreed.html' },
        { name: 'A’laf Al Wadi', kind: 'Animal Feed', img: 'assets/images/alaf.jpg', metric: { v: '1,900 MT', l: 'Daily capacity' }, desc: 'Specialized poultry and large-animal feed from mills in Nubareya and Sadat City — 15% Egyptian market share at 1,900 MT daily capacity.' },
        { name: 'Haditha', kind: 'Soybean Processing', img: 'assets/images/haditha.jpg', metric: { v: '44%', l: 'Protein soy meal' }, desc: 'Soybean crushing for crude and degummed oil, plus 44% protein soybean meal for premium livestock and poultry feed.' },
        { name: 'NSSC', kind: 'Grain Logistics', img: '', metric: { v: '1,200 t/hr', l: 'Discharge capacity' }, desc: 'Nile Storage & Stevedoring — Egypt’s largest river grain port, discharging 1,200 tons/hour into 144,000–160,000 tons of sealed silo and flat storage.' },
        { name: 'Tawseel', kind: 'Transport', img: '', metric: { v: '20', l: 'GPS truck fleet' }, desc: 'A 20-truck GPS-monitored fleet moving bulk cargo and grain across Egypt with modular container systems.' },
        { name: 'Idafat', kind: 'Feed Additives', img: '', metric: { v: 'Sole', l: 'MCP producer in Egypt' }, desc: 'Feed additives and ingredients — Egypt’s sole producer of mono-calcium phosphate (MCP), plus 44% protein soybean meal.' }
      ]
    }
  };

  const ORDER = ['dawagen', 'mazareh', 'sinat'];
  const params = new URLSearchParams(location.search);
  const slug = SECTORS[params.get('s')] ? params.get('s') : 'dawagen';
  const data = SECTORS[slug];

  const $ = (sel) => document.querySelector(sel);
  const setText = (sel, txt) => { const el = $(sel); if (el) el.textContent = txt; };
  const setHTML = (sel, html) => { const el = $(sel); if (el) el.innerHTML = html; };

  // Safety net: force elements to their visible resting state after `delay`,
  // so a stalled/throttled animation can never leave content invisible.
  const ensureVisible = (nodes, delay) => setTimeout(() => {
    (nodes.forEach ? nodes : [nodes]).forEach(n => { if (n) { n.style.opacity = 1; n.style.transform = ''; } });
  }, delay);

  /* ---------------- Populate ---------------- */
  document.title = `${data.name} — Wadi Group`;
  document.body.classList.add('theme-' + data.scene);

  setText('#secNavTitle', data.name);
  setText('#secLogoName', data.name);
  setText('#secIndex', 'Division ' + data.index);
  setHTML('#secTitle', data.headline.map(l => `<span class="sec-line" data-split>${l}</span>`).join(''));
  setText('#secTagline', data.tagline);
  setText('#secLead', data.lead);
  setText('#secBigName', data.name);
  setText('#secNameInline', data.name);
  const scene = $('#secHeroScene');
  if (scene) scene.classList.add('hero-scene', 'hero-scene--' + data.scene);

  // Stats
  setHTML('#secStats', data.stats.map(s => `
    <div class="sec-stat">
      <span class="sec-stat-num">${s.n}</span>
      <span class="sec-stat-label">${s.l}</span>
    </div>`).join(''));

  // Products
  const grid = $('#productGrid');
  if (grid && data.products.length === 2) grid.classList.add('cols-2');
  setHTML('#productGrid', data.products.map((p, i) => {
    const chip = p.metric
      ? `<span class="product-metric-chip"><span class="pm-v">${p.metric.v}</span><span class="pm-l">${p.metric.l}</span></span>`
      : '';
    const media = p.img
      ? `<div class="product-media" style="background-image:url('${p.img}')">${chip}</div>`
      : `<div class="product-media product-media--mark"><span>${p.name.charAt(0)}</span>${chip}</div>`;
    return `
      <article class="product-card" data-i="${i}">
        ${media}
        <div class="product-body">
          <span class="product-kind pc-anim">${p.kind}</span>
          <h3 class="product-name pc-anim">${p.name}</h3>
          <p class="product-desc pc-anim">${p.desc}</p>
          ${p.href
            ? `<a class="product-more pc-anim" href="${p.href}">Explore experience <span aria-hidden="true">→</span></a>`
            : `<span class="product-more pc-anim">Learn more <span aria-hidden="true">→</span></span>`}
        </div>
      </article>`;
  }).join(''));

  // Cross-links to the other two sectors
  setHTML('#crossGrid', ORDER.filter(s => s !== slug).map(s => {
    const d = SECTORS[s];
    return `
      <a class="cross-card hero-scene hero-scene--${d.scene}" href="sector.html?s=${s}">
        <span class="cross-index">${d.index}</span>
        <span class="cross-name">${d.name}</span>
        <span class="cross-sub">${d.subtitle}</span>
        <span class="cross-go" aria-hidden="true">→</span>
      </a>`;
  }).join(''));

  /* ---------------- Split helper ---------------- */
  function splitChars(el) {
    const walk = (node, parent) => {
      if (node.nodeType === Node.TEXT_NODE) {
        [...node.textContent].forEach(ch => {
          const s = document.createElement('span');
          s.className = 'sec-char';
          s.textContent = ch === ' ' ? ' ' : ch;
          parent.appendChild(s);
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const w = document.createElement(node.tagName.toLowerCase());
        [...node.attributes].forEach(a => w.setAttribute(a.name, a.value));
        parent.appendChild(w);
        [...node.childNodes].forEach(c => walk(c, w));
      }
    };
    const frag = document.createDocumentFragment();
    [...el.childNodes].forEach(c => walk(c, frag));
    el.innerHTML = '';
    el.appendChild(frag);
  }
  document.querySelectorAll('[data-split]').forEach(splitChars);

  /* ---------------- Particles ---------------- */
  (function particles() {
    const box = $('#heroParticles');
    if (!box) return;
    for (let i = 0; i < 26; i++) {
      const p = document.createElement('span');
      p.className = 'particle';
      const size = Math.random() * 5 + 2;
      p.style.width = p.style.height = size + 'px';
      p.style.left = Math.random() * 100 + '%';
      p.style.top = Math.random() * 100 + '%';
      box.appendChild(p);
      if (anime) {
        anime({
          targets: p,
          translateY: [0, -(Math.random() * 60 + 30)],
          translateX: [0, (Math.random() - 0.5) * 40],
          opacity: [0, 0.7, 0],
          duration: Math.random() * 4000 + 3000,
          delay: Math.random() * 3000,
          loop: true,
          easing: 'easeInOutSine'
        });
      }
    }
  })();

  /* ---------------- Custom cursor ---------------- */
  (function cursor() {
    const dot = $('#cursorDot'), ring = $('#cursorRing');
    if (!dot || !ring || window.matchMedia('(hover: none)').matches) return;
    document.body.classList.add('custom-cursor');
    let mx = 0, my = 0, rx = 0, ry = 0;
    window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px,${my}px)`; });
    (function loop() { rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18; ring.style.transform = `translate(${rx}px,${ry}px)`; requestAnimationFrame(loop); })();
    document.addEventListener('mouseover', e => {
      if (e.target.closest('a, button, .product-card, .cross-card')) ring.classList.add('is-hover');
      else ring.classList.remove('is-hover');
    });
  })();

  /* ---------------- Scroll progress + nav state ---------------- */
  (function progress() {
    const bar = $('#scrollProgress');
    const nav = $('#secNav');
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (bar) bar.style.transform = `scaleX(${h > 0 ? window.scrollY / h : 0})`;
      if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  })();

  /* ---------------- Intro + hero animation ---------------- */
  function intro() {
    const pre = $('#secPreloader');
    let started = false;
    const begin = () => { if (started) return; started = true; heroIn(); };

    if (anime && pre) {
      anime({ targets: '.sec-preloader-mark', scale: [0.6, 1], opacity: [0, 1], duration: 600, easing: 'easeOutBack' });
      anime({ targets: pre, opacity: [1, 0], duration: 700, delay: 900, easing: 'easeInQuad', complete: () => { pre.style.display = 'none'; begin(); } });
    }

    // Safety net: never leave the intro overlay stuck, even if the animation stalls
    setTimeout(() => { if (pre) pre.style.display = 'none'; begin(); }, 2400);
  }

  function heroIn() {
    if (!anime) { document.querySelectorAll('.sec-logo, .sec-char, #secTagline, #secLead, .scroll-indicator, #secBigName').forEach(e => e.style.opacity = 1); return; }
    anime.timeline({ easing: 'easeOutExpo' })
      .add({ targets: '#secBigName', opacity: [0, 1], scale: [1.15, 1], duration: 1400 })
      .add({ targets: '#secLogo', opacity: [0, 1], translateY: [18, 0], duration: 750 }, '-=1150')
      .add({ targets: '.sec-kicker', opacity: [0, 1], translateY: [16, 0], duration: 700 }, '-=550')
      .add({ targets: '.sec-title .sec-char', opacity: [0, 1], translateY: ['110%', '0%'], rotateX: [-70, 0], duration: 850, delay: anime.stagger(22) }, '-=550')
      .add({ targets: '#secTagline', opacity: [0, 1], translateY: [20, 0], duration: 650 }, '-=500')
      .add({ targets: '#secLead', opacity: [0, 1], translateY: [20, 0], duration: 700 }, '-=450')
      .add({ targets: '.sec-hero .scroll-indicator', opacity: [0, 1], translateY: [15, 0], duration: 600 }, '-=400');

    anime({ targets: '.sec-hero .scroll-arrow', translateY: [0, 8], duration: 1200, direction: 'alternate', loop: true, easing: 'easeInOutSine' });

    ensureVisible(document.querySelectorAll('.sec-logo, .sec-char, .sec-kicker, #secTagline, #secLead, #secBigName, .sec-hero .scroll-indicator'), 2000);
  }

  /* ---------------- Scroll reveals + product cascade ---------------- */
  function observeReveals() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        io.unobserve(el);

        if (el.id === 'secStatsWrap') {
          revealStats();
        } else if (el.id === 'productGrid') {
          cascadeProducts();
        } else {
          if (anime) { anime({ targets: el, opacity: [0, 1], translateY: [40, 0], duration: 800, easing: 'easeOutCubic' }); ensureVisible(el, 1200); }
          else el.style.opacity = 1;
        }
      });
    }, { threshold: 0.2 });

    ['#secStatsWrap', '#productGrid', '.sec-section-head', '.sec-cross .container'].forEach(sel => {
      const el = $(sel); if (el) io.observe(el);
    });
  }

  function revealStats() {
    if (!anime) return;
    anime({ targets: '.sec-stat', opacity: [0, 1], translateY: [30, 0], duration: 800, easing: 'easeOutQuint', delay: anime.stagger(120) });
    document.querySelectorAll('.sec-stat-num').forEach((el, i) => {
      anime({ targets: el, opacity: [0, 1], scale: [0.8, 1], duration: 700, easing: 'easeOutBack', delay: 150 + i * 120 });
    });
    ensureVisible(document.querySelectorAll('.sec-stat, .sec-stat-num'), 1600);
  }

  // The anime.js-style stagger: cards slide DOWN, media zoom-settles,
  // the metric chip pops, and the text reveals in a layered inner stagger.
  function cascadeProducts() {
    const cards = [...document.querySelectorAll('.product-card')];
    if (!anime) {
      cards.forEach(c => {
        c.style.opacity = 1; c.style.transform = 'none';
        c.querySelectorAll('.pc-anim, .product-metric-chip').forEach(e => e.style.opacity = 1);
      });
      return;
    }
    cards.forEach((card, i) => {
      const d = 80 + i * 150;

      anime({
        targets: card,
        translateY: [-90, 0],
        opacity: [0, 1],
        scale: [0.94, 1],
        duration: 1050,
        easing: 'easeOutElastic(1, .72)',
        delay: d,
        complete: () => { card.style.transform = ''; card.classList.add('is-ready'); }
      });

      const media = card.querySelector('.product-media');
      if (media) anime({ targets: media, scale: [1.14, 1], duration: 1400, easing: 'easeOutCubic', delay: d + 40 });

      anime({
        targets: card.querySelectorAll('.pc-anim'),
        opacity: [0, 1],
        translateY: [18, 0],
        duration: 650,
        easing: 'easeOutCubic',
        delay: anime.stagger(70, { start: d + 260 })
      });

      const chip = card.querySelector('.product-metric-chip');
      if (chip) anime({ targets: chip, scale: [0.4, 1], opacity: [0, 1], duration: 700, easing: 'easeOutBack', delay: d + 340 });
    });

    setTimeout(() => {
      cards.forEach(c => {
        c.style.opacity = 1; c.style.transform = ''; c.classList.add('is-ready');
        c.querySelectorAll('.pc-anim, .product-metric-chip').forEach(e => { e.style.opacity = 1; e.style.transform = ''; });
      });
    }, 80 + cards.length * 150 + 1400);
  }

  /* ---------------- Product card tilt ---------------- */
  function productTilt() {
    document.querySelectorAll('.product-card').forEach(card => {
      const media = card.querySelector('.product-media');
      card.addEventListener('mousemove', (e) => {
        if (window.innerWidth < 1024 || !anime) return;
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        anime({ targets: card, rotateY: x * 7, rotateX: -y * 7, duration: 300, easing: 'easeOutQuad' });
        if (media) anime({ targets: media, scale: 1.08, duration: 400, easing: 'easeOutQuad' });
      });
      card.addEventListener('mouseleave', () => {
        if (!anime) return;
        anime({ targets: card, rotateY: 0, rotateX: 0, duration: 600, easing: 'easeOutElastic(1, .5)' });
        if (media) anime({ targets: media, scale: 1, duration: 500, easing: 'easeOutCubic' });
      });
    });
  }

  /* ---------------- Boot ---------------- */
  intro();
  observeReveals();
  productTilt();
})();
