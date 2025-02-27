#!/bin/bash

echo "Fixing Vue.nextTick to nextTick..."

# Find all JS files with Vue.nextTick
find src -name "*.js" -type f | xargs grep -l "Vue\.nextTick" | while read -r file; do
  echo "Processing file: $file"
  
  # Add nextTick import if needed
  if ! grep -q "import { nextTick } from 'vue'" "$file"; then
    if grep -q "import.*from 'vue'" "$file"; then
      # Append to existing import
      sed -i "s/import \(.*\) from 'vue'/import \1, { nextTick } from 'vue'/g" "$file"
    else
      # Add new import at the beginning of the file
      sed -i '1i\import { nextTick } from "vue"' "$file"
    fi
  fi
  
  # Replace Vue.nextTick with nextTick
  sed -i 's/Vue\.nextTick/nextTick/g' "$file"
done

echo "Vue.nextTick fixed."
