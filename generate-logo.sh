#!/bin/bash

# Create a PNG with the FOMO logo
magick -size 512x512 xc:black \
    -fill '#9D5CFF' \
    -font Arial-Bold -pointsize 200 \
    -gravity center -annotate 0 'FOMO' \
    public/fomo-logo.png

echo "FOMO logo generated successfully!" 