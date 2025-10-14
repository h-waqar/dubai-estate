#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Check if a folder path was provided
if [ -z "$1" ]; then
  echo "Usage: $0 /path/to/folder"
  exit 1
fi

FOLDER_PATH="$1"
OUTPUT_FILE="response.txt"

# Go to the folder (optional, keeps paths clean)
cd "$FOLDER_PATH"

# Create/clear the output file
> "$OUTPUT_FILE"

# Loop through all files (recursively)
find . -type f | while read -r file; do
  # Skip the output file itself to prevent recursion
  if [ "$(basename "$file")" = "$OUTPUT_FILE" ]; then
    continue
  fi

  echo "===== FILE: $file =====" >> "$OUTPUT_FILE"
  cat "$file" >> "$OUTPUT_FILE"
  echo -e "\n\n" >> "$OUTPUT_FILE" # add spacing between files
done

echo "✅ All file contents saved to: $FOLDER_PATH/$OUTPUT_FILE"
