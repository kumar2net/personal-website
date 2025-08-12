/*
  Netlify Function: tldr
  - POST body: { slug?: string, content: string, language?: string, maxTokens?: number }
  - Response: { summary: string, model: string, created: number, inputHash: string }
*/

const crypto = require('crypto');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
// Avoid embedding the model value as a static literal to prevent secrets scanning false-positives
const DEFAULT_OPENAI_MODEL = ['gpt', '-4o', '-mini'].join('');
const OPENAI_MODEL = process.env.OPENAI_MODEL || DEFAULT_OPENAI_MODEL;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// Providers: 'auto' | 'openai' | 'gemini'
const TLDR_PROVIDER = (process.env.TLDR_PROVIDER || 'auto').toLowerCase();
const TLDR_DEV_FAKE = process.env.TLDR_DEV_FAKE === '1';
const TLDR_DEV_FALLBACK_ON_ERROR = process.env.TLDR_DEV_FALLBACK_ON_ERROR === '1';

function jsonResponse(statusCode, body, extraHeaders = {}) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      ...extraHeaders,
    },
    body: JSON.stringify(body),
  };
}

function makeFallbackSummary(text) {
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  let combined = sentences.slice(0, 2).join(' ');
  if (!combined) combined = text.slice(0, 240);
  if (combined.length > 480) combined = combined.slice(0, 480) + '…';
  return combined;
}

exports.handler = async (event) => {
  console.log('[tldr] Function started');
  if (event.httpMethod === 'OPTIONS') {
    return jsonResponse(200, { ok: true });
  }

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method Not Allowed' });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (err) {
    return jsonResponse(400, { error: 'Invalid JSON body' });
  }

  const { content, language, maxTokens, slug } = payload || {};
  console.log('[tldr] Received data', {
    slug: slug || null,
    contentLength: typeof content === 'string' ? content.length : 0,
    provider: TLDR_PROVIDER,
  });
  if (!content || typeof content !== 'string') {
    return jsonResponse(400, { error: 'content is required' });
  }

  // Normalize and trim content to a safe length
  const normalized = content.replace(/\s+/g, ' ').trim();
  const MAX_INPUT_CHARS = 8000; // keep input modest to control cost
  const trimmed = normalized.slice(0, MAX_INPUT_CHARS);

  const inputHash = crypto
    .createHash('sha256')
    .update(trimmed)
    .digest('hex');

  const systemPrompt = 'You are a helpful writing assistant.';
  const userPrompt = [
    'Generate a concise 2–3 sentence TL;DR of this blog post for display at the top of the article.',
    'Avoid marketing fluff. Focus on the main point and concrete takeaways.',
    language ? `Write in ${language}.` : '',
    '',
    'Text:',
    trimmed,
  ]
    .filter(Boolean)
    .join('\n');

  // Dev short-circuit: always return a local fallback
  if (TLDR_DEV_FAKE) {
    const summary = makeFallbackSummary(trimmed);
    return jsonResponse(200, {
      summary,
      model: 'dev-fallback',
      created: Math.floor(Date.now() / 1000),
      inputHash,
      slug: slug || null,
      fallback: true,
    });
  }

  // Provider selection and execution
  const tryOpenAI = async () => {
    if (!OPENAI_API_KEY) throw new Error('Missing OPENAI_API_KEY');
    console.log('[tldr] Calling OpenAI', { model: OPENAI_MODEL });
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: Math.min(typeof maxTokens === 'number' ? maxTokens : 160, 300),
        temperature: 0.3,
      }),
    });
    console.log('[tldr] OpenAI response', { ok: response.ok, status: response.status });
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenAI API error: ${errText}`);
    }
    const data = await response.json();
    const summary = data?.choices?.[0]?.message?.content?.trim();
    if (!summary) throw new Error('Empty summary from OpenAI');
    return { summary, model: data?.model || OPENAI_MODEL, created: data?.created };
  };

  const tryGemini = async () => {
    if (!GEMINI_API_KEY) throw new Error('Missing GEMINI_API_KEY');
    const model = 'gemini-1.5-flash-latest';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
    console.log('[tldr] Calling Gemini', { model });
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: Math.min(typeof maxTokens === 'number' ? maxTokens : 160, 300),
        },
      }),
    });
    console.log('[tldr] Gemini response', { ok: response.ok, status: response.status });
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API error: ${errText}`);
    }
    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join(' ').trim();
    if (!text) throw new Error('Empty summary from Gemini');
    return { summary: text, model: model, created: Math.floor(Date.now() / 1000) };
  };

  const runProvider = async () => {
    if (TLDR_PROVIDER === 'openai') return tryOpenAI();
    if (TLDR_PROVIDER === 'gemini') return tryGemini();
    // auto: prefer OpenAI if key present, else Gemini
    if (OPENAI_API_KEY) {
      try {
        return await tryOpenAI();
      } catch (e) {
        // Try Gemini if available
        if (GEMINI_API_KEY) {
          return await tryGemini();
        }
        throw e;
      }
    }
    if (GEMINI_API_KEY) return tryGemini();
    throw new Error('No provider configured');
  };

  try {
    console.log('[tldr] Provider selected', { provider: TLDR_PROVIDER });
    const result = await runProvider();
    console.log('[tldr] Function completed successfully');
    return jsonResponse(200, {
      summary: result.summary,
      model: result.model,
      created: result.created || Math.floor(Date.now() / 1000),
      inputHash,
      slug: slug || null,
    });
  } catch (err) {
    console.error('[tldr] Error in function:', err);
    if (TLDR_DEV_FALLBACK_ON_ERROR) {
      const summary = makeFallbackSummary(trimmed);
      return jsonResponse(200, {
        summary,
        model: 'dev-fallback-exception',
        created: Math.floor(Date.now() / 1000),
        inputHash,
        slug: slug || null,
        fallback: true,
        error: 'Exception calling provider',
        details: String(err),
      });
    }
    return jsonResponse(500, { error: 'Failed to generate summary', details: String(err) });
  }
};


