<template>
  <div class="layered-level">
    <div class="level-name">{{ name }}</div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LayeredLevel',
  props: {
    name: {
      type: String,
      default: ''
    }
  }
})
</script>

<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
.layered-level {
  .level-name {
    font-size: 14px;
    color: #333;
  }
}
</style>
