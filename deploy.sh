#!/bin/bash
set -eu

if [[ ! -z $(git status -s) ]]; then
  echo "Uncommitted files. Abort"
  exit 1
fi

npm run build
git checkout gh-pages