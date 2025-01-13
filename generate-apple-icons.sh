#!/bin/bash

# Create apple touch icons
convert public/icons/icon-192x192.png -resize 180x180 public/apple-touch-icon.png
convert public/icons/icon-192x192.png -resize 180x180 public/apple-touch-icon-precomposed.png

# Create apple startup images for different devices
convert public/icons/icon-512x512.png -resize 1170x2532^ -gravity center -extent 1170x2532 public/apple-splash-1170x2532.png
convert public/icons/icon-512x512.png -resize 1284x2778^ -gravity center -extent 1284x2778 public/apple-splash-1284x2778.png
convert public/icons/icon-512x512.png -resize 1170x2532^ -gravity center -extent 1170x2532 public/apple-splash-1170x2532.png

echo "Apple icons and splash screens generated successfully!"

# Make the script executable
chmod +x generate-apple-icons.sh 