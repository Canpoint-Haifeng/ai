#!/bin/bash

echo "Fixing import name issues..."

# Fix CpFan/index.js export names
if [ -f "src/components/CpFan/index.js" ]; then
  echo "Fixing src/components/CpFan/index.js"
  cp "src/components/CpFan/index.js" "src/components/CpFan/index.js.bak"
  
  # Add TopPagintion export alias for backward compatibility
  sed -i '/export const TopPagination/a export const TopPagintion = TopPagination' "src/components/CpFan/index.js"
  
  # Add CpSimailarDialog export alias for backward compatibility
  sed -i '/export const CpSimilarDialog/a export const CpSimailarDialog = CpSimilarDialog' "src/components/CpFan/index.js"
fi

# Fix files that import TopPagintion
find src -type f -name "*.vue" -o -name "*.js" | xargs grep -l "TopPagintion" | while read -r file; do
  echo "Updating TopPagintion import in $file"
  sed -i 's/TopPagintion/TopPagination/g' "$file"
done

# Fix files that import CpSimailarDialog
find src -type f -name "*.vue" -o -name "*.js" | xargs grep -l "CpSimailarDialog" | while read -r file; do
  echo "Updating CpSimailarDialog import in $file"
  sed -i 's/CpSimailarDialog/CpSimilarDialog/g' "$file"
done

echo "Done fixing import name issues"
