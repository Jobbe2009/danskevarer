module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { url } = req.body || {};

  const prompt = `Du er en vareanalyse-assistent for danskevarer.dk. Brugeren har indtastet: "${url}"

VIGTIGT: Denne hjemmeside handler KUN om fysiske produkter og butikker der sælger varer.
Hvis inputtet er en person, læge, advokat, service, blog, nyhedsside, organisation eller noget der ikke sælger fysiske produkter - returner KUN:
{"error": "not_a_product"}

REGLER FOR productionRegion og productionCountry:
- Hvis input er et SPECIFIKT PRODUKT (fx "Nike Air Max 270", "iPhone 15 Pro", "LEGO Technic 42XXX"): find præcist hvor netop det produkt produceres og sæt DK, EU eller WORLD. productionCountry = det specifikke land.
- Hvis input er et BRAND eller GENERELT SØGEORD (fx "Golden Goose", "Nike", "IKEA sofa"): brug det PRIMÆRE produktionsland/region. Skriv kun ét land eller én region - ALDRIG "delvist", "primært", "nogle" eller lignende forbehold. Vælg det mest repræsentative.
- "MIXED" bruges KUN når et brand er 100% globalt og producerer nogenlunde ligeligt overalt - fx H&M, Zara. ALDRIG for brands der har ét primært produktionsland.

REGLER FOR productionCountry:
- Maks 2-3 ord. Ét land eller én region.
- ALDRIG tilføj "delvist", "primært", "og lidt", "nogle samlinger" eller lignende.
- Bare: "Italien", "Kina", "Danmark", "Vietnam" osv.

Returner KUN JSON (ingen backticks):
{
  "brand": "mærkets primære navn",
  "brandCountry": "ét land hvor mærket er grundlagt, på dansk",
  "productionCountry": "ét land eller én region, maks 2-3 ord, ingen forbehold",
  "productionRegion": "DK, EU, WORLD eller MIXED (MIXED meget sjældent)",
  "mixedNote": "kun hvis MIXED - én kort sætning på dansk",
  "category": "produktkategori på dansk",
  "flag": "flag-emoji for produktionslandet",
  "siteScore": HELTAL 1-5. Store kendte mærker Nike Apple LEGO IKEA HM Zara Adidas Samsung Elgiganten Power Arla = 5. Mellemstore kendte = 4. Mindre kendte = 3. Ukendte = 2. Mistænkelige = 1,
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
