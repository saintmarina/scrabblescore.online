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
# Change version name in cordova/config.xml
# Run this script
# Then in Android Studio, open ScrabbleScore in platorms/android
# Increment app version in app/manifests/AndroidManifest.xml --> line2: android:versionCode="1000" (increment 1000) android: vesionName="1.2.0" (increment 1.2.0)
# In Build --> Generate Signed Bundle/APK --> Create a bundle
# In /Users/anna/scrabble/scrabblescore.online/cordova/platforms/android/app/release find app-release.aab
# Drag app-release.aab to the Developer Console


# If gradle version is outdated:
# Update gradle
# cordova platform rm android
# cordova platform add android
# After the plarform was reinstalled IMAGES need to be reset.
# To reset images:
# - copy all the content from scrabble/mobile_graphics/android/res
# - paste the content to scrabble/scrabblescore.online/cordova/platform/android/app/src/main/res
# Copy keystore.jks from Google\ Drive/scrabble_android_key to cordova/platform/android
# Alias and password for the key is documented in key_instructions file at Google\ Drive/scrabble_android_key
# To update graddle version:
# update graddle in comandline
# update version number here -->  vim /Users/anna/scrabble/scrabblescore.online/cordova/platforms/android/gradle/wrapper/gradle-wrapper.properties
