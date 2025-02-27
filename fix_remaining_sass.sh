#!/bin/bash

# Find all Vue files with SCSS style blocks
find src -type f -name "*.vue" | while read -r file; do
  # Check if the file contains @import statements
  if grep -q "@import" "$file"; then
    # Replace @import with @use
    sed -i 's/@import \(['"'"'"]\)@\/assets\/css\/variables\(['"'"'"]\);/@use \1@\/assets\/css\/variables\2 as *;/g' "$file"
    echo "Updated SASS imports in $file"
  fi
  
  # Check if the file contains /deep/ or >>> selectors that weren't caught by the previous script
  if grep -q "/deep/" "$file" || grep -q ">>>" "$file"; then
    # Replace /deep/ with :deep()
    sed -i 's/\/deep\/ /\:deep(/g' "$file"
    # Replace >>> with :deep()
    sed -i 's/>>> /\:deep(/g' "$file"
    # Add closing parenthesis to :deep( selectors
    sed -i 's/:deep(\([^)]*\) /:deep(\1) /g' "$file"
    
    echo "Updated deep selectors in $file"
  fi
done
