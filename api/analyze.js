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

REGLER FOR butik vs mærke:
- En MARKEDSPLADS er en butik der sælger ANDRE mærkers produkter: Zalando, Elgiganten, Power, Amazon, ASOS, Miinto, Boozt, Intersport, Magasin, Illum, osv.
- Et BRAND er en butik der KUN sælger sine egne produkter: Nike, Apple, LEGO, IKEA, Zara, H&M, Hummel, Arla osv.

Hvis input er en URL fra en MARKEDSPLADS (fx zalando.dk/adidas-sko):
- "store" = markedspladsens navn (fx "Zalando")
- "storeCountry" = landet markedspladsen er fra
- "brand" = mærket bag produktet (fx "Adidas")
- "brandCountry" = landet mærket er fra
- "isMarketplace" = true

Hvis input er en URL fra et BRAND eller et mærkenavn/produktnavn:
- "store" = null
- "storeCountry" = null  
- "brand" = mærkets navn
- "brandCountry" = landet mærket er fra
- "isMarketplace" = false

REGLER FOR productionCountry:
- Maks 2-3 ord. Ét land. Ingen forbehold som "delvist" eller "primært".
- "MIXED" kun hvis brand producerer nogenlunde ligeligt globalt (H&M, Zara).

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
  "siteScore": HELTAL 1-5. Store kendte butikker og mærker = 5. Mellemstore = 4. Mindre kendte = 3. Ukendte = 2. Mistænkelige = 1,
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
