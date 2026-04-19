/**
 * Clic breve tipo ratón en botones y CTAs (marca "a un click").
 * Web Audio API: sin MP3/WAV externos. Respeta prefers-reduced-motion.
 */
(function () {
  'use strict';

  var Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return;

  var ctx = null;

  function getCtx() {
    if (!ctx) ctx = new Ctx();
    return ctx;
  }

  function playClick() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    try {
      var ac = getCtx();
      if (ac.state === 'suspended') void ac.resume();

      var t0 = ac.currentTime;
      var dur = 0.045;
      var n = Math.ceil(ac.sampleRate * dur);
      var buf = ac.createBuffer(1, n, ac.sampleRate);
      var ch = buf.getChannelData(0);
      var i;
      for (i = 0; i < n; i++) {
        ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 4);
      }

      var src = ac.createBufferSource();
      src.buffer = buf;
      var bp = ac.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(1400, t0);
      bp.Q.value = 0.55;
      var g = ac.createGain();
      g.gain.setValueAtTime(0.22, t0);
      g.gain.exponentialRampToValueAtTime(0.0008, t0 + dur);
      src.connect(bp);
      bp.connect(g);
      g.connect(ac.destination);
      src.start(t0);
      src.stop(t0 + dur + 0.01);
    } catch (e) {}
  }

  var selector = [
    'button',
    'input[type="submit"]',
    'input[type="button"]',
    'a.btn-primary',
    'a.btn-outline',
    'a.btn-white',
    'a.btn-teal',
    'a.nav-cta',
    /* Cabecera: Inicio, Quiénes somos, Servicios, submenú y barra superior */
    '#main-header nav a',
    '#mobile-menu a',
    '#topbar a',
    '#clientes a.cliente-item',
    '#cookie-bar .cookie-policy-link'
  ].join(',');

  document.addEventListener('click', function (e) {
    var el = e.target && e.target.closest ? e.target.closest(selector) : null;
    if (!el) return;
    if (el.disabled || el.getAttribute('aria-disabled') === 'true') return;
    playClick();
  }, true);
})();
