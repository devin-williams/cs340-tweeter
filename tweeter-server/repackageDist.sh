#!/bin/bash

# Use set -e to terminate the script on error
set -e

# Define paths
DIST_FOLDER="dist"
ZIP_FILE="dist.zip"

# Check if the dist folder exists
if [ ! -d "$DIST_FOLDER" ]; then
  echo "Error: $DIST_FOLDER folder does not exist. Please build the project first."
  exit 1
fi

# Remove the old dist.zip if it exists
if [ -f "$ZIP_FILE" ]; then
  echo "Removing old $ZIP_FILE..."
  rm "$ZIP_FILE"
fi

# Compress the contents of the dist folder into dist.zip
echo "Creating $ZIP_FILE from the contents of $DIST_FOLDER..."
cd "$DIST_FOLDER"
zip -r "../$ZIP_FILE" . -x "node_modules/aws-sdk/*" > /dev/null
cd ..

# Move the dist.zip to the parent directory
# echo "Moving $ZIP_FILE to the parent directory..."
# mv "$ZIP_FILE" ../

echo "Repackaging complete. $ZIP_FILE moved to the parent directory."