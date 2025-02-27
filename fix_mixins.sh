#!/bin/bash

# Find all Vue files with SCSS style blocks that use the flex mixin
find src -name "*.vue" -type f -exec grep -l "@include flex" {} \; | while read -r file; do
  # Replace the flex mixin with the expanded properties
  sed -i 's/@include flex();/display: flex;\n  flex-direction: row;\n  flex-wrap: nowrap;\n  align-items: center;/g' "$file"
  echo "Fixed flex mixin in $file"
done

# Find all Vue files with SCSS style blocks that use the textEllipsis mixin
find src -name "*.vue" -type f -exec grep -l "@include textEllipsis" {} \; | while read -r file; do
  # Replace the textEllipsis mixin with the expanded properties
  sed -i 's/@include textEllipsis();/overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;/g' "$file"
  echo "Fixed textEllipsis mixin in $file"
done

# Find all Vue files with SCSS style blocks that use the multiLineEllipsis mixin
find src -name "*.vue" -type f -exec grep -l "@include multiLineEllipsis" {} \; | while read -r file; do
  # Replace the multiLineEllipsis mixin with the expanded properties
  sed -i 's/@include multiLineEllipsis(\([0-9]\+\));/overflow: hidden;\n  text-overflow: ellipsis;\n  display: -webkit-box;\n  -webkit-box-orient: vertical;\n  -webkit-line-clamp: \1;/g' "$file"
  echo "Fixed multiLineEllipsis mixin in $file"
done
