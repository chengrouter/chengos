#!/usr/bin/env bash
#
# package-extension.sh — build the ChengTranslate browser extension archive.
#
#   scripts/package-extension.sh [OUTPUT_DIR]
#
# Writes <OUTPUT_DIR>/cheng-translate.zip plus a checksums.txt entry, and prints
# the SHA-256 to stdout. Defaults to deploy/ui/downloads/.
#
# The archive is deterministic: the same source produces a byte-identical zip.
# That is what makes the published SHA-256 meaningful — a user can verify the
# download matches the release, and a rebuild can be compared against what
# shipped. Reproducibility requires fixing both the file timestamps and the entry
# order, since zip records mtimes and directory traversal order is not stable
# across machines.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="${REPO_ROOT}/chengapp/extensions/cheng-translate"
OUT_DIR="${1:-${REPO_ROOT}/deploy/ui/downloads}"
NAME="cheng-translate"

command -v zip >/dev/null 2>&1 || { echo "error: 'zip' is not installed" >&2; exit 1; }
[[ -d "$SRC" ]] || { echo "error: extension source not found at $SRC" >&2; exit 1; }
[[ -f "${SRC}/manifest.json" ]] || { echo "error: ${SRC}/manifest.json is missing" >&2; exit 1; }

VERSION="$(node -p "require('${SRC}/manifest.json').version" 2>/dev/null || echo "unknown")"

mkdir -p "$OUT_DIR"
ZIP_PATH="${OUT_DIR}/${NAME}.zip"

STAGING="$(mktemp -d)"
trap 'rm -rf "$STAGING"' EXIT
WORK="${STAGING}/${NAME}"
mkdir -p "$WORK"

# Copy only what the browser actually loads. Development files (tsconfig,
# package.json, notes) would otherwise ship to every user and appear in the
# extension's own source view.
for item in manifest.json src assets _locales README.md LICENSE NOTICE; do
  [[ -e "${SRC}/${item}" ]] && cp -a "${SRC}/${item}" "${WORK}/"
done

# Strip anything that is not part of the shipped extension. Tests in particular:
# they are dead weight in every user's install, and they appear in the
# extension's own source view as if they were product code.
find "$WORK" \( \
    -name '.DS_Store' -o -name '*.swp' -o -name 'node_modules' \
    -o -name '*.test.mjs' -o -name '*.test.js' -o -name '*.spec.js' \
    -o -name 'tsconfig.json' -o -name 'package.json' \
  \) -prune -exec rm -rf {} + 2>/dev/null || true

# Fixed timestamp (the zip epoch: DOS timestamps cannot represent anything
# earlier) so the archive does not change just because it was rebuilt.
find "$WORK" -exec touch -t 198001010000.00 {} +

rm -f "$ZIP_PATH"
(
  cd "$STAGING"
  # -X drops extra attributes (uid/gid, host timestamps); sorted input fixes the
  # entry order. Both are required for byte-identical rebuilds.
  find "$NAME" -type f | LC_ALL=C sort | zip -q -X -9 "$ZIP_PATH" -@
)

SHA="$(sha256sum "$ZIP_PATH" | cut -d' ' -f1)"

# A checksums file next to the artifact, so the UI can show a verifiable hash.
CHECKSUMS="${OUT_DIR}/checksums.txt"
if [[ -f "$CHECKSUMS" ]]; then
  grep -v "  ${NAME}.zip\$" "$CHECKSUMS" > "${CHECKSUMS}.tmp" 2>/dev/null || true
  mv "${CHECKSUMS}.tmp" "$CHECKSUMS"
fi
echo "${SHA}  ${NAME}.zip" >> "$CHECKSUMS"

echo "Packaged ${NAME} v${VERSION}"
echo "  path:   ${ZIP_PATH}"
echo "  size:   $(du -h "$ZIP_PATH" | cut -f1)"
echo "  sha256: ${SHA}"
