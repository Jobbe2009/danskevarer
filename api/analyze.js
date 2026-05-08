module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { url } = req.body || {};

  const prompt = `Du er en vareanalyse-assistent for danskevarer.dk. Produktlink: "${url}"\n\nReturner KUN JSON (ingen backticks):\n{\n  "brand": "maerkets navn",\n  "brandCountry": "landet hvor maerket er grundlagt, paa dansk",\n  "productionCountry": "landet hvor produktet typisk produceres, paa dansk",\n  "productionRegion": "DK eller EU eller WORLD",\n  "category": "produktkategori paa dansk",\n  "flag": "flag-emoji for produktionslandet",\n  "siteScore": HELTAL 1-5 (Nike Apple LEGO Zara IKEA Arla og alle store kendte butikker = 5. Ukendte sider = 1-2),\n  "analysis": "2-3 saetninger paa dansk om maerke, produktion og baeredygtighed",\n  "tags": ["op til 5 korte noegleord paa dansk"]\n}`;

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
