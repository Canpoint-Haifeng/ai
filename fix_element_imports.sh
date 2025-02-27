#!/bin/bash

echo "Fixing Element UI imports to Element Plus equivalents..."

# Update main.js to use Element Plus instead of Element UI
if grep -q "import ElementUI from 'element-ui'" src/main.js; then
  sed -i 's/import ElementUI from .element-ui./import ElementPlus from "element-plus"\nimport "element-plus\/dist\/index.css"/' src/main.js
  sed -i 's/Vue.use(ElementUI)/app.use(ElementPlus)/' src/main.js
fi

# Update component imports
find src -name "*.vue" -type f | xargs grep -l "import.*from 'element-ui'" | while read -r file; do
  echo "Processing file: $file"
  sed -i 's/import { \(.*\) } from .element-ui./import { El\1 } from "element-plus"/' "$file"
  sed -i 's/import \(.*\) from .element-ui\/lib\/\(.*\)./import { El\1 } from "element-plus"/' "$file"
done

# Update element-ui components to element-plus components in templates
find src -name "*.vue" -type f | while read -r file; do
  echo "Processing template in file: $file"
  sed -i 's/<el-\([a-z-]*\)/<el-\1/g' "$file"
done

echo "Element UI imports fixed."
