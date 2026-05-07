export default async function handler(req, res) {
  // Allow requests from any origin (CORS)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'Missing URL' });
  }

  const prompt = `Du er en vareanalyse-assistent for hjemmesiden danskevarer.dk. En bruger har indsat dette produktlink: "${url}"

Analyser URL'en og returner KUN et JSON-objekt (ingen ekstra tekst, ingen markdown-backticks) med følgende felter:

{
  "brand": "Mærkets navn",
  "brandCountry": "Landet hvor mærket er stiftet/ejet",
  "productionCountry": "Landet hvor produktet typisk produceres",
  "productionRegion": "DK" eller "EU" eller "WORLD",
  "category": "Produktkategori på dansk (fx Sportstøj, Elektronik, Møbler, Legetøj...)",
  "flag": "ét enkelt flag-emoji for produktionslandet",
  "siteScore": et heltal 0-100 for butikkens troværdighed og sikkerhed,
  "siteScoreLabel": "Meget troværdig" eller "Troværdig" eller "Neutral" eller "Vær forsigtig",
  "analysis": "2-3 sætninger på dansk der forklarer oprindlsesland, produktion og eventuelle bæredygtighedsforhold",
  "tags": ["op til 6 korte nøgleord"]
}

Basér dit svar på din viden om mærket og domænet. Svar KUN med JSON.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: 'API error', details: data });
    }

    const text = data.content.map(i => i.text || '').join('').replace(/```json|```/g, '').trim();
    const result = JSON.parse(text);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to analyze', details: err.message });
  }
}
