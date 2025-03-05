#!/bin/bash

echo "Fixing JS import statements in all Vue files..."

# Find all Vue files
find src -name "*.vue" > all_vue_files.txt

# Process each Vue file
while IFS= read -r file; do
  echo "Processing $file..."
  
  # Check if the file contains import statements with .js extension
  if grep -q "import.*\.js[\"']" "$file"; then
    echo "  Found .js imports in $file"
    
    # Create a backup of the original file
    cp "$file" "$file.backup"
    
    # Replace .js imports with regular imports (without .js extension)
    sed -i 's/\(import.*\)\.js[\"'\''])/\1'"'"')/g' "$file"
    sed -i 's/\(import.*\)\.js[\"'\'']/\1'"'"'/g' "$file"
    
    echo "  Fixed .js imports in $file"
  fi
done < all_vue_files.txt

# Clean up
rm -f all_vue_files.txt

echo "Successfully fixed JS import statements in all Vue files."
