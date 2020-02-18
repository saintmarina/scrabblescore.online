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
sed -Ei '' 's/web-platform/cordova-ios/g' index.html               #sets correct css


# Build the application for debuging
cordova build ios --debug --emulator

# Build app for release:
# Change version name in cordova/config.xml
# Run this script
# Then in Xcode, open ScrabbleScore in platorms/ios
# Increment app version in Targets ScrableScore -> General
# In Targets --> Signing & Capabilities in Debug select Automatically manage signing.
#                                       in Release DON'T select Automatic signing, do manually. 
# Try in emulator
# Select device "Generic iOS"
# Menu Product-->Archive

# To restore the launchscreen and icon images:
# 1. Go to scrabble/mobile_graphics/ios/
#    Copy fodler AppIcon.appiconset 
#    Paste it here --> /Users/anna/scrabble/scrabblescore.online/cordova/platforms/ios/ScrabbleScore/Images.xcassets/AppIcon.appiconset 
# 2. Go to scrabble/mobile_graphics/ios/
#    Copy fodler LaunchImage.launchimage
#    Paste it here --> /Users/anna/scrabble/scrabblescore.online/cordova/platforms/ios/ScrabbleScore/Images.xcassets/LaunchImage.launchimage
