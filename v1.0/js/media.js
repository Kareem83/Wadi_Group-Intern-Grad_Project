/* Media Center — news, videos & events */
(function () {
  'use strict';

  const IMG = 'https://www.wadigroup.com/sites/default/files/';
  const MEDIA_ITEMS = [
    { id: 1, featured: true, title: 'Wadi Group — Corporate Film', category: 'Videos', type: 'video',
      date: 'March 2025', youtubeId: '179CTHMVUcs',
      description: 'A cinematic journey through five decades of Egyptian agribusiness — from breeding and feed to farms, food and logistics.' },
    { id: 2, title: 'Katkoot El Wadi — Product Story', category: 'Videos', type: 'video', date: '2023', youtubeId: '69IrYOiKiC8',
      description: "How Wadi's poultry brand grew to supply a third of local demand." },
    { id: 3, title: "A'laf Al Wadi — Feed Mill Film", category: 'Videos', type: 'video', date: '2023', youtubeId: '9ecRuf7kinU',
      description: "Inside the feed mills producing 15% of Egypt's animal feed." },
    { id: 4, title: 'Proudly Grown in Egypt — Brand Film', category: 'Videos', type: 'video', date: '2024', youtubeId: '48fqEHApvNo',
      description: "The story behind Wadi Food's award-winning olive oil and pantry staples." },
    { id: 5, title: 'Leadership Vision — Executive Interview', category: 'Videos', type: 'video', date: '2024', youtubeId: 'CYBEFHDhB18',
      description: "Wadi's leadership on growth, innovation and customer centricity." },
    { id: 6, title: "Wadi Group welcomes Mitsui's investment", category: 'News', type: 'article', date: '2024',
      image: IMG + 'Wadi-Food_0.jpg',
      description: 'A landmark strategic investment from Mitsui & Co. strengthens Wadi Poultry Group.',
      body: 'Wadi Group welcomes Mitsui & Co. as a strategic partner in Wadi Poultry Group. The investment reinforces the group\'s capital base, brings world-class food-business expertise to the board, and supports an ambitious expansion agenda spanning breeding, feed, farming and logistics — while keeping customer centricity at the core.' },
    { id: 7, title: "World's Longest Rotating Grill — Guinness World Record", category: 'News', type: 'video',
      date: '14 Dec 2024', youtubeId: '0hDMt8iCqd0',
      description: 'Wadi Food enters the Guinness World Records in Cairo with the longest rotating grill.' },
    { id: 8, title: 'Wadi Food Factory Revamp', category: 'News', type: 'article', date: '2023', image: IMG + 'Inner_WF_02.jpg',
      description: "A major upgrade to Wadi Food's production facilities raises capacity and quality.",
      body: "Wadi Food completed a comprehensive revamp of its production facilities, modernising lines for olive oil, pickles and pantry staples, expanding capacity and reinforcing its 'Proudly Grown in Egypt' quality promise." },
    { id: 9, title: 'Wadi Group Publishes 2024 Sustainability Report', category: 'News', type: 'article', date: '2025', image: IMG + 'Inner_Rula_0.jpg',
      description: 'Progress on sustainable farming, resource efficiency and community impact.',
      body: "Wadi Group released its 2024 sustainability report, detailing progress on organic farming technique, water and energy efficiency, and community impact across Dawagen, Mazareh and Sina'at." },
    { id: 10, title: 'Wadi Group Roadshow Highlights', category: 'Events', type: 'video', date: '2024', youtubeId: 'BaJ3S0QKSt0',
      description: "Highlights from the group's partner and customer roadshow." },
    { id: 11, title: 'Environmental Day Highlights', category: 'Events', type: 'video', date: '2024', youtubeId: '5lKdmFD7esY',
      description: 'Sustainability in action across Rula Farms and the wider group.' },
    { id: 12, title: 'Wadi Food Harvest Festival', category: 'Events', type: 'article', date: '2023', image: IMG + 'Wadi-Food_0.jpg',
      description: 'A celebration of the olive harvest bringing partners and community together.',
      body: 'The Wadi Food Harvest Festival celebrated another season of the olive harvest at Rula Farms, welcoming partners, customers and the local community to experience farm-to-shelf quality first-hand.' },
    { id: 13, title: 'Agrena Trade Show', category: 'Events', type: 'article', date: '2023', image: IMG + 'Inner_HiTec.jpg',
      description: "Wadi Group exhibits its poultry and feed solutions at Egypt's leading agribusiness show.",
      body: "At Agrena, Wadi Group presented its integrated poultry, feed and veterinary solutions — from Katkoot El Wadi day-old chicks to A'laf Al Wadi feed and Hi-Tec diagnostics — to thousands of industry visitors." },
    { id: 14, title: 'Gulfood Exhibition', category: 'Events', type: 'article', date: '2024', image: IMG + '3.jpeg',
      description: 'Wadi Food brings its award-winning range to the region\'s largest food exhibition in Dubai.',
      body: "Wadi Food joined Gulfood in Dubai, one of the world's largest food exhibitions, connecting with distributors and retailers across the Middle East and showcasing its extra virgin olive oil and pantry range." }
  ];

  const catClass = (c) => 'cat-' + c.toLowerCase();
  const ytThumb = (id) => 'https://img.youtube.com/vi/' + id + '/hqdefault.jpg';
  const thumbFor = (m) => m.thumbnail || (m.youtubeId ? ytThumb(m.youtubeId) : m.image);
  const d = document;
  const grid = d.getElementById('mediaGrid');
  const featuredEl = d.getElementById('featuredCard');
  const countEl = d.getElementById('mediaCount');
  if (!grid || !featuredEl || !countEl) return;

  const byId = (id) => MEDIA_ITEMS.find((m) => m.id == id);

  const featured = MEDIA_ITEMS.find((m) => m.featured) || MEDIA_ITEMS[0];
  featuredEl.classList.add(catClass(featured.category));
  featuredEl.dataset.id = featured.id;
  featuredEl.innerHTML =
    '<div class="media-thumb"><span class="media-badge">' + featured.category + '</span>' +
      '<img src="' + thumbFor(featured) + '" alt="' + featured.title + '" loading="lazy">' +
      (featured.type === 'video' ? '<span class="media-play" aria-hidden="true"></span>' : '') + '</div>' +
    '<div class="media-featured-body"><span class="media-tag">Featured · ' + featured.category + '</span>' +
      '<h3>' + featured.title + '</h3><p>' + featured.description + '</p>' +
      '<div class="media-meta"><span>' + featured.date + '</span><span class="dot"></span><span>' +
        (featured.type === 'video' ? 'Video' : 'Story') + '</span></div>' +
      '<button type="button" class="btn btn-primary">' + (featured.type === 'video' ? '▶ Watch now' : 'Read more') + '</button></div>';

  const items = MEDIA_ITEMS.filter((m) => !m.featured);
  grid.innerHTML = items.map((m) =>
    '<article class="media-card ' + catClass(m.category) + '" data-id="' + m.id + '" data-category="' + m.category.toLowerCase() +
        '" tabindex="0" role="button" aria-label="Open: ' + m.title + '">' +
      '<div class="media-thumb"><span class="media-badge">' + m.category + '</span>' +
        '<img src="' + thumbFor(m) + '" alt="' + m.title + '" loading="lazy">' +
        (m.type === 'video' ? '<span class="media-play" aria-hidden="true"></span>' : '') + '</div>' +
      '<div class="media-card-body"><h3>' + m.title + '</h3><p>' + m.description + '</p>' +
        '<div class="media-card-foot"><span class="media-date">' + m.date + '</span>' +
          '<span class="media-action">' + (m.type === 'video' ? 'Watch video' : 'Read more') +
            ' <span aria-hidden="true">→</span></span></div>' +
      '</div></article>'
  ).join('');

  const cards = Array.from(grid.querySelectorAll('.media-card'));
  countEl.textContent = items.length;

  const vModal = d.getElementById('mediaModal');
  const vVideo = d.getElementById('mediaModalVideo');
  const vYt = d.getElementById('mediaModalYt');
  const dModal = d.getElementById('detailModal');
  let lastFocus = null;

  function openVideo(id, trigger) {
    if (!id || !vModal) return;
    lastFocus = trigger || null;
    vVideo.innerHTML = '<iframe src="https://www.youtube.com/embed/' + id + '?autoplay=1&rel=0" title="Wadi Group video" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>';
    vYt.href = 'https://www.youtube.com/watch?v=' + id;
    vModal.classList.add('open');
    vModal.setAttribute('aria-hidden', 'false');
    d.body.style.overflow = 'hidden';
    d.getElementById('mediaModalClose')?.focus();
  }

  function closeVideo() {
    if (!vModal) return;
    vModal.classList.remove('open');
    vModal.setAttribute('aria-hidden', 'true');
    d.body.style.overflow = '';
    setTimeout(function () { vVideo.innerHTML = ''; }, 320);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function openDetail(m, trigger) {
    if (!dModal) return;
    lastFocus = trigger || null;
    d.getElementById('detailImg').src = thumbFor(m);
    d.getElementById('detailImg').alt = m.title;
    d.getElementById('detailBadge').textContent = m.category;
    d.querySelector('#detailModal .media-detail-img').className = 'media-detail-img ' + catClass(m.category);
    d.getElementById('detailDate').textContent = m.date;
    d.getElementById('detailCat').textContent = m.category;
    d.getElementById('detailTitle').textContent = m.title;
    d.getElementById('detailText').textContent = m.body || m.description;
    dModal.classList.add('open');
    dModal.setAttribute('aria-hidden', 'false');
    d.body.style.overflow = 'hidden';
    d.getElementById('detailClose')?.focus();
  }

  function closeDetail() {
    if (!dModal) return;
    dModal.classList.remove('open');
    dModal.setAttribute('aria-hidden', 'true');
    d.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  d.getElementById('mediaModalClose')?.addEventListener('click', closeVideo);
  vModal?.addEventListener('click', function (e) { if (e.target === vModal) closeVideo(); });
  d.getElementById('detailClose')?.addEventListener('click', closeDetail);
  dModal?.addEventListener('click', function (e) { if (e.target === dModal) closeDetail(); });
  d.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (vModal?.classList.contains('open')) closeVideo();
    if (dModal?.classList.contains('open')) closeDetail();
  });

  function activate(el) {
    const m = byId(el.dataset.id);
    if (!m) return;
    if (m.type === 'video') openVideo(m.youtubeId, el);
    else openDetail(m, el);
  }

  featuredEl.addEventListener('click', function () { activate(featuredEl); });
  featuredEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      activate(featuredEl);
    }
  });
  d.getElementById('heroWatch')?.addEventListener('click', function () {
    openVideo(featured.youtubeId, d.getElementById('heroWatch'));
  });
  grid.addEventListener('click', function (e) {
    const c = e.target.closest('.media-card');
    if (c) activate(c);
  });
  grid.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const c = e.target.closest('.media-card');
    if (c) {
      e.preventDefault();
      activate(c);
    }
  });

  const filters = Array.from(d.querySelectorAll('.media-filter'));
  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filters.forEach(function (b) {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const f = btn.dataset.filter;
      let shown = 0;
      cards.forEach(function (card) {
        const match = f === 'all' || card.dataset.category === f;
        if (match) {
          card.style.display = '';
          card.classList.remove('media-hide');
          shown += 1;
        } else {
          card.classList.add('media-hide');
          setTimeout(function () {
            if (card.classList.contains('media-hide')) card.style.display = 'none';
          }, 300);
        }
      });
      countEl.textContent = shown;
    });
  });

  /* Scroll reveals — same pattern as about / leaders */
  const revealItems = d.querySelectorAll('.anim-reveal');
  if (!('IntersectionObserver' in window)) {
    revealItems.forEach(function (el) { el.classList.add('revealed'); });
  } else {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -4% 0px' });
    revealItems.forEach(function (el) { io.observe(el); });
  }
})();
