export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { url } = req.body || {};

  const prompt = `Du er en vareanalyse-assistent for danskevarer.dk. Produktlink: "${url}"\n\nReturner KUN JSON (ingen backticks):\n{\n  "brand": "navn",\n  "brandCountry": "land",\n  "productionCountry": "land",\n  "productionRegion": "DK eller EU eller WORLD",\n  "category": "kategori paa dansk",\n  "flag": "flag emoji",\n  "siteScore": 85,\n  "siteScoreLabel": "Trovaerdig",\n  "analysis": "2-3 saetninger paa dansk",\n  "tags": ["tag1", "tag2"]\n}`;

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
    return res.status(200).json(JSON.parse(text));
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
