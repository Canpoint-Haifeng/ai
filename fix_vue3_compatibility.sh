#!/bin/bash

# Fix deep selectors in all Vue files
find src -name "*.vue" -type f -exec sed -i 's|\/deep\/|:deep(|g' {} \;
find src -name "*.vue" -type f -exec sed -i 's|>>>.el-|:deep(.el-|g' {} \;

# Fix v-model syntax in all Vue files
find src -name "*.vue" -type f -exec sed -i 's|v-model:visible="visible"|:visible="visible" @update:visible="visible = \$event"|g' {} \;

# Remove .native event modifiers in all Vue files
find src -name "*.vue" -type f -exec sed -i 's|@click.native|@click|g' {} \;
find src -name "*.vue" -type f -exec sed -i 's|@keyup.enter.native|@keyup.enter|g' {} \;

# Fix slot syntax in all Vue files
find src -name "*.vue" -type f -exec sed -i 's|slot="title"|#title|g' {} \;
find src -name "*.vue" -type f -exec sed -i 's|slot="footer"|#footer|g' {} \;
find src -name "*.vue" -type f -exec sed -i 's|slot="prefix"|#prefix|g' {} \;
find src -name "*.vue" -type f -exec sed -i 's|slot="suffix"|#suffix|g' {} \;
find src -name "*.vue" -type f -exec sed -i 's|slot="default"|#default|g' {} \;
find src -name "*.vue" -type f -exec sed -i 's|slot="header"|#header|g' {} \;
