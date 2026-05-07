# danskevarer
<!DOCTYPE html>
<html lang="da">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>danskevarer.dk — Kender du varen bag din vare?</title>
<meta name="description" content="Tjek om dit produkt er dansk, europæisk eller produceret udenfor EU. Handel bevidst og bæredygtigt."/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Source+Sans+3:wght@400;500;600&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css"/>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Source Sans 3', sans-serif;
    background: #f7f5f0;
    color: #1a1a18;
    min-height: 100vh;
  }

  /* HEADER */
  .dv-header {
    background: #1a3a2a;
    padding: 0 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 56px;
    border-bottom: 3px solid #2d6a47;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .dv-logo {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    color: #e8f5ee;
    letter-spacing: -0.5px;
    text-decoration: none;
  }
  .dv-logo span { color: #5ecf8a; }
  .dv-nav { display: flex; gap: 1.5rem; font-size: 13px; color: #9abfac; }
  .dv-nav a { color: #9abfac; text-decoration: none; }
  .dv-nav a:hover { color: #e8f5ee; }

  /* HERO */
  .dv-hero {
    background: linear-gradient(160deg, #1a3a2a 0%, #0d2419 100%);
    padding: 3rem 2rem 2.5rem;
    text-align: center;
  }
  .dv-hero h1 {
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    color: #e8f5ee;
    margin-bottom: 8px;
    line-height: 1.2;
  }
  .dv-hero p { color: #8fbfaa; font-size: 15px; margin-bottom: 1.8rem; }

  .dv-search-box {
    background: #fff;
    border-radius: 12px;
    padding: 6px 6px 6px 16px;
    display: flex;
    align-items: center;
    max-width: 640px;
    margin: 0 auto 1rem;
    border: 2px solid #2d6a47;
    box-shadow: 0 4px 24px rgba(0,0,0,0.2);
    gap: 8px;
  }
  .dv-search-box input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 14px;
    color: #1a1a18;
    font-family: 'Source Sans 3', sans-serif;
    background: transparent;
  }
  .dv-search-box input::placeholder { color: #aaa; }
  .dv-search-btn {
    background: #2d6a47;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Source Sans 3', sans-serif;
    white-space: nowrap;
    transition: background 0.15s;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .dv-search-btn:hover { background: #3a8558; }
  .dv-search-btn:disabled { background: #aaa; cursor: not-allowed; }

  .dv-examples {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
    max-width: 640px;
    margin: 0 auto;
  }
  .dv-ex-pill {
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.15);
    color: #b8d9c4;
    border-radius: 20px;
    padding: 5px 14px;
    font-size: 12px;
    cursor: pointer;
    transition: background 0.15s;
  }
  .dv-ex-pill:hover { background: rgba(255,255,255,0.15); color: #e8f5ee; }

  /* MAIN LAYOUT */
  .dv-main {
    max-width: 960px;
    margin: 0 auto;
    padding: 2rem 1rem;
    display: grid;
    grid-template-columns: 1fr 230px;
    gap: 1.5rem;
    align-items: start;
  }

  /* LOADING */
  .dv-loading {
    background: #fff;
    border-radius: 12px;
    padding: 2.5rem;
    border: 1px solid #e0ddd5;
    text-align: center;
    color: #666;
    font-size: 14px;
    display: none;
  }
  .dv-spinner {
    width: 36px; height: 36px;
    border: 3px solid #e0ddd5;
    border-top-color: #2d6a47;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 1rem;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* RESULT CARD */
  .dv-result-card {
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #e0ddd5;
    display: none;
    animation: fadeIn 0.4s ease forwards;
  }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

  .dv-result-banner {
    padding: 1.2rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .dv-result-banner.dk { background: #eaf6f0; border-bottom: 3px solid #2d9b5a; }
  .dv-result-banner.eu { background: #fefbea; border-bottom: 3px solid #c9a520; }
  .dv-result-banner.world { background: #fef0ec; border-bottom: 3px solid #d45a30; }

  .dv-flag { font-size: 28px; }
  .dv-origin-label { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.8px; }
  .dv-origin-val { font-family: 'Playfair Display', serif; font-size: 20px; color: #1a1a18; }
  .dv-origin-badge {
    margin-left: auto;
    border-radius: 20px;
    padding: 6px 16px;
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
  }
  .dk .dv-origin-badge { background: #2d9b5a; color: #fff; }
  .eu .dv-origin-badge { background: #c9a520; color: #fff; }
  .world .dv-origin-badge { background: #d45a30; color: #fff; }

  .dv-result-body { padding: 1.5rem; }

  .dv-grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 1.2rem;
  }
  .dv-stat { background: #f7f5f0; border-radius: 8px; padding: 10px 12px; }
  .dv-stat-label { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
  .dv-stat-val { font-size: 15px; font-weight: 600; color: #1a1a18; }

  .dv-score-row {
    display: flex;
    align-items: center;
    gap: 12px;
    background: #f7f5f0;
    border-radius: 8px;
    padding: 12px 16px;
    margin-bottom: 1.2rem;
  }
  .dv-score-num { font-family: 'Playfair Display', serif; font-size: 32px; color: #1a1a18; min-width: 60px; }
  .dv-score-bar-wrap { flex: 1; }
  .dv-score-label { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; }
  .dv-score-bar-bg { height: 8px; background: #e0ddd5; border-radius: 4px; overflow: hidden; }
  .dv-score-bar-fill { height: 100%; border-radius: 4px; width: 0%; transition: width 1s ease; }
  .score-high .dv-score-bar-fill { background: #2d9b5a; }
  .score-mid .dv-score-bar-fill { background: #c9a520; }
  .score-low .dv-score-bar-fill { background: #d45a30; }
  .dv-score-text { font-size: 13px; color: #555; white-space: nowrap; }

  .dv-analysis { font-size: 14px; line-height: 1.7; color: #333; margin-bottom: 1.2rem; }

  .dv-tags { display: flex; flex-wrap: wrap; gap: 6px; }
  .dv-tag { background: #eaf6f0; color: #1a5c35; border-radius: 4px; padding: 3px 10px; font-size: 12px; }
  .dv-tag.warn { background: #fef0ec; color: #7a2e14; }

  /* PLACEHOLDER */
  .dv-placeholder {
    background: #fff;
    border-radius: 12px;
    padding: 3rem 1.5rem;
    border: 1px dashed #c8c4bb;
    text-align: center;
  }
  .dv-placeholder-icon { font-size: 42px; margin-bottom: 12px; opacity: 0.35; }
  .dv-placeholder h3 { font-size: 15px; color: #555; font-weight: 500; margin-bottom: 6px; }
  .dv-placeholder p { font-size: 13px; color: #999; line-height: 1.6; max-width: 320px; margin: 0 auto; }

  /* SIDEBAR */
  .dv-ad-card, .dv-suggest-card {
    background: #fff;
    border-radius: 12px;
    padding: 1rem;
    border: 1px solid #e0ddd5;
    margin-bottom: 1rem;
  }
  .dv-ad-label, .dv-suggest-title {
    font-size: 10px;
    color: #aaa;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 10px;
    font-weight: 600;
  }
  .dv-ad-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.1s;
    margin-bottom: 2px;
    text-decoration: none;
  }
  .dv-ad-item:hover { background: #f7f5f0; }
  .dv-ad-icon {
    width: 36px; height: 36px;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }
  .dv-ad-name { font-size: 13px; font-weight: 600; color: #1a1a18; }
  .dv-ad-sub { font-size: 11px; color: #888; }
  .dv-ad-badge {
    margin-left: auto;
    font-size: 10px;
    border-radius: 3px;
    padding: 2px 7px;
    font-weight: 600;
    flex-shrink: 0;
  }
  .badge-dk { background: #eaf6f0; color: #1a5c35; }
  .badge-eu { background: #fefbea; color: #7a5c00; }

  .dv-suggest-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 7px 0;
    border-bottom: 1px solid #f0ede6;
    font-size: 13px;
    color: #333;
    cursor: pointer;
    transition: color 0.1s;
  }
  .dv-suggest-item:last-child { border-bottom: none; }
  .dv-suggest-item:hover { color: #2d6a47; }
  .dv-suggest-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .dot-dk { background: #2d9b5a; }
  .dot-eu { background: #c9a520; }
  .dot-world { background: #d45a30; }

  /* INFO STRIP */
  .dv-info-strip {
    background: #fff;
    border-top: 1px solid #e0ddd5;
    border-bottom: 1px solid #e0ddd5;
    padding: 1.5rem 2rem;
    display: flex;
    justify-content: center;
    gap: 3rem;
    flex-wrap: wrap;
    margin-top: 1rem;
  }
  .dv-info-item { text-align: center; }
  .dv-info-icon { font-size: 24px; margin-bottom: 4px; }
  .dv-info-title { font-size: 13px; font-weight: 600; color: #1a1a18; }
  .dv-info-desc { font-size: 12px; color: #888; }

  /* FOOTER */
  .dv-footer {
    background: #1a3a2a;
    padding: 2rem;
    text-align: center;
    color: #5a8a6e;
    font-size: 12px;
    margin-top: 1rem;
  }
  .dv-footer a { color: #8fbfaa; text-decoration: none; margin: 0 0.5rem; }
  .dv-footer a:hover { color: #e8f5ee; }
  .dv-footer-logo {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    color: #e8f5ee;
    margin-bottom: 8px;
  }
  .dv-footer-logo span { color: #5ecf8a; }

  /* RESPONSIVE */
  @media (max-width: 680px) {
    .dv-main { grid-template-columns: 1fr; }
    .dv-sidebar { display: none; }
    .dv-hero h1 { font-size: 24px; }
    .dv-grid-3 { grid-template-columns: repeat(2, 1fr); }
    .dv-info-strip { gap: 1.5rem; }
  }

  /* API KEY BANNER */
  .dv-api-banner {
    background: #fefbea;
    border: 1px solid #c9a520;
    border-radius: 8px;
    padding: 10px 16px;
    font-size: 13px;
    color: #7a5c00;
    margin-bottom: 1rem;
    display: none;
    align-items: center;
    gap: 8px;
  }
</style>
</head>
<body>

<header class="dv-header">
  <a href="/" class="dv-logo">danske<span>varer</span>.dk</a>
  <nav class="dv-nav">
    <a href="#">Om os</a>
    <a href="#">Kategorier</a>
    <a href="#">Blog</a>
  </nav>
</header>

<section class="dv-hero">
  <h1>Kender du varen bag din vare?</h1>
  <p>Indsæt et produktlink — vi fortæller dig om oprindlsesland, mærke og sikkerhed</p>
  <div class="dv-search-box">
    <i class="ti ti-link" style="font-size:18px;color:#aaa;"></i>
    <input type="text" id="urlInput" placeholder="Indsæt produktlink her, fx https://www.elgiganten.dk/produkt/..." />
    <button class="dv-search-btn" id="checkBtn" onclick="checkProduct()">
      Tjek varen <i class="ti ti-arrow-right"></i>
    </button>
  </div>
  <div class="dv-examples">
    <div class="dv-ex-pill" onclick="fillExample('https://www.nike.com/dk/t/air-max-270-sko')">👟 Nike Air Max</div>
    <div class="dv-ex-pill" onclick="fillExample('https://www.ikea.com/dk/da/p/kallax-reol-hvid/')">🪑 IKEA Kallax</div>
    <div class="dv-ex-pill" onclick="fillExample('https://www.hummel.dk/products/hummel-core-t-shirt')">🇩🇰 Hummel T-shirt</div>
    <div class="dv-ex-pill" onclick="fillExample('https://www.apple.com/dk/shop/buy-iphone/iphone-15')">📱 iPhone 15</div>
    <div class="dv-ex-pill" onclick="fillExample('https://www.ecco.com/dk/dk/sneakers')">👞 ECCO Sneakers</div>
    <div class="dv-ex-pill" onclick="fillExample('https://www.lego.com/dk-dk/themes/city')">🧱 LEGO City</div>
  </div>
</section>

<div class="dv-info-strip">
  <div class="dv-info-item">
    <div class="dv-info-icon">🇩🇰</div>
    <div class="dv-info-title">Dansk produceret</div>
    <div class="dv-info-desc">Støt lokal produktion</div>
  </div>
  <div class="dv-info-item">
    <div class="dv-info-icon">🌱</div>
    <div class="dv-info-title">Bæredygtigt forbrug</div>
    <div class="dv-info-desc">Kortere transportruter</div>
  </div>
  <div class="dv-info-item">
    <div class="dv-info-icon">🔒</div>
    <div class="dv-info-title">Sikkerhedstjek</div>
    <div class="dv-info-desc">Troværdighed vurderet</div>
  </div>
  <div class="dv-info-item">
    <div class="dv-info-icon">🤖</div>
    <div class="dv-info-title">AI-drevet analyse</div>
    <div class="dv-info-desc">Øjeblikkelig indsigt</div>
  </div>
</div>

<div class="dv-main">
  <div class="dv-result-area">

    <div class="dv-api-banner" id="apiBanner">
      <i class="ti ti-alert-triangle" style="font-size:16px;"></i>
      <span>Husk at indsætte din Anthropic API-nøgle i koden (se kommentar øverst i &lt;script&gt;-tagget)</span>
    </div>

    <div class="dv-loading" id="loadingBox">
      <div class="dv-spinner"></div>
      <div style="font-size:15px;color:#333;margin-bottom:4px;">AI-assistent analyserer produktet...</div>
      <div style="font-size:12px;color:#aaa;">Vent venligst et øjeblik</div>
    </div>

    <div class="dv-result-card" id="resultCard">
      <div class="dv-result-banner" id="resultBanner">
        <div class="dv-flag" id="flagEmoji"></div>
        <div>
          <div class="dv-origin-label">Produktionslandet</div>
          <div class="dv-origin-val" id="originCountry"></div>
        </div>
        <div class="dv-origin-badge" id="originBadge"></div>
      </div>
      <div class="dv-result-body">
        <div class="dv-grid-3">
          <div class="dv-stat">
            <div class="dv-stat-label">Mærke</div>
            <div class="dv-stat-val" id="brandName"></div>
          </div>
          <div class="dv-stat">
            <div class="dv-stat-label">Mærkeland</div>
            <div class="dv-stat-val" id="brandCountry"></div>
          </div>
          <div class="dv-stat">
            <div class="dv-stat-label">Kategori</div>
            <div class="dv-stat-val" id="productCat"></div>
          </div>
        </div>

        <div class="dv-score-row" id="scoreRow">
          <div class="dv-score-num" id="scoreNum"></div>
          <div class="dv-score-bar-wrap">
            <div class="dv-score-label">Sikkerhedsscore for butikken</div>
            <div class="dv-score-bar-bg">
              <div class="dv-score-bar-fill" id="scoreBar"></div>
            </div>
          </div>
          <div class="dv-score-text" id="scoreText"></div>
        </div>

        <div class="dv-analysis" id="analysisText"></div>
        <div class="dv-tags" id="tagBox"></div>
      </div>
    </div>

    <div class="dv-placeholder" id="placeholder">
      <div class="dv-placeholder-icon">🔍</div>
      <h3>Indsæt et produktlink ovenfor</h3>
      <p>Vi analyserer om varen er dansk, europæisk eller produceret andre steder i verden — så du kan handle bevidst og bæredygtigt.</p>
    </div>

  </div>

  <aside class="dv-sidebar">
    <div class="dv-ad-card">
      <div class="dv-ad-label">Anbefalede danske varer</div>
      <a class="dv-ad-item" href="https://www.madsnorgaard.dk" target="_blank">
        <div class="dv-ad-icon" style="background:#eaf6f0;">🧦</div>
        <div>
          <div class="dv-ad-name">Mads Nørgaard</div>
          <div class="dv-ad-sub">Striper & basics</div>
        </div>
        <div class="dv-ad-badge badge-dk">DK</div>
      </a>
      <a class="dv-ad-item" href="https://www.samsoe.com" target="_blank">
        <div class="dv-ad-icon" style="background:#eaf6f0;">👗</div>
        <div>
          <div class="dv-ad-name">Samsøe Samsøe</div>
          <div class="dv-ad-sub">Dansk design</div>
        </div>
        <div class="dv-ad-badge badge-dk">DK</div>
      </a>
      <a class="dv-ad-item" href="https://www.bang-olufsen.com" target="_blank">
        <div class="dv-ad-icon" style="background:#eaf6f0;">🎵</div>
        <div>
          <div class="dv-ad-name">Bang & Olufsen</div>
          <div class="dv-ad-sub">Dansk lyd & design</div>
        </div>
        <div class="dv-ad-badge badge-dk">DK</div>
      </a>
      <a class="dv-ad-item" href="https://www.hay.dk" target="_blank">
        <div class="dv-ad-icon" style="background:#fefbea;">🪑</div>
        <div>
          <div class="dv-ad-name">HAY</div>
          <div class="dv-ad-sub">Møbler & indretning</div>
        </div>
        <div class="dv-ad-badge badge-dk">DK</div>
      </a>
      <a class="dv-ad-item" href="https://www.ecco.com/dk" target="_blank">
        <div class="dv-ad-icon" style="background:#fefbea;">👟</div>
        <div>
          <div class="dv-ad-name">ECCO</div>
          <div class="dv-ad-sub">Dansk fodtøj</div>
        </div>
        <div class="dv-ad-badge badge-eu">EU</div>
      </a>
    </div>

    <div class="dv-suggest-card">
      <div class="dv-suggest-title">Populære tjek</div>
      <div class="dv-suggest-item" onclick="fillExample('https://www.samsung.com/dk/smartphones/galaxy-s24/')">
        <div class="dv-suggest-dot dot-world"></div>
        <span>Samsung Galaxy S24</span>
      </div>
      <div class="dv-suggest-item" onclick="fillExample('https://www.bang-olufsen.com/da/dk/speakers')">
        <div class="dv-suggest-dot dot-dk"></div>
        <span>Bang & Olufsen højtaler</span>
      </div>
      <div class="dv-suggest-item" onclick="fillExample('https://www.lego.com/dk-dk/themes/creator')">
        <div class="dv-suggest-dot dot-dk"></div>
        <span>Lego Creator set</span>
      </div>
      <div class="dv-suggest-item" onclick="fillExample('https://www2.hm.com/da_dk/index.html')">
        <div class="dv-suggest-dot dot-world"></div>
        <span>H&M vinterjakke</span>
      </div>
      <div class="dv-suggest-item" onclick="fillExample('https://www.hummel.dk')">
        <div class="dv-suggest-dot dot-dk"></div>
        <span>Hummel sportstøj</span>
      </div>
    </div>

    <div style="background:#f7f5f0;border-radius:12px;padding:1rem;text-align:center;font-size:12px;color:#888;border:1px dashed #c8c4bb;">
      <div style="font-size:20px;margin-bottom:6px;">📣</div>
      <div style="font-weight:600;color:#555;margin-bottom:4px;">Annoncér her</div>
      <div>Google AdSense reklame</div>
    </div>
  </aside>
</div>

<footer class="dv-footer">
  <div class="dv-footer-logo">danske<span>varer</span>.dk</div>
  <div style="margin-bottom:8px;">Handel bevidst. Støt lokalt. Tænk bæredygtigt.</div>
  <div>
    <a href="#">Om os</a>
    <a href="#">Privatlivspolitik</a>
    <a href="#">Kontakt</a>
    <a href="#">Annoncér</a>
  </div>
  <div style="margin-top:8px;">© 2026 danskevarer.dk — Alle rettigheder forbeholdes</div>
</footer>

<script>
  // ============================================================
  // VIGTIGT: Indsæt din Anthropic API-nøgle her:
  const ANTHROPIC_API_KEY = "DIN_API_NØGLE_HER";
  // Få din nøgle gratis på: https://console.anthropic.com
  // ============================================================

  window.onload = function() {
    if (ANTHROPIC_API_KEY === "DIN_API_NØGLE_HER") {
      document.getElementById('apiBanner').style.display = 'flex';
    }
  };

  function fillExample(url) {
    document.getElementById('urlInput').value = url;
    document.getElementById('urlInput').focus();
  }

  document.getElementById('urlInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') checkProduct();
  });

  async function checkProduct() {
    const url = document.getElementById('urlInput').value.trim();
    if (!url) {
      document.getElementById('urlInput').focus();
      return;
    }

    const btn = document.getElementById('checkBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="ti ti-loader" style="animation:spin 0.8s linear infinite;"></i> Analyserer...';

    document.getElementById('placeholder').style.display = 'none';
    document.getElementById('resultCard').style.display = 'none';
    document.getElementById('loadingBox').style.display = 'block';

    const prompt = `Du er en vareanalyse-assistent for hjemmesiden danskevarer.dk. En bruger har indsat dette produktlink: "${url}"

Analyser URL'en og returner KUN et JSON-objekt (ingen ekstra tekst, ingen markdown-backticks) med følgende felter:

{
  "brand": "Mærkets navn",
  "brandCountry": "Landet hvor mærket er stiftet/ejet",
  "productionCountry": "Landet hvor produktet typisk produceres",
  "productionRegion": "DK" eller "EU" eller "WORLD",
  "category": "Produktkategori på dansk (fx Sportstøj, Elektronik, Møbler, Legetøj...)",
  "flag": "ét enkelt flag-emoji for produktionslandet",
  "siteScore": et heltal 0-100 for butikkens troværdighed og sikkerhed,
  "siteScoreLabel": "Meget troværdig" eller "Troværdig" eller "Neutral" eller "Vær forsigtig",
  "analysis": "2-3 sætninger på dansk der forklarer oprindlsesland, produktion og eventuelle bæredygtighedsforhold",
  "tags": ["op til 6 korte nøgleord"]
}

Basér dit svar på din viden om mærket og domænet. Svar KUN med JSON.`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }]
        })
      });

      const data = await response.json();
      const text = data.content.map(i => i.text || "").join("").replace(/```json|```/g, "").trim();
      const result = JSON.parse(text);
      showResult(result);
    } catch (e) {
      document.getElementById('loadingBox').style.display = 'none';
      document.getElementById('placeholder').style.display = 'block';
      document.getElementById('placeholder').innerHTML = '<div class="dv-placeholder-icon">⚠️</div><h3>Kunne ikke analysere linket</h3><p>Tjek at din API-nøgle er korrekt indsat, og at linket er gyldigt.</p>';
    }

    btn.disabled = false;
    btn.innerHTML = 'Tjek varen <i class="ti ti-arrow-right"></i>';
  }

  function showResult(r) {
    document.getElementById('loadingBox').style.display = 'none';

    const region = r.productionRegion || 'WORLD';
    const banner = document.getElementById('resultBanner');
    banner.className = 'dv-result-banner ' + (region === 'DK' ? 'dk' : region === 'EU' ? 'eu' : 'world');

    document.getElementById('flagEmoji').textContent = r.flag || '🌍';
    document.getElementById('originCountry').textContent = r.productionCountry || 'Ukendt';

    const badge = document.getElementById('originBadge');
    if (region === 'DK') badge.textContent = '🇩🇰 Dansk vare';
    else if (region === 'EU') badge.textContent = '🇪🇺 EU-vare';
    else badge.textContent = '🌍 Udenfor EU';

    document.getElementById('brandName').textContent = r.brand || '—';
    document.getElementById('brandCountry').textContent = r.brandCountry || '—';
    document.getElementById('productCat').textContent = r.category || '—';

    const score = Math.round(r.siteScore) || 70;
    const scoreRow = document.getElementById('scoreRow');
    scoreRow.className = 'dv-score-row ' + (score >= 70 ? 'score-high' : score >= 40 ? 'score-mid' : 'score-low');
    document.getElementById('scoreNum').textContent = score + '/100';
    document.getElementById('scoreText').textContent = r.siteScoreLabel || '';
    setTimeout(() => { document.getElementById('scoreBar').style.width = score + '%'; }, 100);

    document.getElementById('analysisText').textContent = r.analysis || '';

    const tagBox = document.getElementById('tagBox');
    tagBox.innerHTML = '';
    (r.tags || []).forEach(tag => {
      const t = document.createElement('div');
      const isWarn = tag.toLowerCase().includes('kina') || tag.toLowerCase().includes('risiko') || tag.toLowerCase().includes('bangladesh');
      t.className = 'dv-tag' + (isWarn ? ' warn' : '');
      t.textContent = tag;
      tagBox.appendChild(t);
    });

    const card = document.getElementById('resultCard');
    card.style.display = 'block';
    card.style.animation = 'none';
    void card.offsetHeight;
    card.style.animation = 'fadeIn 0.4s ease forwards';
  }
</script>
</body>
</html>
