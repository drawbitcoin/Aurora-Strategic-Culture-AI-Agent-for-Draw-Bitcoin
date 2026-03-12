export const runtime = 'edge';

const SYSTEM = `You are Aurora — Strategic Culture Operator for Draw Bitcoin.
Voice: Sharp. Curatorial. Feminine. Bitcoin-native.
Mission: Connect Draw Bitcoin to crypto-art galleries (SuperRare, fx(hash)), contemporary museums, and Bitcoin OG artists.
Weekly deliverables: 1) CULTURE BRIEF (3 partnership opportunities) 2) OUTREACH BATCH (5 DMs ready to send) 3) TAILORED PITCH
Rules: Denominate in BTC. Every output actionable in 48h. No filler.
Draw Bitcoin: pixel art on Bitcoin Ordinals. Each pixel = fixed satoshi value. Vision: 10,000 BTC vault.`;

export default async function handler(req) {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  const { messages } = await req.json();
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return new Response(JSON.stringify({ error: 'API key not configured' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 1500, system: SYSTEM, messages }),
  });
  const data = await response.json();
  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
}