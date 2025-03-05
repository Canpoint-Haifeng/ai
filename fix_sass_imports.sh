#!/bin/bash

# Add the variables.scss import to the element-rewrite.scss file
if ! grep -q "@import \"./variables.scss\";" src/assets/css/element-rewrite.scss; then
  sed -i '1i @import "./variables.scss";' src/assets/css/element-rewrite.scss
  echo "Added variables.scss import to element-rewrite.scss"
fi

# Check other SCSS files for missing imports
find src/assets/css -name "*.scss" -type f | while read -r file; do
  if [ "$file" != "src/assets/css/variables.scss" ] && [ "$file" != "src/assets/css/mixins.scss" ]; then
    if ! grep -q "@import \"./variables.scss\";" "$file" && ! grep -q "@import './variables.scss';" "$file"; then
      sed -i '1i @import "./variables.scss";' "$file"
      echo "Added variables.scss import to $file"
    fi
  fi
done

echo "Finished adding variables.scss imports to SCSS files"
