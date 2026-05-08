module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { url } = req.body || {};

  const prompt = `Du er en vareanalyse-assistent for danskevarer.dk. Brugeren har indtastet: "${url}"

Inputtet kan være:
1. Et produktlink (fx https://www.nike.com/dk/t/air-max-270)
2. Et domæne eller hjemmeside (fx power.dk eller www.elgiganten.dk)
3. Et produktnavn eller søgeord (fx "iPhone 17 Pro", "Zara bukser", "LEGO Technic", "Nike Air Max")

Analyser inputtet og returner KUN JSON (ingen backticks, ingen ekstra tekst):
{
  "brand": "virksomhedens eller mærkets navn",
  "brandCountry": "landet hvor virksomheden/mærket er grundlagt, på dansk",
  "productionCountry": "landet hvor produktet/varerne typisk produceres, på dansk. Hvis ukendt skriv Ukendt",
  "productionRegion": "DK" hvis Danmark, "EU" hvis europæisk land (Sverige Norge Finland Island Tyskland Frankrig Italien Spanien Holland Belgien Polen Schweiz mv), "WORLD" hvis udenfor Europa (Kina USA Bangladesh Vietnam Indien Tyrkiet osv),
  "category": "produktkategori eller virksomhedstype på dansk",
  "flag": "flag-emoji for produktionslandet eller virksomhedens hjemland hvis produktion ukendt",
  "siteScore": HELTAL 1-5. Store kendte globale mærker og butikker som Nike Apple LEGO Zara IKEA Arla HM Adidas Samsung Sony Elgiganten Power Zalando og lignende = altid 5. Mellemstore kendte mærker = 4. Mindre kendte = 3. Ukendte = 2. Mistænkelige = 1,
  "analysis": "2-3 sætninger på dansk om virksomhedens oprindelse, hvor produkterne typisk produceres og eventuelle bæredygtighedsforhold",
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
