## Using Gemini locally

The Gemini embeddings endpoint now rejects pure API-key auth with `API keys are not supported`. Server-side calls here use `apps/personal-website/lib/gemini.js`, which will mint an OAuth token when a service account is provided and only falls back to `GEMINI_API_KEY` if no token is available.

1) Create a service account in your GCP project with access to the Generative Language API (e.g., role: “Generative AI API User”). Enable the API.
2) Download the JSON key. Do **not** commit it.
3) Add one of these to your `.env` (preferred first):
   - `GCP_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n","client_email":"...","client_id":"...","token_uri":"https://oauth2.googleapis.com/token"}`
   - `GCP_SERVICE_ACCOUNT_JSON_BASE64=<base64-encoded JSON blob>`
   - `GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/key.json`
4) Keep `GEMINI_API_KEY` set only if you also call any remaining API-key-friendly endpoints; it is ignored for embeddings when OAuth is configured.
5) Restart your dev/build process so the new env vars load.

If you still see a 401, confirm the service account has the correct role and the `GCP_SERVICE_ACCOUNT_JSON*` value is valid JSON (watch for stray quotes or missing escapes).
