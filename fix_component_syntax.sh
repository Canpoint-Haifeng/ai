#!/bin/bash

echo "Fixing component syntax issues..."

# Fix issues with duplicate imports
find src -type f -name "*.vue" | while read -r file; do
  # Check if the file has duplicate imports
  if grep -q "import { .* } from 'vue'" "$file" && grep -q "import { .* } from \"vue\"" "$file"; then
    echo "Fixing duplicate imports in $file"
    # Create a backup
    cp "$file" "${file}.bak"
    
    # Extract all imports from 'vue'
    single_quotes=$(grep -o "import { .* } from 'vue'" "$file" | sed -E "s/import \{ (.*) \} from 'vue'/\1/")
    double_quotes=$(grep -o "import { .* } from \"vue\"" "$file" | sed -E "s/import \{ (.*) \} from \"vue\"/\1/")
    
    # Combine imports
    all_imports="$single_quotes, $double_quotes"
    
    # Remove duplicate imports
    unique_imports=$(echo "$all_imports" | tr ',' '\n' | sed 's/^ *//' | sed 's/ *$//' | sort -u | tr '\n' ',' | sed 's/,/, /g' | sed 's/, $//')
    
    # Replace with a single import
    sed -i "/import { .* } from ['\"]vue['\"]/d" "$file"
    sed -i "1s/^/import { $unique_imports } from 'vue'\n/" "$file"
  fi
done

# Fix issues with defineComponent syntax
find src -type f -name "*.vue" | while read -r file; do
  # Check if the file has syntax issues with defineComponent
  if grep -q "export default defineComponent({" "$file" && grep -q "}))" "$file"; then
    echo "Fixing defineComponent syntax in $file"
    # Create a backup
    cp "$file" "${file}.bak"
    
    # Replace })) with })
    sed -i "s/}))/})/g" "$file"
  fi
done

# Fix issues with setup() syntax
find src -type f -name "*.vue" | while read -r file; do
  # Check if the file has syntax issues with setup()
  if grep -q "setup() {" "$file" && grep -q "  })" "$file"; then
    echo "Fixing setup() syntax in $file"
    # Create a backup
    cp "$file" "${file}.bak"
    
    # Replace }) with }
    sed -i "s/  })/  }/g" "$file"
    
    # Add missing closing bracket
    sed -i "/^  }/a})" "$file"
  fi
done

echo "Done fixing component syntax issues"
