#!/bin/bash

echo "Fixing Vue 2 filters to Vue 3 equivalents..."

# Find all Vue files with filters
find src -name "*.vue" -type f | xargs grep -l "filters:" | while read -r file; do
  echo "Processing file: $file"
  
  # Extract filter names and implementations
  filters=$(grep -A 20 "filters:" "$file" | sed -n '/filters:/,/}/p' | grep -v "filters:" | grep -v "}" | sed 's/,$//' | sed 's/^[ \t]*//')
  
  if [ ! -z "$filters" ]; then
    # Create methods from filters
    methods=$(echo "$filters" | sed 's/\([a-zA-Z0-9_]*\):/\1:/')
    
    # Add methods to the component if they don't exist
    if grep -q "methods:" "$file"; then
      # Append to existing methods
      sed -i "/methods:/,/}/s/}/$methods,\n}/" "$file"
    else
      # Add new methods section
      sed -i "/filters:/i\  methods: {\n$methods\n  }," "$file"
    fi
    
    # Remove filters section
    sed -i '/filters:/,/}/d' "$file"
  fi
done

echo "Filters fixed."
