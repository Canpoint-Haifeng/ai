<template>
  <div
    v-if="visible"
    class="base-dialog-container"
  >
    <div
      class="base-dialog-mask"
      @click="handleClose"
    />
    <div
      class="base-dialog"
      :style="{ width: width }"
    >
      <div class="base-dialog-header">
        <span class="base-dialog-title">{{ title }}</span>
        <span
          v-if="showClose"
          class="base-dialog-close"
          @click="handleClose"
        >×</span>
      </div>
      <div class="base-dialog-body">
        <slot />
      </div>
      <div
        v-if="$slots.footer"
        class="base-dialog-footer"
      >
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '30%'
    },
    showClose: {
      type: Boolean,
      default: true
    },
    closeOnClickModal: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleClose() {
      if (this.closeOnClickModal) {
        this.$emit('update:visible', false)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/mixins.scss";
@import "@/assets/css/variables.scss";
@import "@/assets/css/variables.scss";
.base-dialog-container {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2000;
  
  .base-dialog-mask {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }
  
  .base-dialog {
    position: relative;
    margin: 15vh auto 50px;
    background: #fff;
    border-radius: 2px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    
    .base-dialog-header {
      padding: 20px;
      border-bottom: 1px solid #eee;
      
      .base-dialog-title {
        font-size: 18px;
        color: #333;
      }
      
      .base-dialog-close {
        position: absolute;
        top: 20px;
        right: 20px;
        font-size: 16px;
        cursor: pointer;
      }
    }
    
    .base-dialog-body {
      padding: 20px;
    }
    
    .base-dialog-footer {
      padding: 10px 20px 20px;
      text-align: right;
    }
  }
}
</style>
