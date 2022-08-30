#!/bin/bash

set -eu

npm run build
npm run test
cp README.md LICENSE text.min.js* package/
cd package/
npm version patch
npm publish --dry-run
