# `/api/blog-tts` Contract

This endpoint generates spoken audio for blog content using OpenAI Audio Speech.

## Endpoint

- `POST /api/blog-tts`
- `Content-Type: application/json`

## Request Body

```json
{
  "text": "string",
  "content": "string",
  "slug": "string",
  "language": "en|hi|ta",
  "response_format": "mp3|opus|aac|flac|wav|pcm",
  "stream_format": "audio",
  "speed": 1.0,
  "instructions": "optional style guidance"
}
```

### Field Rules

- `text` or `content`: required text source (`text` is preferred).
- `slug`: optional; defaults to `blog-post`.
- `language`: optional; defaults to `en`.
- `response_format`: optional; defaults to `mp3`.
- `stream_format`: optional; only `"audio"` is supported by this endpoint.
- `speed`: optional; clamped to `0.25..4.0`, default `1.0`.
- `instructions`: optional; trimmed to 400 chars.

## Successful Response

- Status: `200`
- Body: binary audio stream or buffered binary audio (`Content-Type` matches selected format).

### Response Headers

- `X-Blogtts-Cache`: `hit|miss`
- `X-Blogtts-Language`: resolved language code
- `X-Blogtts-Slug`: resolved slug
- `X-Blogtts-Translated`: `1|0`
- `X-Blogtts-Translation-Failed`: `1|0`
- `X-Blogtts-Truncated`: `1|0`
- `X-Blogtts-Model`: OpenAI model used (when available)
- `X-Blogtts-Speed`: effective speed value
- `X-Blogtts-Stream-Format`: effective stream format
- `X-Blogtts-Response-Format`: effective response format

## Error Responses

- `400`: invalid JSON, unsupported language, empty text, unsupported `stream_format`.
- `405`: non-POST method.
- `503`: missing API key or no available TTS model.
- `500`: unexpected generation or stream failure.

## Performance Notes

- For browser playback latency, binary audio streaming (`stream_format: "audio"`) is the fast path.
- The web player now uses progressive `MediaSource` playback when supported, then falls back to blob playback.
- `stream_format: "sse"` is intentionally not served by this endpoint:
  - SSE audio parts are base64-encoded, which increases payload size and decoding work.
  - Browsers cannot feed SSE directly into `<audio>` without client-side decode/reassembly.
  - For this site, binary audio streaming yields better first-audio latency and lower CPU overhead.

## cURL Example

```bash
curl -X POST http://localhost:3000/api/blog-tts \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello from blog TTS.",
    "slug": "demo-post",
    "language": "en",
    "response_format": "opus",
    "stream_format": "audio",
    "speed": 1.0
  }' \
  --output out.ogg
```

