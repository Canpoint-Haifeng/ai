#!/bin/bash
# Comprehensive script to fix Vue 3 compatibility issues

echo "Starting Vue 3 compatibility fixes..."

# Fix deep selectors
echo "Fixing deep selectors..."
find src -name "*.vue" -type f -exec sed -i 's|\/deep\/|:deep(|g' {} \;
find src -name "*.vue" -type f -exec sed -i 's|>>>.el-|:deep(.el-|g' {} \;

# Fix v-model syntax
echo "Fixing v-model syntax..."
find src -name "*.vue" -type f -exec sed -i 's|:visible.sync="visible"|:visible="visible" @update:visible="visible = \$event"|g' {} \;
find src -name "*.vue" -type f -exec sed -i 's|v-model:visible="visible"|:visible="visible" @update:visible="visible = \$event"|g' {} \;

# Remove .native event modifiers
echo "Removing .native event modifiers..."
find src -name "*.vue" -type f -exec sed -i 's|@click.native|@click|g' {} \;
find src -name "*.vue" -type f -exec sed -i 's|@keyup.enter.native|@keyup.enter|g' {} \;

# Update slot syntax
echo "Updating slot syntax..."
find src -name "*.vue" -type f -exec sed -i 's|<template slot="|<template #|g' {} \;
find src -name "*.vue" -type f -exec sed -i 's|slot="|#|g' {} \;

# Fix scoped slots
echo "Fixing scoped slots..."
find src -name "*.vue" -type f -exec sed -i 's|slot-scope="|v-slot:|g' {} \;
find src -name "*.vue" -type f -exec sed -i 's|scope="|v-slot:|g' {} \;

# Fix v-bind.sync
echo "Fixing v-bind.sync..."
find src -name "*.vue" -type f -exec sed -i 's|:([a-zA-Z0-9_-]+).sync="|:$1="$2" @update:$1="|g' {} \;

echo "Vue 3 compatibility fixes completed!"
