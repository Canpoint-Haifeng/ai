#!/bin/bash

# Fix Vue 3 compatibility issues in the project
echo "Fixing Vue 3 compatibility issues in the project..."

# 1. Fix import statements
echo "1. Fixing import statements..."
find src -name "*.vue" -o -name "*.js" | xargs sed -i 's/import \([^ ]*\) from '\''@\/\([^.]*\)'\''$/import \1 from '\''@\/\2.js'\''/'
find src -name "*.vue" -o -name "*.js" | xargs sed -i 's/import \([^ ]*\) from '\''@\/\([^.]*\)'\''$/import \1 from '\''@\/\2.vue'\''/'
find src -name "*.vue" -o -name "*.js" | xargs sed -i 's/import \([^ ]*\) from '\''\.\.\(\/[^.]*\)'\''$/import \1 from '\''\.\.\2.vue'\''/'
find src -name "*.vue" -o -name "*.js" | xargs sed -i 's/import \([^ ]*\) from '\''\.\(\/[^.]*\)'\''$/import \1 from '\''\.\2.vue'\''/'

# 2. Fix SASS deep selectors
echo "2. Fixing SASS deep selectors..."
find src -name "*.vue" | xargs sed -i 's/>>>/::v-deep/g'
find src -name "*.vue" | xargs sed -i 's/::v-deep/::v-deep(/g'
find src -name "*.vue" | xargs sed -i 's/::v-deep(\([^)]*\))/::v-deep(\1)/g'
find src -name "*.vue" | xargs sed -i 's/::v-deep(/:deep(/g'

# 3. Fix SASS variable imports
echo "3. Fixing SASS variable imports..."
find src -name "*.vue" | xargs sed -i '/<style.*>/a\
@import "@/assets/css/variables.scss";'

# 4. Fix v-model issues
echo "4. Fixing v-model issues..."
find src -name "*.vue" | xargs sed -i 's/v-model="visible"/:visible="visible" @update:visible="$emit('\''update:visible'\'', \$event)"/g'

# 5. Fix SASS @use rule order
echo "5. Fixing SASS @use rule order..."
find src -name "*.vue" | grep -l "@use" | while read -r file; do
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
  fi
  
  # Clean up temporary files
  rm -f style_section.tmp use_rules.tmp style_without_use.tmp without_style.tmp new_style_section.tmp
done

# 6. Fix route paths
echo "6. Fixing route paths..."
find src -name "*.js" | xargs sed -i 's/path: '\''[^\/]/path: '\''\//'

echo "Successfully fixed Vue 3 compatibility issues in the project."
