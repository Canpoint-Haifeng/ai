#!/bin/bash

echo "Fixing remaining issues..."

# Fix environment variables
echo "Fixing environment variables..."
grep -r "process.env.VUE_APP_" --include="*.js" --include="*.vue" src/ | while read -r line; do
  file=$(echo "$line" | cut -d':' -f1)
  echo "Processing file: $file"
  sed -i 's/process\.env\.VUE_APP_/import.meta.env.VITE_/g' "$file"
done

# Fix deep selectors
echo "Fixing deep selectors..."
grep -r "/deep/" --include="*.vue" --include="*.scss" src/ | while read -r line; do
  file=$(echo "$line" | cut -d':' -f1)
  echo "Processing file: $file"
  sed -i 's|/deep/|:deep(|g' "$file"
  sed -i 's|>>>\(.*\)|:deep(\1)|g' "$file"
  sed -i 's|::v-deep\(.*\)|:deep(\1)|g' "$file"
done

# Fix v-model
echo "Fixing v-model..."
grep -r "v-model\." --include="*.vue" src/ | while read -r line; do
  file=$(echo "$line" | cut -d':' -f1)
  echo "Processing file: $file"
  sed -i 's/v-model\.\([a-zA-Z0-9]*\)/v-model:\1/g' "$file"
done

# Fix .sync
echo "Fixing .sync..."
grep -r "\.sync=" --include="*.vue" src/ | grep -v "\.sync-" | grep -v "\.synchro" | grep -v "\.synchronous" | while read -r line; do
  file=$(echo "$line" | cut -d':' -f1)
  echo "Processing file: $file"
  sed -i 's/:\([a-zA-Z0-9-]\+\)\.sync=/v-model:\1=/g' "$file"
done

echo "Fixes completed."
