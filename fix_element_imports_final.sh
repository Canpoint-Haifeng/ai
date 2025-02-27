#!/bin/bash

echo "Fixing Element UI imports to Element Plus (final pass)..."

# Replace element-ui imports with element-plus
find src -type f -name "*.vue" -o -name "*.js" | xargs sed -i 's/import ElementUI from "element-ui"/import ElementPlus from "element-plus"/g'
find src -type f -name "*.vue" -o -name "*.js" | xargs sed -i "s/import ElementUI from 'element-ui'/import ElementPlus from 'element-plus'/g"
find src -type f -name "*.vue" -o -name "*.js" | xargs sed -i 's/import { [^}]* } from "element-ui"/import { & } from "element-plus"/g'
find src -type f -name "*.vue" -o -name "*.js" | xargs sed -i "s/import { [^}]* } from 'element-ui'/import { & } from 'element-plus'/g"

# Replace Vue.use(ElementUI) with app.use(ElementPlus)
find src -type f -name "*.js" | xargs sed -i 's/Vue\.use(ElementUI)/app.use(ElementPlus)/g'

echo "Done fixing Element UI imports to Element Plus"
