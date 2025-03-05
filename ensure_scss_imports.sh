#!/bin/bash

# Find all Vue files with SCSS style blocks
find src -name "*.vue" -type f | while read -r file; do
  # Check if the file has a <style lang="scss"> block
  if grep -q "<style.*lang=\"scss\"" "$file"; then
    # Check if the file already imports variables.scss
    if ! grep -q "@import \"@/assets/css/variables.scss\";" "$file" && ! grep -q "@import '@/assets/css/variables.scss';" "$file"; then
      # Add the import to the style block
      sed -i '/<style.*lang="scss">/a @import "@/assets/css/variables.scss";' "$file"
      echo "Added variables.scss import to $file"
    fi
  fi
done

echo "Finished adding variables.scss imports to Vue files"
