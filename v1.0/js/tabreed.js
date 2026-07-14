(function () {
  'use strict';

  const panelBuild = document.getElementById('panelBuild');
  const assemblyTrack = document.getElementById('assemblyTrack');
  const compareRange = document.getElementById('compareRange');
  const compareNew = document.getElementById('compareNew');
  const certCards = Array.from(document.querySelectorAll('.cert-card'));
  const certDetail = document.getElementById('certDetail');
  const metricNums = Array.from(document.querySelectorAll('.metric-num'));
  const chapterSections = Array.from(document.querySelectorAll('.tb-chapter'));
  const storyDots = Array.from(document.querySelectorAll('.tb-story-dot'));
  const storyProgress = document.getElementById('tbStoryProgress');

  const certData = [
    {
      title: 'ISO Quality',
      desc: 'Manufacturing workflows and controls aligned with quality management standards for consistent production output.',
    },
    {
      title: 'Fire Safety',
      desc: 'Panel systems engineered and tested to satisfy relevant fire behavior and safety criteria for industrial projects.',
    },
    {
      title: 'Thermal Performance',
      desc: 'Certified thermal characteristics supporting energy-conscious envelope design and measurable efficiency outcomes.',
    },
  ];

  // Pinned construction: scroll through the tall track builds the panel
  // layer by layer while the stage stays centred, and callouts form around it.
  if (panelBuild && assemblyTrack) {
    const buildLayers = Array.from(panelBuild.querySelectorAll('.pbuild-layer'));
    const callouts = Array.from(document.querySelectorAll('.pcallout'));
    const stepNum = document.getElementById('assemblyStepNum');
    const n = buildLayers.length;
    const clamp01 = (v) => Math.max(0, Math.min(1, v));

    const renderAssembly = () => {
      const rect = assemblyTrack.getBoundingClientRect();
      const viewH = window.innerHeight || document.documentElement.clientHeight;
      const pinnedDistance = assemblyTrack.offsetHeight - viewH;
      const progress = clamp01(-rect.top / Math.max(1, pinnedDistance));

      buildLayers.forEach((layer, i) => {
        const start = i / n;
        const end = (i + 0.85) / n; // each layer finishes just before the next begins
        const p = clamp01((progress - start) / Math.max(0.0001, end - start));
        layer.style.setProperty('--p', p.toFixed(3));
      });

      callouts.forEach((c, i) => {
        c.classList.toggle('is-on', progress >= (i + 0.5) / n);
      });

      const step = Math.min(n, Math.floor(progress * n) + 1);
      if (stepNum) stepNum.textContent = String(step).padStart(2, '0');

      panelBuild.classList.toggle('is-complete', progress > 0.985);
    };

    window.addEventListener('scroll', renderAssembly, { passive: true });
    window.addEventListener('resize', renderAssembly);
    renderAssembly();
  }

  if (compareRange && compareNew) {
    const updateClip = () => {
      const v = Number(compareRange.value);
      compareNew.style.clipPath = `inset(0 0 0 ${100 - v}%)`;
    };
    compareRange.addEventListener('input', updateClip);
    updateClip();
  }

  if (certCards.length && certDetail) {
    certCards.forEach((btn) => {
      btn.addEventListener('click', () => {
        certCards.forEach((c) => c.classList.remove('active'));
        btn.classList.add('active');
        const index = Number(btn.dataset.cert || 0);
        const item = certData[index] || certData[0];
        certDetail.innerHTML = `<h3>${item.title}</h3><p>${item.desc}</p>`;
      });
    });
  }

  if (metricNums.length) {
    const mo = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        metricNums.forEach((el, i) => {
          const target = Number(el.dataset.target || 0);
          if (!window.anime) {
            el.textContent = String(target);
            return;
          }
          const counter = { v: 0 };
          anime({
            targets: counter,
            v: target,
            round: 1,
            duration: 1200,
            easing: 'easeOutCubic',
            delay: 120 * i,
            update: () => { el.textContent = String(counter.v); },
          });
        });
        mo.disconnect();
      });
    }, { threshold: 0.35 });
    const section = document.getElementById('sustainability');
    if (section) mo.observe(section);
  }

  if (window.anime) {
    anime({
      targets: '.tb-hero-inner > *',
      opacity: [0, 1],
      translateY: [24, 0],
      easing: 'easeOutExpo',
      duration: 900,
      delay: anime.stagger(120, { start: 250 }),
    });

    anime({
      targets: '.tb-hero-media',
      scale: [1.15, 1.02],
      duration: 7000,
      easing: 'linear',
    });

    anime({
      targets: '.journey-step, .industry-card, .project-card, .metric-card, .resource-card',
      opacity: [0, 1],
      translateY: [22, 0],
      duration: 800,
      delay: anime.stagger(70, { start: 450 }),
      easing: 'easeOutCubic',
    });
  }

  if (chapterSections.length) {
    const chapterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          storyDots.forEach((dot) => {
            dot.classList.toggle('active', dot.dataset.chapter === id);
          });
        }
      });
    }, { threshold: 0.35 });

    chapterSections.forEach((section) => chapterObserver.observe(section));
  }

  const updateStoryProgress = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
    if (storyProgress) storyProgress.style.height = `${Math.max(0, Math.min(100, ratio))}%`;

    const hero = document.querySelector('.tb-hero-media');
    if (hero) {
      const subtle = Math.min(window.scrollY * 0.06, 36);
      hero.style.transform = `scale(1.05) translateY(${subtle}px)`;
    }
  };

  window.addEventListener('scroll', updateStoryProgress, { passive: true });
  updateStoryProgress();
})();

