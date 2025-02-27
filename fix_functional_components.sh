#!/bin/bash

echo "Fixing Vue 2 functional components to Vue 3 equivalents..."

# Find all Vue files with functional components
find src -name "*.vue" -type f | xargs grep -l "functional: true" | while read -r file; do
  echo "Processing file: $file"
  
  # Remove functional: true
  sed -i 's/functional: true,//' "$file"
  
  # Add defineComponent import if needed
  if ! grep -q "import { defineComponent } from 'vue'" "$file"; then
    if grep -q "import.*from 'vue'" "$file"; then
      # Append to existing import
      sed -i "s/import \(.*\) from 'vue'/import \1, { defineComponent } from 'vue'/g" "$file"
    else
      # Add new import after the script tag
      sed -i "/<script>/a import { defineComponent } from 'vue'" "$file"
    fi
  fi
  
  # Wrap export default with defineComponent
  sed -i 's/export default {/export default defineComponent({/' "$file"
  sed -i 's/}$/})/' "$file"
done

echo "Functional components fixed."
