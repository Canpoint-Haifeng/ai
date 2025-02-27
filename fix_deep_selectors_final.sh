#!/bin/bash

echo "Fixing deep selectors in SCSS (final pass)..."

# Replace /deep/ with :deep()
find src -type f -name "*.vue" -o -name "*.scss" | xargs sed -i 's/\/deep\/ /:deep(/g'
find src -type f -name "*.vue" -o -name "*.scss" | xargs sed -i 's/\/deep\//:deep(/g'
find src -type f -name "*.vue" -o -name "*.scss" | xargs sed -i 's/>>>/:deep(/g'
find src -type f -name "*.vue" -o -name "*.scss" | xargs sed -i 's/::v-deep/:deep(/g'

# Add closing parenthesis to :deep( selectors
find src -type f -name "*.vue" -o -name "*.scss" | xargs sed -i 's/:deep(\([^)]*\) {/:deep(\1) {/g'

echo "Done fixing deep selectors in SCSS"
