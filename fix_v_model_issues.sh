#!/bin/bash

# Fix v-model issues in CpReceiveReward.vue
if [ -f src/components/AuthorityVip/dialog/CpReceiveReward.vue ]; then
  echo "Fixing v-model issues in CpReceiveReward.vue"
  
  # Create a backup of the original file
  cp src/components/AuthorityVip/dialog/CpReceiveReward.vue src/components/AuthorityVip/dialog/CpReceiveReward.vue.backup
  
  # Replace v-model="visible" with :visible="visible" @update:visible="$emit('update:visible', $event)"
  sed -i 's/v-model="visible"/:visible="visible" @update:visible="$emit('\''update:visible'\'', \$event)"/' src/components/AuthorityVip/dialog/CpReceiveReward.vue
  
  echo "Fixed v-model issues in CpReceiveReward.vue"
fi

# Find all Vue files that might have v-model issues with el-dialog
find src -name "*.vue" -exec grep -l "v-model=\"visible\"" {} \; | grep -v "CpReceiveReward.vue" > vue_files_with_v_model.txt

# Fix v-model issues in all found files
while IFS= read -r file; do
  echo "Fixing v-model issues in $file"
  
  # Create a backup of the original file
  cp "$file" "$file.backup"
  
  # Replace v-model="visible" with :visible="visible" @update:visible="$emit('update:visible', $event)"
  sed -i 's/v-model="visible"/:visible="visible" @update:visible="$emit('\''update:visible'\'', \$event)"/' "$file"
  
  echo "Fixed v-model issues in $file"
done < vue_files_with_v_model.txt

echo "Fixed all v-model issues in Vue files"
