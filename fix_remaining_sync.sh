#!/bin/bash

echo "Fixing remaining .sync modifiers..."

# Find all Vue files with .sync
find src -name "*.vue" -type f | xargs grep -l "\.sync" | grep -v "\.sync-" | grep -v "\.synchro" | grep -v "\.synchronous" | while read -r file; do
  echo "Processing file: $file"
  
  # Replace :prop.sync="value" with v-model:prop="value"
  sed -i 's/:\([a-zA-Z0-9-]\+\)\.sync=/v-model:\1=/g' "$file"
  
  # Handle special cases
  sed -i 's/\.sync {/\.sync-class {/g' "$file"
  sed -i 's/this\.syncPaper/this.syncPaper/g' "$file"
  sed -i 's/\.sync_type/\.sync_type/g' "$file"
done

echo "Remaining .sync modifiers fixed."
