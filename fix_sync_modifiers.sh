#!/bin/bash

echo "Fixing .sync modifiers in Vue templates..."

# Find all Vue files with .sync modifiers
FILES_WITH_SYNC=$(grep -l "\.sync" --include="*.vue" -r src/)

# Process each file
for FILE in $FILES_WITH_SYNC; do
  echo "Processing $FILE..."
  
  # Create a backup of the file
  cp "$FILE" "${FILE}.bak"
  
  # Replace :current-page.sync with v-model:current-page
  sed -i 's/:current-page\.sync="/:current-page="/' "$FILE"
  sed -i 's/:current-page\.sync=/v-model:current-page=/' "$FILE"
  
  # Replace :visible.sync with v-model:visible
  sed -i 's/:visible\.sync="/:visible="/' "$FILE"
  sed -i 's/:visible\.sync=/v-model:visible=/' "$FILE"
  
  # Replace :value.sync with v-model:value
  sed -i 's/:value\.sync="/:value="/' "$FILE"
  sed -i 's/:value\.sync=/v-model:value=/' "$FILE"
  
  # Replace other common .sync props
  sed -i 's/\([a-zA-Z0-9-]\+\)\.sync=/v-model:\1=/g' "$FILE"
  
  # Add @update events for the replaced .sync props
  sed -i 's/:current-page="\([^"]*\)"/:current-page="\1" @update:current-page="\1 = $event"/g' "$FILE"
  sed -i 's/:visible="\([^"]*\)"/:visible="\1" @update:visible="\1 = $event"/g' "$FILE"
  sed -i 's/:value="\([^"]*\)"/:value="\1" @update:value="\1 = $event"/g' "$FILE"
done

echo "Done fixing .sync modifiers in Vue templates"
