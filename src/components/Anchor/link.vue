<template>
  <div
    class="anchor-link"
    @click="handleClick"
  >
    <slot />
  </div>
</template>

<script>
import { defineComponent, ref, reactive, computed, onMounted, watch } from "vue"

export default defineComponent({
  name: 'AnchorLink',
  props: {
    href: {
      type: String,
      required: true
    }
  })

    return {
  methods: {
    handleClick() {
      const target = document.querySelector(this.href)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
.anchor-link {
  padding: 4px 0;
  line-height: 1.5;
  cursor: pointer;
  color: #666;

  &:hover {
    color: #1890ff;
  }
}
</style>