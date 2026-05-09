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

Accepter KUN: produktnavne, mærker der sælger fysiske varer, eller links til webshops og produktsider.

REGLER FOR productionRegion - vær simpel og direkte:
- "DK" = produceres primært i Danmark
- "EU" = produceres primært i Europa (brug dette hvis det meste af produktionen er europæisk, selvom der kan være undtagelser)
- "WORLD" = produceres primært udenfor Europa
- "MIXED" = brug KUN dette hvis produktionen er nogenlunde ligeligt fordelt mellem Europa og resten af verden (fx H&M, Zara, Nike). ALDRIG for brands der primært producerer ét sted.

REGLER FOR productionCountry - vær kort og præcis:
- Skriv det primære produktionsland eller region. Maks 3-4 ord.
- Ingen lange forklaringer eller undtagelser - det hører hjemme i analysis feltet.

Returner KUN JSON (ingen backticks):
{
  "brand": "mærkets primære navn",
  "brandCountry": "ét land hvor mærket er grundlagt, på dansk",
  "productionCountry": "primært produktionsland, maks 3-4 ord",
  "productionRegion": "DK, EU, WORLD eller MIXED (MIXED bruges meget sjældent)",
  "mixedNote": "kun hvis MIXED - én kort sætning på dansk",
  "category": "produktkategori på dansk",
  "flag": "flag-emoji for primært produktionsland, ved MIXED brug 🌍",
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
