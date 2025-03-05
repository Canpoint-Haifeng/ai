#!/bin/bash

echo "Fixing SASS @use rule order issues in all Vue files..."

# Find all Vue files
find src -name "*.vue" > all_vue_files.txt

# Process each Vue file
while IFS= read -r file; do
  echo "Processing $file..."
  
  # Check if the file contains a style section
  if grep -q "<style" "$file"; then
    # Extract the style section
    sed -n '/<style/,/<\/style>/p' "$file" > style_section.tmp
    
    # Check if the style section contains @use or @import rules
    if grep -q "@use\|@import" style_section.tmp; then
      echo "  Found @use or @import rules in $file"
      
      # Create a backup of the original file
      cp "$file" "$file.backup"
      
      # Extract the style tag
      style_tag=$(grep "<style" "$file")
      
      # Extract all @use rules
      grep "@use" style_section.tmp > use_rules.tmp || touch use_rules.tmp
      
      # Extract all @import rules
      grep "@import" style_section.tmp > import_rules.tmp || touch import_rules.tmp
      
      # Remove the @use and @import rules from the style section
      grep -v "@use\|@import" style_section.tmp > style_without_imports.tmp
      
      # Create a new style section with @use rules at the beginning, followed by @import rules
      echo "$style_tag" > new_style_section.tmp
      cat use_rules.tmp >> new_style_section.tmp
      cat import_rules.tmp >> new_style_section.tmp
      grep -v "<style" style_without_imports.tmp | grep -v "</style>" >> new_style_section.tmp
      echo "</style>" >> new_style_section.tmp
      
      # Replace the old style section with the new one
      sed '/<style/,/<\/style>/d' "$file" > without_style.tmp
      
      # Find the line number where the style section should be inserted
      line_num=$(grep -n "</script>" without_style.tmp | tail -1 | cut -d: -f1)
      
      if [ -n "$line_num" ]; then
        # Insert the new style section after the script section
        head -n $line_num without_style.tmp > new_file.tmp
        cat new_style_section.tmp >> new_file.tmp
        tail -n +$((line_num + 1)) without_style.tmp >> new_file.tmp
      else
        # If there's no script section, insert at the end of the template section
        line_num=$(grep -n "</template>" without_style.tmp | tail -1 | cut -d: -f1)
        
        if [ -n "$line_num" ]; then
          head -n $line_num without_style.tmp > new_file.tmp
          cat new_style_section.tmp >> new_file.tmp
          tail -n +$((line_num + 1)) without_style.tmp >> new_file.tmp
        else
          # If there's no template section either, just append to the end
          cat without_style.tmp > new_file.tmp
          cat new_style_section.tmp >> new_file.tmp
        fi
      fi
      
      # Replace the original file with the new one
      mv new_file.tmp "$file"
      
      echo "  Fixed SASS @use rule order issues in $file"
    else
      echo "  No @use or @import rules found in $file"
    fi
    
    # Clean up temporary files
    rm -f style_section.tmp use_rules.tmp import_rules.tmp style_without_imports.tmp without_style.tmp new_style_section.tmp
  fi
done < all_vue_files.txt

# Clean up
rm -f all_vue_files.txt

echo "Successfully fixed SASS @use rule order issues in all Vue files."
