/*
  Netlify Function: tldr
  - POST body: { slug?: string, content: string, language?: string, maxTokens?: number }
  - Response: { summary: string, model: string, created: number, inputHash: string }
*/

const crypto = require('crypto');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
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
  if (event.httpMethod === 'OPTIONS') {
    return jsonResponse(200, { ok: true });
  }

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method Not Allowed' });
  }

  // Allow dev fake or fallback when key is missing, gated by TLDR_DEV_FAKE
  if (!OPENAI_API_KEY && !TLDR_DEV_FAKE) {
    return jsonResponse(500, { error: 'Missing OPENAI_API_KEY' });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (err) {
    return jsonResponse(400, { error: 'Invalid JSON body' });
  }

  const { content, language, maxTokens, slug } = payload || {};
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

  try {
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

    if (!response.ok) {
      const errText = await response.text();
      if (TLDR_DEV_FALLBACK_ON_ERROR) {
        const summary = makeFallbackSummary(trimmed);
        return jsonResponse(200, {
          summary,
          model: 'dev-fallback-openai-error',
          created: Math.floor(Date.now() / 1000),
          inputHash,
          slug: slug || null,
          fallback: true,
          error: 'OpenAI API error',
          details: errText,
        });
      }
      return jsonResponse(response.status, { error: 'OpenAI API error', details: errText });
    }

    const data = await response.json();
    const summary = data?.choices?.[0]?.message?.content?.trim();
    if (!summary) {
      return jsonResponse(502, { error: 'Empty summary from model' });
    }

    return jsonResponse(200, {
      summary,
      model: data?.model || OPENAI_MODEL,
      created: data?.created || Math.floor(Date.now() / 1000),
      inputHash,
      slug: slug || null,
    });
  } catch (err) {
    if (TLDR_DEV_FALLBACK_ON_ERROR) {
      const summary = makeFallbackSummary(trimmed);
      return jsonResponse(200, {
        summary,
        model: 'dev-fallback-exception',
        created: Math.floor(Date.now() / 1000),
        inputHash,
        slug: slug || null,
        fallback: true,
        error: 'Exception calling OpenAI',
        details: String(err),
      });
    }
    return jsonResponse(500, { error: 'Failed to generate summary', details: String(err) });
  }
};


