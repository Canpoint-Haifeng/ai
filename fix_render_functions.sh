#!/bin/bash

echo "Fixing Vue 2 render functions to Vue 3 equivalents..."

# Find all JS files with render functions
find src -name "*.js" -type f | xargs grep -l "render:" | while read -r file; do
  echo "Processing file: $file"
  
  # Update h parameter in render functions
  sed -i 's/render: function *(/render(/' "$file"
  sed -i 's/render: *(/render(/' "$file"
  sed -i 's/render *(/render(/' "$file"
  sed -i 's/render: *function *(h)/render(/' "$file"
  sed -i 's/render *(h)/render(/' "$file"
  
  # Add h import if needed
  if grep -q "import { h } from 'vue'" "$file"; then
    echo "h import already exists in $file"
  else
    if grep -q "import.*from 'vue'" "$file"; then
      # Append to existing import
      sed -i "s/import \(.*\) from 'vue'/import \1, { h } from 'vue'/g" "$file"
    else
      # Add new import at the beginning of the file
      sed -i '1i\import { h } from "vue"' "$file"
    fi
  fi
done

echo "Render functions fixed."
