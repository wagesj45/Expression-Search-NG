#!/bin/bash
set -e
cd "$(dirname "$0")"
zip -r extension.xpi _locales api html modules scripts skin ex-background.js manifest.json ai-filter > /dev/null
echo "Created extension.xpi"
