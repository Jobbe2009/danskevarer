module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { url } = req.body || {};

  const prompt = `Du er en vareanalyse-assistent for danskevarer.dk. Brugeren har indtastet: "${url}"

Søg på nettet for at finde præcise og faktuelle oplysninger om dette produkt eller mærke, særligt hvor det produceres.

REGLER FOR productionRegion:
- Hvis input er et SPECIFIKT PRODUKT eller PRODUKTLINK: find præcist hvor den type produkt produceres og sæt DK, EU eller WORLD. Brug ALDRIG MIXED for specifikke produkter.
- Hvis input er et BRAND eller BUTIK uden specifikt produkt: brug MIXED hvis de producerer i både Europa og udenfor Europa.
- EU betyder KUN EU-lande plus Norge, Schweiz, Island, Ukraine og Belarus. Rusland regnes altid som WORLD uanset geografi.

REGLER FOR brand og brandCountry:
- Skriv kun det mest kendte/primære navn på mærket - ikke en lang forklaring med ejerforhold i parentes.
- brandCountry skal være ét land - det land mærket primært er grundlagt i. Ved tvivl vælg det mest kendte ophav.

REGLER FOR productionCountry:
- Maks 3-4 ord. Fx "Polen", "Polen og Rumænien", "Primært Bangladesh", "Kina og Vietnam".
- Aldrig en hel sætning eller forklaring her - det er en overskrift ikke en beskrivelse.
- Eventuelle forklaringer hører hjemme i mixedNote eller analysis.

Returner KUN JSON (ingen backticks):
{
  "brand": "det primære og mest kendte navn på mærket - kort",
  "brandCountry": "ét land hvor mærket er grundlagt, på dansk",
  "productionCountry": "maks 3-4 ord om produktionssted",
  "productionRegion": "DK hvis kun Danmark, EU hvis kun Europa ekskl. Rusland, WORLD hvis udenfor Europa eller Rusland, MIXED hvis både europæisk og ikke-europæisk - kun for brands/butikker generelt",
  "mixedNote": "kun udfyldt hvis MIXED - kort forklaring på dansk fx 'Produceres primært i Asien, men også i Europa'",
  "category": "produktkategori på dansk",
  "flag": "flag-emoji for produktionslandet - ved MIXED brug 🌍",
  "siteScore": HELTAL 1-5. Kendte store mærker Nike Apple LEGO IKEA HM Zara Adidas Samsung Elgiganten Power Arla = 5. Mellemstore = 4. Mindre kendte = 3. Ukendte = 2. Mistænkelige = 1,
  "analysis": "2-3 sætninger på dansk om virksomhedens oprindelse, produktion og bæredygtighed - baseret på hvad du fandt ved søgning",
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
        max_tokens: 1000,
        tools: [
          {
            type: 'web_search_20250305',
            name: 'web_search',
          }
        ],
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const data = await r.json();
    const text = data.content
      .map(item => item.type === 'text' ? item.text : '')
      .filter(Boolean)
      .join('')
      .replace(/```json|```/g, '')
      .trim();
    res.status(200).json(JSON.parse(text));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
