#!/bin/bash
set -eu

if [[ ! -z $(git status -s) ]]; then
  echo "Uncommitted files. Abort"
  exit 1
fi

rm -rf build
npm run build
git checkout gh-pages
rm -rf static *.js *.png *.jpg *.html

mv build/* .
git add .
git commit -am Deploy
git push
git checkout master