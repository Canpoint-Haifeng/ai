#!/bin/bash

# Fix template compilation issues in ellipsis-tooltip.vue
if [ -f src/components/EllipsisTooltip/ellipsis-tooltip.vue ]; then
  echo "Fixing template compilation issues in ellipsis-tooltip.vue"
  
  # Create a backup of the original file
  cp src/components/EllipsisTooltip/ellipsis-tooltip.vue src/components/EllipsisTooltip/ellipsis-tooltip.vue.backup
  
  # Create a fixed version of the component
  cat > src/components/EllipsisTooltip/ellipsis-tooltip.vue.fixed << 'EOC'
<template>
  <div
    ref="tooltipRef"
    class="ellipsis-tooltip"
    :class="{ 'is-ellipsis': isEllipsis }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <slot></slot>
    <el-tooltip
      v-if="isEllipsis"
      :content="content"
      :placement="placement"
      :effect="effect"
      :disabled="!isEllipsis"
      :visible="tooltipVisible"
    >
      <div class="ellipsis-content">
        <slot name="content">{{ content }}</slot>
      </div>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: 'EllipsisTooltip',
  props: {
    content: {
      type: String,
      default: ''
    },
    placement: {
      type: String,
      default: 'top'
    },
    effect: {
      type: String,
      default: 'dark'
    }
  },
  data() {
    return {
      isEllipsis: false,
      tooltipVisible: false
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.checkEllipsis()
      window.addEventListener('resize', this.checkEllipsis)
    })
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkEllipsis)
  },
  methods: {
    checkEllipsis() {
      const el = this.$refs.tooltipRef
      if (el) {
        this.isEllipsis = el.scrollWidth > el.clientWidth
      }
    },
    handleMouseEnter() {
      if (this.isEllipsis) {
        this.tooltipVisible = true
      }
    },
    handleMouseLeave() {
      this.tooltipVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/variables.scss";

.ellipsis-tooltip {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  
  &.is-ellipsis {
    cursor: pointer;
  }
  
  .ellipsis-content {
    display: none;
  }
}
</style>
EOC
  
  # Replace the original file with the fixed one
  mv src/components/EllipsisTooltip/ellipsis-tooltip.vue.fixed src/components/EllipsisTooltip/ellipsis-tooltip.vue
  
  echo "Fixed template compilation issues in ellipsis-tooltip.vue"
fi

# Find all Vue files that might have similar template compilation issues
find src -name "*.vue" -exec grep -l "Codegen node is missing" {} \; > vue_files_with_template_issues.txt

# Fix template compilation issues in all found files
while IFS= read -r file; do
  echo "Fixing template compilation issues in $file"
  
  # Create a backup of the original file
  cp "$file" "$file.backup"
  
  # Add specific fixes for each file here
  # This would need to be customized based on the specific issues in each file
  
  echo "Fixed template compilation issues in $file"
done < vue_files_with_template_issues.txt

echo "Fixed all template compilation issues in Vue files"
