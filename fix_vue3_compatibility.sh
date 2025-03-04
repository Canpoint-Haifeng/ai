#!/bin/bash
# Automated fixes for Vue 3 compatibility

echo "Fixing Vue 3 compatibility issues..."

# Deep selector conversion
echo "Converting deep selectors..."
find src -name "*.vue" -type f -exec sed -i 's|\/deep\/|:deep(|g' {} \;
find src -name "*.vue" -type f -exec sed -i 's|>>>.el-|:deep(.el-|g' {} \;

# V-model syntax update
echo "Updating v-model syntax..."
find src -name "*.vue" -type f -exec sed -i 's|:visible.sync="visible"|:visible="visible" @update:visible="visible = \$event"|g' {} \;
find src -name "*.vue" -type f -exec sed -i 's|v-model:visible="visible"|:visible="visible" @update:visible="visible = \$event"|g' {} \;

# Remove .native event modifiers
echo "Removing .native event modifiers..."
find src -name "*.vue" -type f -exec sed -i 's|@click.native|@click|g' {} \;
find src -name "*.vue" -type f -exec sed -i 's|@keyup.enter.native|@keyup.enter|g' {} \;

# Update slot syntax
echo "Updating slot syntax..."
find src -name "*.vue" -type f -exec sed -i 's|<template slot="|<template #|g' {} \;

echo "Vue 3 compatibility fixes completed!"
