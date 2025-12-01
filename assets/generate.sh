#!/bin/bash
# From svg logo file, generate PNG logos of various sizes.
# Usage: ./generate.sh
# Ensure you have Inkscape or ImageMagick installed to run this script.
# This script generates PNG logos from a single SVG file at various sizes.
set -e
# Manual for the script
usage() {
  echo "Usage: $0"
  echo "This script generates use an SVG file to generate PNG logos."
  echo "Ensure you have Inkscape or ImageMagick installed."
  echo "Run this script in the directory containing 'lingualibre.svg'."
  exit 1
}
# Help message
if [[ "$1" == "--help" || "$1" == "-h" ]]; then
  usage
fi

# Check if Inkscape or ImageMagick is installed
if ! command -v inkscape &> /dev/null && ! command -v convert &> /dev/null; then
  echo "Error: Neither Inkscape nor ImageMagick is installed."
  echo "Please install one of them to generate PNG logos."
  exit 1
fi
# Generate PNG logos from the SVG file
# Ensure the SVG file exists
SVG_FILE="logo.svg"
if [ ! -f "$SVG_FILE" ]; then
  echo "Error: SVG file '$SVG_FILE' not found."
  exit 1
fi
# Define the sizes for the logos
SIZES=(16 32 48 64 72 96 128 180 192 256 512)
# Generate logos using either Inkscape or ImageMagick based on availability   
if command -v inkscape &> /dev/null; then
  echo "Using Inkscape to generate logos..."
  for size in "${SIZES[@]}"; do
    inkscape -o "logo-${size}.png" -w "$size" -h "$size" "$SVG_FILE"
  done
elif command -v convert &> /dev/null; then
  echo "Using ImageMagick to generate logos..."
  for size in "${SIZES[@]}"; do
    convert -background none -resize "${size}x${size}" "$SVG_FILE" "logo-${size}.png"
  done
fi
# Notify the user of completion
echo "logo generation complete. PNG files created:"
for size in "${SIZES[@]}"; do
  echo "logo-${size}.png"
done
# Create favicon.ico from the generated logos
if command -v convert &> /dev/null; then
  echo "Creating favicon.ico from generated logos..."
else
  echo "Warning: ImageMagick is required to create favicon.ico."
  exit 1
fi
# Convert the generated PNG files into a favlogo.ico file
convert logo-16.png logo-32.png logo-48.png favicon.ico  
# End of script
