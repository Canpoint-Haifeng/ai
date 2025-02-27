#!/bin/bash

echo "修复环境变量使用..."
grep -r "VUE_APP_" --include="*.js" --include="*.vue" src/ | while read -r line; do
  file=$(echo "$line" | cut -d':' -f1)
  echo "处理文件: $file"
  sed -i 's/import\.meta\.env\.VUE_APP_/import.meta.env.VITE_/g' "$file"
done
echo "环境变量修复完成。"
