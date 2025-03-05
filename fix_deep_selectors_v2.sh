#!/bin/bash

# Fix :deep() selector syntax for Vue 3
# In Vue 3, the syntax is :deep(.selector) instead of ::v-deep .selector or /deep/ .selector

# Find all Vue files
find src -name "*.vue" -type f | while read -r file; do
  # Replace :deep(.selector)) with :deep(.selector)
  sed -i 's/:deep(\([^)]*\)))/\:deep(\1)/g' "$file"
  
  # Replace other incorrect :deep syntax
  sed -i 's/::v-deep \(.*\)/:deep(\1)/g' "$file"
  sed -i 's/\/deep\/ \(.*\)/:deep(\1)/g' "$file"
done

echo "Fixed :deep selector syntax in Vue files"
