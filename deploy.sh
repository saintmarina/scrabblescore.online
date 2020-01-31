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

# To deploy in Cordova IOS:
# make sure you are in [master]scrabblescore.online »
# npm run build
# rm -rf ../scrabbleScoreCordova/www/*
# cp -r build/* ../scrabbleScoreCordova/www
# cd ../scrabbleScoreCordova/www
# rm 200.html
# cordova build
# in xcode go to Staging/www/index.js -- SECOND www folder
# change path from absolute to relative for all ccs files, js files, manifest.json and boothstrap.(take out first / in path)
# in xcode go to Staging/www/static/css/ *second chunk.css file* -- SECOND www folder
# search for hidden-input or caret-color
# delete caret-color:transparent
# insert font-size: 0;
# in the END of the same css file: add .top {padding-top: 20px;}
# to fix Status Bar:
#   - run cordova plugin add https://github.com/apache/cordova-plugin-statusbar.git
#   - inside FIRST config.xml, inside <platform name='ios'> tag add <preference name="StatusBarBackgroundColor" value="#" /> 
#   - index.html add <meta name="viewport" content="viewport-fit=cover, initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width" />
#
#
#
# To deploy in Cordova Android:
# open Android Studio, goto assets/index.js change all paths from Absolute to Relative.