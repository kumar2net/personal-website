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
  "language": "en|hi|ta|tn",
  "model": "gpt-4o-mini-tts|tts-1|tts-1-hd|custom-snapshot",
  "voice": "alloy",
  "response_format": "mp3|opus|aac|flac|wav|pcm",
  "stream_format": "audio|sse",
  "speed": 1.0,
  "instructions": "optional style guidance"
}
```

### Field Rules

- `text` or `content`: required text source (`text` is preferred).
- `slug`: optional; defaults to `blog-post`.
- `language`: optional; defaults to `en`. `tn` is accepted as an alias for Tamil and is normalized to `ta`.
- `model`: optional; if omitted, the route tries its configured model order starting with the official aliases.
- `voice`: optional; this app build pins one preset voice per language and rejects other voice overrides. By default that preset is `alloy` for `en`, `hi`, and `ta` unless a server env override changes it.
- `response_format`: optional; defaults to `mp3`.
- `stream_format`: optional; supports `"audio"` and `"sse"`.
- `speed`: optional; clamped to `0.25..4.0`, default `1.0`.
- `instructions`: optional; trimmed to 400 chars and only sent to models that support speech instructions (`gpt-4o-mini-tts` today).

## Successful Response

- Status: `200`
- `stream_format: "audio"` returns binary audio (`Content-Type` matches the selected audio format).
- `stream_format: "sse"` returns `text/event-stream` and proxies the upstream OpenAI event stream.

### Response Headers

- `X-Blogtts-Cache`: `hit|miss`
- `X-Blogtts-Language`: resolved language code
- `X-Blogtts-Slug`: resolved slug
- `X-Blogtts-Voice`: resolved voice
- `X-Blogtts-Translated`: `1|0`
- `X-Blogtts-Translation-Failed`: `1|0`
- `X-Blogtts-Truncated`: `1|0`
- `X-Blogtts-Model`: OpenAI model used (when available)
- `X-Blogtts-Upstream-Request-Ids`: comma-separated OpenAI request ids for the synthesis calls
- `X-Blogtts-Speed`: effective speed value
- `X-Blogtts-Stream-Format`: effective stream format
- `X-Blogtts-Response-Format`: effective response format

## Error Responses

- `400`: invalid JSON, unsupported language, empty text, unsupported `stream_format`.
- `400`: invalid `model + stream_format` or `model + instructions` combination.
- `400`: unsupported `voice` for the selected language. Response includes `supported_voices` and `default_voice`.
- `400`: long-form `stream_format: "audio"` with a non-`mp3` format. Response includes `retry_with_response_format: "mp3"`.
- `405`: non-POST method.
- `503`: missing API key or no available TTS model.
- `500`: unexpected generation or stream failure.

## Performance Notes

- For browser playback latency, binary audio streaming (`stream_format: "audio"`) is the fast path used by the site player.
- The web player uses progressive `MediaSource` playback when supported, then falls back to blob playback.
- Long-form binary audio on this route is intentionally constrained to `mp3` because concatenating multi-request raw `opus`/`aac`/`flac` payloads is not container-safe. Callers that want long-form non-`mp3` output should use `stream_format: "sse"` or keep input within a single Speech API request.
- `tts-1` and `tts-1-hd` do not support `stream_format: "sse"` or speech `instructions`; the route filters or rejects those combinations accordingly.

## cURL Example

```bash
curl -X POST http://localhost:3000/api/blog-tts \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello from blog TTS.",
    "slug": "demo-post",
    "language": "en",
    "model": "gpt-4o-mini-tts",
    "voice": "alloy",
    "response_format": "mp3",
    "stream_format": "audio",
    "speed": 1.0
  }' \
  --output out.mp3
```
