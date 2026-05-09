const https = require('https');
const http = require('http');

function fetchPage(url) {
  return new Promise((resolve) => {
    try {
      const client = url.startsWith('https') ? https : http;
      const req = client.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml',
          'Accept-Language': 'da-DK,da;q=0.9,en;q=0.8',
        },
        timeout: 5000
      }, (res) => {
        let data = '';
        res.on('data', chunk => { data += chunk; });
        res.on('end', () => {
          // Strip HTML tags and extract text
          const text = data
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .substring(0, 3000); // First 3000 chars
          resolve(text);
        });
      });
      req.on('error', () => resolve(null));
      req.on('timeout', () => { req.destroy(); resolve(null); });
    } catch(e) {
      resolve(null);
    }
  });
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { url } = req.body || {};

  // Try to fetch page content if it looks like a URL
  let pageContent = null;
  const isUrl = url && (url.startsWith('http') || url.includes('.'));
  if (isUrl) {
    const fullUrl = url.startsWith('http') ? url : 'https://' + url;
    pageContent = await fetchPage(fullUrl);
  }

  const pageContext = pageContent
    ? `\n\nHer er indholdet fra produktsiden (brug dette til at finde præcise oplysninger om produktet):\n${pageContent}`
    : '';

  const prompt = `Du er en vareanalyse-assistent for danskevarer.dk. Brugeren har indtastet: "${url}"${pageContext}

VIGTIGT: Denne hjemmeside handler KUN om fysiske produkter og butikker der sælger varer.
Hvis inputtet er en person, læge, advokat, service, blog, nyhedsside, organisation eller noget der ikke sælger fysiske produkter - returner KUN:
{"error": "not_a_product"}

REGLER FOR brand - MEGET VIGTIGT:
- Hvis inputtet er en URL: brand er ALTID butikkens/hjemmesidens navn fra domænet - IKKE produktnavnet i URL'en.
- Fx: "shopsauna.com/products/curve-tee" → brand = "Sauna"
- Fx: "lego.com/product/jurassic-park" → brand = "LEGO"
- En MARKEDSPLADS sælger ANDRE mærkers produkter: Zalando, Elgiganten, Power, Amazon, ASOS, Miinto, Boozt, Intersport, Magasin osv.

REGLER FOR productionCountry - brug sidens indhold hvis tilgængeligt:
- Hvis du kan se produktionsland i sidens indhold, brug det præcist.
- Ellers brug din bedste viden om det specifikke produkt.
- Maks 2-3 ord. Ét land. INGEN forbehold som "delvist" eller "primært".
- "MIXED" KUN hvis brand er et stort globalt brand der producerer nogenlunde ligeligt overalt.

Returner KUN JSON (ingen backticks):
{
  "isMarketplace": true eller false,
  "store": "markedspladsens navn eller null",
  "storeCountry": "markedspladsens hjemland på dansk eller null",
  "brand": "mærkets navn",
  "brandCountry": "mærkets hjemland på dansk",
  "productionCountry": "ét land, maks 2-3 ord",
  "productionRegion": "DK, EU, WORLD eller MIXED",
  "mixedNote": "kun hvis MIXED - én kort sætning",
  "category": "produktkategori på dansk",
  "flag": "flag-emoji for produktionslandet",
  "siteScore": HELTAL 1-5. Store kendte mærker og butikker = 5. Mellemstore = 4. Mindre kendte = 3. Ukendte = 2. Mistænkelige = 1,
  "analysis": "2-3 sætninger på dansk om mærkets oprindelse og produktion",
  "tags": ["op til 5 korte nøgleord på dansk"]
}`;

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 800,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const data = await r.json();
    const text = data.content[0].text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(text);
    if (parsed.error === 'not_a_product') {
      return res.status(200).json({ error: 'not_a_product' });
    }
    res.status(200).json(parsed);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
