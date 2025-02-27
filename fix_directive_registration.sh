#!/bin/bash

echo "Fixing Vue 2 directive registration to Vue 3 equivalents..."

# Update main.js to use app.directive instead of Vue.directive
if grep -q "Vue.directive" src/main.js; then
  sed -i 's/Vue.directive(\(.*\), \(.*\))/app.directive(\1, \2)/g' src/main.js
fi

echo "Directive registration fixed."
