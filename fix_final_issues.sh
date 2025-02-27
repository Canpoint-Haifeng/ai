#!/bin/bash

echo "Fixing final Vue 2 to Vue 3 issues..."

# Replace Vue.prototype with app.config.globalProperties
find src -type f -name "*.js" | xargs sed -i 's/Vue\.prototype\./app\.config\.globalProperties\./g'

# Replace Vue.use with app.use
find src -type f -name "*.js" | xargs sed -i 's/Vue\.use/app\.use/g'

# Replace beforeDestroy with beforeUnmount
find src -type f -name "*.vue" -o -name "*.js" | xargs sed -i 's/beforeDestroy/beforeUnmount/g'

# Replace destroyed with unmounted
find src -type f -name "*.vue" -o -name "*.js" | xargs sed -i 's/destroyed/unmounted/g'

# Replace .sync with v-model
find src -type f -name "*.vue" | xargs sed -i 's/:prop\.sync="value"/:prop="value" @update:prop="value = $event"/g'
find src -type f -name "*.vue" | xargs sed -i 's/:prop\.sync="value"/:prop="value" @update:prop="value = $event"/g'

# Fix v-model syntax for Vue 3
find src -type f -name "*.vue" | xargs sed -i 's/v-model\.lazy/v-model:lazy/g'
find src -type f -name "*.vue" | xargs sed -i 's/v-model\.number/v-model:number/g'
find src -type f -name "*.vue" | xargs sed -i 's/v-model\.trim/v-model:trim/g'

# Fix .native event modifiers (remove them as they're not needed in Vue 3)
find src -type f -name "*.vue" | xargs sed -i 's/@click\.native/@click/g'
find src -type f -name "*.vue" | xargs sed -i 's/@change\.native/@change/g'
find src -type f -name "*.vue" | xargs sed -i 's/@input\.native/@input/g'
find src -type f -name "*.vue" | xargs sed -i 's/@focus\.native/@focus/g'
find src -type f -name "*.vue" | xargs sed -i 's/@blur\.native/@blur/g'
find src -type f -name "*.vue" | xargs sed -i 's/@keyup\.native/@keyup/g'
find src -type f -name "*.vue" | xargs sed -i 's/@keydown\.native/@keydown/g'

# Replace process.env with import.meta.env
find src -type f -name "*.vue" -o -name "*.js" | xargs sed -i 's/process\.env\.VUE_APP_/import\.meta\.env\.VITE_/g'
find src -type f -name "*.vue" -o -name "*.js" | xargs sed -i 's/process\.env\.NODE_ENV/import\.meta\.env\.MODE/g'

echo "Done fixing final Vue 2 to Vue 3 issues"
