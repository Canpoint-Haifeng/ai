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

