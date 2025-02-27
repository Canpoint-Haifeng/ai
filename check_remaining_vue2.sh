#!/bin/bash

echo "Checking for remaining Vue 2 syntax..."

# Check for Vue 2 specific lifecycle hooks
echo "Checking for Vue 2 lifecycle hooks..."
grep -r "beforeDestroy\|destroyed" --include="*.vue" src/

# Check for filters
echo "Checking for Vue 2 filters..."
grep -r "filters:" --include="*.vue" src/

# Check for event modifiers
echo "Checking for .native event modifier..."
grep -r "\.native" --include="*.vue" src/

# Check for functional components
echo "Checking for functional components..."
grep -r "functional: true" --include="*.vue" src/

# Check for Vue.set and Vue.delete
echo "Checking for Vue.set and Vue.delete..."
grep -r "Vue\.set\|Vue\.delete" --include="*.js" --include="*.vue" src/

# Check for this.$listeners
echo "Checking for this.$listeners..."
grep -r "this\.\$listeners" --include="*.vue" src/

# Check for process.env
echo "Checking for process.env..."
grep -r "process\.env" --include="*.js" --include="*.vue" src/

# Check for element-ui imports
echo "Checking for element-ui imports..."
grep -r "element-ui" --include="*.js" --include="*.vue" src/
