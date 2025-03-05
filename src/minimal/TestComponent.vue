<template>
  <div class="test-component">
    <p>This is a minimal test component to verify Vue 3 compatibility.</p>
    <el-button
      type="primary"
      @click="testClick"
    >
      Test Button
    </el-button>
    <test-dialog
      :visible="dialogVisible"
      @update:visible="dialogVisible = $event"
    />
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import TestDialog from './TestDialog.vue'

export default defineComponent({
  name: 'TestComponent',
  components: {
    TestDialog
  },
  setup() {
    const dialogVisible = ref(false)
    
    const testClick = () => {
      dialogVisible.value = true
      console.log('Button clicked!')
    }
    
    return {
      dialogVisible,
      testClick
    }
  }
})
</script>

<style lang="scss" scoped>
@import "@/assets/css/mixins.scss";
@import "@/assets/css/variables.scss";
@import "@/assets/css/variables.scss";
.test-component {
  padding: 20px;
  
  p {
    color: $color-text;
    margin-bottom: 20px;
  }
}
</style>
