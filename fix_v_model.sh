#!/bin/bash

echo "修复v-model用法..."
grep -r "v-model\." --include="*.vue" src/ | while read -r line; do
  file=$(echo "$line" | cut -d':' -f1)
  echo "处理文件: $file"
  sed -i 's/v-model\.\([a-zA-Z0-9]*\)/v-model:\1/g' "$file"
done
echo "v-model用法修复完成。"
