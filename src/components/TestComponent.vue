<template>
  <div class="test-component">
    <h1>Vue 3 Compatibility Test</h1>
    <p>This component is used to test Vue 3 compatibility</p>
    
    <div class="test-section">
      <h2>Dialog Test</h2>
      <el-button @click="dialogVisible = true">
        Open Dialog
      </el-button>
      <BaseDialog 
        v-model="dialogVisible"
        title="Test Dialog"
        @confirm="handleConfirm"
      >
        <p>This is a test dialog using the updated BaseDialog component</p>
      </BaseDialog>
    </div>
    
    <div class="test-section">
      <h2>Triangle Mixin Test</h2>
      <div class="triangle-container">
        <div class="triangle-up" />
        <div class="triangle-down" />
        <div class="triangle-left" />
        <div class="triangle-right" />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import BaseDialog from './BaseDialog/BaseDialog.vue'

export default defineComponent({
  name: 'TestComponent',
  components: {
    BaseDialog
  },
  setup() {
    const dialogVisible = ref(false)
    
    const handleConfirm = () => {
      console.log('Dialog confirmed')
      dialogVisible.value = false
    }
    
    const handleCancel = () => {
      console.log('Dialog cancelled')
      dialogVisible.value = false
    }
    
    return {
      dialogVisible,
      handleConfirm,
      handleCancel
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
  max-width: 800px;
  margin: 0 auto;
  
  h1 {
    color: $color-theme;
    margin-bottom: 20px;
  }
  
  .test-section {
    margin-bottom: 30px;
    padding: 20px;
    border: 1px solid $color-border;
    border-radius: $border-radius-medium;
  }
  
  .triangle-container {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
    
    .triangle-up {
      @include triangle(up, 20px, $color-theme);
    }
    
    .triangle-down {
      @include triangle(down, 20px, $color-theme);
    }
    
    .triangle-left {
      @include triangle(left, 20px, $color-theme);
    }
    
    .triangle-right {
      @include triangle(right, 20px, $color-theme);
    }
  }
}
</style>
