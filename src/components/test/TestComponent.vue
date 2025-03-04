<template>
  <div class="test-component">
    <h1>Vue 3 Migration Test</h1>
    <p>This is a minimal test component to verify Vue 3 compatibility.</p>
    
    <div class="test-section">
      <h2>Testing BaseDialog Component</h2>
      <el-button @click="showDialog = true">Open Dialog</el-button>
      <base-dialog 
        :visible="showDialog"
        @update:visible="showDialog = $event"
        title="Test Dialog"
        @confirm="handleConfirm"
        @cancel="handleCancel"
      >
        <p>This is a test dialog using Vue 3 compatible syntax.</p>
      </base-dialog>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import BaseDialog from '../BaseDialog/BaseDialog.vue'

export default defineComponent({
  name: 'TestComponent',
  components: {
    BaseDialog
  },
  setup() {
    const showDialog = ref(false)
    
    const handleConfirm = () => {
      console.log('Dialog confirmed')
      showDialog.value = false
    }
    
    const handleCancel = () => {
      console.log('Dialog cancelled')
      showDialog.value = false
    }
    
    return {
      showDialog,
      handleConfirm,
      handleCancel
    }
  }
})
</script>

<style lang="scss" scoped>
.test-component {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  
  h1 {
    color: #487fff;
  }
  
  .test-section {
    margin-top: 30px;
    padding: 20px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
  }
}
</style>
