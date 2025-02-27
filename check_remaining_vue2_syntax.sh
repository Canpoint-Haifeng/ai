#!/bin/bash

echo "Checking for remaining Vue 2 specific syntax..."

# Check for Vue.prototype
echo "Checking for Vue.prototype..."
grep -r "Vue\.prototype" src/ --include="*.vue" --include="*.js" || echo "No Vue.prototype found"

# Check for Vue.use
echo "Checking for Vue.use..."
grep -r "Vue\.use" src/ --include="*.vue" --include="*.js" || echo "No Vue.use found"

# Check for beforeDestroy
echo "Checking for beforeDestroy..."
grep -r "beforeDestroy" src/ --include="*.vue" --include="*.js" || echo "No beforeDestroy found"

# Check for destroyed
echo "Checking for destroyed..."
grep -r "destroyed" src/ --include="*.vue" --include="*.js" || echo "No destroyed found"

# Check for .sync
echo "Checking for .sync..."
grep -r "\.sync" src/ --include="*.vue" --include="*.js" || echo "No .sync found"

# Check for v-model.
echo "Checking for v-model...."
grep -r "v-model\." src/ --include="*.vue" --include="*.js" || echo "No v-model. found"

# Check for .native
echo "Checking for .native..."
grep -r "\.native" src/ --include="*.vue" --include="*.js" || echo "No .native found"

# Check for process.env
echo "Checking for process.env..."
grep -r "process\.env" src/ --include="*.vue" --include="*.js" || echo "No process.env found"

# Check for filters
echo "Checking for filters..."
grep -r "filters:" src/ --include="*.vue" --include="*.js" || echo "No filters found"

# Check for Vue.extend
echo "Checking for Vue.extend..."
grep -r "Vue\.extend" src/ --include="*.vue" --include="*.js" || echo "No Vue.extend found"

echo "Done checking for remaining Vue 2 specific syntax"
