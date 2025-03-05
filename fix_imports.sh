#!/bin/bash

# Find all Vue files in the project
find src -name "*.vue" -type f | while read -r file; do
  # Fix imports from @/common/js/util
  sed -i 's/import { \([^}]*\) } from '\''@\/common\/js\/util'\''/import { \1 } from '\''@\/common\/js\/util.js'\''/' "$file"
  sed -i 's/import \([^ ]*\) from '\''@\/common\/js\/util'\''/import \1 from '\''@\/common\/js\/util.js'\''/' "$file"
  
  # Fix imports from other JS files
  sed -i 's/import { \([^}]*\) } from '\''@\/\([^.]*\)'\''$/import { \1 } from '\''@\/\2.js'\''/' "$file"
  sed -i 's/import \([^ ]*\) from '\''@\/\([^.]*\)'\''$/import \1 from '\''@\/\2.js'\''/' "$file"
  
  # Fix relative imports
  sed -i 's/import { \([^}]*\) } from '\''\.\.\(\/[^.]*\)'\''$/import { \1 } from '\''\.\.\2.js'\''/' "$file"
  sed -i 's/import \([^ ]*\) from '\''\.\.\(\/[^.]*\)'\''$/import \1 from '\''\.\.\2.js'\''/' "$file"
  sed -i 's/import { \([^}]*\) } from '\''\.\(\/[^.]*\)'\''$/import { \1 } from '\''\.\2.js'\''/' "$file"
  sed -i 's/import \([^ ]*\) from '\''\.\(\/[^.]*\)'\''$/import \1 from '\''\.\2.js'\''/' "$file"
done

echo "Finished fixing imports in Vue files"
