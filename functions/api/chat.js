/**
 * Cloudflare Pages Function: /api/chat
 *
 * Proxies requests to DeepSeek API.
 * The DEEPSEEK_API_KEY is stored as a Cloudflare Pages environment variable
 * (secret) — never exposed to the browser.
 *
 * Expected request body (JSON):
 *   { system: string, user: string, maxTokens?: number }
 *
 * Returns:
 *   { text: string }
 */

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const MODEL = 'deepseek-chat';

export async function onRequestPost(context) {
  const { request, env } = context;

  // ── CORS headers (allow your own domain only in production) ──
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  try {
    const apiKey = env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'DEEPSEEK_API_KEY environment variable not set' }),
        { status: 500, headers: corsHeaders }
      );
    }

    const body = await request.json();
    const { system, user, maxTokens = 1000 } = body;

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: user' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Build messages array
    const messages = [];
    if (system) {
      messages.push({ role: 'system', content: system });
    }
    messages.push({ role: 'user', content: user });

    // Call DeepSeek
    const dsResp = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: maxTokens,
        temperature: 0.4,
        messages,
      }),
    });

    if (!dsResp.ok) {
      const errText = await dsResp.text();
      return new Response(
        JSON.stringify({ error: `DeepSeek API error ${dsResp.status}: ${errText}` }),
        { status: dsResp.status, headers: corsHeaders }
      );
    }

    const data = await dsResp.json();
    const text = data?.choices?.[0]?.message?.content || '';

    return new Response(
      JSON.stringify({ text }),
      { status: 200, headers: corsHeaders }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || 'Internal server error' }),
      { status: 500, headers: corsHeaders }
    );
  }
}

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
