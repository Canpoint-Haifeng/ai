#!/bin/bash

echo "修复SCSS深度选择器..."
grep -r "/deep/" --include="*.vue" --include="*.scss" src/ | while read -r line; do
  file=$(echo "$line" | cut -d':' -f1)
  echo "处理文件: $file"
  sed -i 's|/deep/|:deep(|g' "$file"
  sed -i 's|>>>\(.*\)|:deep(\1)|g' "$file"
  sed -i 's|::v-deep\(.*\)|:deep(\1)|g' "$file"
done
echo "深度选择器修复完成。"
