<template>
  <div class="test-component">
    <h1>Vue 3 Migration Test</h1>
    <p>This is a minimal test component to verify Vue 3 compatibility.</p>
    <el-button type="primary" @click="testClick">Test Button</el-button>
    <base-dialog :visible="dialogVisible" @update:visible="dialogVisible = $event" title="Test Dialog">
      <p>This is a test dialog to verify Vue 3 compatibility.</p>
    </base-dialog>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import BaseDialog from '@/components/BaseDialog/BaseDialog.vue'

export default defineComponent({
  name: 'TestComponent',
  components: {
    BaseDialog
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
.test-component {
  padding: 20px;
  text-align: center;
  
  h1 {
    color: $color-theme;
    margin-bottom: 20px;
  }
  
  p {
    color: $color-text;
    margin-bottom: 20px;
  }
}
</style>
