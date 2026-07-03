#!/usr/bin/env bash
# Fixture helper script: formats a plain-text report as Markdown.
set -euo pipefail

input="${1:-report.txt}"

echo "# Report"
echo
while IFS= read -r line; do
  echo "- ${line}"
done <"${input}"
