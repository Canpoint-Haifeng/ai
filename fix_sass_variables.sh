#!/bin/bash

# Find all Vue files with SCSS style blocks that use $color-theme
find src -name "*.vue" -type f -exec grep -l "\$color-theme" {} \; | while read -r file; do
  # Check if the file already has the import
  if ! grep -q "@import '@/assets/css/variables.scss';" "$file"; then
    # Add the import after the style tag
    sed -i '/<style.*lang="scss"/a \  @import '"'"'@/assets/css/variables.scss'"'"';' "$file"
    echo "Added variables import to $file"
  fi
done

# Find all Vue files with SCSS style blocks that use $color-text
find src -name "*.vue" -type f -exec grep -l "\$color-text" {} \; | while read -r file; do
  # Check if the file already has the import
  if ! grep -q "@import '@/assets/css/variables.scss';" "$file"; then
    # Add the import after the style tag
    sed -i '/<style.*lang="scss"/a \  @import '"'"'@/assets/css/variables.scss'"'"';' "$file"
    echo "Added variables import to $file"
  fi
done

# Find all Vue files with SCSS style blocks that use $font-size
find src -name "*.vue" -type f -exec grep -l "\$font-size" {} \; | while read -r file; do
  # Check if the file already has the import
  if ! grep -q "@import '@/assets/css/variables.scss';" "$file"; then
    # Add the import after the style tag
    sed -i '/<style.*lang="scss"/a \  @import '"'"'@/assets/css/variables.scss'"'"';' "$file"
    echo "Added variables import to $file"
  fi
done
