#!/bin/bash

# Fix SASS @use rule issues in LoginActivationVipDialog.vue
if [ -f src/components/AuthorityVip/dialog/LoginActivationVipDialog.vue ]; then
  echo "Fixing SASS @use rule issues in LoginActivationVipDialog.vue"
  
  # Create a backup of the original file
  cp src/components/AuthorityVip/dialog/LoginActivationVipDialog.vue src/components/AuthorityVip/dialog/LoginActivationVipDialog.vue.backup
  
  # Extract the style section
  sed -n '/<style/,/<\/style>/p' src/components/AuthorityVip/dialog/LoginActivationVipDialog.vue > style_section.tmp
  
  # Check if the style section contains @use rules
  if grep -q "@use" style_section.tmp; then
    # Extract the @use rules
    grep "@use" style_section.tmp > use_rules.tmp
    
    # Remove the @use rules from the style section
    grep -v "@use" style_section.tmp > style_without_use.tmp
    
    # Create a new style section with @use rules at the beginning
    echo "<style lang=\"scss\" scoped>" > new_style_section.tmp
    cat use_rules.tmp >> new_style_section.tmp
    cat style_without_use.tmp | grep -v "<style" | grep -v "</style>" >> new_style_section.tmp
    echo "</style>" >> new_style_section.tmp
    
    # Replace the old style section with the new one
    sed '/<style/,/<\/style>/d' src/components/AuthorityVip/dialog/LoginActivationVipDialog.vue > without_style.tmp
    
    # Find the line number where the style section should be inserted
    line_num=$(grep -n "</script>" without_style.tmp | tail -1 | cut -d: -f1)
    
    # Insert the new style section after the script section
    head -n $line_num without_style.tmp > new_file.tmp
    cat new_style_section.tmp >> new_file.tmp
    tail -n +$((line_num + 1)) without_style.tmp >> new_file.tmp
    
    # Replace the original file with the new one
    mv new_file.tmp src/components/AuthorityVip/dialog/LoginActivationVipDialog.vue
    
    echo "Fixed SASS @use rule issues in LoginActivationVipDialog.vue"
  else
    echo "No @use rules found in LoginActivationVipDialog.vue"
  fi
  
  # Clean up temporary files
  rm -f style_section.tmp use_rules.tmp style_without_use.tmp without_style.tmp new_style_section.tmp
fi

# Find all Vue files that might have SASS @use rule issues
find src -name "*.vue" -exec grep -l "@use" {} \; | grep -v "LoginActivationVipDialog.vue" > vue_files_with_use.txt

# Fix SASS @use rule issues in all found files
while IFS= read -r file; do
  echo "Fixing SASS @use rule issues in $file"
  
  # Create a backup of the original file
  cp "$file" "$file.backup"
  
  # Extract the style section
  sed -n '/<style/,/<\/style>/p' "$file" > style_section.tmp
  
  # Check if the style section contains @use rules
  if grep -q "@use" style_section.tmp; then
    # Extract the @use rules
    grep "@use" style_section.tmp > use_rules.tmp
    
    # Remove the @use rules from the style section
    grep -v "@use" style_section.tmp > style_without_use.tmp
    
    # Create a new style section with @use rules at the beginning
    echo "<style lang=\"scss\" scoped>" > new_style_section.tmp
    cat use_rules.tmp >> new_style_section.tmp
    cat style_without_use.tmp | grep -v "<style" | grep -v "</style>" >> new_style_section.tmp
    echo "</style>" >> new_style_section.tmp
    
    # Replace the old style section with the new one
    sed '/<style/,/<\/style>/d' "$file" > without_style.tmp
    
    # Find the line number where the style section should be inserted
    line_num=$(grep -n "</script>" without_style.tmp | tail -1 | cut -d: -f1)
    
    # Insert the new style section after the script section
    head -n $line_num without_style.tmp > new_file.tmp
    cat new_style_section.tmp >> new_file.tmp
    tail -n +$((line_num + 1)) without_style.tmp >> new_file.tmp
    
    # Replace the original file with the new one
    mv new_file.tmp "$file"
    
    echo "Fixed SASS @use rule issues in $file"
  else
    echo "No @use rules found in $file"
  fi
  
  # Clean up temporary files
  rm -f style_section.tmp use_rules.tmp style_without_use.tmp without_style.tmp new_style_section.tmp
done < vue_files_with_use.txt

echo "Fixed all SASS @use rule issues in Vue files"
