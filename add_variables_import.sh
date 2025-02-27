#!/bin/bash

# Find all Vue files with SCSS style blocks
find src -name "*.vue" -type f -exec grep -l "<style lang=\"scss\"" {} \; | while read -r file; do
  # Check if the file already has the import
  if ! grep -q "@import '@/assets/css/variables.scss';" "$file"; then
    # Add the import after the style tag
    sed -i '/<style lang="scss"/a \  @import '"'"'@/assets/css/variables.scss'"'"';' "$file"
    echo "Added import to $file"
  fi
done
