#!/bin/bash
set -eu

rm -rf build
npm run build

cd build
echo scrabblescore.online > CNAME
git init
git add .
git commit -am 'Deploy'
git push -f https://github.com/saintmarina/scrabblescore.online master:gh-pages

# To deploy in Cordova Android:
# open Android Studio, goto assets/index.js change all paths from Absolute to Relative.
