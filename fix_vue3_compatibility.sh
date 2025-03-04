#!/bin/bash

# Script to fix Vue 3 compatibility issues in a Vue 2 project

echo "Starting Vue 3 compatibility fixes..."

# Function to replace deep selectors
fix_deep_selectors() {
  echo "Fixing deep selectors..."
  find src -type f -name "*.vue" -exec sed -i 's|/deep/|:deep(|g' {} \;
  find src -type f -name "*.vue" -exec sed -i 's|>>>/|:deep(|g' {} \;
  find src -type f -name "*.vue" -exec sed -i 's|::v-deep|:deep(|g' {} \;
  
  # Add closing parenthesis to :deep( selectors
  find src -type f -name "*.vue" -exec sed -i 's/:deep(\([^)]*\)/:deep(\1)/g' {} \;
}

# Function to update v-model syntax
fix_v_model() {
  echo "Fixing v-model syntax..."
  find src -type f -name "*.vue" -exec sed -i 's/v-model:visible="visible"/\:visible="visible" @update:visible="visible = \$event"/g' {} \;
  find src -type f -name "*.vue" -exec sed -i 's/v-model:visible/\:visible/g' {} \;
}

# Function to remove .native event modifiers
fix_native_modifiers() {
  echo "Removing .native event modifiers..."
  find src -type f -name "*.vue" -exec sed -i 's/@click.native/@click/g' {} \;
  find src -type f -name "*.vue" -exec sed -i 's/@change.native/@change/g' {} \;
  find src -type f -name "*.vue" -exec sed -i 's/@input.native/@input/g' {} \;
  find src -type f -name "*.vue" -exec sed -i 's/@keyup.native/@keyup/g' {} \;
  find src -type f -name "*.vue" -exec sed -i 's/@keydown.native/@keydown/g' {} \;
  find src -type f -name "*.vue" -exec sed -i 's/@focus.native/@focus/g' {} \;
  find src -type f -name "*.vue" -exec sed -i 's/@blur.native/@blur/g' {} \;
}

# Function to update slot syntax
fix_slot_syntax() {
  echo "Updating slot syntax..."
  find src -type f -name "*.vue" -exec sed -i 's/<template slot="/<template #/g' {} \;
  find src -type f -name "*.vue" -exec sed -i 's/<template v-slot:/<template #/g' {} \;
  find src -type f -name "*.vue" -exec sed -i 's/slot="title"/#title/g' {} \;
  find src -type f -name "*.vue" -exec sed -i 's/slot="header"/#header/g' {} \;
  find src -type f -name "*.vue" -exec sed -i 's/slot="footer"/#footer/g' {} \;
  find src -type f -name "*.vue" -exec sed -i 's/slot="default"/#default/g' {} \;
}

# Function to fix scoped slots
fix_scoped_slots() {
  echo "Fixing scoped slots..."
  find src -type f -name "*.vue" -exec sed -i 's/slot-scope=/v-slot:/g' {} \;
  find src -type f -name "*.vue" -exec sed -i 's/scope=/v-slot:/g' {} \;
}

# Run all fixes
fix_deep_selectors
fix_v_model
fix_native_modifiers
fix_slot_syntax
fix_scoped_slots

echo "Vue 3 compatibility fixes completed!"
