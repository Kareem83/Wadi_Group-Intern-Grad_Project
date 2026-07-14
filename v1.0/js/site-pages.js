/* =====================================================================
   Wadi Group — shared site script (loaded on every inner page)
   Handles: nav scroll background, mobile menu, scroll-reveal animations,
   and count-up statistics. Dependency-free. Safe to load once per page.
   ===================================================================== */
(function () {
  "use strict";
  var d = document;

  /* Signal to CSS that JS is on, so [data-reveal] elements start hidden.
     With JS off, this class is never added and content stays visible. */
  d.documentElement.classList.add("js-reveal");

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function ready(fn) {
    if (d.readyState !== "loading") fn();
    else d.addEventListener("DOMContentLoaded", fn);
  }

  /* ---------- Nav: translucent background that solidifies on scroll ---------- */
  (function () {
    var nav = d.getElementById("nav");
    if (!nav) return;
    var onScroll = function () {
      nav.style.background = window.scrollY > 40
        ? "rgba(255,253,249,.96)"
        : "rgba(255,253,249,.85)";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  })();

  /* ---------- Mobile navigation toggle + dropdowns ---------- */
  ready(function () {
    var toggle = d.querySelector(".nav-toggle");
    var links = d.querySelector(".nav-links");
    if (!toggle || !links) return;

    toggle.addEventListener("click", function () {
      var isOpen = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    d.querySelectorAll(".nav-item > button").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        if (window.innerWidth > 1100) return;
        e.preventDefault();
        var item = btn.parentElement;
        var wasOpen = item.classList.contains("open");
        d.querySelectorAll(".nav-item.open").forEach(function (i) {
          i.classList.remove("open");
        });
        if (!wasOpen) item.classList.add("open");
      });
    });

    d.querySelectorAll(".nav-links a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  });

  /* ---------- Scroll-reveal: fade/slide elements in as they enter view ---------- */
  ready(function () {
    var reveals = [].slice.call(d.querySelectorAll("[data-reveal]"));
    if (!reveals.length) return;

    /* Auto-stagger: elements in the same parent animate in sequence unless
       an explicit --i is already set inline. Capped so big grids don't lag. */
    reveals.forEach(function (el) {
      if (el.style.getPropertyValue("--i")) return;
      var parent = el.parentElement;
      if (!parent) return;
      var siblings = [].slice.call(parent.children).filter(function (c) {
        return c.hasAttribute("data-reveal");
      });
      var idx = siblings.indexOf(el);
      el.style.setProperty("--i", Math.min(idx, 7));
    });

    /* Fallbacks: reduced-motion, no IntersectionObserver support, or a
       zero-height viewport (some headless/embedded renderers) -> just show. */
    if (reduceMotion || !("IntersectionObserver" in window) || !window.innerHeight) {
      reveals.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("is-in");
        io.unobserve(en.target);
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });

    reveals.forEach(function (el) { io.observe(el); });
  });

  /* ---------- Count-up numbers (e.g. founding year, brand count) ---------- */
  ready(function () {
    var counters = [].slice.call(d.querySelectorAll("[data-count]"));
    if (!counters.length) return;

    function run(el) {
      var raw = el.getAttribute("data-count");
      var num = parseFloat(raw.replace(/[^0-9.]/g, ""));
      var suffix = raw.replace(/[0-9.,]/g, ""); // keep "+", "%", etc.
      if (isNaN(num)) { el.textContent = raw; return; }
      var start = null, dur = 1500;
      function step(ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * num) + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = raw;
      }
      requestAnimationFrame(step);
    }

    if (reduceMotion || !("IntersectionObserver" in window) || !window.innerHeight) {
      counters.forEach(function (el) {
        el.textContent = el.getAttribute("data-count");
      });
      return;
    }

    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        run(en.target);
        cio.unobserve(en.target);
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { cio.observe(el); });
  });

  /* ---------- "See more" expandable blocks ---------- */
  ready(function () {
    d.querySelectorAll("[data-more-toggle]").forEach(function (btn) {
      var target = d.getElementById(btn.getAttribute("data-more-toggle"));
      if (!target) return;
      var labelMore = btn.getAttribute("data-more-label") || "See more";
      var labelLess = btn.getAttribute("data-more-less") || "See less";
      btn.addEventListener("click", function () {
        var open = target.classList.toggle("more-open");
        btn.textContent = open ? labelLess : labelMore;
        btn.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });
  });
})();
