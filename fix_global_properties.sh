#!/bin/bash

echo "Fixing Vue 2 global properties to Vue 3 equivalents..."

# Update main.js to use app.config.globalProperties instead of Vue.prototype
if grep -q "Vue.prototype" src/main.js; then
  sed -i 's/Vue.prototype.\([a-zA-Z0-9_$]*\) = \(.*\)/app.config.globalProperties.\1 = \2/g' src/main.js
fi

echo "Global properties fixed."
