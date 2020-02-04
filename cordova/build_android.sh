#!/bin/bash
set -eux

# Prepare the www folder
cd ..
rm -rf build
npm run build
cd -

rm -rf www
mkdir www
cp -a ../build/* www
cd www
sed -Ei '' 's%((src|href)=")/%\1%g' index.html                     #changes all paths from absolute to relative
sed -Ei '' 's/web-platform/cordova-android/g' index.html     #sets correct css


# Build the application for debuging
cordova build android --debug --emulator

# Build app for release:
# Run this script
# Then in Android Studio, open ScrabbleScore in platorms/android
# Increment app version in app/manifests/AndroidManifest.xml --> line2: android:versionCode="1000" (increment 1000) android: vesionName="1.2.0" (increment 1.2.0)
# In Build --> Generate Signed Bundle/APK --> Create a bundle
# In /Users/anna/scrabble/scrabblescore.online/cordova/platforms/android/app/release find app-release.aab
# Drag app-release.aab to the Developer Console

