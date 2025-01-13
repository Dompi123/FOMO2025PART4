#!/bin/bash

# Create splash directory if it doesn't exist
mkdir -p public/splash

# Define background color
BG_COLOR="#070707"

# Function to generate splash screen
generate_splash() {
    local width=$1
    local height=$2
    local name=$3
    
    magick -size ${width}x${height} xc:${BG_COLOR} \
        public/fomo-logo.png -gravity center -composite \
        public/splash/apple-splash-${width}-${height}.png
    
    echo "Generated splash screen for ${name} (${width}x${height})"
}

# Generate splash screens for all iPhone models
generate_splash 1290 2796 "iPhone 14 Pro Max"
generate_splash 1179 2556 "iPhone 14 Pro"
generate_splash 1284 2778 "iPhone 14 Plus/13 Pro Max"
generate_splash 1170 2532 "iPhone 14/13 Pro/13/12 Pro/12"
generate_splash 1080 2340 "iPhone 13 mini/12 mini"
generate_splash 1242 2688 "iPhone 11 Pro Max/XS Max"
generate_splash 828 1792 "iPhone 11/XR"
generate_splash 1125 2436 "iPhone X/XS/11 Pro/12 mini"

echo "All splash screens generated successfully!" 