/* home.js — homepage specific JS */

document.addEventListener("DOMContentLoaded", () => {
  Components.init("Home");
  document.getElementById("currentYear").textContent = new Date().getFullYear();
  buildStats();
  buildHero();
  buildHomeNotices();
  buildHeadmasterDesk();
});

/* ── Stats ── */
function buildStats() {
  const grid = document.getElementById("statsGrid");
  if (!grid) return;
  grid.innerHTML = SCHOOL_CONFIG.stats.map(s => `
    <div class="stat-item">
      <div class="stat-item__icon">${s.icon}</div>
      <div class="stat-item__value" data-target="${s.value}" data-suffix="${s.suffix}">0${s.suffix}</div>
      <div class="stat-item__label">${esc(s.label)}</div>
    </div>
  `).join("");

  // Animate on scroll
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll("[data-target]").forEach(el => {
        const target = +el.dataset.target;
        const suf = el.dataset.suffix;
        let cur = 0;
        const step = target / 60;
        const t = setInterval(() => {
          cur = Math.min(cur + step, target);
          el.textContent = Math.floor(cur) + suf;
          if (cur >= target) clearInterval(t);
        }, 18);
      });
      obs.unobserve(e.target);
    });
  }, { threshold: 0.4 });
  obs.observe(grid);
}

/* ── Hero Slider ── */
let heroImages = [], heroIdx = 0, heroTimer = null;

function buildHero() {
  // ✅ FIX: Use getHeroImages() which handles driveFiles, hosted, and fallback correctly.
  // Old code only checked source==="hosted" and missed the "driveFiles" mode entirely.
  heroImages = (typeof getHeroImages === "function")
    ? getHeroImages()
    : SCHOOL_CONFIG.heroImages.fallback;

  const track = document.getElementById("heroTrack");
  const dotsWrap = document.getElementById("heroDots");
  if (!track) return;

  track.innerHTML = "";
  dotsWrap.innerHTML = "";

  heroImages.forEach((img, i) => {
    const url = img.url || img.path;
    const slide = document.createElement("div");
    slide.className = "hero__slide" + (i === 0 ? " active" : "");
    slide.innerHTML = `
      <img src="${url}" alt="${esc(img.caption || "")}" loading="${i === 0 ? "eager" : "lazy"}"
           onerror="this.parentElement.style.background='var(--grad-primary)'">
      <div class="hero__overlay"></div>
      <div class="hero__pattern"></div>
    `;
    track.appendChild(slide);

    const dot = document.createElement("button");
    dot.className = "hero__dot" + (i === 0 ? " active" : "");
    dot.setAttribute("aria-label", "Slide " + (i + 1));
    dot.addEventListener("click", () => goSlide(i));
    dotsWrap.appendChild(dot);
  });

  startHeroTimer();

  document.querySelector(".hero__nav--prev")?.addEventListener("click", () => goSlide(heroIdx - 1));
  document.querySelector(".hero__nav--next")?.addEventListener("click", () => goSlide(heroIdx + 1));
}

function goSlide(n) {
  const slides = document.querySelectorAll(".hero__slide");
  const dots = document.querySelectorAll(".hero__dot");
  slides[heroIdx]?.classList.remove("active");
  dots[heroIdx]?.classList.remove("active");
  heroIdx = ((n % heroImages.length) + heroImages.length) % heroImages.length;
  slides[heroIdx]?.classList.add("active");
  dots[heroIdx]?.classList.add("active");
  clearInterval(heroTimer);
  startHeroTimer();
}

function startHeroTimer() {
  heroTimer = setInterval(() => goSlide(heroIdx + 1), 5000);
}

/* ── Headmaster Desk ── */
function buildHeadmasterDesk() {
  const hm = SCHOOL_CONFIG.headmaster;
  if (!hm) return;

  // Photo
  let photoUrl = "https://ui-avatars.com/api/?background=1a5276&color=fff&size=300&bold=true&name=" + encodeURIComponent(hm.name);
  if (hm.photoSource === "drive" && !isDrivePlaceholder(hm.drivePhotoLink)) {
    photoUrl = driveShareToImageUrl(hm.drivePhotoLink);
  } else if (hm.photoSource === "hosted" && hm.hostedPath) {
    photoUrl = hm.hostedPath;
  }
  const imgEl = document.getElementById("hmPhoto");
  if (imgEl) imgEl.src = photoUrl;

  // Text fields
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val || ""; };
  set("hmName", hm.name);
  set("hmDesig", hm.designation);
  set("hmQual", hm.qualification + (hm.experience ? " · " + hm.experience : ""));
  set("hmSigName", hm.name);

  // Message — preserve line breaks
  const msgEl = document.getElementById("hmMessage");
  if (msgEl && hm.message) {
    msgEl.innerHTML = hm.message
      .trim()
      .split(/\n\n+/)
      .map(p => `<p>${esc(p.trim()).replace(/\n/g, "<br>")}</p>`)
      .join("");
  }
               }

/* ── Home Notices Preview ── */
function buildHomeNotices() {
  const list = document.getElementById("homeNoticeList");
  if (!list) return;

  const cfg = SCHOOL_CONFIG.notices;
  let notices = [];

  if (cfg.source === "drive" && cfg.driveFiles && cfg.driveFiles.length) {
    // Real Drive links — convert to embed/download URLs
    const real = cfg.driveFiles
      .filter(n => n.title && !isDrivePlaceholder(n.driveLink))
      .map(n => ({
        title:       n.title,
        date:        n.date,
        viewUrl:     driveShareToEmbed(n.driveLink),
        downloadUrl: driveShareToDownload(n.driveLink),
        isNew:       isNew(n.date)
      }));
    // Placeholder links — show title/date but disable buttons
    const placeholder = cfg.driveFiles
      .filter(n => n.title && isDrivePlaceholder(n.driveLink))
      .map(n => ({
        title: n.title, date: n.date,
        viewUrl: null, downloadUrl: null,
        isNew: isNew(n.date)
      }));
    notices = [...real, ...placeholder];

  } else if (cfg.source === "hosted" && cfg.hostedFiles && cfg.hostedFiles.length) {
    notices = cfg.hostedFiles.map(n => ({
      title:       n.title,
      date:        n.date,
      viewUrl:     n.file,
      downloadUrl: n.file,
      isNew:       isNew(n.date)
    }));
  }

  // Sort newest first, show top 5
  notices.sort((a, b) => new Date(b.date) - new Date(a.date));
  notices = notices.slice(0, 5);

  if (!notices.length) {
    list.innerHTML = `<div style="padding:2rem;text-align:center;color:var(--c-muted)">No notices available.</div>`;
    return;
  }

  list.innerHTML = notices.map(n => `
    <div class="notice-item">
      <div class="notice-item__icon">📄</div>
      <div class="notice-item__body">
        <div class="notice-item__title">
          ${esc(n.title)}
          ${n.isNew ? `<span class="badge-new">New</span>` : ""}
        </div>
        <div class="notice-item__date">📅 ${fmtDate(n.date)}</div>
      </div>
      <div class="notice-item__btns">
        ${n.viewUrl
          ? `<button class="n-btn n-btn--view" onclick="openPdfModal('${esc(n.title)}','${n.viewUrl}','${n.downloadUrl}')" title="Preview">👁️</button>`
          : `<button class="n-btn n-btn--view" disabled title="Not uploaded yet" style="opacity:.4;cursor:not-allowed">👁️</button>`}
        ${n.downloadUrl
          ? `<a href="${n.downloadUrl}" download class="n-btn n-btn--dl" title="Download">⬇️</a>`
          : `<button class="n-btn n-btn--dl" disabled style="opacity:.4;cursor:not-allowed">⬇️</button>`}
      </div>
    </div>
  `).join("");
}
