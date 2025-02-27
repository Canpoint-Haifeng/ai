#!/bin/bash

echo "Fixing .native event modifiers..."
find src -type f -name "*.vue" | xargs sed -i 's/@keyup\.enter\.native/@keyup.enter/g'
find src -type f -name "*.vue" | xargs sed -i 's/@keyup\.native/@keyup/g'
find src -type f -name "*.vue" | xargs sed -i 's/@click\.native/@click/g'
find src -type f -name "*.vue" | xargs sed -i 's/@change\.native/@change/g'
find src -type f -name "*.vue" | xargs sed -i 's/@input\.native/@input/g'
find src -type f -name "*.vue" | xargs sed -i 's/@focus\.native/@focus/g'
find src -type f -name "*.vue" | xargs sed -i 's/@blur\.native/@blur/g'
find src -type f -name "*.vue" | xargs sed -i 's/@keydown\.native/@keydown/g'

echo "Done fixing .native event modifiers"
