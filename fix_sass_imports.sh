#!/bin/bash

# Find all Vue files with SCSS style blocks
find src -type f -name "*.vue" | while read -r file; do
  # Check if the file contains SCSS style blocks with @import for variables
  if grep -q "@import.*variables.scss" "$file"; then
    # Replace @import with @use and add 'as *' to make variables available without namespace
    sed -i 's/@import.*variables.scss.*;/@use "@\/assets\/css\/variables" as *;/g' "$file"
    echo "Updated SASS imports in $file"
  fi
done
