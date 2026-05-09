module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { url } = req.body || {};

  const prompt = `Du er en vareanalyse-assistent for danskevarer.dk. Brugeren har indtastet: "${url}"

VIGTIGT: Denne hjemmeside handler KUN om fysiske produkter og butikker der sælger varer. 
Hvis inputtet er en person, en læge, en advokat, en service, en blog, en nyhedsside, en organisation eller noget andet der ikke sælger fysiske produkter - returner dette JSON og intet andet:
{"error": "not_a_product"}

Accepter KUN: produktnavne (fx iPhone, Nike sko, LEGO), mærkenavne der sælger fysiske varer (fx Nike, IKEA, Arla), eller links til webshops og produktsider.

Hvis inputtet er gyldigt, returner KUN JSON (ingen backticks):
{
  "brand": "det primære og mest kendte navn på mærket - kort",
  "brandCountry": "ét land hvor mærket er grundlagt, på dansk",
  "productionCountry": "maks 3-4 ord om produktionssted",
  "productionRegion": "DK hvis kun Danmark, EU hvis kun Europa, WORLD hvis udenfor Europa, MIXED hvis både europæisk og ikke-europæisk - kun for brands/butikker generelt",
  "mixedNote": "kun udfyldt hvis MIXED - kort forklaring på dansk",
  "category": "produktkategori på dansk",
  "flag": "flag-emoji for produktionslandet - ved MIXED brug 🌍",
  "siteScore": HELTAL 1-5. Store kendte mærker Nike Apple LEGO IKEA HM Zara Adidas Samsung Elgiganten Power Arla = 5. Mellemstore = 4. Mindre kendte = 3. Ukendte = 2. Mistænkelige = 1,
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
    const parsed = JSON.parse(text);

    if (parsed.error === 'not_a_product') {
      return res.status(200).json({ error: 'not_a_product' });
    }

    res.status(200).json(parsed);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
