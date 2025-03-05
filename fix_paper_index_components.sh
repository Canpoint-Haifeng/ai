#!/bin/bash

# Check if paper-index.vue exists
if [ ! -f src/views/paper-index/paper-index.vue ]; then
  echo "paper-index.vue not found"
  exit 1
fi

# Create a backup of the original file
cp src/views/paper-index/paper-index.vue src/views/paper-index/paper-index.vue.backup

# Fix all import statements in paper-index.vue
sed -i 's/import \([^ ]*\) from '\''@\/\([^.]*\)'\''$/import \1 from '\''@\/\2.js'\''/' src/views/paper-index/paper-index.vue
sed -i 's/import \([^ ]*\) from '\''@\/\([^.]*\)'\''$/import \1 from '\''@\/\2.vue'\''/' src/views/paper-index/paper-index.vue
sed -i 's/import \([^ ]*\) from '\''\.\.\(\/[^.]*\)'\''$/import \1 from '\''\.\.\2.vue'\''/' src/views/paper-index/paper-index.vue
sed -i 's/import \([^ ]*\) from '\''\.\(\/[^.]*\)'\''$/import \1 from '\''\.\2.vue'\''/' src/views/paper-index/paper-index.vue

# Fix specific import statements
sed -i 's/import CpVipLoginActivity from '\''@\/components\/Backtop\/CpVipLoginActivity.js'\''/import CpVipLoginActivity from '\''@\/components\/Backtop\/CpVipLoginActivity.vue'\''/' src/views/paper-index/paper-index.vue
sed -i 's/import Carousel from '\''@\/components\/Carousel\/Carousel'\''/import Carousel from '\''@\/components\/Carousel\/Carousel.vue'\''/' src/views/paper-index/paper-index.vue
sed -i 's/import imgSrc1 from '\''@\/assets\/images\/index\/banner1.png'\''/import imgSrc1 from '\''@\/assets\/images\/index\/banner1.png'\''/' src/views/paper-index/paper-index.vue
sed -i 's/import imgSrc3 from '\''@\/assets\/images\/index\/banner3.png'\''/import imgSrc3 from '\''@\/assets\/images\/index\/banner3.png'\''/' src/views/paper-index/paper-index.vue
sed -i 's/import VipOne from '\''@\/assets\/images\/vip1.png'\''/import VipOne from '\''@\/assets\/images\/vip1.png'\''/' src/views/paper-index/paper-index.vue
sed -i 's/import VipTwo from '\''@\/assets\/images\/vip2.png'\''/import VipTwo from '\''@\/assets\/images\/vip2.png'\''/' src/views/paper-index/paper-index.vue
sed -i 's/import ClaimPointsBox from '\''\.\/compontents\/ClaimPointsBox'\''/import ClaimPointsBox from '\''\.\/compontents\/ClaimPointsBox.vue'\''/' src/views/paper-index/paper-index.vue
sed -i 's/import parallelPaperBox from '\''\.\/compontents\/parallel-paper-box'\''/import parallelPaperBox from '\''\.\/compontents\/parallel-paper-box.vue'\''/' src/views/paper-index/paper-index.vue
sed -i 's/import MyCompositionPaper from '\''\.\/compontents\/MyCompositionPaper'\''/import MyCompositionPaper from '\''\.\/compontents\/MyCompositionPaper.vue'\''/' src/views/paper-index/paper-index.vue

# Check if the components directory exists
mkdir -p src/views/paper-index/compontents

# Check if the components exist, if not, extract them from src.zip
if [ ! -f src/views/paper-index/compontents/ClaimPointsBox.vue ]; then
  unzip -j ~/attachments/23f993ef-a4ad-4230-a7fb-0a3d452a5908/src.zip "src/views/paper-index/compontents/ClaimPointsBox.vue" -d src/views/paper-index/compontents/ || echo "Failed to extract ClaimPointsBox.vue"
fi

if [ ! -f src/views/paper-index/compontents/parallel-paper-box.vue ]; then
  unzip -j ~/attachments/23f993ef-a4ad-4230-a7fb-0a3d452a5908/src.zip "src/views/paper-index/compontents/parallel-paper-box.vue" -d src/views/paper-index/compontents/ || echo "Failed to extract parallel-paper-box.vue"
fi

if [ ! -f src/views/paper-index/compontents/MyCompositionPaper.vue ]; then
  unzip -j ~/attachments/23f993ef-a4ad-4230-a7fb-0a3d452a5908/src.zip "src/views/paper-index/compontents/MyCompositionPaper.vue" -d src/views/paper-index/compontents/ || echo "Failed to extract MyCompositionPaper.vue"
fi

if [ ! -f src/components/Carousel/Carousel.vue ]; then
  mkdir -p src/components/Carousel
  unzip -j ~/attachments/23f993ef-a4ad-4230-a7fb-0a3d452a5908/src.zip "src/components/Carousel/Carousel.vue" -d src/components/Carousel/ || echo "Failed to extract Carousel.vue"
fi

echo "Fixed all component imports in paper-index.vue"
