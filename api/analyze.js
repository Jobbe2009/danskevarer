module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { url } = req.body || {};

  const prompt = `Du er en vareanalyse-assistent for danskevarer.dk. Brugeren har indtastet: "${url}"

REGLER FOR productionRegion:
- Hvis input er et SPECIFIKT PRODUKT eller PRODUKTLINK: find præcist hvor den type produkt produceres og sæt DK, EU eller WORLD. Brug ALDRIG MIXED for specifikke produkter.
- Hvis input er et BRAND eller BUTIK uden specifikt produkt: brug MIXED hvis de producerer i både Europa og udenfor Europa.

Returner KUN JSON (ingen backticks):
{
  "brand": "virksomhedens navn",
  "brandCountry": "landet hvor virksomheden er grundlagt, på dansk",
  "productionCountry": "beskriv præcist hvor produktet produceres, fx 'Kina', 'Danmark', 'Vietnam og Kina', 'Globalt - primært Asien' osv.",
  "productionRegion": "DK hvis kun Danmark, EU hvis kun Europa, WORLD hvis kun udenfor Europa, MIXED hvis både europæisk og ikke-europæisk - kun for brands/butikker generelt",
  "mixedNote": "kun udfyldt hvis MIXED - kort forklaring på dansk fx 'Produceres primært i Asien, men også i Europa'",
  "category": "produktkategori på dansk",
  "flag": "flag-emoji for produktionslandet - ved MIXED brug 🌍",
  "siteScore": HELTAL 1-5. Kendte store mærker Nike Apple LEGO IKEA HM Zara Adidas Samsung Elgiganten Power Arla = 5. Mellemstore = 4. Mindre kendte = 3. Ukendte = 2. Mistænkelige = 1,
  "analysis": "2-3 sætninger på dansk om virksomhedens oprindelse, produktion og bæredygtighed",
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
    res.status(200).json(JSON.parse(text));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
