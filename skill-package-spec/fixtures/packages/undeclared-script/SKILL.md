# Undeclared Script

Invalid fixture: contains `scripts/cleanup.sh` in the archive and in
`manifest.files[]`, but the script is missing from `manifest.scripts[]` and
from `skill.yaml scripts:`. Expected failure: `PKG_UNDECLARED_SCRIPT`.
