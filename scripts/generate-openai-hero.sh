#!/usr/bin/env bash
set -euo pipefail

# Load .env from repo root so OPENAI_API_KEY is available
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$REPO_ROOT/.env"
if [[ ! -f "$ENV_FILE" ]]; then
  echo "Could not find .env at $ENV_FILE" >&2
  exit 1
fi

set -a
source "$ENV_FILE"
set +a

if [[ -z "${OPENAI_API_KEY:-}" ]]; then
  echo "OPENAI_API_KEY is not set – add it to .env or export it before running." >&2
  exit 1
fi

mode="${1:-hero}"
case "$mode" in
  hero)
    prompt='Tamil Nadu climate tracker meets COP30 prep: collage of Tamil Nadu climate dashboard screens, Belém skyline silhouettes, solar farms, and water flow meters, neon greens with Amazon dusk sky, optimistic reportage vibe, no text'
    outfile="apps/personal-website/public/media/generated/openai-cop30-tn-tracker.png"
    ;;
  water)
    prompt='Lighthearted meme in Tamil Nadu street, people carrying bright plastic pots (kudam) queuing for water while a futuristic AI data centre pipes draw all the water, playful comic palette, include cheeky signage like "Water for AI first?"'
    outfile="apps/personal-website/public/media/generated/openai-water-shortage-meme.png"
    ;;
  *)
    echo "Unknown mode '$mode'. Use 'hero' (default) or 'water'." >&2
    exit 1
    ;;
esac

tmpjson=$(mktemp)
payload=$(python3 - <<'PY' "$prompt"
import json, sys
prompt = sys.argv[1]
print(json.dumps({"model": "gpt-image-1", "prompt": prompt, "size": "1024x1024"}))
PY
)

curl -s https://api.openai.com/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${OPENAI_API_KEY}" \
  -d "$payload" > "$tmpjson"

python3 - <<'PY' "$tmpjson" "$outfile"
import base64, json, pathlib, sys

json_path, out_path = sys.argv[1:3]
with open(json_path) as f:
    data = json.load(f)

try:
    b64 = data["data"][0]["b64_json"]
except Exception as exc:
    raise SystemExit(f"Failed to parse OpenAI response: {exc}\nRaw: {data}")

img = base64.b64decode(b64)
path = pathlib.Path(out_path)
path.parent.mkdir(parents=True, exist_ok=True)
path.write_bytes(img)
print(f"Wrote {path}")
PY
