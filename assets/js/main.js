/* =============================================================
   Puskaasztal.hu — main.js
   Mobil menü · almenük · lightbox · megrendelő kalkulátor
   ============================================================= */
(function () {
  'use strict';

  /* ---------- 1. Mobil menü ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('fonavigacio');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.querySelector('.label').textContent = open ? 'Bezár' : 'Menü';
    });
  }

  /* ---------- 2. Almenük (mobilon kattintásra, desktopon hoverre) ---------- */
  document.querySelectorAll('.has-sub').forEach(function (item) {
    var btn = item.querySelector('.sub-toggle');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var open = item.getAttribute('data-open') === 'true';
      document.querySelectorAll('.has-sub').forEach(function (o) {
        if (o !== item) o.setAttribute('data-open', 'false');
      });
      item.setAttribute('data-open', open ? 'false' : 'true');
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.has-sub')) {
      document.querySelectorAll('.has-sub').forEach(function (o) {
        o.setAttribute('data-open', 'false');
        var b = o.querySelector('.sub-toggle');
        if (b) b.setAttribute('aria-expanded', 'false');
      });
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.has-sub').forEach(function (o) { o.setAttribute('data-open', 'false'); });
    if (nav && nav.classList.contains('is-open')) {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.querySelector('.label').textContent = 'Menü';
    }
    closeLightbox();
  });

  /* ---------- 3. Lightbox (galéria + árlista nagyítás) ---------- */
  var lb, lbImg, lastFocus = null;

  function ensureLightbox() {
    if (lb) return;
    lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Kép nagyítva');
    lb.innerHTML =
      '<button type="button" class="lightbox-close" aria-label="Bezárás">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">' +
      '<path d="M18 6 6 18M6 6l12 12"/></svg></button><img alt="">';
    document.body.appendChild(lb);
    lbImg = lb.querySelector('img');
    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target.closest('.lightbox-close')) closeLightbox();
    });
  }

  function openLightbox(src, alt) {
    ensureLightbox();
    lastFocus = document.activeElement;
    lbImg.src = src;
    lbImg.alt = alt || '';
    lb.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    lb.querySelector('.lightbox-close').focus();
  }

  function closeLightbox() {
    if (!lb || !lb.classList.contains('is-open')) return;
    lb.classList.remove('is-open');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  document.querySelectorAll('[data-zoom]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var img = btn.querySelector('img');
      openLightbox(btn.getAttribute('data-zoom') || (img && img.src), img ? img.alt : '');
    });
  });

  /* ---------- 4. Megrendelő — élő árkalkulátor ---------- */
  var form = document.getElementById('megrendelo-urlap');
  if (form) {
    var elTermek   = form.querySelector('#termek');
    var elDb       = form.querySelector('#darab');
    var outTermek  = document.getElementById('osszeg-termek');
    var outEgyseg  = document.getElementById('osszeg-egysegar');
    var outDb      = document.getElementById('osszeg-darab');
    var outSzallit = document.getElementById('osszeg-szallitas');
    var outVegso   = document.getElementById('osszeg-vegosszeg');
    var lapFigyelmeztetes = document.getElementById('lap-figyelmeztetes');

    var fmt = new Intl.NumberFormat('hu-HU');
    var huf = function (n) { return fmt.format(n) + ' Ft'; };

    function szallitasAr() {
      var v = form.querySelector('input[name="atvetel"]:checked');
      return v ? parseInt(v.value, 10) : 0;
    }

    function frissit() {
      var opt = elTermek.options[elTermek.selectedIndex];
      var egyseg = parseInt(opt.dataset.ar || '0', 10);
      var db = Math.max(1, Math.min(20, parseInt(elDb.value || '1', 10)));
      var szallit = szallitasAr();
      var vegso = egyseg * db + szallit;

      outTermek.textContent  = egyseg ? opt.dataset.nev : '—';
      outEgyseg.textContent  = egyseg ? huf(egyseg) : '—';
      outDb.textContent      = db + ' db';
      outSzallit.textContent = szallit ? huf(szallit) : 'Ingyenes';
      outVegso.textContent   = egyseg ? huf(vegso) : '—';

      if (lapFigyelmeztetes) {
        lapFigyelmeztetes.hidden = szallit === 0;
      }
    }

    form.addEventListener('input', frissit);
    form.addEventListener('change', frissit);
    frissit();

    /* Elküldés: előre kitöltött e-mail nyitása.
       Éles üzemben ezt cseréld le szerveroldali feldolgozásra
       (pl. PHP mail(), Formspree, Netlify Forms) — lásd README. */
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;

      var d = new FormData(form);
      var opt = elTermek.options[elTermek.selectedIndex];
      var atvetelLabel = form.querySelector('input[name="atvetel"]:checked')
        .closest('.radio-card').querySelector('strong').textContent;

      var sorok = [
        'MEGRENDELÉS – puskaasztal.hu',
        '--------------------------------',
        'Név: ' + (d.get('nev') || ''),
        'E-mail: ' + (d.get('email') || ''),
        'Telefon: ' + (d.get('telefon') || ''),
        'Cím: ' + (d.get('cim') || ''),
        '',
        'Termék: ' + opt.dataset.nev,
        'Magasság: ' + (d.get('magassag') || ''),
        'Mennyiség: ' + (d.get('darab') || '') + ' db',
        'Átvétel: ' + atvetelLabel,
        'Végösszeg (tájékoztató): ' + outVegso.textContent,
        '',
        'Megjegyzés:',
        (d.get('megjegyzes') || '-')
      ].join('\n');

      window.location.href = 'mailto:info@puskaasztal.hu'
        + '?subject=' + encodeURIComponent('Megrendelés – ' + opt.dataset.nev)
        + '&body=' + encodeURIComponent(sorok);
    });
  }

  /* ---------- 5. Aktuális év a láblécben ---------- */
  var ev = document.getElementById('ev');
  if (ev) ev.textContent = new Date().getFullYear();
})();
