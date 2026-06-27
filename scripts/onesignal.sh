#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="${ENV_FILE:-$ROOT_DIR/.env}"
API_URL="https://api.onesignal.com/notifications"

SEGMENT="${ONESIGNAL_TEST_SEGMENT:-Test Users}"
BASE_URL_OVERRIDE=""
DRY_RUN=false

usage() {
  cat <<'USAGE'
Usage:
  scripts/onesignal.sh [options]

Options:
  --segment NAME   OneSignal test segment name. Default: Test Users
  --base-url URL   Web/PWA launch URL. Default: BASE_URL or NEXT_PUBLIC_BASE_URL from env/.env
  --dry-run        Print the 4 payloads without sending
  -h, --help       Show this help

The script sends 4 push messages to the test segment:
  blog x web, blog x iOS app, zenn x web, zenn x iOS app

It reads only ONESIGNAL_APP_ID, ONESIGNAL_REST_API_KEY, BASE_URL, and
NEXT_PUBLIC_BASE_URL from .env without sourcing the file.
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --segment)
      SEGMENT="${2:-}"
      shift 2
      ;;
    --base-url)
      BASE_URL_OVERRIDE="${2:-}"
      shift 2
      ;;
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    -h | --help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

if ! command -v node >/dev/null 2>&1; then
  echo "node is required" >&2
  exit 1
fi

if ! command -v curl >/dev/null 2>&1; then
  echo "curl is required" >&2
  exit 1
fi

read_env() {
  local key="$1"
  local current_value="${!key:-}"

  if [[ -n "$current_value" ]]; then
    printf '%s' "$current_value"
    return
  fi

  node - "$ENV_FILE" "$key" <<'NODE'
const fs = require('fs');

const [file, key] = process.argv.slice(2);
if (!file || !key || !fs.existsSync(file)) {
  process.exit(0);
}

const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
for (const line of lines) {
  const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
  if (!match || match[1] !== key) {
    continue;
  }

  let value = match[2].trim();
  const quoted =
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"));

  if (quoted) {
    value = value.slice(1, -1);
  } else {
    value = value.replace(/\s+#.*$/, '').trim();
  }

  process.stdout.write(value);
  break;
}
NODE
}

require_value() {
  local name="$1"
  local value="$2"

  if [[ -z "$value" ]]; then
    echo "$name is required" >&2
    exit 1
  fi
}

case "$SEGMENT" in
  "" | "Total Subscriptions" | "Subscribed Users" | "All" | "All Users")
    echo "Refusing to send to broad segment: ${SEGMENT:-<empty>}" >&2
    echo "Use a test-only segment such as Test Users." >&2
    exit 1
    ;;
esac

ONESIGNAL_APP_ID_VALUE="$(read_env ONESIGNAL_APP_ID)"
ONESIGNAL_REST_API_KEY_VALUE="$(read_env ONESIGNAL_REST_API_KEY)"
BASE_URL_VALUE="$BASE_URL_OVERRIDE"

if [[ -z "$BASE_URL_VALUE" ]]; then
  BASE_URL_VALUE="$(read_env BASE_URL)"
fi
if [[ -z "$BASE_URL_VALUE" ]]; then
  BASE_URL_VALUE="$(read_env NEXT_PUBLIC_BASE_URL)"
fi

BASE_URL_VALUE="${BASE_URL_VALUE%/}"

require_value "ONESIGNAL_APP_ID" "$ONESIGNAL_APP_ID_VALUE"
require_value "ONESIGNAL_REST_API_KEY" "$ONESIGNAL_REST_API_KEY_VALUE"
require_value "BASE_URL or NEXT_PUBLIC_BASE_URL" "$BASE_URL_VALUE"

payload_for() {
  local source="$1"
  local platform="$2"
  local article_id="$3"
  local article_url="$4"

  node - "$ONESIGNAL_APP_ID_VALUE" "$SEGMENT" "$BASE_URL_VALUE" "$source" "$platform" "$article_id" "$article_url" <<'NODE'
const [
  appId,
  segment,
  baseUrl,
  source,
  platform,
  articleId,
  articleUrl,
] = process.argv.slice(2);

const sourceLabel = source === 'zenn' ? 'Zenn' : 'ブログ';
const platformLabel = platform === 'ios' ? 'iOS App' : 'Web/PWA';
const title = `テスト通知: ${sourceLabel} / ${platformLabel}`;
const body = `${sourceLabel}通知を${platformLabel}向けにテスト送信しています。`;

const payload = {
  app_id: appId,
  target_channel: 'push',
  included_segments: [segment],
  headings: {
    ja: title,
    en: `Test notification: ${source} / ${platform}`,
  },
  contents: {
    ja: body,
    en: `Testing ${source} notification for ${platform}.`,
  },
  data: {
    type: 'article',
    source,
    articleId,
  },
  ttl: 300,
};

if (source === 'zenn') {
  payload.data.articleUrl = articleUrl;
}

if (platform === 'web') {
  payload.isAnyWeb = true;
  payload.web_url = baseUrl;
} else if (platform === 'ios') {
  payload.isIos = true;
} else {
  throw new Error(`Unsupported platform: ${platform}`);
}

process.stdout.write(JSON.stringify(payload));
NODE
}

extract_message_id() {
  node -e "
let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  input += chunk;
});
process.stdin.on('end', () => {
  try {
    const parsed = JSON.parse(input);
    process.stdout.write(parsed.id || '');
  } catch {
    process.stdout.write('');
  }
});
"
}

send_payload() {
  local label="$1"
  local payload="$2"

  if [[ "$DRY_RUN" == true ]]; then
    echo "DRY RUN: $label"
    echo "$payload"
    echo
    return
  fi

  local response
  response="$(
    curl -sS -w $'\n%{http_code}' \
      -X POST "$API_URL" \
      -H "Content-Type: application/json" \
      -H "Authorization: Key $ONESIGNAL_REST_API_KEY_VALUE" \
      --data "$payload"
  )"

  local status="${response##*$'\n'}"
  local body="${response%$'\n'*}"
  local message_id
  message_id="$(printf '%s' "$body" | extract_message_id)"

  if [[ "$status" != 2* || -z "$message_id" ]]; then
    echo "FAILED: $label" >&2
    echo "HTTP $status $body" >&2
    return 1
  fi

  echo "SENT: $label -> $message_id"
}

echo "Sending OneSignal test notifications to segment: $SEGMENT"
echo "Web/PWA launch URL: $BASE_URL_VALUE"

failures=0

for item in \
  "blog|web|onesignal-test-blog|" \
  "blog|ios|onesignal-test-blog|" \
  "zenn|web|onesignal-test-zenn|https://zenn.dev/realunivlog/articles/onesignal-test-zenn" \
  "zenn|ios|onesignal-test-zenn|https://zenn.dev/realunivlog/articles/onesignal-test-zenn"
do
  IFS='|' read -r source platform article_id article_url <<<"$item"
  label="$source / $platform"
  payload="$(payload_for "$source" "$platform" "$article_id" "$article_url")"

  if ! send_payload "$label" "$payload"; then
    failures=$((failures + 1))
  fi
done

if [[ "$failures" -gt 0 ]]; then
  echo "$failures notification(s) failed" >&2
  exit 1
fi

echo "Done"
