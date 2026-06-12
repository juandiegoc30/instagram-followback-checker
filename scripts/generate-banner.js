const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const WIDTH = 1536;
const HEIGHT = 1024;

const assetsDir = path.resolve(__dirname, '../assets');
const usFlagBase64 = fs.readFileSync(path.join(assetsDir, 'flags/4x3/us.svg')).toString('base64');
const esFlagBase64 = fs.readFileSync(path.join(assetsDir, 'flags/4x3/es.svg')).toString('base64');

const avatar1 = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><circle cx="16" cy="16" r="16" fill="#c7d2fe"/><text x="16" y="21" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="700" fill="#3730a3">SC</text></svg>')}`;
const avatar2 = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><circle cx="16" cy="16" r="16" fill="#fde68a"/><text x="16" y="21" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="700" fill="#92400e">DP</text></svg>')}`;

const variants = [
  {
    flag: usFlagBase64, langCode: 'EN', output: 'banner.png',
    eyebrow: 'Chrome Extension · Instagram Utility',
    h1: 'Find out who does not follow you back on Instagram.',
    text: 'Analyze your account, filter results, export data, and decide exactly which accounts to keep before unfollowing.',
    download: '↓ Download latest release', github: 'View on GitHub',
    certNoPassword: 'NO PASSWORD', certNoPasswordSub: 'Session based',
    certLocal: 'LOCAL ONLY', certLocalSub: 'No external backend',
    certOpen: 'OPEN SOURCE', certOpenSub: 'MIT License',
    account: 'Account: @demo.user',
    analyze: 'Analyze account', cancel: 'Cancel', copy: 'Copy list', export: 'Export',
    status: 'Analysis complete. 12 accounts do not follow you back.',
    followers: 'Followers', following: 'Following', notFollowing: 'Not following back',
    search: 'Search by username or name...', contains: 'Contains', all: 'All',
    showing: 'Showing 2 of 12 results', clear: 'Clear filter',
    selectAll: 'Select all', selected: '12 of 12 selected',
    speed: 'Unfollow speed',
    balanced: 'Balanced', balancedHint: '5 to 8 s per account',
    fast: 'Fast', fastHint: '2.5 to 4.5 s per account',
    unfollow: 'Unfollow selected',
    detected: 'Detected accounts', listSelected: '12 selected', open: 'Open',
    footer: 'The extension uses your active Instagram session from the browser. It does not request your password or store credentials.',
    user1: '@sample.creator', name1: 'Sample Creator',
    user2: '@demo.profile', name2: 'Demo Profile',
  },
  {
    flag: esFlagBase64, langCode: 'ES', output: 'banner-es.png',
    eyebrow: 'Extensión Chrome · Utilidad de Instagram',
    h1: 'Descubre quién no te sigue de vuelta en Instagram.',
    text: 'Analiza tu cuenta, filtra los resultados, exporta datos y decide exactamente qué cuentas quieres dejar de seguir.',
    download: '↓ Descargar última versión', github: 'Ver en GitHub',
    certNoPassword: 'SIN CONTRASEÑA', certNoPasswordSub: 'Basado en sesión',
    certLocal: 'SOLO LOCAL', certLocalSub: 'Sin backend externo',
    certOpen: 'CÓDIGO ABIERTO', certOpenSub: 'Licencia MIT',
    account: 'Cuenta: @demo.usuario',
    analyze: 'Analizar cuenta', cancel: 'Cancelar', copy: 'Copiar lista', export: 'Exportar',
    status: 'Análisis completo. 12 cuentas no te siguen de vuelta.',
    followers: 'Seguidores', following: 'Seguidos', notFollowing: 'No te siguen de vuelta',
    search: 'Buscar por usuario o nombre...', contains: 'Contiene', all: 'Todos',
    showing: 'Mostrando 2 de 12 resultados', clear: 'Limpiar filtro',
    selectAll: 'Seleccionar todo', selected: '12 de 12 seleccionados',
    speed: 'Velocidad de dejar de seguir',
    balanced: 'Equilibrado', balancedHint: '5 a 8 s por cuenta',
    fast: 'Rápido', fastHint: '2.5 a 4.5 s por cuenta',
    unfollow: 'Dejar de seguir seleccionados',
    detected: 'Cuentas detectadas', listSelected: '12 seleccionadas', open: 'Abrir',
    footer: 'La extensión usa tu sesión activa de Instagram en el navegador. No solicita tu contraseña ni almacena credenciales.',
    user1: '@sample.creator', name1: 'Sample Creator',
    user2: '@demo.profile', name2: 'Demo Profile',
  },
];

function buildHtml(t) {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: ${WIDTH}px; height: ${HEIGHT}px; overflow: hidden;
    font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    background: #f8fafc; color: #0f172a; position: relative;
  }
  .bg {
    position: absolute; inset: 0;
    background:
      radial-gradient(circle at 8% 20%, rgba(37,99,235,.18), transparent 36%),
      radial-gradient(circle at 88% 14%, rgba(236,72,153,.14), transparent 34%),
      radial-gradient(circle at 70% 76%, rgba(251,191,36,.13), transparent 32%),
      linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
    z-index: 0;
  }
  .layout {
    position: relative; z-index: 1;
    display: grid; grid-template-columns: 1fr 500px;
    gap: 60px; align-items: center;
    height: 100%; padding: 64px 90px;
  }
  .eyebrow {
    font-size: 13px; font-weight: 900; text-transform: uppercase;
    letter-spacing: .13em; color: #2563eb; margin-bottom: 20px;
  }
  h1 {
    font-size: 62px; font-weight: 920; line-height: 1.05;
    letter-spacing: -0.018em; color: #0f172a;
    max-width: 640px; margin-bottom: 22px;
  }
  .hero-text {
    font-size: 20px; line-height: 1.52; color: #64748b;
    max-width: 620px; margin-bottom: 32px;
  }
  .hero-actions { display: flex; gap: 14px; margin-bottom: 28px; }
  .btn {
    display: inline-flex; align-items: center; justify-content: center;
    gap: 10px; min-height: 50px; padding: 0 26px;
    border-radius: 17px; font-size: 15px; font-weight: 800;
    text-decoration: none; border: 0;
  }
  .btn-primary { background: #111827; color: white; box-shadow: 0 16px 36px rgba(15,23,42,.16); }
  .btn-secondary { background: rgba(255,255,255,.9); color: #0f172a; border: 1px solid #e2e8f0; }
  .certificates {
    display: grid; grid-template-columns: repeat(3, minmax(120px, 1fr));
    gap: 12px; max-width: 470px;
  }
  .cert {
    min-height: 82px; border-radius: 15px; padding: 13px;
    display: grid; align-content: center; justify-items: start;
    gap: 4px; border: 1px solid rgba(226,232,240,.95);
    box-shadow: 0 14px 36px rgba(15,23,42,.10);
    position: relative; overflow: hidden;
  }
  .cert::after {
    content: ""; position: absolute; width: 80px; height: 80px;
    border-radius: 999px; right: -28px; top: -28px;
    background: rgba(255,255,255,.13);
  }
  .cert-dark  { background: linear-gradient(135deg, #111827, #1e293b); color: #fff; }
  .cert-blue  { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #fff; }
  .cert-light { background: linear-gradient(135deg, #ffffff, #eff6ff); color: #111827; border-color: rgba(37,99,235,.22); }
  .cert-icon  { font-size: 19px; line-height: 1; font-weight: 900; letter-spacing: .04em; }
  .cert-icon svg { display: block; width: 18px; height: 18px; }
  .cert-label { font-size: 11px; font-weight: 920; letter-spacing: .09em; white-space: nowrap; }
  .cert small  { font-size: 10px; font-weight: 700; opacity: .82; letter-spacing: .05em; }
  /* panel */
  .panel {
    background: #ffffff; color: #111827;
    border: 1px solid #e5e7eb; box-shadow: 0 28px 80px rgba(15,23,42,.13);
    border-radius: 22px; overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
    width: 500px;
  }
  .p-header {
    padding: 15px 18px; border-bottom: 1px solid #f3f4f6;
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
  }
  .p-title { font-size: 15px; font-weight: 850; letter-spacing: -.02em; }
  .p-subtitle {
    display: inline-flex; margin-top: 7px; padding: 5px 10px;
    border: 1px solid #dbeafe; border-radius: 999px;
    background: linear-gradient(90deg,#eff6ff,#fff); font-size: 12px; font-weight: 750;
  }
  .p-header-right { display: flex; align-items: center; gap: 8px; }
  .p-lang {
    border: 1px solid #e5e7eb; border-radius: 999px; background: #fff;
    padding: 5px 10px; color: #111827; display: inline-flex;
    align-items: center; gap: 6px; font-size: 12px; font-weight: 780;
  }
  .p-flag { width: 16px; height: 12px; border-radius: 2px; object-fit: cover; }
  .p-close {
    background: #f3f4f6; color: #111827; width: 30px; height: 30px;
    border-radius: 999px; font-size: 20px; display: inline-flex;
    align-items: center; justify-content: center; border: 0; line-height: 1;
  }
  .p-body { padding: 14px 17px 12px; }
  .p-actions { display: grid; grid-template-columns: 1.08fr .78fr .92fr .78fr; gap: 7px; margin-bottom: 10px; }
  .p-btn { border: 0; border-radius: 9px; padding: 9px 8px; font-size: 11.5px; font-weight: 750; white-space: nowrap; }
  .p-btn-primary  { background: #111827; color: #fff; }
  .p-btn-secondary{ background: #f3f4f6; color: #111827; }
  .p-btn-danger   { background: #fee2e2; color: #991b1b; }
  .p-status {
    color: #1f2937; font-size: 12px; line-height: 1.45; padding: 10px 12px;
    border: 1px solid #bfdbfe; background: #eff6ff; border-radius: 12px;
    font-weight: 650; margin-bottom: 11px;
  }
  .p-metrics { display: grid; grid-template-columns: repeat(3,1fr); gap: 7px; margin-bottom: 11px; }
  .p-metric { border: 1px solid #f3f4f6; background: #fafafa; border-radius: 11px; padding: 9px; }
  .p-metric-value { font-size: 17px; font-weight: 850; }
  .p-metric-label { font-size: 10.5px; color: #6b7280; margin-top: 3px; }
  .p-filter-grid { display: grid; grid-template-columns: minmax(0,1fr) 104px 104px; gap: 7px; margin-bottom: 9px; }
  .p-search,.p-select { width: 100%; border: 1px solid #e5e7eb; border-radius: 9px; padding: 9px; font-size: 12px; background: #fff; color: #111827; }
  .p-filter-tools { display: flex; justify-content: space-between; gap: 8px; color: #6b7280; font-size: 11.5px; margin-bottom: 9px; }
  .p-link-btn { border: 0; background: transparent; color: #2563eb; font-weight: 800; padding: 0; font-size: 11.5px; }
  .p-selection { display: grid; gap: 9px; margin: 9px 0 11px; padding: 11px; border: 1px solid #f3f4f6; border-radius: 11px; background: #fafafa; }
  .p-sel-row { display: flex; justify-content: space-between; align-items: center; gap: 10px; }
  .p-check-label { display: flex; align-items: center; gap: 7px; font-size: 12px; font-weight: 700; }
  .p-checkbox { width: 15px; height: 15px; accent-color: #111827; }
  .p-sel-count { color: #6b7280; font-size: 11px; }
  .p-speed-label { font-size: 11.5px; font-weight: 750; color: #374151; display: block; margin-bottom: 8px; }
  .p-speed-toggle { display: grid; grid-template-columns: 1fr 1fr; gap: 5px; padding: 4px; border: 1px solid #e5e7eb; background: #f9fafb; border-radius: 11px; }
  .p-speed-card { min-height: 40px; display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 8px; color: #374151; text-align: center; padding: 5px; }
  .p-speed-card.active { background: #111827; color: white; }
  .p-speed-name { font-size: 11.5px; font-weight: 800; line-height: 1.15; }
  .p-speed-hint { margin-top: 2px; font-size: 9.5px; font-weight: 600; color: #6b7280; line-height: 1.15; }
  .p-speed-card.active .p-speed-hint { color: #d1d5db; }
  .p-unfollow-btn { width: 100%; text-align: center; margin-top: 2px; }
  .p-list-box { margin-top: 9px; border: 1px solid #e5e7eb; border-radius: 13px; overflow: hidden; background: #fff; }
  .p-list-header { display: flex; justify-content: space-between; padding: 9px 11px; border-bottom: 1px solid #f3f4f6; background: #fafafa; color: #374151; font-size: 11.5px; font-weight: 800; }
  .p-row { display: flex; justify-content: space-between; align-items: center; gap: 10px; padding: 9px 11px; border-bottom: 1px solid #f3f4f6; }
  .p-row:last-child { border-bottom: 0; }
  .p-user-wrap { display: flex; align-items: center; gap: 7px; min-width: 0; flex: 1 1 auto; }
  .p-avatar { width: 32px; height: 32px; border-radius: 999px; flex: 0 0 auto; object-fit: cover; background: #f3f4f6; border: 1px solid #e5e7eb; }
  .p-user { min-width: 0; flex: 1 1 auto; }
  .p-username { display: flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 800; }
  .p-fullname { color: #6b7280; font-size: 11px; margin-top: 2px; }
  .p-open { color: #2563eb; text-decoration: none; font-size: 11.5px; font-weight: 800; }
  .p-badge { width: 14px; height: 14px; display: inline-flex; align-items: center; justify-content: center; border-radius: 999px; background: #0095f6; color: white; font-size: 9.5px; font-weight: 900; }
  .p-footer { padding: 11px 17px 10px; border-top: 1px solid #f3f4f6; color: #6b7280; font-size: 10.5px; line-height: 1.45; background: #fff; }
  .p-copyright { margin-top: 7px; padding-top: 7px; border-top: 1px dashed #e5e7eb; text-align: center; color: #4b5563; font-size: 10px; font-weight: 700; }
  .p-copyright a { color: #2563eb; text-decoration: none; font-weight: 850; }
</style>
</head>
<body>
<div class="bg"></div>
<div class="layout">

  <div class="left">
    <p class="eyebrow">${t.eyebrow}</p>
    <h1>${t.h1}</h1>
    <p class="hero-text">${t.text}</p>
    <div class="hero-actions">
      <div class="btn btn-primary">${t.download}</div>
      <div class="btn btn-secondary">${t.github}</div>
    </div>
    <div class="certificates">
      <div class="cert cert-dark">
        <span class="cert-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span>
        <span class="cert-label">${t.certNoPassword}</span>
        <small>${t.certNoPasswordSub}</small>
      </div>
      <div class="cert cert-blue">
        <span class="cert-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></span>
        <span class="cert-label">${t.certLocal}</span>
        <small>${t.certLocalSub}</small>
      </div>
      <div class="cert cert-light">
        <span class="cert-icon">MIT</span>
        <span class="cert-label">${t.certOpen}</span>
        <small>${t.certOpenSub}</small>
      </div>
    </div>
  </div>

  <div class="panel">
    <div class="p-header">
      <div>
        <p class="p-title">IG MutualCheck</p>
        <div class="p-subtitle">${t.account}</div>
      </div>
      <div class="p-header-right">
        <div class="p-lang">
          <img class="p-flag" src="data:image/svg+xml;base64,${t.flag}" alt="" />
          <span>${t.langCode}</span>
        </div>
        <div class="p-close">×</div>
      </div>
    </div>
    <div class="p-body">
      <div class="p-actions">
        <div class="p-btn p-btn-primary">${t.analyze}</div>
        <div class="p-btn p-btn-danger">${t.cancel}</div>
        <div class="p-btn p-btn-secondary">${t.copy}</div>
        <div class="p-btn p-btn-secondary">${t.export}</div>
      </div>
      <div class="p-status">${t.status}</div>
      <div class="p-metrics">
        <div class="p-metric"><div class="p-metric-value">231</div><div class="p-metric-label">${t.followers}</div></div>
        <div class="p-metric"><div class="p-metric-value">243</div><div class="p-metric-label">${t.following}</div></div>
        <div class="p-metric"><div class="p-metric-value">12</div><div class="p-metric-label">${t.notFollowing}</div></div>
      </div>
      <div class="p-filter-grid">
        <input class="p-search" placeholder="${t.search}" readonly />
        <select class="p-select" disabled><option>${t.contains}</option></select>
        <select class="p-select" disabled><option>${t.all}</option></select>
      </div>
      <div class="p-filter-tools">
        <span>${t.showing}</span>
        <button class="p-link-btn">${t.clear}</button>
      </div>
      <div class="p-selection">
        <div class="p-sel-row">
          <label class="p-check-label"><input class="p-checkbox" type="checkbox" checked /> ${t.selectAll}</label>
          <span class="p-sel-count">${t.selected}</span>
        </div>
        <div>
          <div class="p-speed-label">${t.speed}</div>
          <div class="p-speed-toggle">
            <div class="p-speed-card active">
              <span class="p-speed-name">${t.balanced}</span>
              <small class="p-speed-hint">${t.balancedHint}</small>
            </div>
            <div class="p-speed-card">
              <span class="p-speed-name">${t.fast}</span>
              <small class="p-speed-hint">${t.fastHint}</small>
            </div>
          </div>
        </div>
        <div class="p-btn p-btn-danger p-unfollow-btn">${t.unfollow}</div>
      </div>
      <div class="p-list-box">
        <div class="p-list-header">
          <span>${t.detected}</span><span>${t.listSelected}</span>
        </div>
        <div class="p-row">
          <div class="p-user-wrap">
            <input class="p-checkbox" type="checkbox" checked />
            <img class="p-avatar" src="${avatar1}" alt="" />
            <div class="p-user">
              <div class="p-username"><span>${t.user1}</span><span class="p-badge">✓</span></div>
              <div class="p-fullname">${t.name1}</div>
            </div>
          </div>
          <a class="p-open" href="#">${t.open}</a>
        </div>
        <div class="p-row">
          <div class="p-user-wrap">
            <input class="p-checkbox" type="checkbox" checked />
            <img class="p-avatar" src="${avatar2}" alt="" />
            <div class="p-user">
              <div class="p-username"><span>${t.user2}</span><span class="p-badge">✓</span></div>
              <div class="p-fullname">${t.name2}</div>
            </div>
          </div>
          <a class="p-open" href="#">${t.open}</a>
        </div>
      </div>
    </div>
    <div class="p-footer">
      ${t.footer}
      <div class="p-copyright">© 2026 Juan Diego Castellanos · <a href="#">github.com/juandiegoc30</a></div>
    </div>
  </div>

</div>
</body>
</html>`;
}

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  for (const t of variants) {
    const page = await browser.newPage();
    await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 });
    await page.setContent(buildHtml(t), { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    const outputPath = path.resolve(__dirname, '../assets', t.output);
    await page.screenshot({ path: outputPath, type: 'png', clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT } });
    await page.close();
    console.log('Saved', outputPath);
  }
  await browser.close();
})();
