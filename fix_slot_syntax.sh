#!/bin/bash

echo "Fixing Vue 2 slot syntax to Vue 3 equivalents..."

# Find all Vue files with old slot syntax
find src -name "*.vue" -type f | while read -r file; do
  echo "Processing file: $file"
  
  # Replace slot="name" with v-slot:name
  sed -i 's/slot="\([^"]*\)"/v-slot:\1/g' "$file"
  
  # Replace slot-scope="scope" with v-slot="scope"
  sed -i 's/slot-scope="\([^"]*\)"/v-slot="\1"/g' "$file"
  
  # Replace scope.row with row
  sed -i 's/scope\.row/row/g' "$file"
done

echo "Slot syntax fixed."
