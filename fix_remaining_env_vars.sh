#!/bin/bash

echo "Fixing remaining environment variables..."
find src -type f -name "*.js" -o -name "*.vue" | xargs sed -i 's/process\.env\.VUE_APP_/import.meta.env.VITE_/g'
find src -type f -name "*.js" -o -name "*.vue" | xargs sed -i 's/process\.env\.NODE_ENV/import.meta.env.MODE/g'

echo "Done fixing environment variables"
