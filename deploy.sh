#!/bin/bash
set -eu

rm -rf build
npm run build

cd build
echo scrabblescore.online > CNAME
echo www.scrabblescore.online >> CNAME
git init
git add .
git commit -am 'Deploy'
git branch -M master
git push -f https://github.com/saintmarina/scrabblescore.online master:gh-pages
