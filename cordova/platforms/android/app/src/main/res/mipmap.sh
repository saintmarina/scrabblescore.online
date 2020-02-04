#!/bin/bash
set -eu

WIDTH=$(sips -g pixelWidth ic_launcher.png | grep pixelWidth | sed 's/[^0-9]*//g')
echo "WIDTH"
HEIGHT=$(sips -g pixelHeight ic_launcher.png | grep pixelHeight | sed 's/[^0-9]*//g')
echo "HEIGHT"
convert icon400.png -resize ${WIDTH}x${HEIGHT}^ -gravity center -crop ${WIDTH}x${HEIGHT}+0+0 ic_launcher.png
echo "COVERTED"