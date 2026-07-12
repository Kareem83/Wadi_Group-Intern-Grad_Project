/* =====================================================================
   Wadi Group — Admin dashboard logic (UI only).
   No backend: content is seeded from the real site copy and kept in
   localStorage purely so edits persist across a refresh in the demo.
   Nothing here writes back to the public HTML files.
   ===================================================================== */

/* ---------------------------------------------------------------------
   Auth (demo-only — a real deployment must check credentials server-side)
   --------------------------------------------------------------------- */
var AdminAuth = (function () {
  var KEY = 'wadi_admin_session';
  var USER = 'admin';
  var PASS = 'wadigroup';

  function getSession() {
    var raw = sessionStorage.getItem(KEY) || localStorage.getItem(KEY);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
  }

  function login(user, pass, remember) {
    if (user !== USER || pass !== PASS) return false;
    var payload = JSON.stringify({ user: user, at: Date.now() });
    if (remember) localStorage.setItem(KEY, payload);
    else sessionStorage.setItem(KEY, payload);
    return true;
  }

  function logout() {
    sessionStorage.removeItem(KEY);
    localStorage.removeItem(KEY);
    window.location.href = 'login.html';
  }

  function guardLogin() {
    if (getSession()) window.location.href = 'index.html';
  }

  function guardDashboard() {
    var s = getSession();
    if (!s) { window.location.href = 'login.html'; return null; }
    return s;
  }

  return { login: login, logout: logout, guardLogin: guardLogin, guardDashboard: guardDashboard };
})();

/* Only run dashboard boot logic on index.html (login.html includes this
   file only for AdminAuth and returns before this point via guardLogin). */
if (/index\.html$/.test(window.location.pathname) || /\/admin\/?$/.test(window.location.pathname)) {
  (function () {
    "use strict";

    var session = AdminAuth.guardDashboard();
    if (!session) return;

    var d = document;
    var STORE_KEY = 'wadi_admin_content_v1';

    /* ---------------- Seed data (mirrors real site content) ---------------- */
    var IMG = 'https://www.wadigroup.com/sites/default/files/';

    var defaults = {
      hero: {
        eyebrow: 'Est. 1984 · Sheikh Zayed, Giza, Egypt',
        title: 'To Achieve...         To Lead.',
        sub: 'Wadi Group breeds day-old chicks, grows olives and produce, mills feed, and moves it all to market — three sectors and eight brands built into one Egyptian supply chain since 1984.',
        image: ''
      },
      sectorAssets: [
        { id: 1, name: 'Dawagen sector logo', file: '../Dawagen-sector.png' },
        { id: 2, name: 'Mazareh sector logo', file: '../Mazareh-sector.png' },
        { id: 3, name: "Sina'at sector logo", file: '../Sinaat-sector.png' }
      ],
      leaders: [
        { id: 1, name: 'Mr. Musa Freiji', role: 'Founding Shareholder & Director', pill: 'Founder', group: 'Top Leaders', bio: 'A founding figure behind Wadi Group, with a BSc in Agricultural Engineering from the American University of Beirut. His poultry industry experience began in the 1950s.', photo: 'https://www.wadigroup.com/sites/default/files/Musa-Freiji.jpg' },
        { id: 2, name: 'Mr. Tony Freiji', role: 'Executive Chairman, Shareholder', pill: 'Shareholder', group: 'Wadi Poultry Group Board of Directors', bio: 'Joined Wadi in 1984 after studying Agricultural Engineering at AUB and Poultry Nutrition at Iowa State University. He has led production, commercial operations and expansion projects.', photo: 'https://www.wadigroup.com/sites/default/files/Tony-Freiji_0.jpg' },
        { id: 3, name: 'Mr. Ramzi P. Nasrallah', role: 'Vice-Chairman & Managing Director, Shareholder', pill: 'Shareholder', group: 'Wadi Poultry Group Board of Directors', bio: 'Responsible for corporate financial direction, audit activity and budget planning. He joined Wadi at the establishment stage.', photo: 'https://www.wadigroup.com/sites/default/files/Ramzi-Nasrallah.jpg' },
        { id: 4, name: 'Mrs. Rima Freiji', role: 'Director, Head of Governance Committee, Shareholder', pill: 'Shareholder', group: 'Wadi Poultry Group Board of Directors', bio: 'Leads governance and institutional development initiatives. She joined Wadi in 2008 and later became Chief Development Officer.', photo: 'https://www.wadigroup.com/sites/default/files/Rima-Freiji_0.jpg' }
      ],
      media: [
        { id: 1, featured: true, title: 'Wadi Group — Corporate Film', category: 'Videos', type: 'video', date: 'March 2025', youtubeId: '179CTHMVUcs', description: 'An inside look at Wadi Group\'s three sectors and fifty-year story.' },
        { id: 2, featured: false, title: 'Katkoot El Wadi Hatchery Tour', category: 'Videos', type: 'video', date: 'January 2025', youtubeId: '179CTHMVUcs', description: 'A walkthrough of the day-old chick hatchery operations.' },
        { id: 3, featured: false, title: 'Wadi Group Expands Olive Oil Exports', category: 'News', type: 'article', date: 'February 2025', description: 'Wadi Food olive oil reaches three new export markets this quarter.' },
        { id: 4, featured: false, title: 'Wadi Group at Cairo Agri Expo', category: 'Events', type: 'article', date: 'April 2025', description: 'Wadi Group showcased its three sectors at this year\'s Cairo Agri Expo.' }
      ],
      resources: [
        { id: 1, title: 'Company Profile', description: 'An overview of Wadi Group, its three sectors, ten brands and fifty-year story.', fileType: 'pdf', size: '3.2 MB' },
        { id: 2, title: 'Brand Guidelines', description: 'The complete visual identity manual — logo, colour, typography and tone of voice.', fileType: 'pdf', size: '5.8 MB' },
        { id: 3, title: 'Official Logo Package', description: 'Primary, mono and sector logos in SVG, PNG and EPS with clear-space guides.', fileType: 'zip', size: '12 MB' }
      ],
      awards: [
        { id: 1, title: 'NYIOOC World Olive Oil Competition', brand: 'Wadi Food Olive Oil', year: '2020', image: IMG + 'award-1.png' },
        { id: 2, title: 'New York Golden Award', brand: 'Wadi Food Olive Oil', year: '2018', image: IMG + 'award-2.png' },
        { id: 3, title: 'Produit Gourmet', brand: 'Wadi Food Olive Oil', year: '2015', image: IMG + 'award-3.png' }
      ],
      certs: [
        { id: 1, title: 'ISO 9001', brand: 'Wadi Food', standard: 'ISO 9001', category: 'iso', year: '2008' },
        { id: 2, title: 'ISO 22000', brand: 'Wadi Food', standard: 'ISO 22000', category: 'foodsafety', year: '2005' },
        { id: 3, title: 'OHSAS 18001', brand: 'Wadi Food', standard: 'OHSAS 18001', category: 'ohsas', year: '2007' }
      ],
      jobs: [
        { id: 1, title: 'Poultry Production Supervisor', sector: 'Dawagen', location: 'Giza, Egypt', jobType: 'Full-time', status: 'Open' },
        { id: 2, title: 'Agronomist', sector: 'Mazareh', location: 'Minya, Egypt', jobType: 'Full-time', status: 'Open' },
        { id: 3, title: 'Logistics Coordinator', sector: "Sina'at", location: 'Alexandria, Egypt', jobType: 'Contract', status: 'Closed' }
      ],
      activity: [
        { text: 'Dashboard initialized with current site content', time: 'just now' }
      ]
    };

    var data = loadData();

    function loadData() {
      try {
        var raw = localStorage.getItem(STORE_KEY);
        if (raw) {
          var parsed = JSON.parse(raw);
          /* Backfill any keys added to `defaults` after this browser last saved. */
          Object.keys(defaults).forEach(function (k) {
            if (!(k in parsed)) parsed[k] = defaults[k];
          });
          return parsed;
        }
      } catch (e) {}
      return JSON.parse(JSON.stringify(defaults));
    }
    function saveData() {
      localStorage.setItem(STORE_KEY, JSON.stringify(data));
    }
    function nextId(list) {
      return list.reduce(function (m, x) { return Math.max(m, x.id); }, 0) + 1;
    }
    function logActivity(text) {
      data.activity.unshift({ text: text, time: 'just now' });
      data.activity = data.activity.slice(0, 8);
    }

    /* ---------------- Toast ---------------- */
    var toastEl = d.getElementById('toast');
    var toastTimer;
    function toast(msg) {
      toastEl.textContent = msg;
      toastEl.classList.add('is-visible');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () { toastEl.classList.remove('is-visible'); }, 2200);
    }

    /* ---------------- Sidebar nav ---------------- */
    var side = d.getElementById('adminSide');
    var overlay = d.getElementById('adminOverlay');
    d.getElementById('sideToggle').addEventListener('click', function () {
      side.classList.add('is-open'); overlay.classList.add('is-open');
    });
    d.getElementById('sideClose').addEventListener('click', closeSide);
    overlay.addEventListener('click', closeSide);
    function closeSide() { side.classList.remove('is-open'); overlay.classList.remove('is-open'); }

    var panelMeta = {
      overview: ['Overview', 'A snapshot of everything editable on the site.'],
      'site-media': ['Site Media', 'Hero and sector imagery shown on the homepage.'],
      'management-team': ['Management Team', 'Leadership profiles shown on the homepage and leaders page.'],
      'media-center': ['Media Center', 'News, videos and events published to visitors.'],
      'public-relations': ['Public Relations', 'Media kit resources, awards and certificates.'],
      careers: ['Careers', 'Job listings shown on the Careers page.']
    };

    function goPanel(name) {
      d.querySelectorAll('.side-link[data-panel]').forEach(function (b) {
        b.classList.toggle('is-active', b.dataset.panel === name);
      });
      d.querySelectorAll('.panel').forEach(function (p) {
        p.classList.toggle('is-active', p.id === 'panel-' + name);
      });
      d.getElementById('panelTitle').textContent = panelMeta[name][0];
      d.getElementById('panelSub').textContent = panelMeta[name][1];
      closeSide();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    d.querySelectorAll('.side-link[data-panel]').forEach(function (b) {
      b.addEventListener('click', function () { goPanel(b.dataset.panel); });
    });
    d.querySelectorAll('[data-goto]').forEach(function (b) {
      b.addEventListener('click', function () { goPanel(b.dataset.goto); });
    });
    d.getElementById('logoutBtn').addEventListener('click', function () { AdminAuth.logout(); });
    d.getElementById('userName').textContent = session.user || 'admin';

    /* ---------------- Generic modal ---------------- */
    var modal = d.getElementById('adminModal');
    var modalBody = d.getElementById('modalBody');
    var modalTitle = d.getElementById('modalTitle');
    var modalSave = d.getElementById('modalSave');
    var currentSave = null;

    function openModal(title, fieldsHtml, onSave) {
      modalTitle.textContent = title;
      modalBody.innerHTML = fieldsHtml;
      currentSave = onSave;
      modal.classList.add('is-open');
    }
    function closeModal() { modal.classList.remove('is-open'); currentSave = null; }
    d.getElementById('modalClose').addEventListener('click', closeModal);
    d.getElementById('modalCancel').addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
    modalSave.addEventListener('click', function () {
      if (currentSave) {
        var ok = currentSave();
        if (ok !== false) closeModal();
      }
    });

    function fv(id) { var el = d.getElementById(id); return el ? el.value.trim() : ''; }
    function fc(id) { var el = d.getElementById(id); return el ? el.checked : false; }
    function esc(s) { return (s || '').toString().replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

    /* ============================================================
       OVERVIEW
       ============================================================ */
    function renderOverview() {
      d.getElementById('statLeaders').textContent = data.leaders.length;
      d.getElementById('statMedia').textContent = data.media.length;
      d.getElementById('statResources').textContent = data.resources.length;
      d.getElementById('statAwards').textContent = data.awards.length + data.certs.length;
      d.getElementById('statJobs').textContent = data.jobs.filter(function (j) { return j.status === 'Open'; }).length;

      var list = d.getElementById('activityList');
      list.innerHTML = data.activity.map(function (a) {
        return '<li><span class="a-dot"></span>' + esc(a.text) + '<span class="a-time">' + esc(a.time) + '</span></li>';
      }).join('') || '<li class="muted">No recent activity</li>';
    }

    /* ============================================================
       SITE MEDIA
       ============================================================ */
    function renderHero() {
      d.getElementById('heroEyebrow').value = data.hero.eyebrow;
      d.getElementById('heroTitle').value = data.hero.title;
      d.getElementById('heroSub').value = data.hero.sub;
      var prev = d.getElementById('heroPreview');
      prev.style.backgroundImage = data.hero.image
        ? 'url(' + data.hero.image + ')'
        : 'linear-gradient(135deg,#2b3a2b,#1c261c)';
      prev.innerHTML = '<div class="mp-text"><b>' + esc(data.hero.title.split('\n')[0]) + '</b><span>' + esc(data.hero.eyebrow) + '</span></div>';
    }

    d.getElementById('heroImageInput').addEventListener('change', function (e) {
      var file = e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        data.hero.image = reader.result;
        renderHero();
      };
      reader.readAsDataURL(file);
    });

    d.getElementById('saveHero').addEventListener('click', function () {
      data.hero.eyebrow = fv('heroEyebrow');
      data.hero.title = fv('heroTitle');
      data.hero.sub = fv('heroSub');
      logActivity('Updated homepage hero content');
      saveData();
      renderHero();
      renderOverview();
      toast('Hero section saved');
    });

    function renderSectorAssets() {
      var grid = d.getElementById('sectorAssetGrid');
      grid.innerHTML = data.sectorAssets.map(function (a) {
        return '' +
          '<div class="asset-card" data-id="' + a.id + '">' +
            '<div class="asset-thumb" style="background-image:url(\'' + a.file + '\')"></div>' +
            '<div class="asset-body">' +
              '<b>' + esc(a.name) + '</b>' +
              '<input type="file" accept="image/*" data-asset-upload="' + a.id + '">' +
            '</div>' +
          '</div>';
      }).join('');

      grid.querySelectorAll('[data-asset-upload]').forEach(function (input) {
        input.addEventListener('change', function (e) {
          var id = Number(input.dataset.assetUpload);
          var file = e.target.files[0];
          if (!file) return;
          var reader = new FileReader();
          reader.onload = function () {
            var item = data.sectorAssets.find(function (x) { return x.id === id; });
            item.file = reader.result;
            logActivity('Replaced image: ' + item.name);
            saveData();
            renderSectorAssets();
            toast('Image updated');
          };
          reader.readAsDataURL(file);
        });
      });
    }

    /* ============================================================
       MANAGEMENT TEAM
       ============================================================ */
    var leaderFilter = 'all';

    function renderLeaders() {
      var grid = d.getElementById('leaderGrid');
      var rows = data.leaders.filter(function (l) { return leaderFilter === 'all' || l.group === leaderFilter; });
      if (!rows.length) { grid.innerHTML = '<p class="muted">No profiles in this group.</p>'; return; }
      grid.innerHTML = rows.map(function (l) {
        return '' +
          '<div class="item-card" data-id="' + l.id + '">' +
            '<div class="ic-thumb" style="background-image:url(\'' + l.photo + '\')"></div>' +
            '<b>' + esc(l.name) + '</b>' +
            '<span class="ic-meta">' + esc(l.role) + '</span>' +
            '<p>' + esc(l.bio) + '</p>' +
            '<div class="ic-actions">' +
              '<button class="icon-btn" data-edit="' + l.id + '">✎</button>' +
              '<button class="icon-btn danger" data-del="' + l.id + '">🗑</button>' +
            '</div>' +
          '</div>';
      }).join('');
      grid.querySelectorAll('[data-edit]').forEach(function (b) { b.addEventListener('click', function () { openLeaderModal(Number(b.dataset.edit)); }); });
      grid.querySelectorAll('[data-del]').forEach(function (b) {
        b.addEventListener('click', function () {
          var id = Number(b.dataset.del);
          var item = data.leaders.find(function (x) { return x.id === id; });
          if (!confirm('Remove "' + item.name + '" from the management team?')) return;
          data.leaders = data.leaders.filter(function (x) { return x.id !== id; });
          logActivity('Removed management profile: ' + item.name);
          saveData(); renderLeaders(); renderOverview();
          toast('Profile removed');
        });
      });
    }

    function openLeaderModal(id) {
      var item = id ? data.leaders.find(function (x) { return x.id === id; }) : null;
      var v = item || { name: '', role: '', pill: 'Shareholder', group: 'Top Leaders', bio: '', photo: '' };
      var html = '' +
        '<label class="field"><span>Full name</span><input id="lName" value="' + esc(v.name) + '" placeholder="Mr. / Mrs. Full Name"></label>' +
        '<label class="field"><span>Role / title</span><input id="lRole" value="' + esc(v.role) + '"></label>' +
        '<div class="field-row">' +
          '<label class="field"><span>Pill label</span><input id="lPill" value="' + esc(v.pill) + '" placeholder="Founder, Shareholder…"></label>' +
          '<label class="field"><span>Group</span><select id="lGroup">' +
            ['Top Leaders', 'Wadi Poultry Group Board of Directors'].map(function (g) { return '<option ' + (v.group === g ? 'selected' : '') + '>' + g + '</option>'; }).join('') +
          '</select></label>' +
        '</div>' +
        '<label class="field"><span>Bio</span><textarea id="lBio" rows="4">' + esc(v.bio) + '</textarea></label>' +
        '<label class="field file-field"><span>Photo</span><input type="file" id="lPhoto" accept="image/*"></label>';

      var uploadedPhoto = v.photo;
      openModal(item ? 'Edit management profile' : 'New management profile', html, function () {
        var name = fv('lName');
        if (!name) { toast('Name is required'); return false; }
        var payload = { name: name, role: fv('lRole'), pill: fv('lPill'), group: fv('lGroup'), bio: fv('lBio'), photo: uploadedPhoto };
        if (item) { Object.assign(item, payload); logActivity('Updated management profile: ' + name); }
        else { payload.id = nextId(data.leaders); data.leaders.push(payload); logActivity('Added management profile: ' + name); }
        saveData(); renderLeaders(); renderOverview();
        toast('Profile saved');
      });

      d.getElementById('lPhoto').addEventListener('change', function (e) {
        var file = e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function () { uploadedPhoto = reader.result; };
        reader.readAsDataURL(file);
      });
    }

    d.getElementById('addLeaderBtn').addEventListener('click', function () { openLeaderModal(null); });
    d.querySelectorAll('#leaderFilterBar .chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        d.querySelectorAll('#leaderFilterBar .chip').forEach(function (c) { c.classList.remove('is-active'); });
        chip.classList.add('is-active');
        leaderFilter = chip.dataset.leaderfilter;
        renderLeaders();
      });
    });

    /* ============================================================
       MEDIA CENTER
       ============================================================ */
    var mediaFilter = 'all';
    var mediaQuery = '';

    function renderMediaTable() {
      var body = d.getElementById('mediaTableBody');
      var rows = data.media.filter(function (m) {
        var matchFilter = mediaFilter === 'all' || m.category === mediaFilter;
        var matchQuery = !mediaQuery || m.title.toLowerCase().indexOf(mediaQuery) > -1;
        return matchFilter && matchQuery;
      });

      if (!rows.length) {
        body.innerHTML = '<tr class="empty-row"><td colspan="7">No media items match your filters.</td></tr>';
        return;
      }

      body.innerHTML = rows.map(function (m) {
        var icon = m.type === 'video' ? '▶' : (m.category === 'Events' ? '📅' : '📰');
        return '' +
          '<tr data-id="' + m.id + '">' +
            '<td><span class="row-thumb" style="display:flex;align-items:center;justify-content:center;">' + icon + '</span></td>' +
            '<td>' + esc(m.title) + '</td>' +
            '<td>' + esc(m.category) + '</td>' +
            '<td>' + esc(m.type) + '</td>' +
            '<td>' + esc(m.date) + '</td>' +
            '<td>' + (m.featured ? '<span class="tag">Featured</span>' : '<span class="tag tag-off">—</span>') + '</td>' +
            '<td><div class="row-actions">' +
              '<button class="icon-btn" data-edit="' + m.id + '" title="Edit">✎</button>' +
              '<button class="icon-btn danger" data-del="' + m.id + '" title="Delete">🗑</button>' +
            '</div></td>' +
          '</tr>';
      }).join('');

      body.querySelectorAll('[data-edit]').forEach(function (b) {
        b.addEventListener('click', function () { openMediaModal(Number(b.dataset.edit)); });
      });
      body.querySelectorAll('[data-del]').forEach(function (b) {
        b.addEventListener('click', function () {
          var id = Number(b.dataset.del);
          var item = data.media.find(function (x) { return x.id === id; });
          if (!confirm('Delete "' + item.title + '"?')) return;
          data.media = data.media.filter(function (x) { return x.id !== id; });
          logActivity('Deleted media item: ' + item.title);
          saveData(); renderMediaTable(); renderOverview();
          toast('Item deleted');
        });
      });
    }

    function openMediaModal(id) {
      var item = id ? data.media.find(function (x) { return x.id === id; }) : null;
      var v = item || { title: '', category: 'News', type: 'article', date: '', description: '', youtubeId: '', featured: false };
      var html = '' +
        '<label class="field"><span>Title</span><input id="mTitle" value="' + esc(v.title) + '"></label>' +
        '<div class="field-row">' +
          '<label class="field"><span>Category</span><select id="mCategory">' +
            ['Videos', 'News', 'Events'].map(function (c) { return '<option ' + (v.category === c ? 'selected' : '') + '>' + c + '</option>'; }).join('') +
          '</select></label>' +
          '<label class="field"><span>Type</span><select id="mType">' +
            ['video', 'article'].map(function (t) { return '<option value="' + t + '" ' + (v.type === t ? 'selected' : '') + '>' + t + '</option>'; }).join('') +
          '</select></label>' +
        '</div>' +
        '<div class="field-row">' +
          '<label class="field"><span>Date (display text)</span><input id="mDate" value="' + esc(v.date) + '" placeholder="March 2025"></label>' +
          '<label class="field"><span>YouTube ID (if video)</span><input id="mYoutube" value="' + esc(v.youtubeId || '') + '"></label>' +
        '</div>' +
        '<label class="field"><span>Description</span><textarea id="mDesc" rows="3">' + esc(v.description) + '</textarea></label>' +
        '<label class="checkbox-field"><input type="checkbox" id="mFeatured" ' + (v.featured ? 'checked' : '') + '> Show as featured item</label>';

      openModal(item ? 'Edit media item' : 'New media item', html, function () {
        var title = fv('mTitle');
        if (!title) { toast('Title is required'); return false; }
        var payload = {
          title: title, category: fv('mCategory'), type: fv('mType'), date: fv('mDate'),
          youtubeId: fv('mYoutube'), description: fv('mDesc'), featured: fc('mFeatured')
        };
        if (item) {
          Object.assign(item, payload);
          logActivity('Updated media item: ' + title);
        } else {
          payload.id = nextId(data.media);
          data.media.push(payload);
          logActivity('Published media item: ' + title);
        }
        saveData(); renderMediaTable(); renderOverview();
        toast('Media item saved');
      });
    }

    d.getElementById('addMediaBtn').addEventListener('click', function () { openMediaModal(null); });
    d.querySelectorAll('#panel-media-center .chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        d.querySelectorAll('#panel-media-center .chip').forEach(function (c) { c.classList.remove('is-active'); });
        chip.classList.add('is-active');
        mediaFilter = chip.dataset.filter;
        renderMediaTable();
      });
    });
    d.getElementById('mediaSearch').addEventListener('input', function (e) {
      mediaQuery = e.target.value.trim().toLowerCase();
      renderMediaTable();
    });

    /* ============================================================
       PUBLIC RELATIONS
       ============================================================ */
    d.querySelectorAll('.pr-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        d.querySelectorAll('.pr-tab').forEach(function (t) { t.classList.remove('is-active'); });
        d.querySelectorAll('.pr-view').forEach(function (v) { v.classList.remove('is-active'); });
        tab.classList.add('is-active');
        d.getElementById('pr-' + tab.dataset.pr).classList.add('is-active');
      });
    });

    /* --- Resources --- */
    function renderResources() {
      var grid = d.getElementById('resourceGrid');
      if (!data.resources.length) { grid.innerHTML = '<p class="muted">No resources yet.</p>'; return; }
      grid.innerHTML = data.resources.map(function (r) {
        return '' +
          '<div class="item-card" data-id="' + r.id + '">' +
            '<b>' + esc(r.title) + '</b>' +
            '<p>' + esc(r.description) + '</p>' +
            '<span class="ic-meta">' + esc(r.fileType.toUpperCase()) + ' · ' + esc(r.size) + '</span>' +
            '<div class="ic-actions">' +
              '<button class="icon-btn" data-edit="' + r.id + '">✎</button>' +
              '<button class="icon-btn danger" data-del="' + r.id + '">🗑</button>' +
            '</div>' +
          '</div>';
      }).join('');
      grid.querySelectorAll('[data-edit]').forEach(function (b) { b.addEventListener('click', function () { openResourceModal(Number(b.dataset.edit)); }); });
      grid.querySelectorAll('[data-del]').forEach(function (b) {
        b.addEventListener('click', function () {
          var id = Number(b.dataset.del);
          var item = data.resources.find(function (x) { return x.id === id; });
          if (!confirm('Delete "' + item.title + '"?')) return;
          data.resources = data.resources.filter(function (x) { return x.id !== id; });
          logActivity('Deleted PR resource: ' + item.title);
          saveData(); renderResources(); renderOverview();
          toast('Resource deleted');
        });
      });
    }
    function openResourceModal(id) {
      var item = id ? data.resources.find(function (x) { return x.id === id; }) : null;
      var v = item || { title: '', description: '', fileType: 'pdf', size: '' };
      var html = '' +
        '<label class="field"><span>Title</span><input id="rTitle" value="' + esc(v.title) + '"></label>' +
        '<label class="field"><span>Description</span><textarea id="rDesc" rows="3">' + esc(v.description) + '</textarea></label>' +
        '<div class="field-row">' +
          '<label class="field"><span>File type</span><select id="rType">' +
            ['pdf', 'zip', 'png', 'jpg'].map(function (t) { return '<option value="' + t + '" ' + (v.fileType === t ? 'selected' : '') + '>' + t.toUpperCase() + '</option>'; }).join('') +
          '</select></label>' +
          '<label class="field"><span>File size</span><input id="rSize" value="' + esc(v.size) + '" placeholder="3.2 MB"></label>' +
        '</div>' +
        '<label class="field file-field"><span>Upload file</span><input type="file" id="rFile"></label>';

      openModal(item ? 'Edit resource' : 'New resource', html, function () {
        var title = fv('rTitle');
        if (!title) { toast('Title is required'); return false; }
        var payload = { title: title, description: fv('rDesc'), fileType: fv('rType'), size: fv('rSize') || '—' };
        if (item) { Object.assign(item, payload); logActivity('Updated PR resource: ' + title); }
        else { payload.id = nextId(data.resources); data.resources.push(payload); logActivity('Added PR resource: ' + title); }
        saveData(); renderResources(); renderOverview();
        toast('Resource saved');
      });
    }
    d.getElementById('addResourceBtn').addEventListener('click', function () { openResourceModal(null); });

    /* --- Awards --- */
    function renderAwards() {
      var grid = d.getElementById('awardGrid');
      if (!data.awards.length) { grid.innerHTML = '<p class="muted">No awards yet.</p>'; return; }
      grid.innerHTML = data.awards.map(function (a) {
        return '' +
          '<div class="item-card" data-id="' + a.id + '">' +
            '<div class="ic-thumb" style="background-image:url(\'' + a.image + '\')"></div>' +
            '<b>' + esc(a.title) + '</b>' +
            '<span class="ic-meta">' + esc(a.brand) + ' · ' + esc(a.year) + '</span>' +
            '<div class="ic-actions">' +
              '<button class="icon-btn" data-edit="' + a.id + '">✎</button>' +
              '<button class="icon-btn danger" data-del="' + a.id + '">🗑</button>' +
            '</div>' +
          '</div>';
      }).join('');
      grid.querySelectorAll('[data-edit]').forEach(function (b) { b.addEventListener('click', function () { openAwardModal(Number(b.dataset.edit)); }); });
      grid.querySelectorAll('[data-del]').forEach(function (b) {
        b.addEventListener('click', function () {
          var id = Number(b.dataset.del);
          var item = data.awards.find(function (x) { return x.id === id; });
          if (!confirm('Delete "' + item.title + '"?')) return;
          data.awards = data.awards.filter(function (x) { return x.id !== id; });
          logActivity('Deleted award: ' + item.title);
          saveData(); renderAwards(); renderOverview();
          toast('Award deleted');
        });
      });
    }
    function openAwardModal(id) {
      var item = id ? data.awards.find(function (x) { return x.id === id; }) : null;
      var v = item || { title: '', brand: '', year: '', image: '' };
      var html = '' +
        '<label class="field"><span>Award title</span><input id="aTitle" value="' + esc(v.title) + '"></label>' +
        '<div class="field-row">' +
          '<label class="field"><span>Brand</span><input id="aBrand" value="' + esc(v.brand) + '"></label>' +
          '<label class="field"><span>Year</span><input id="aYear" value="' + esc(v.year) + '"></label>' +
        '</div>' +
        '<label class="field file-field"><span>Award image</span><input type="file" id="aImage" accept="image/*"></label>';

      var uploadedImage = v.image;
      openModal(item ? 'Edit award' : 'New award', html, function () {
        var title = fv('aTitle');
        if (!title) { toast('Title is required'); return false; }
        var payload = { title: title, brand: fv('aBrand'), year: fv('aYear'), image: uploadedImage };
        if (item) { Object.assign(item, payload); logActivity('Updated award: ' + title); }
        else { payload.id = nextId(data.awards); data.awards.push(payload); logActivity('Added award: ' + title); }
        saveData(); renderAwards(); renderOverview();
        toast('Award saved');
      });

      d.getElementById('aImage').addEventListener('change', function (e) {
        var file = e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function () { uploadedImage = reader.result; };
        reader.readAsDataURL(file);
      });
    }
    d.getElementById('addAwardBtn').addEventListener('click', function () { openAwardModal(null); });

    /* --- Certificates --- */
    var certFilter = 'all';
    var certLabels = { iso: 'ISO', ohsas: 'OHSAS', globalgap: 'Global GAP', foodsafety: 'Food Safety', organic: 'Organic' };

    function renderCerts() {
      var body = d.getElementById('certTableBody');
      var rows = data.certs.filter(function (c) { return certFilter === 'all' || c.category === certFilter; });
      if (!rows.length) { body.innerHTML = '<tr class="empty-row"><td colspan="6">No certificates in this category.</td></tr>'; return; }
      body.innerHTML = rows.map(function (c) {
        return '' +
          '<tr data-id="' + c.id + '">' +
            '<td>' + esc(c.title) + '</td>' +
            '<td>' + esc(c.brand) + '</td>' +
            '<td>' + esc(c.standard) + '</td>' +
            '<td><span class="tag">' + esc(certLabels[c.category] || c.category) + '</span></td>' +
            '<td>' + esc(c.year) + '</td>' +
            '<td><div class="row-actions">' +
              '<button class="icon-btn" data-edit="' + c.id + '">✎</button>' +
              '<button class="icon-btn danger" data-del="' + c.id + '">🗑</button>' +
            '</div></td>' +
          '</tr>';
      }).join('');
      body.querySelectorAll('[data-edit]').forEach(function (b) { b.addEventListener('click', function () { openCertModal(Number(b.dataset.edit)); }); });
      body.querySelectorAll('[data-del]').forEach(function (b) {
        b.addEventListener('click', function () {
          var id = Number(b.dataset.del);
          var item = data.certs.find(function (x) { return x.id === id; });
          if (!confirm('Delete "' + item.title + '"?')) return;
          data.certs = data.certs.filter(function (x) { return x.id !== id; });
          logActivity('Deleted certificate: ' + item.title);
          saveData(); renderCerts(); renderOverview();
          toast('Certificate deleted');
        });
      });
    }
    function openCertModal(id) {
      var item = id ? data.certs.find(function (x) { return x.id === id; }) : null;
      var v = item || { title: '', brand: '', standard: '', category: 'iso', year: '' };
      var html = '' +
        '<div class="field-row">' +
          '<label class="field"><span>Certificate name</span><input id="cTitle" value="' + esc(v.title) + '"></label>' +
          '<label class="field"><span>Standard</span><input id="cStandard" value="' + esc(v.standard) + '"></label>' +
        '</div>' +
        '<div class="field-row">' +
          '<label class="field"><span>Brand</span><input id="cBrand" value="' + esc(v.brand) + '"></label>' +
          '<label class="field"><span>Year</span><input id="cYear" value="' + esc(v.year) + '"></label>' +
        '</div>' +
        '<label class="field"><span>Category</span><select id="cCategory">' +
          Object.keys(certLabels).map(function (k) { return '<option value="' + k + '" ' + (v.category === k ? 'selected' : '') + '>' + certLabels[k] + '</option>'; }).join('') +
        '</select></label>' +
        '<label class="field file-field"><span>Certificate PDF</span><input type="file" id="cFile" accept="application/pdf"></label>';

      openModal(item ? 'Edit certificate' : 'New certificate', html, function () {
        var title = fv('cTitle');
        if (!title) { toast('Certificate name is required'); return false; }
        var payload = { title: title, standard: fv('cStandard'), brand: fv('cBrand'), year: fv('cYear'), category: fv('cCategory') };
        if (item) { Object.assign(item, payload); logActivity('Updated certificate: ' + title); }
        else { payload.id = nextId(data.certs); data.certs.push(payload); logActivity('Added certificate: ' + title); }
        saveData(); renderCerts(); renderOverview();
        toast('Certificate saved');
      });
    }
    d.getElementById('addCertBtn').addEventListener('click', function () { openCertModal(null); });
    d.querySelectorAll('#certFilterBar .chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        d.querySelectorAll('#certFilterBar .chip').forEach(function (c) { c.classList.remove('is-active'); });
        chip.classList.add('is-active');
        certFilter = chip.dataset.certfilter;
        renderCerts();
      });
    });

    /* ============================================================
       CAREERS
       ============================================================ */
    function renderJobs() {
      var body = d.getElementById('jobTableBody');
      if (!data.jobs.length) { body.innerHTML = '<tr class="empty-row"><td colspan="6">No job listings yet.</td></tr>'; return; }
      body.innerHTML = data.jobs.map(function (j) {
        return '' +
          '<tr data-id="' + j.id + '">' +
            '<td>' + esc(j.title) + '</td>' +
            '<td>' + esc(j.sector) + '</td>' +
            '<td>' + esc(j.location) + '</td>' +
            '<td>' + esc(j.jobType) + '</td>' +
            '<td>' + (j.status === 'Open' ? '<span class="tag">Open</span>' : '<span class="tag tag-off">Closed</span>') + '</td>' +
            '<td><div class="row-actions">' +
              '<button class="icon-btn" data-edit="' + j.id + '">✎</button>' +
              '<button class="icon-btn danger" data-del="' + j.id + '">🗑</button>' +
            '</div></td>' +
          '</tr>';
      }).join('');
      body.querySelectorAll('[data-edit]').forEach(function (b) { b.addEventListener('click', function () { openJobModal(Number(b.dataset.edit)); }); });
      body.querySelectorAll('[data-del]').forEach(function (b) {
        b.addEventListener('click', function () {
          var id = Number(b.dataset.del);
          var item = data.jobs.find(function (x) { return x.id === id; });
          if (!confirm('Delete "' + item.title + '"?')) return;
          data.jobs = data.jobs.filter(function (x) { return x.id !== id; });
          logActivity('Removed job listing: ' + item.title);
          saveData(); renderJobs(); renderOverview();
          toast('Listing deleted');
        });
      });
    }
    function openJobModal(id) {
      var item = id ? data.jobs.find(function (x) { return x.id === id; }) : null;
      var v = item || { title: '', sector: 'Dawagen', location: '', jobType: 'Full-time', status: 'Open' };
      var html = '' +
        '<label class="field"><span>Role title</span><input id="jTitle" value="' + esc(v.title) + '"></label>' +
        '<div class="field-row">' +
          '<label class="field"><span>Sector</span><select id="jSector">' +
            ['Dawagen', 'Mazareh', "Sina'at", 'Group'].map(function (s) { return '<option ' + (v.sector === s ? 'selected' : '') + '>' + s + '</option>'; }).join('') +
          '</select></label>' +
          '<label class="field"><span>Location</span><input id="jLocation" value="' + esc(v.location) + '"></label>' +
        '</div>' +
        '<div class="field-row">' +
          '<label class="field"><span>Employment type</span><select id="jType">' +
            ['Full-time', 'Part-time', 'Contract', 'Internship'].map(function (t) { return '<option ' + (v.jobType === t ? 'selected' : '') + '>' + t + '</option>'; }).join('') +
          '</select></label>' +
          '<label class="field"><span>Status</span><select id="jStatus">' +
            ['Open', 'Closed'].map(function (s) { return '<option ' + (v.status === s ? 'selected' : '') + '>' + s + '</option>'; }).join('') +
          '</select></label>' +
        '</div>';

      openModal(item ? 'Edit listing' : 'New listing', html, function () {
        var title = fv('jTitle');
        if (!title) { toast('Role title is required'); return false; }
        var payload = { title: title, sector: fv('jSector'), location: fv('jLocation'), jobType: fv('jType'), status: fv('jStatus') };
        if (item) { Object.assign(item, payload); logActivity('Updated job listing: ' + title); }
        else { payload.id = nextId(data.jobs); data.jobs.push(payload); logActivity('Posted job listing: ' + title); }
        saveData(); renderJobs(); renderOverview();
        toast('Listing saved');
      });
    }
    d.getElementById('addJobBtn').addEventListener('click', function () { openJobModal(null); });

    /* ---------------- Initial render ---------------- */
    renderOverview();
    renderHero();
    renderSectorAssets();
    renderLeaders();
    renderMediaTable();
    renderResources();
    renderAwards();
    renderCerts();
    renderJobs();
  })();
}
