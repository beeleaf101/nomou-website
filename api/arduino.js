export const config = { runtime: 'edge' };

export default async function handler(req) {
  const ARDUINO_URL = process.env.ARDUINO_URL;

  if (!ARDUINO_URL) {
    return new Response(JSON.stringify({ error: 'ARDUINO_URL not configured' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  const url = new URL(req.url);
  const path = url.searchParams.get('path') || '/api/current';

  try {
    const response = await fetch(`${ARDUINO_URL}${path}`, {
      signal: AbortSignal.timeout(5000),
    });
    const data = await response.text();

    return new Response(data, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Arduino offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}