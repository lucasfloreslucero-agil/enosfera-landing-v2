/* Enosfera · landing editorial
   Scroll suave (Lenis), parallax de tarjetas, reveals, menú lateral,
   fichas de producto y formulario de postulación. */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var EASE = function (t) { return 1 - Math.pow(1 - t, 3); };

  /* ---------- Scroll suave ---------- */
  var lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.05, smoothWheel: true, syncTouch: false });
    var raf = function (t) { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
  function scrollToTarget(target) {
    var el = typeof target === 'string' ? $(target) : target;
    if (!el) return;
    if (lenis) {
      lenis.start();
      var y = el.getBoundingClientRect().top + window.scrollY;
      lenis.scrollTo(y, { duration: 0.8, easing: EASE, force: true });
    }
    else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  }
  function lock(on) { if (lenis) { if (on) lenis.stop(); else lenis.start(); } }

  $$('a[href^="#"]').forEach(function (a) {
    var id = a.getAttribute('href');
    if (id.length < 2 || !document.getElementById(id.slice(1))) return;
    a.addEventListener('click', function (e) {
      e.preventDefault();
      if (panel.open) panel.close();
      closeFichas();
      scrollToTarget(id);
    });
  });

  /* ---------- Menú lateral ---------- */
  var panel = $('#panel');
  $('#menu-open').addEventListener('click', function () { panel.showModal(); lock(true); });
  $('[data-panel-close]').addEventListener('click', function () { panel.close(); });
  panel.addEventListener('click', function (e) { if (e.target === panel) panel.close(); });
  panel.addEventListener('close', function () { lock(false); });

  /* ---------- Parallax de tarjetas ---------- */
  var movers = $$('[data-speed]');
  function parallax() {
    if (window.innerWidth <= 991) { movers.forEach(function (m) { m.style.transform = ''; }); return; }
    var vh = window.innerHeight;
    movers.forEach(function (m) {
      var r = m.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      var d = (r.top + r.height / 2) - vh / 2;
      m.style.transform = 'translate3d(0,' + (d * -0.025 * Number(m.dataset.speed)).toFixed(1) + 'px,0)';
    });
  }
  if (!reduce) {
    if (lenis) lenis.on('scroll', parallax); else window.addEventListener('scroll', parallax, { passive: true });
    window.addEventListener('resize', parallax);
    parallax();
  }

  /* ---------- Reveals ---------- */
  if (!reduce && 'IntersectionObserver' in window) {
    // Fotos: telón que se abre cada vez que entran en pantalla.
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { en.target.classList.toggle('active', en.isIntersecting); });
    }, { rootMargin: '0px 0px -10% 0px' });
    $$('.reveal').forEach(function (el) { io.observe(el); });
    // Textos: aparecen una sola vez.
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-inview'); io2.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    $$('.fade').forEach(function (el) { io2.observe(el); });
  } else {
    $$('.reveal').forEach(function (el) { el.classList.add('active'); });
    $$('.fade').forEach(function (el) { el.classList.add('is-inview'); });
  }

  /* ---------- Fichas de producto ---------- */
  function closeFichas(except) {
    $$('.prod').forEach(function (p) {
      if (p === except) return;
      $('.ficha', p).classList.remove('mostrar');
      $('.prod__btn', p).setAttribute('aria-expanded', 'false');
    });
  }
  $$('.prod').forEach(function (p) {
    var btn = $('.prod__btn', p), ficha = $('.ficha', p);
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = !ficha.classList.contains('mostrar');
      closeFichas(p);
      ficha.classList.toggle('mostrar', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) $('.ficha__close', ficha).focus();
    });
    ficha.addEventListener('click', function (e) { e.stopPropagation(); });
    $('.ficha__close', ficha).addEventListener('click', function () { closeFichas(); btn.focus(); });
  });
  document.addEventListener('click', function () { closeFichas(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeFichas(); });

  /* ---------- Formulario de postulación ---------- */
  // URL /exec del script de Google Sheets (planilla "Enosfera · Postulaciones de creadores").
  // Para revisar los estados sin enviar nada: agregar ?demo=ok o ?demo=error a la URL.
  var ENDPOINT = 'https://script.google.com/macros/s/AKfycbwHTuY755yx46cH7XBBysmRcGmWrUHfk3t2IgH54J34weBxGDYqIkGmimZyFfd_MGW8rg/exec';
  var DEMO = new URLSearchParams(location.search).get('demo');

  var PREVENTA = 'Preventa de una línea';
  var OPCIONES = {
    tipo: ['Sommelier', 'Enólogo/a', 'Productor/a', 'Bodega', 'Otro'],
    seguidores: ['Menos de 1.000', '1.000 a 5.000', '5.000 a 20.000', 'Más de 20.000'],
    intereses: ['Catas presenciales', 'Catas online', 'Visitas', 'Cursos o contenido', PREVENTA, 'Solo comunidad']
  };
  var PROVINCIAS = ['Buenos Aires', 'Ciudad de Buenos Aires', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba', 'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja', 'Mendoza', 'Misiones', 'Neuquén', 'Río Negro', 'Salta', 'San Juan', 'San Luis', 'Santa Cruz', 'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego', 'Tucumán'];

  var modal = $('#modal'), form = $('#form'), success = $('#success');
  var nServer = $('#n-server'), nFields = $('#n-fields'), submitBtn = $('#submit');
  var wPreventa = $('#w-preventa');
  var status = 'idle', errors = {}, opener = null;

  var select = $('#f-prov');
  PROVINCIAS.forEach(function (p) {
    var o = document.createElement('option'); o.value = p; o.textContent = p; select.appendChild(o);
  });

  $$('[data-chips]').forEach(function (box) {
    var key = box.dataset.chips, multi = box.dataset.mode === 'multi';
    OPCIONES[key].forEach(function (label) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip' + (multi ? ' chip--multi' : '');
      b.setAttribute('aria-pressed', 'false');
      b.dataset.value = label;
      b.textContent = label;
      b.addEventListener('click', function () {
        if (multi) b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
        else $$('.chip', box).forEach(function (c) { c.setAttribute('aria-pressed', c === b ? 'true' : 'false'); });
        if (key === 'tipo') clearError('tipo');
        syncPreventa();
      });
      box.appendChild(b);
    });
  });

  function picked(key) {
    return $$('[data-chips="' + key + '"] .chip[aria-pressed="true"]').map(function (c) { return c.dataset.value; });
  }
  function syncPreventa() { wPreventa.hidden = picked('intereses').indexOf(PREVENTA) === -1; }

  function values() {
    return {
      nombre: form.nombre.value.trim(),
      email: form.email.value.trim(),
      whatsapp: form.whatsapp.value.trim(),
      provincia: form.provincia.value,
      tipo: picked('tipo')[0] || '',
      red: form.red.value.trim(),
      seguidores: picked('seguidores')[0] || '',
      intereses: picked('intereses'),
      preventa: wPreventa.hidden ? '' : form.preventa.value.trim(),
      hoy: form.hoy.value.trim(),
      acepta: form.acepta.checked,
      sitio: form.sitio.value
    };
  }

  function showError(key, msg) {
    var w = $('[data-field="' + key + '"]', form);
    if (!w) return;
    var out = $('.err', w);
    var ctl = $('.ctl', w); if (ctl) ctl.classList.toggle('is-error', !!msg);
    var input = $('input, select', w); if (input) input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    out.textContent = msg || '';
    out.hidden = !msg;
  }
  function clearError(key) {
    if (!errors[key]) return;
    delete errors[key]; showError(key, ''); render();
  }

  function render() {
    var ok = status === 'ok';
    form.hidden = ok;
    success.hidden = !ok;
    nServer.hidden = status !== 'error';
    nFields.hidden = status === 'error' || Object.keys(errors).length === 0;
    submitBtn.disabled = status === 'sending';
    submitBtn.textContent = status === 'sending' ? 'Enviando…' : status === 'error' ? 'Probá de nuevo' : 'Enviar postulación';
  }

  ['nombre', 'email', 'whatsapp', 'red'].forEach(function (k) {
    form[k].addEventListener('input', function () { clearError(k); });
  });
  select.addEventListener('change', function () { clearError('provincia'); });
  form.acepta.addEventListener('change', function () { clearError('acepta'); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (status === 'sending') return;
    var v = values(), err = {};
    if (!v.nombre) err.nombre = 'Decinos cómo te llamás.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) err.email = 'Revisá el email: parece incompleto.';
    if (v.whatsapp.replace(/\D/g, '').length < 8) err.whatsapp = 'Revisá el número: parece incompleto.';
    if (!v.provincia) err.provincia = 'Elegí tu provincia.';
    if (!v.tipo) err.tipo = 'Elegí la opción que más se parezca a lo que hacés.';
    if (!v.red) err.red = 'Pasanos el link para conocer lo que hacés.';
    if (!v.acepta) err.acepta = 'Para postularte tenés que ser mayor de 18 años y aceptar la política de privacidad.';
    ['nombre', 'email', 'whatsapp', 'provincia', 'tipo', 'red', 'acepta'].forEach(function (k) { showError(k, err[k]); });
    errors = err; status = 'idle'; render();
    if (Object.keys(err).length) { modal.scrollTop = 0; return; }

    status = 'sending'; render();
    send(v).then(function () { status = 'ok'; }, function () { status = 'error'; }).then(function () {
      render(); modal.scrollTop = 0;
    });
  });

  function send(v) {
    if (DEMO) return new Promise(function (res, rej) { setTimeout(DEMO === 'error' ? rej : res, 900); });
    // Apps Script no acepta el preflight de CORS: el JSON viaja como text/plain.
    return fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(v)
    }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    }).then(function (res) { if (!res || res.ok !== true) throw new Error('rechazado'); });
  }

  function resetForm() {
    form.reset();
    $$('.chip', form).forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
    Object.keys(errors).forEach(function (k) { showError(k, ''); });
    errors = {}; status = 'idle'; syncPreventa();
  }

  function openModal(preventa) {
    if (status === 'ok') resetForm();
    if (preventa) {
      var chip = $('[data-chips="intereses"] .chip[data-value="' + PREVENTA + '"]');
      if (chip) chip.setAttribute('aria-pressed', 'true');
      syncPreventa();
    }
    render();
    if (panel.open) panel.close();
    closeFichas();
    if (!modal.open) modal.showModal();
    lock(true);
    modal.scrollTop = 0;
  }

  $$('[data-open]').forEach(function (b) {
    b.addEventListener('click', function (e) { e.stopPropagation(); opener = b; openModal(b.dataset.open === 'preventa'); });
  });
  $$('[data-close]').forEach(function (b) { b.addEventListener('click', function () { modal.close(); }); });
  modal.addEventListener('click', function (e) { if (e.target === modal) modal.close(); });
  modal.addEventListener('close', function () { lock(false); if (opener && opener.isConnected && opener.offsetParent !== null) opener.focus(); });
})();
