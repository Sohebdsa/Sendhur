/* Sendhur Educational Trust — homepage interactions */
(function () {
  'use strict';

  var body = document.body;

  /* ---------- Header shadow ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.getElementById('menu-btn');
  var nav = document.getElementById('primary-nav');

  function setMenu(open) {
    if (!menuBtn || !nav) return;
    body.classList.toggle('nav-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (!open) closeAllSubmenus();
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      setMenu(!body.classList.contains('nav-open'));
    });
  }

  /* ---------- Dropdowns ---------- */
  var toggles = Array.prototype.slice.call(document.querySelectorAll('.nav-toggle'));

  function closeAllSubmenus(except) {
    toggles.forEach(function (btn) {
      var wrap = btn.closest('.has-menu');
      if (!wrap || wrap === except) return;
      wrap.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    });
  }

  toggles.forEach(function (btn) {
    btn.addEventListener('click', function (event) {
      event.preventDefault();
      var wrap = btn.closest('.has-menu');
      var open = wrap.classList.contains('is-open');
      closeAllSubmenus(wrap);
      wrap.classList.toggle('is-open', !open);
      btn.setAttribute('aria-expanded', String(!open));
    });
  });

  document.addEventListener('click', function (event) {
    if (!event.target.closest('.has-menu')) closeAllSubmenus();
  });

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    closeAllSubmenus();
    if (body.classList.contains('nav-open')) {
      setMenu(false);
      if (menuBtn) menuBtn.focus();
    }
  });

  if (nav) {
    nav.addEventListener('click', function (event) {
      var link = event.target.closest('a');
      if (!link) return;
      if (window.matchMedia('(max-width: 1080px)').matches) setMenu(false);
    });
  }

  window.addEventListener('resize', function () {
    if (window.innerWidth > 1080 && body.classList.contains('nav-open')) setMenu(false);
  });

  /* ---------- Project carousel ---------- */
  var track = document.getElementById('impact-track');
  if (track) {
    var prev = document.querySelector('[data-carousel-prev]');
    var next = document.querySelector('[data-carousel-next]');

    function step(dir) {
      var card = track.querySelector('.impact-card');
      if (!card) return;
      var gap = parseFloat(getComputedStyle(track).columnGap || '24') || 24;
      track.scrollBy({ left: dir * (card.getBoundingClientRect().width + gap), behavior: 'smooth' });
    }
    if (prev) prev.addEventListener('click', function () { step(-1); });
    if (next) next.addEventListener('click', function () { step(1); });
  }

  /* ---------- Trustees ---------- */
  var trustees = [
    {
      name: 'Dr. M. Gopinath',
      role: 'Managing Trustee',
      photo: 'assets/site/founder-portrait.png',
      text: "Dr. M. Gopinath founded Sendhur Educational Trust in 2003. An allergy and asthma therapist with an MBBS, DFM and CTCD, he leads the trust's work in paramedical education and community health."
    },
    {
      name: 'Mrs. S Radha',
      role: 'Financial Trustee',
      photo: 'assets/site/trustee-radha.png',
      text: "Mrs. S Radha serves as Financial Trustee of Sendhur Educational Trust, supporting the trust's training, healthcare and community programmes in Dindigul."
    },
    {
      name: 'Mrs. Shanthi',
      role: 'Trustee',
      photo: 'assets/site/trustee-shanthi.png',
      text: 'Mrs. Shanthi is a Trustee of Sendhur Educational Trust and supports its education and community initiatives.'
    }
  ];

  var trusteeButtons = Array.prototype.slice.call(document.querySelectorAll('[data-trustee]'));
  var trusteePhoto = document.getElementById('trustee-photo');
  var trusteeText = document.getElementById('trustee-text');
  var trusteeName = document.getElementById('trustee-name');
  var trusteeRole = document.getElementById('trustee-role');
  var currentTrustee = 0;

  function showTrustee(index) {
    if (!trusteePhoto) return;
    currentTrustee = (index + trustees.length) % trustees.length;
    var t = trustees[currentTrustee];
    trusteePhoto.src = t.photo;
    trusteePhoto.alt = t.name;
    trusteeText.textContent = t.text;
    trusteeName.textContent = t.name;
    trusteeRole.textContent = t.role;
    trusteeButtons.forEach(function (btn, i) {
      var active = i === currentTrustee;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
  }

  trusteeButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      showTrustee(Number(btn.getAttribute('data-trustee')));
    });
  });

  var tPrev = document.querySelector('[data-trustee-prev]');
  var tNext = document.querySelector('[data-trustee-next]');
  if (tPrev) tPrev.addEventListener('click', function () { showTrustee(currentTrustee - 1); });
  if (tNext) tNext.addEventListener('click', function () { showTrustee(currentTrustee + 1); });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  if (revealEls.length) {
    if (!('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

      revealEls.forEach(function (el) { observer.observe(el); });
    }
  }
})();

/* ---------- Photo gallery lightbox ---------- */
(function () {
  var items = Array.prototype.slice.call(document.querySelectorAll('.gallery-item'));
  var box = document.getElementById('lightbox');
  if (!items.length || !box) return;

  var imgEl = document.getElementById('lightbox-img');
  var capEl = document.getElementById('lightbox-caption');
  var closeBtn = box.querySelector('[data-lightbox-close]');
  var prevBtn = box.querySelector('[data-lightbox-prev]');
  var nextBtn = box.querySelector('[data-lightbox-next]');
  var index = 0;
  var lastFocus = null;

  function render(i) {
    index = (i + items.length) % items.length;
    var item = items[index];
    var img = item.querySelector('img');
    imgEl.src = img.currentSrc || img.src;
    imgEl.alt = img.alt;
    capEl.textContent = item.getAttribute('data-caption') || img.alt;
  }

  function open(i) {
    lastFocus = document.activeElement;
    render(i);
    box.hidden = false;
    document.body.classList.add('lightbox-open');
    if (closeBtn) closeBtn.focus();
  }

  function close() {
    box.hidden = true;
    document.body.classList.remove('lightbox-open');
    if (lastFocus) lastFocus.focus();
  }

  items.forEach(function (item, i) {
    item.addEventListener('click', function () { open(i); });
  });

  if (closeBtn) closeBtn.addEventListener('click', close);
  if (prevBtn) prevBtn.addEventListener('click', function () { render(index - 1); });
  if (nextBtn) nextBtn.addEventListener('click', function () { render(index + 1); });

  box.addEventListener('click', function (event) {
    if (event.target === box) close();
  });

  document.addEventListener('keydown', function (event) {
    if (box.hidden) return;
    if (event.key === 'Escape') close();
    else if (event.key === 'ArrowLeft') render(index - 1);
    else if (event.key === 'ArrowRight') render(index + 1);
  });
})();
