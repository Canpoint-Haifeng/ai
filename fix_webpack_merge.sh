#!/bin/bash

echo "Fixing webpack-merge import issues..."

# Find files that import webpack-merge
find src -type f -name "*.vue" -o -name "*.js" | xargs grep -l "webpack-merge" | while read -r file; do
  echo "Updating webpack-merge import in $file"
  # Replace webpack-merge with lodash merge
  sed -i 's/import merge from .webpack-merge./import { merge } from "lodash";/g' "$file"
  sed -i 's/import merge from "webpack-merge"/import { merge } from "lodash";/g' "$file"
  sed -i "s/import merge from 'webpack-merge'/import { merge } from 'lodash';/g" "$file"
done

echo "Done fixing webpack-merge import issues"
