#!/bin/bash

echo "Fixing CpFan/index.js export issues..."

# Fix CpFan/index.js export names
if [ -f "src/components/CpFan/index.js" ]; then
  echo "Fixing src/components/CpFan/index.js"
  cp "src/components/CpFan/index.js" "src/components/CpFan/index.js.bak"
  
  # Create a completely new version of the file
  cat > "src/components/CpFan/index.js" << 'EOF'
// CpFan components
import CpFileDownloads from './CpFileDownloads.vue'
import CpPageFilter from './Components/CpPageFilter.vue'
import CpSubjectSelect from './Components/CpSubjectSelect.vue'
import LayeredLevel from './Components/LayeredLevel.vue'
import TopPagination from './Components/TopPagination.vue'
import CpNumberInput from './Components/CpNumberInput.vue'
import CpSimilarDialog from './Components/CpSimilarDialog.vue'

// Backward compatibility aliases
const TopPagintion = TopPagination
const CpSimailarDialog = CpSimilarDialog

// Export components for direct use
export {
  CpFileDownloads,
  CpPageFilter,
  CpSubjectSelect,
  LayeredLevel,
  TopPagination,
  TopPagintion,
  CpNumberInput,
  CpSimilarDialog,
  CpSimailarDialog
}

// Export component names for external use
export const LayeredLevelName = LayeredLevel.name

// Default export for Vue plugin installation
export default {
  install(app) {
    app.component(LayeredLevel.name, LayeredLevel)
    app.component(TopPagination.name, TopPagination)
    app.component(CpNumberInput.name, CpNumberInput)
    app.component(CpSimilarDialog.name, CpSimilarDialog)
    app.component(CpFileDownloads.name, CpFileDownloads)
    app.component(CpPageFilter.name, CpPageFilter)
    app.component(CpSubjectSelect.name, CpSubjectSelect)
  }
}
EOF
fi

# Fix files that import TopPagintion
find src -type f -name "*.vue" -o -name "*.js" | xargs grep -l "TopPagintion" | while read -r file; do
  echo "Updating TopPagintion import in $file"
  sed -i 's/TopPagintion/TopPagination/g' "$file"
done

# Fix files that import CpSimailarDialog
find src -type f -name "*.vue" -o -name "*.js" | xargs grep -l "CpSimailarDialog" | while read -r file; do
  echo "Updating CpSimailarDialog import in $file"
  sed -i 's/CpSimailarDialog/CpSimilarDialog/g' "$file"
done

echo "Done fixing CpFan/index.js export issues"
