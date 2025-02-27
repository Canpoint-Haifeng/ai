#!/bin/bash

echo "Fixing Vue 2 component registration to Vue 3 equivalents..."

# Update main.js to use app.component instead of Vue.component
if grep -q "Vue.component" src/main.js; then
  sed -i 's/Vue.component(\(.*\), \(.*\))/app.component(\1, \2)/g' src/main.js
fi

echo "Component registration fixed."
