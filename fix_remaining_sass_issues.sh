#!/bin/bash

echo "Fixing remaining SASS issues..."

# Fix ::v-deep selectors
find src -type f -name "*.vue" -o -name "*.scss" | xargs sed -i 's/::v-deep/:deep(/g'
find src -type f -name "*.vue" -o -name "*.scss" | xargs sed -i 's/:deep(\([^)]*\))/:deep(\1)/g'

echo "Done fixing SASS issues"
