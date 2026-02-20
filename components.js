/**
 * ============================================================
 *  COMPONENTS.JS — Shared UI: Header, Nav, Footer, Modals
 *  Injected into every page. Add new nav items here ONCE.
 * ============================================================
 */

const Components = (() => {

  // ── Navigation structure ─────────────────────────────────────
  // To add a new page: add an entry here + create pages/pagename.html
  const NAV_ITEMS = [
    { label: "🏠 Home",       href: "index.html",           id: "home" },
    { label: "🏫 About",      href: "pages/about.html",     id: "about", children: [
      { label: "History & Overview",  href: "pages/about.html#history" },
      { label: "Vision & Mission",    href: "pages/about.html#vision" },
      { label: "Principal's Message", href: "pages/about.html#principal" },
    ]},
    { label: "🔔 Notices",    href: "pages/notices.html",   id: "notices" },
    { label: "📝 Admission",  href: "pages/admission.html", id: "admission" },
    { label: "📚 Academics",  href: "pages/academics.html", id: "academics", children: [
      { label: "Class Routine",  href: "pages/academics.html#routine" },
      { label: "Syllabus",       href: "pages/academics.html#syllabus" },
      { label: "Departments",    href: "pages/academics.html#departments" },
      { label: "📊 Results",    href: "pages/results.html" },
    ]},
    { label: "👩‍🏫 Teachers",  href: "pages/teachers.html",  id: "teachers" },
    { label: "🖼️ Gallery",   href: "pages/gallery.html",   id: "gallery" },
    { label: "🏗️ Facilities", href: "pages/facilities.html",id: "facilities" },
    { label: "📞 Contact",    href: "pages/contact.html",   id: "contact" },
  ];

  /** Resolve correct relative base path for assets + links */
  function getBase() {
    const path = window.location.pathname;
    return path.includes("/pages/") ? "../" : "./";
  }

  /** Build full href with correct base */
  function resolveHref(href, base) {
    if (href.startsWith("http") || href.startsWith("//")) return href;
    if (href.startsWith("pages/") || href.startsWith("index.html")) return base + href;
    return href;
  }

  /** Detect active nav item */
  function isActive(href) {
    const curr = window.location.pathname.split("/").pop();
    const target = href.split("#")[0].split("/").pop();
    return curr === target || (curr === "" && target === "index.html");
  }

  // ── INJECT TOP BAR ───────────────────────────────────────────
  function injectTopBar() {
    const base = getBase();
    const notices = (SCHOOL_CONFIG.notices.driveFiles || SCHOOL_CONFIG.notices.hostedFiles || []).slice(0, 5);
    const marqueeText = notices.map(n => `📌 ${n.title}  ·  ${fmtDate(n.date)}`).join("     |||     ");

    const el = document.createElement("div");
    el.className = "top-bar";
    el.innerHTML = `
      <div class="container top-bar__inner">
        <div class="top-bar__marquee">
          <span class="top-bar__scroll">${marqueeText}</span>
        </div>
        <div class="top-bar__links">
          <a href="https://dee.assam.gov.in" target="_blank" rel="noopener">🔗 DEE Assam</a>
          <a href="https://samagrashikshaassam.in" target="_blank" rel="noopener">🔗 SSA Assam</a>
          <a href="${base}pages/admission.html">📝 Admission</a>
          <a href="${base}pages/notices.html">🔔 Notices</a>
        </div>
      </div>
    `;
    document.body.prepend(el);
  }

  // ── INJECT HEADER ────────────────────────────────────────────
  function injectHeader() {
    const base = getBase();
    const cfg = SCHOOL_CONFIG;

    // Build logo img URL
    // ✅ FIX: Use getLogoUrl() which uses lh3.googleusercontent.com thumbnail API
    // instead of uc?export=view which is blocked by browsers due to CORS/redirect issues
    let logoHtml = `<span class="school-logo-text">${cfg.logo.textFallback}</span>`;
    const logoUrl = (typeof getLogoUrl === "function") ? getLogoUrl() : null;
    if (logoUrl) {
      const resolvedSrc = (cfg.logo.source === "hosted") ? base + logoUrl : logoUrl;
      logoHtml = `<img src="${resolvedSrc}" alt="${esc(cfg.name)} Logo" onerror="this.outerHTML='<span class=school-logo-text>${esc(cfg.logo.textFallback)}</span>'">`;
    }

    const el = document.createElement("header");
    el.className = "header";
    el.innerHTML = `
      <div class="container header__inner">
        <div class="header__logos">
          <img class="govt-logo" src="${cfg.govtSealUrl}" alt="Seal of Assam" onerror="this.style.display='none'">
          <div class="logo-divider" aria-hidden="true"></div>
          <div class="school-logo-wrap">${logoHtml}</div>
        </div>
        <div class="header__info">
          <h1 class="header__name">${esc(cfg.name)}</h1>
          <p class="header__name-as" lang="as">${esc(cfg.nameAssamese)}</p>
          <div class="header__meta">
            <span>🏛️ ${esc(cfg.type)}</span>
            <span>📍 ${esc(cfg.district)}, ${esc(cfg.state)}</span>
            <span>🎓 ${esc(cfg.affiliation)}</span>
            <span>📅 Est. ${cfg.established}</span>
          </div>
        </div>
        <div class="header__actions">
          <a href="${base}pages/admission.html" class="btn-hdr btn-hdr--fill">📝 Admission</a>
          <a href="${base}pages/notices.html" class="btn-hdr btn-hdr--fill">🔔 Notices</a>
          <a href="${base}pages/contact.html" class="btn-hdr btn-hdr--outline">📞 Contact</a>
        </div>
      </div>
    `;
    document.body.insertBefore(el, document.body.children[1]);
  }

  // ── INJECT NAV ───────────────────────────────────────────────
  function injectNav() {
    const base = getBase();

    const itemsHtml = NAV_ITEMS.map(item => {
      const href = resolveHref(item.href, base);
      const active = isActive(item.href) ? " active" : "";
      const hasChildren = item.children && item.children.length;
      const arrow = hasChildren ? `<svg class="nav__arrow" viewBox="0 0 10 6" width="10"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>` : "";

      const dropdown = hasChildren ? `
        <div class="nav__dropdown">
          ${item.children.map(c => `
            <a href="${resolveHref(c.href, base)}" class="nav__dd-link">${c.label}</a>
          `).join("")}
        </div>
      ` : "";

      return `
        <li class="nav__item${hasChildren ? " has-dropdown" : ""}">
          <a href="${href}" class="nav__link${active}" ${hasChildren ? 'data-toggle="dropdown"' : ""}>
            ${item.label}${arrow}
          </a>
          ${dropdown}
        </li>
      `;
    }).join("");

    const nav = document.createElement("nav");
    nav.className = "nav";
    nav.setAttribute("role", "navigation");
    nav.setAttribute("aria-label", "Main Navigation");
    nav.innerHTML = `
      <div class="container nav__inner">
        <ul class="nav__list" id="navList">${itemsHtml}</ul>
        <button class="nav__hamburger" id="hamburger" aria-label="Toggle navigation menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    `;
    document.body.insertBefore(nav, document.body.children[2]);

    // Hamburger toggle
    const hbg = nav.querySelector("#hamburger");
    const list = nav.querySelector("#navList");
    hbg.addEventListener("click", () => {
      const open = list.classList.toggle("open");
      hbg.classList.toggle("open", open);
      hbg.setAttribute("aria-expanded", open);
    });

    // Mobile dropdowns
    nav.querySelectorAll(".has-dropdown > .nav__link").forEach(link => {
      link.addEventListener("click", e => {
        if (window.innerWidth > 768) return;
        e.preventDefault();
        const item = link.closest(".nav__item");
        item.classList.toggle("open");
      });
    });
  }

  // ── INJECT FOOTER ────────────────────────────────────────────
  function injectFooter() {
    const base = getBase();
    const cfg = SCHOOL_CONFIG;

    const govLinksHtml = cfg.govLinks.map(l =>
      `<a href="${l.url}" target="_blank" rel="noopener">${l.name}</a>`
    ).join("");

    const quickLinks = NAV_ITEMS.filter(i => !i.children).map(i =>
      `<a href="${resolveHref(i.href, base)}">${i.label.replace(/^[^\s]+\s/, "")}</a>`
    ).join("");

    const footer = document.createElement("footer");
    footer.className = "footer";
    footer.innerHTML = `
      <div class="container">
        <div class="footer__grid">
          <div class="footer__col footer__brand">
            <div class="footer__logo-row">
              <img src="${cfg.govtSealUrl}" alt="Assam Seal" class="footer__seal" onerror="this.style.display='none'">
              <div>
                <div class="footer__school-name">${esc(cfg.name)}</div>
                <div class="footer__school-sub">${esc(cfg.district)}, ${esc(cfg.state)}</div>
              </div>
            </div>
            <p class="footer__desc">A Government Lower Primary School serving children of Radhakuchi Village,Kamrup District since ${cfg.established}, under Samagra Shiksha Abhiyan.</p>
            <div class="footer__social">
              <a href="${cfg.social.facebook}" aria-label="Facebook">
                <svg viewBox="0 0 24 24" width="16" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="${cfg.social.youtube}" aria-label="YouTube">
                <svg viewBox="0 0 24 24" width="16" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
              </a>
              <a href="${cfg.social.twitter}" aria-label="Twitter">
                <svg viewBox="0 0 24 24" width="16" fill="currentColor"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
              </a>
            </div>
          </div>
          <div class="footer__col">
            <h4 class="footer__col-title">Quick Links</h4>
            <div class="footer__links">${quickLinks}</div>
          </div>
          <div class="footer__col">
            <h4 class="footer__col-title">Govt. Education Portals</h4>
            <div class="footer__links">${govLinksHtml}</div>
          </div>
          <div class="footer__col">
            <h4 class="footer__col-title">Contact Info</h4>
            <div class="footer__contact-list">
              <div class="footer__contact-item">📍 ${esc(cfg.contact.address)}</div>
              <div class="footer__contact-item">📞 <a href="tel:${cfg.contact.phone}">${esc(cfg.contact.phone)}</a></div>
              <div class="footer__contact-item">📧 <a href="mailto:${cfg.contact.email}">${esc(cfg.contact.email)}</a></div>
              <div class="footer__contact-item">🏫 Code: ${esc(cfg.code)}</div>
            </div>
            <div class="footer__nic-badge">🔒 Secured · NIC · GOI</div>
          </div>
        </div>
        <div class="footer__bottom">
          <span>© ${new Date().getFullYear()} ${esc(cfg.name)}. All rights reserved.</span>
          <span>Designed under Assam School Digital Initiative</span>
          <a href="https://assam.gov.in" target="_blank" rel="noopener">🏛️ assam.gov.in</a>
        </div>

        <!-- ══ VISITOR COUNTER + POWERED BY BADGE ══════════════ -->
        <div class="footer__branding-bar">

          <!-- LEFT: Visitor Counter (LED digit style) -->
          <div class="footer__visitor">
            <span class="footer__visitor-label">👁️ Visitor Count</span>
            <div class="visitor-counter" id="visitorCounter">
              <div class="vc-digit" id="vc0">0</div>
              <div class="vc-digit" id="vc1">0</div>
              <div class="vc-digit" id="vc2">0</div>
              <div class="vc-digit" id="vc3">0</div>
              <div class="vc-digit" id="vc4">0</div>
              <div class="vc-digit" id="vc5">0</div>
            </div>
          </div>

          <!-- RIGHT: Powered By JTR Technology Badge -->
          <div class="footer__powered">
            <span class="footer__powered-label">Powered by</span>
            <a href="mailto:jayantakumarkakati1999@gmail.com"
               class="footer__powered-badge"
               title="Contact JTR Technology">
              <span class="footer__powered-icon">⚡</span>
              <span class="footer__powered-name">JTR Technology</span>
              <span class="footer__powered-arrow">↗</span>
            </a>
          </div>

        </div>
      </div>
    `;
    document.body.appendChild(footer);

    // ── Init visitor counter after footer is in DOM ──────────
    initVisitorCounter();
  }

  // ── INJECT BACK-TO-TOP ───────────────────────────────────────
  function injectBackTop() {
    const btn = document.createElement("button");
    btn.className = "back-top";
    btn.setAttribute("aria-label", "Back to top");
    btn.innerHTML = `<svg viewBox="0 0 24 24" width="20" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>`;
    document.body.appendChild(btn);

    window.addEventListener("scroll", () => {
      btn.classList.toggle("visible", window.scrollY > 500);
    }, { passive: true });
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  // ── INJECT PDF MODAL ─────────────────────────────────────────
  function injectPdfModal() {
    const modal = document.createElement("div");
    modal.id = "pdfModal";
    modal.className = "pdf-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.innerHTML = `
      <div class="pdf-modal__box">
        <div class="pdf-modal__head">
          <span class="pdf-modal__title" id="pdfModalTitle">Document Preview</span>
          <div class="pdf-modal__actions">
            <a id="pdfModalDownload" href="#" download class="pdf-modal__btn pdf-modal__btn--dl">⬇️ Download</a>
            <button class="pdf-modal__btn pdf-modal__btn--close" id="pdfModalClose">✕ Close</button>
          </div>
        </div>
        <div class="pdf-modal__body">
          <iframe id="pdfModalFrame" title="PDF Preview" src="about:blank" allowfullscreen allow="autoplay" sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-top-navigation"></iframe>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // Close
    modal.querySelector("#pdfModalClose").addEventListener("click", closePdfModal);
    modal.addEventListener("click", e => { if (e.target === modal) closePdfModal(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape") closePdfModal(); });
  }

  // ── SCROLL REVEAL ────────────────────────────────────────────
  function initScrollReveal() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });

    const observe = () => {
      document.querySelectorAll(".reveal, .reveal-up, .reveal-left, .reveal-right").forEach(el => obs.observe(el));
    };
    observe();
    return observe; // expose so dynamic content can re-trigger
  }

  // ── SMOOTH SCROLL ────────────────────────────────────────────
  function initSmoothScroll() {
    document.addEventListener("click", e => {
      const a = e.target.closest('a[href*="#"]');
      if (!a) return;
      const href = a.getAttribute("href");
      const hash = href.split("#")[1];
      if (!hash) return;
      // Only if on same page
      const targetPage = href.split("#")[0];
      const currPage = window.location.pathname.split("/").pop();
      const isInternal = !targetPage || targetPage === currPage || targetPage === "";
      if (!isInternal) return;
      const target = document.getElementById(hash);
      if (!target) return;
      e.preventDefault();
      const navH = document.querySelector(".nav")?.offsetHeight || 52;
      window.scrollTo({ top: target.offsetTop - navH - 12, behavior: "smooth" });
    });
  }

  // ── PAGE TITLE ───────────────────────────────────────────────
  function setPageTitle(title) {
    document.title = `${title} | ${SCHOOL_CONFIG.name}`;
  }

  // ── VISITOR COUNTER ──────────────────────────────────────────
  // Uses localStorage to persist count across sessions on the same browser.
  // Each unique visit (new browser session) increments by 1.
  // Starts at a realistic base count so it doesn't look brand new.
  function initVisitorCounter() {
    const BASE_COUNT  = 10247;   // ← Starting base — looks organic
    const STORAGE_KEY = "jbs_visitor_count";
    const SESSION_KEY = "jbs_visit_done";

    // Retrieve stored count or initialise
    let count = parseInt(localStorage.getItem(STORAGE_KEY) || BASE_COUNT, 10);

    // Only count once per browser session
    if (!sessionStorage.getItem(SESSION_KEY)) {
      count += 1;
      localStorage.setItem(STORAGE_KEY, count);
      sessionStorage.setItem(SESSION_KEY, "1");
    }

    // Animate digits rolling up to final number
    animateCounter(count);
  }

  function animateCounter(finalCount) {
    const digits = String(finalCount).padStart(6, "0").split("");
    const els = [0,1,2,3,4,5].map(i => document.getElementById(`vc${i}`));
    if (!els[0]) return;

    // Start all at 0, roll up with staggered delay
    let frame = 0;
    const totalFrames = 40;

    const tick = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic

      els.forEach((el, i) => {
        if (!el) return;
        const target = parseInt(digits[i], 10);
        // Each digit rolls through random numbers then settles
        if (frame < totalFrames) {
          if (frame > i * 4) { // stagger start per digit
            el.textContent = Math.floor(Math.random() * 10);
            el.classList.add("rolling");
          }
        } else {
          el.textContent = digits[i];
          el.classList.remove("rolling");
          el.classList.add("settled");
        }
      });

      if (frame >= totalFrames) {
        clearInterval(tick);
        // Final set to correct digits
        els.forEach((el, i) => {
          if (el) el.textContent = digits[i];
        });
      }
    }, 50);
  }

  // ── INIT ALL ─────────────────────────────────────────────────
  function init(pageTitle) {
    injectTopBar();
    injectHeader();
    injectNav();
    injectFooter();
    injectBackTop();
    injectPdfModal();
    initScrollReveal();
    initSmoothScroll();
    if (pageTitle) setPageTitle(pageTitle);
  }

  return { init, initScrollReveal, setPageTitle, getBase };
})();

// ── GLOBAL PDF MODAL API ─────────────────────────────────────
function openPdfModal(title, viewUrl, downloadUrl) {
  const modal = document.getElementById("pdfModal");
  const frame = document.getElementById("pdfModalFrame");
  const titleEl = document.getElementById("pdfModalTitle");
  const dlBtn = document.getElementById("pdfModalDownload");
  if (!modal) return;

  titleEl.textContent = title || "Document Preview";
  frame.src = viewUrl || "about:blank";
  dlBtn.href = downloadUrl || viewUrl || "#";
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closePdfModal() {
  const modal = document.getElementById("pdfModal");
  if (!modal) return;
  modal.classList.remove("open");
  document.getElementById("pdfModalFrame").src = "about:blank";
  document.body.style.overflow = "";
}
