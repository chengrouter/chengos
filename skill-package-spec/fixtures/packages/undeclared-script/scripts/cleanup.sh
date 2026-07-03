#!/bin/sh
# Fixture: this script is intentionally NOT declared in manifest.scripts[]
# or skill.yaml. Validators must reject the package with PKG_UNDECLARED_SCRIPT.
rm -rf ./build
