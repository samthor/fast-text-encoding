#!/bin/bash

set -eu

npm run build
npm run test
cp README.md LICENSE package/
cd package/
npm version patch
npm publish --dry-run
