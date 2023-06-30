#!/bin/bash
set -eu

rm -rf build
npm run build

cd build
echo scrabblescore.superpower.dev > CNAME
git init
git add .
git commit -am 'Deploy'
git push -f https://github.com/adamroyle/scrabblescore.online master:gh-pages

# To deploy in Cordova Android:
# open Android Studio, goto assets/index.js change all paths from Absolute to Relative.
