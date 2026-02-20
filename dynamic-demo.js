/**
 * ============================================================
 *  DYNAMIC-DEMO.JS  —  URL-Parameter Demo Personalisation
 *  PM Shri School Website System
 * ============================================================
 *
 *  USAGE:
 *  ──────
 *  Option A — Individual URL params:
 *    index.html?name=Sunrise%20Academy&logo=demo/sunrise/logo.png
 *              &hero=demo/sunrise/hero.jpg&phone=9876543210
 *              &address=Barpeta,Assam&map=https://maps.google.com/...
 *              &gallery=demo/sunrise/1.jpg,demo/sunrise/2.jpg
 *
 *  Option B — Single demo profile (loads demo/{id}/config.json):
 *    index.html?demo=sunrise
 *
 *  SUPPORTED PARAMS:
 *  ─────────────────
 *    ?name=        School / institute name
 *    ?nameAs=      Name in Assamese / regional script
 *    ?shortName=   Short code shown in stamp (e.g. RJBS)
 *    ?tagline=     English tagline
 *    ?type=        School type (e.g. Govt. Jr. Basic School)
 *    ?district=    District name
 *    ?state=       State name
 *    ?est=         Year established (number)
 *    ?phone=       Primary phone number
 *    ?address=     Full address
 *    ?email=       Email address
 *    ?map=         Google Maps embed URL
 *    ?logo=        Logo image path or Google Drive share URL
 *    ?hero=        Hero image(s) — comma-separated paths or Drive URLs
 *    ?gallery=     Gallery image(s) — comma-separated paths or Drive URLs
 *    ?demo=        Demo profile ID — loads demo/{id}/config.json
 *
 * ============================================================
 *  HOW TO CREATE A DEMO PROFILE (Option B):
 *  ─────────────────────────────────────────
 *  1. Create folder:  demo/your-school-id/
 *  2. Create file:    demo/your-school-id/config.json
 *  3. Put images in:  demo/your-school-id/  (optional)
 *  4. Share URL:      index.html?demo=your-school-id
 *
 * ============================================================
 */

(function () {
  'use strict';

  /* ── Determine base path relative to current page ─────────── */
  const BASE = window.location.pathname.includes('/pages/') ? '../' : './';

  /* ── URL param reader ──────────────────────────────────────── */
  function getParam(name) {
    const params = new URLSearchParams(window.location.search);
    const val = params.get(name);
    return val ? val.trim() : null;
  }

  /* ── Security: strip dangerous characters from text ────────── */
  /* Never inserted via innerHTML — only via textContent — but    */
  /* this layer blocks script injection if misused in src attrs.  */
  function sanitizeText(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

  /* Strip any javascript: protocol from URLs */
  function sanitizeUrl(url) {
    if (typeof url !== 'string') return '';
    const trimmed = url.trim();
    if (/^javascript:/i.test(trimmed)) return '';
    return trimmed;
  }

  /* ── Load demo config synchronously before DOM runs ─────────── */
  /* Synchronous XHR is used intentionally here: we must override  */
  /* SCHOOL_CONFIG BEFORE components.js DOMContentLoaded handlers  */
  /* fire, so async fetch is not suitable.                          */
  function loadDemoConfig(demoId) {
    /* Only allow safe alphanumeric IDs to prevent path traversal */
    if (!/^[a-zA-Z0-9_-]{1,64}$/.test(demoId)) {
      console.warn('[DynamicDemo] Invalid demo ID format:', demoId);
      return null;
    }
    try {
      const url = BASE + 'demo/' + demoId + '/config.json';
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, false /* synchronous */);
      xhr.send(null);
      if (xhr.status === 200) {
        return JSON.parse(xhr.responseText);
      }
      console.warn('[DynamicDemo] Demo config not found for:', demoId, '(status', xhr.status + ')');
    } catch (e) {
      console.warn('[DynamicDemo] Failed to load demo config:', e.message);
    }
    return null;
  }

  /* ── Deep-merge demo JSON config → SCHOOL_CONFIG ────────────── */
  function applyDemoConfig(demo) {
    if (!demo || typeof SCHOOL_CONFIG === 'undefined') return;
    const C = SCHOOL_CONFIG;

    /* Identity */
    if (demo.name)          C.name          = demo.name;
    if (demo.nameAssamese)  C.nameAssamese  = demo.nameAssamese;
    if (demo.shortName)     { C.shortName = demo.shortName; C.logo.textFallback = demo.shortName; }
    if (demo.taglineEn)     C.taglineEn     = demo.taglineEn;
    if (demo.tagline)       C.tagline       = demo.tagline;
    if (demo.type)          C.type          = demo.type;
    if (demo.district)      C.district      = demo.district;
    if (demo.state)         C.state         = demo.state;
    if (demo.affiliation)   C.affiliation   = demo.affiliation;
    if (demo.established)   C.established   = demo.established;
    if (demo.code)          C.code          = demo.code;
    if (demo.mapEmbedUrl)   C.mapEmbedUrl   = demo.mapEmbedUrl;

    /* Contact */
    if (demo.contact) {
      if (!C.contact) C.contact = {};
      if (demo.contact.address)  C.contact.address  = demo.contact.address;
      if (demo.contact.phone)    C.contact.phone    = demo.contact.phone;
      if (demo.contact.phone2)   C.contact.phone2   = demo.contact.phone2;
      if (demo.contact.email)    C.contact.email    = demo.contact.email;
    }

    /* Logo */
    if (demo.logo) {
      if (typeof demo.logo === 'string') {
        C.logo.source = 'hosted';
        C.logo.hostedPath = demo.logo;
        C.logo.driveLink  = '';
      } else {
        if (demo.logo.driveLink) {
          C.logo.source   = 'drive';
          C.logo.driveLink = demo.logo.driveLink;
        } else if (demo.logo.url || demo.logo.hostedPath) {
          C.logo.source    = 'hosted';
          C.logo.hostedPath = demo.logo.url || demo.logo.hostedPath;
          C.logo.driveLink  = '';
        }
        if (demo.logo.textFallback) C.logo.textFallback = demo.logo.textFallback;
      }
    }

    /* Headmaster */
    if (demo.headmaster) {
      if (!C.headmaster) C.headmaster = {};
      Object.assign(C.headmaster, demo.headmaster);
    }

    /* Hero images */
    if (demo.heroImages && Array.isArray(demo.heroImages) && demo.heroImages.length) {
      C.heroImages.source = 'hosted';
      C.heroImages.hosted = demo.heroImages.map(h =>
        typeof h === 'string'
          ? { path: h, caption: '' }
          : { path: h.url || h.path || '', caption: h.caption || '' }
      );
      C.heroImages.driveFiles = [];
    }

    /* Gallery */
    if (demo.gallery && Array.isArray(demo.gallery) && demo.gallery.length) {
      C.gallery.source = 'hosted';
      C.gallery.hosted = demo.gallery.map(g =>
        typeof g === 'string'
          ? { path: g, caption: '' }
          : { path: g.url || g.path || '', caption: g.caption || '' }
      );
      C.gallery.driveFiles = [];
    }

    /* Stats */
    if (demo.stats && Array.isArray(demo.stats)) {
      C.stats = demo.stats;
    }

    /* Social */
    if (demo.social) Object.assign(C.social, demo.social);

    console.info('[DynamicDemo] Demo config applied ✅');
  }

  /* ── Apply individual URL params → SCHOOL_CONFIG ────────────── */
  function applyUrlParams() {
    if (typeof SCHOOL_CONFIG === 'undefined') return;
    const C = SCHOOL_CONFIG;

    const name = getParam('name');
    if (name) C.name = name;

    const nameAs = getParam('nameAs');
    if (nameAs) C.nameAssamese = nameAs;

    const shortName = getParam('shortName');
    if (shortName) { C.shortName = shortName; C.logo.textFallback = shortName; }

    const tagline = getParam('tagline');
    if (tagline) { C.taglineEn = tagline; C.tagline = tagline; }

    const type = getParam('type');
    if (type) C.type = type;

    const district = getParam('district');
    if (district) C.district = district;

    const state = getParam('state');
    if (state) C.state = state;

    const est = getParam('est');
    if (est && /^\d{4}$/.test(est)) C.established = parseInt(est, 10);

    const phone = getParam('phone');
    if (phone) C.contact.phone = phone;

    const address = getParam('address');
    if (address) C.contact.address = address;

    const email = getParam('email');
    if (email) C.contact.email = email;

    const map = getParam('map');
    if (map) C.mapEmbedUrl = sanitizeUrl(map);

    /* Logo — auto-detect Drive vs hosted path */
    const logo = getParam('logo');
    if (logo) {
      const clean = sanitizeUrl(logo);
      if (clean.includes('drive.google.com')) {
        C.logo.source    = 'drive';
        C.logo.driveLink = clean;
      } else {
        C.logo.source    = 'hosted';
        C.logo.hostedPath = clean;
        C.logo.driveLink  = '';
      }
    }

    /* Hero — comma-separated, Drive or hosted */
    const hero = getParam('hero');
    if (hero) {
      const urls = hero.split(',').map(u => sanitizeUrl(u.trim())).filter(Boolean);
      if (urls.some(u => u.includes('drive.google.com'))) {
        C.heroImages.source    = 'driveFiles';
        C.heroImages.driveFiles = urls.map(u => ({ driveLink: u, caption: '' }));
      } else {
        C.heroImages.source  = 'hosted';
        C.heroImages.hosted  = urls.map(u => ({ path: u, caption: '' }));
        C.heroImages.driveFiles = [];
      }
    }

    /* Gallery — comma-separated, Drive or hosted */
    const gallery = getParam('gallery');
    if (gallery) {
      const urls = gallery.split(',').map(u => sanitizeUrl(u.trim())).filter(Boolean);
      if (urls.some(u => u.includes('drive.google.com'))) {
        C.gallery.source    = 'driveFiles';
        C.gallery.driveFiles = urls.map(u => ({ driveLink: u, caption: '' }));
      } else {
        C.gallery.source  = 'hosted';
        C.gallery.hosted  = urls.map(u => ({ path: u, caption: '' }));
        C.gallery.driveFiles = [];
      }
    }
  }

  /* ── DOM patches — run after DOMContentLoaded ────────────────── */
  /* Patches hardcoded text in index.html hero + form injection.   */
  function patchDom() {
    if (typeof SCHOOL_CONFIG === 'undefined') return;
    const C = SCHOOL_CONFIG;

    /* ── Hero title (index.html) ──────────────────────────────── */
    const heroTitle = document.getElementById('heroTitle');
    if (heroTitle) {
      /* Use textContent on the inner span to avoid XSS */
      const accent = heroTitle.querySelector('.hero__title-accent');
      if (accent) {
        accent.textContent = C.name;
      } else {
        /* Rebuild safely */
        const welcome = document.createTextNode('Welcome to ');
        const span = document.createElement('span');
        span.className = 'hero__title-accent';
        span.textContent = C.name;
        heroTitle.textContent = '';
        heroTitle.appendChild(welcome);
        heroTitle.appendChild(span);
      }
    }

    /* ── Hero subtitle (index.html) ───────────────────────────── */
    const heroSub = document.getElementById('heroSub');
    if (heroSub) {
      /* <em>tagline</em><br>type · district, state */
      const em = document.createElement('em');
      em.textContent = '\u201C' + C.taglineEn + '\u201D';
      const br = document.createElement('br');
      const text = document.createTextNode(
        C.type + ' · ' + C.district + ', ' + C.state
      );
      heroSub.textContent = '';
      heroSub.appendChild(em);
      heroSub.appendChild(br);
      heroSub.appendChild(text);
    }

    /* ── Headmaster stamp shortName + est ─────────────────────── */
    const hmStampName = document.getElementById('hmStampName');
    if (hmStampName) hmStampName.textContent = C.shortName || C.name.substring(0, 4).toUpperCase();

    const hmStampEst = document.getElementById('hmStampEst');
    if (hmStampEst) hmStampEst.textContent = 'Est. ' + C.established;

    /* ── Headmaster sig school name ────────────────────────────── */
    const hmSigSchool = document.getElementById('hmSigSchool');
    if (hmSigSchool) hmSigSchool.textContent = C.name;

    /* ── Page <title> ──────────────────────────────────────────── */
    if (document.title) {
      document.title = document.title.replace(/^.+?\s*\|/, C.name + ' |');
    }

    /* ── Contact form: inject institute_name hidden input ──────── */
    const form = document.getElementById('contactForm');
    if (form && !form.querySelector('[name="institute_name"]')) {
      const input = document.createElement('input');
      input.type  = 'hidden';
      input.name  = 'institute_name';
      input.value = C.name;   /* value set at runtime — safe */
      form.appendChild(input);
    }

    console.info('[DynamicDemo] DOM patched for:', C.name, '✅');
  }

  /* ── Main: run synchronously ─────────────────────────────────── */
  (function init() {
    /* Guard: SCHOOL_CONFIG must already be defined by config.js */
    if (typeof SCHOOL_CONFIG === 'undefined') {
      console.error('[DynamicDemo] SCHOOL_CONFIG not found. Make sure config.js loads first.');
      return;
    }

    /* Step 1 — Load ?demo=id profile (synchronous, before any render) */
    const demoId = getParam('demo');
    if (demoId) {
      const demoConfig = loadDemoConfig(demoId);
      if (demoConfig) applyDemoConfig(demoConfig);
    }

    /* Step 2 — Apply individual URL params (override demo config) */
    applyUrlParams();

    /* Step 3 — DOM patches after page elements exist */
    document.addEventListener('DOMContentLoaded', patchDom);

    console.info('[DynamicDemo] Loaded. Active params:', window.location.search || '(none)');
  })();

})();
