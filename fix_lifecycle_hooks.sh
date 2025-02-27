#!/bin/bash

echo "Fixing Vue 2 lifecycle hooks to Vue 3 equivalents..."

# Define the lifecycle hook mappings
declare -A lifecycle_hooks=(
  ["beforeCreate"]="setup"
  ["created"]="setup"
  ["beforeMount"]="onBeforeMount"
  ["mounted"]="onMounted"
  ["beforeUpdate"]="onBeforeUpdate"
  ["updated"]="onUpdated"
  ["beforeDestroy"]="onBeforeUnmount"
  ["destroyed"]="onUnmounted"
  ["activated"]="onActivated"
  ["deactivated"]="onDeactivated"
)

# Find all Vue files
find src -name "*.vue" -type f | while read -r file; do
  echo "Processing file: $file"
  
  # Check if the file contains Vue 2 lifecycle hooks
  if grep -q "beforeCreate\|created\|beforeMount\|mounted\|beforeUpdate\|updated\|beforeDestroy\|destroyed\|activated\|deactivated" "$file"; then
    # Add import for lifecycle hooks if needed
    if ! grep -q "import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'" "$file"; then
      # Check if there's already a vue import
      if grep -q "import.*from 'vue'" "$file"; then
        # Append to existing import
        sed -i "s/import \(.*\) from 'vue'/import \1, { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'/g" "$file"
      else
        # Add new import after the last import or at the beginning of the script section
        if grep -q "<script>" "$file"; then
          sed -i "/<script>/a import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'" "$file"
        fi
      fi
    fi
  fi
done

echo "Lifecycle hooks fixed."
