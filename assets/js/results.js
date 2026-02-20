/* results.js — Results page logic */

document.addEventListener("DOMContentLoaded", () => {
  Components.init("Results");
  buildYearPills();
  buildResultsTabs();
  bindFindButton();
});

const allResults = SCHOOL_CONFIG.results;
const years = [...new Set(allResults.map(r => r.year))].sort((a, b) => b - a);

let selectedYear = years[0];
let selectedClass = "";
let activeTabYear = years[0];

/* ── Year Pills (in selector) ── */
function buildYearPills() {
  const wrap = document.getElementById("yearPills");
  if (!wrap) return;

  wrap.innerHTML = years.map(y => `
    <button class="year-pill${y === selectedYear ? " active" : ""}" data-year="${y}">${y}</button>
  `).join("");

  wrap.querySelectorAll(".year-pill").forEach(btn => {
    btn.addEventListener("click", () => {
      wrap.querySelectorAll(".year-pill").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selectedYear = +btn.dataset.year;
    });
  });
}

/* ── Bind Find Button ── */
function bindFindButton() {
  const btn = document.getElementById("findResultBtn");
  const sel = document.getElementById("classSelect");
  if (!btn || !sel) return;

  sel.addEventListener("change", () => { selectedClass = sel.value; });

  btn.addEventListener("click", () => {
    if (!selectedYear || !selectedClass) {
      showValidationShake(btn);
      return;
    }
    findAndShow(selectedYear, +selectedClass);
  });
}

function showValidationShake(el) {
  el.style.animation = "none";
  el.offsetHeight;
  el.style.animation = "shake .4s ease";
  setTimeout(() => { el.style.animation = ""; }, 500);
}

/* ── Find & Show Result ── */
function findAndShow(year, cls) {
  const match = allResults.find(r => r.year === year && r.class === cls);
  const placeholder = document.getElementById("viewerPlaceholder");
  const found = document.getElementById("viewerFound");
  const unavail = document.getElementById("viewerUnavail");

  placeholder.style.display = "none";
  found.style.display = "none";
  unavail.style.display = "none";

  if (!match) {
    document.getElementById("unavailTitle").textContent = `Result Not Found`;
    document.getElementById("unavailMsg").textContent = `No result entry found for ${getClassName(cls)}, Year ${year}.`;
    unavail.style.display = "block";
    unavail.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  const urls = getResultUrls(match);

  if (!urls.available) {
    document.getElementById("unavailTitle").textContent = `Result Not Uploaded Yet`;
    document.getElementById("unavailMsg").textContent =
      `The result PDF for ${getClassName(cls)} – Year ${year} has not been uploaded. Please check back later or contact the school.`;
    unavail.style.display = "block";
    unavail.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  // Show result
  document.getElementById("resultBadge").textContent = `${year} · ${getClassName(cls)}`;
  document.getElementById("resultTitle").textContent = `Annual Examination Result ${year}`;
  document.getElementById("resultSub").textContent = `${getClassName(cls)} · Naharkatia Primary School, Dibrugarh, Assam`;
  document.getElementById("resultIframe").src = urls.view;
  document.getElementById("downloadBtn").href = urls.download;

  document.getElementById("previewBtn").onclick = () => {
    openPdfModal(`${getClassName(cls)} – Result ${year}`, urls.view, urls.download);
  };

  found.style.display = "block";
  found.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ── All Results Tabs ── */
function buildResultsTabs() {
  const tabsWrap = document.getElementById("resultsTabs");
  const gridWrap = document.getElementById("resultsGridWrap");
  if (!tabsWrap || !gridWrap) return;

  tabsWrap.innerHTML = years.map(y => `
    <button class="result-tab${y === activeTabYear ? " active" : ""}" data-year="${y}">
      📅 ${y}
    </button>
  `).join("");

  tabsWrap.querySelectorAll(".result-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      tabsWrap.querySelectorAll(".result-tab").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeTabYear = +btn.dataset.year;
      renderGrid(activeTabYear, gridWrap);
    });
  });

  renderGrid(activeTabYear, gridWrap);
}

function renderGrid(year, container) {
  const yearResults = allResults.filter(r => r.year === year);
  // Ensure all 5 classes shown
  const grid = [1, 2, 3, 4, 5].map(cls => {
    return yearResults.find(r => r.class === cls) || { year, class: cls, label: getClassName(cls), source: "none" };
  });

  const sourceLabel = r => {
    if (r.source === "drive") return `<span class="source-badge source-badge--drive">📁 Drive</span>`;
    if (r.source === "hosted") return `<span class="source-badge source-badge--hosted">🖥️ Hosted</span>`;
    return "";
  };

  container.innerHTML = `
    <div class="results-year-grid">
      ${grid.map(r => {
        const urls = r.source !== "none" ? getResultUrls(r) : { available: false };
        const classNum = toRoman(r.class);
        return `
          <div class="result-grid-item ${urls.available ? "available" : "unavailable"}">
            <div class="rgi-class-icon">${classNum}</div>
            <div class="rgi-label">${esc(getClassName(r.class))}</div>
            ${sourceLabel(r)}
            <div class="rgi-status ${urls.available ? "rgi-status--avail" : "rgi-status--unavail"}">
              ${urls.available ? "✅ Available" : "⏳ Not Uploaded"}
            </div>
            ${urls.available ? `
              <div class="rgi-btns">
                <button class="rgi-btn rgi-btn--view"
                  onclick="openPdfModal('${esc(getClassName(r.class))} – Result ${r.year}','${urls.view}','${urls.download}')">
                  👁️ View
                </button>
                <a href="${urls.download}" download class="rgi-btn rgi-btn--dl">⬇️ Download</a>
              </div>
            ` : `
              <div class="rgi-btns">
                <button class="rgi-btn rgi-btn--view" disabled style="opacity:.4;flex:1;cursor:not-allowed;">
                  👁️ Not Available
                </button>
              </div>
            `}
          </div>
        `;
      }).join("")}
    </div>
  `;
}

/* ── Helpers ── */
function getClassName(n) {
  const names = { 1: "Class I", 2: "Class II", 3: "Class III", 4: "Class IV", 5: "Class V" };
  return names[n] || `Class ${n}`;
}

function toRoman(n) {
  const map = { 1: "I", 2: "II", 3: "III", 4: "IV", 5: "V" };
  return map[n] || n;
}
