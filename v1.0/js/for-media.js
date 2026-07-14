/* Public Relations — resources, awards & certificates */
(function () {
  'use strict';

  const d = document;
  const CERT_BASE = 'https://www.wadigroup.com/sites/default/files/certificates/';
  const IMG = 'https://www.wadigroup.com/sites/default/files/';

  const ICONS = {
    doc: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h6"/>',
    zip: '<path d="M21 8v13H3V3h10"/><path d="M13 3l8 5"/><path d="M12 7v2M12 11v2M12 15v2"/>',
    img: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>',
    id: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M13 9h5M13 13h5M6 16c.8-1.5 4.2-1.5 5 0"/>'
  };

  const RESOURCES = [
    { id: 1, title: 'Company Profile', description: 'An overview of Wadi Group, its three sectors, ten brands and fifty-year story.', fileType: 'pdf', icon: 'doc', size: '3.2 MB' },
    { id: 2, title: 'Brand Guidelines', description: 'The complete visual identity manual — logo, colour, typography and tone of voice.', fileType: 'pdf', icon: 'doc', size: '5.8 MB' },
    { id: 3, title: 'Official Logo Package', description: 'Primary, mono and sector logos in SVG, PNG and EPS with clear-space guides.', fileType: 'zip', icon: 'zip', size: '12 MB' },
    { id: 4, title: 'Press Kit', description: 'Recent releases, statements and fact sheets prepared for journalists.', fileType: 'zip', icon: 'zip', size: '8.4 MB' },
    { id: 5, title: 'Corporate Images', description: 'High-resolution photography of farms, facilities, products and leadership.', fileType: 'jpg', icon: 'img', size: '42 MB' },
    { id: 6, title: 'Media Contact Sheet', description: 'Direct contacts for the Public Relations and communications team.', fileType: 'pdf', icon: 'id', size: '0.4 MB' }
  ];

  const fileClass = (ft) => (ft === 'jpg' || ft === 'png' || ft === 'img') ? 'img' : ft;
  const assetGrid = d.getElementById('assetGrid');
  if (assetGrid) {
    assetGrid.innerHTML = RESOURCES.map(function (a) {
      return '<article class="asset-card">' +
        '<div class="asset-top">' +
          '<span class="asset-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + ICONS[a.icon] + '</svg></span>' +
          '<span class="file-badge ' + fileClass(a.fileType) + '">' + (a.fileType === 'jpg' ? 'JPG' : a.fileType.toUpperCase()) + '</span>' +
        '</div>' +
        '<h3>' + a.title + '</h3><p>' + a.description + '</p>' +
        '<span class="asset-size">' + a.fileType.toUpperCase() + ' · ' + a.size + '</span>' +
        '<button type="button" class="asset-dl" data-download="' + a.title + '">↓ Download</button>' +
      '</article>';
    }).join('');
  }

  const AWARDS = [
    { id: 1, title: 'NYIOOC World Olive Oil Competition', brand: 'Wadi Food Olive Oil', year: '2020', image: IMG + 'award-1.png' },
    { id: 2, title: 'New York Golden Award', brand: 'Wadi Food Olive Oil', year: '2018', image: IMG + 'award-2.png' },
    { id: 3, title: 'Produit Gourmet', brand: 'Wadi Food Olive Oil', year: '2015', image: IMG + 'award-3.png' },
    { id: 4, title: 'AVPA Paris', brand: 'Wadi Food Olive Oil', year: '', image: IMG + 'AVPA.jpg' },
    { id: 5, title: 'International Olive Oil Competition', brand: 'Wadi Food Olive Oil', year: '', image: IMG + 'award-1.png' },
    { id: 6, title: 'Best of bioPress Olive Oil', brand: 'Wadi Food Olive Oil', year: '', image: IMG + 'award-2.png' }
  ];

  const awardGrid = d.getElementById('awardGrid');
  if (awardGrid) {
    awardGrid.innerHTML = AWARDS.map(function (a) {
      return '<article class="award-card">' +
        '<div class="award-media"><span class="award-badge">Award</span>' +
          (a.year ? '<span class="award-year">' + a.year + '</span>' : '') +
          '<img src="' + a.image + '" alt="' + a.title + ' — ' + a.brand + '" loading="lazy"></div>' +
        '<div class="award-body"><h4>' + a.title + '</h4><span class="award-brand">' + a.brand + '</span></div>' +
      '</article>';
    }).join('');
  }

  const C = function (title, company, type, filter, year, file) {
    return { title: title, company: company, type: type, filter: filter, year: year, url: CERT_BASE + file };
  };

  const CERTS = [
    C('ISO 9001', 'Wadi Food', 'ISO 9001', 'iso', '2008', 'Wadi%20Food-%20ISO%209001-%202008.pdf'),
    C('ISO 22000', 'Wadi Food', 'ISO 22000', 'foodsafety', '2005', 'Wadi%20Food-%20ISO%2022000-%202005.pdf'),
    C('OHSAS 18001', 'Wadi Food', 'OHSAS 18001', 'ohsas', '2007', 'Wadi%20Food%20-%20OHSAS%2018001%20-%202007.pdf'),
    C('BRC Global Standard for Food Safety', 'Wadi Food (Sadat City)', 'BRC', 'foodsafety', '2016', 'Wadi%20Food%20%28Sadat%20City%29%20-%20Global%20Standard%20for%20Food%20Safety%20-%202016.pdf'),
    C('BRC Global Standard for Food Safety', 'Wadi Food (Km 54)', 'BRC', 'foodsafety', '2015', 'Wadi%20Food%20%28km%2054%29%20-%20Global%20Standard%20for%20Food%20Safety%20-%202015.pdf'),
    C('EC Organic Certificate', 'Wadi Food', 'EC', 'organic', '2016', 'Wadi%20Food%20EC%20Certificate%202016.pdf'),
    C('NOP Organic Certificate', 'Wadi Food', 'NOP', 'organic', '2016', 'Wadi%20Food%20NOP%20Certificate%202016.pdf'),
    C('EC Organic Certificate', 'Rula Farms', 'EC', 'organic', '2016', 'Rula%20EC%20Certificate%202016.pdf'),
    C('NOP Organic Certificate', 'Rula Farms', 'NOP', 'organic', '2016', 'Rula%20NOP%20Certificate%202016.pdf'),
    C('Global GAP Certificate', 'Rula Farms', 'Global GAP', 'globalgap', '2016–2017', 'Global%20Gap%20certificate%202016-2017.pdf'),
    C('ISO 9001', "Wadi Feed (A'laf)", 'ISO 9001', 'iso', '2008', 'Wadi%20Feed%20-%20ISO%209001%20-%202008.pdf'),
    C('OHSAS 18001', "Wadi Feed (A'laf)", 'OHSAS 18001', 'ohsas', '2008', 'Wadi%20Feed%20OHSAS%2018001%20-%202008.pdf'),
    C('ISO 9001', 'Tabreed (Haditha)', 'ISO 9001', 'iso', '2008', 'Haditha%20For%20Exports%20and%20Industries%20Co-Tabreed-%20ISO%209001-2008.pdf'),
    C('OHSAS 18001', 'Tabreed (Haditha)', 'OHSAS 18001', 'ohsas', '2007', 'Haditha%20for%20Importing%2C%20Exporting%20and%20Industry%20-Tabreed%20OHSAS%2018001-2007.pdf'),
    C('ISO 9001', 'Haditha Soya', 'ISO 9001', 'iso', '', 'Haditha%20for%20Imports%2C%20Exports%20-Soya%20ISO%209001.pdf'),
    C('OHSAS 18001', 'Haditha Soya', 'OHSAS 18001', 'ohsas', '2007', 'Haditha%20for%20Imports%2C%20Exports%20%20Soya%20OHSAS%2018001-2007.pdf'),
    C('ISO 9001', 'Wadi Poultry', 'ISO 9001', 'iso', '2008', 'Wadi%20Poultry%20-%20ISO%209001-2008.pdf'),
    C('ISO 9001', 'Wadi Poultry Grandparents', 'ISO 9001', 'iso', '2016–2018', 'Wadi%20Poultry%20Grandparents%20ISO%209001%202016-2018.pdf'),
    C('ISO 9001', 'Wadi Poultry Parents', 'ISO 9001', 'iso', '2008', 'Wadi%20Poultry%20Parents%20-%20ISO%209001%20-%202008.pdf'),
    C('OHSAS 18001', 'Wadi Poultry Parents', 'OHSAS 18001', 'ohsas', '2007', 'Wadi%20Poultry%20Parents%20-%20OHSAS%2018001%20-%202007.pdf'),
    C('ISO 9001', 'Wadi Hatcheries & Poultry', 'ISO 9001', 'iso', '2008', 'Wadi%20Hatcheries%20and%20Poultry-ISO%209001-2008.pdf'),
    C('OHSAS 18001', 'Wadi Hatcheries & Poultry', 'OHSAS 18001', 'ohsas', '2007', 'Wadi%20Hatcheries%20and%20Poultry%20-%20OHSAS%2018001-2007.pdf'),
    C('ISO 9001', 'Wadi for Fish Production', 'ISO 9001', 'iso', '2008', 'Wadi%20For%20Fish%20Production%20ISO%209001%20-%202008.pdf')
  ];

  const DL_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>';
  const CERT_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><circle cx="10" cy="14" r="2.2"/><path d="M8.5 16.5L7 21l3-1.4L13 21l-1.5-4.5"/></svg>';

  const certPanel = d.getElementById('certPanel');
  if (certPanel) {
    certPanel.innerHTML = CERTS.map(function (c) {
      return '<div class="cert-row" data-filter="' + c.filter + '">' +
        '<span class="cert-ico">' + CERT_ICON + '</span>' +
        '<div class="cert-main"><h4>' + c.company + '</h4><span>' + c.title + (c.year ? ' · ' + c.year : '') + '</span></div>' +
        '<span class="cert-type ' + c.filter + '">' + c.type + '</span>' +
        '<a class="cert-dl" href="' + c.url + '" target="_blank" rel="noopener" title="Download ' + c.company + ' ' + c.type + '" aria-label="Download ' + c.company + ' ' + c.type + '">' + DL_ICON + '</a>' +
      '</div>';
    }).join('');
  }

  const certRows = Array.from(d.querySelectorAll('#certPanel .cert-row'));
  const certCount = d.getElementById('certCount');
  if (certCount) certCount.textContent = certRows.length;

  const certFilters = Array.from(d.querySelectorAll('#certFilters .media-filter'));
  certFilters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      certFilters.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      const f = btn.dataset.filter;
      let shown = 0;
      certRows.forEach(function (r) {
        const m = f === 'all' || r.dataset.filter === f;
        r.classList.toggle('cert-hide', !m);
        if (m) shown += 1;
      });
      if (certCount) certCount.textContent = shown;
    });
  });

  const tabs = Array.from(d.querySelectorAll('.pr-tab'));
  const setActive = function (id) {
    tabs.forEach(function (t) { t.classList.toggle('active', t.dataset.target === id); });
  };
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) setActive(e.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    ['resources', 'awards'].forEach(function (id) {
      const s = d.getElementById(id);
      if (s) spy.observe(s);
    });
  }
  tabs.forEach(function (t) {
    t.addEventListener('click', function () { setActive(t.dataset.target); });
  });

  const toast = d.getElementById('prToast');
  let toastT;
  d.addEventListener('click', function (e) {
    const b = e.target.closest('[data-download]');
    if (!b || !toast) return;
    toast.textContent = b.dataset.download + ' — coming soon. Connect the real file here.';
    toast.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(function () { toast.classList.remove('show'); }, 3200);
  });

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
