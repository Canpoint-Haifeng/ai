<template>
  <div class="dialog-wrapper">
    <el-dialog
      :visible="visible"
      @update:visible="$emit('update:visible', $event)"
      :title="title"
      :width="width"
      :close-on-click-modal="closeOnClickModal"
      :close-on-press-escape="closeOnPressEscape"
      :show-close="showClose"
      :before-close="beforeClose"
      :append-to-body="appendToBody"
      :lock-scroll="lockScroll"
      :custom-class="customClass"
      :top="top"
      :destroy-on-close="destroyOnClose"
      @close="cancel"
    >
      <div class="dialog-content">
        <slot></slot>
      </div>
      <template #footer v-if="$slots.footer || showFooter">
        <slot name="footer">
          <div class="dialog-footer">
            <el-button @click="cancel" v-if="showCancelBtn">
              {{ cancelBtnText }}
            </el-button>
            <el-button type="primary" @click="confirm" v-if="showConfirmBtn">
              {{ confirmBtnText }}
            </el-button>
          </div>
        </slot>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BaseDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '提示'
    },
    width: {
      type: String,
      default: '500px'
    },
    showFooter: {
      type: Boolean,
      default: true
    },
    showConfirmBtn: {
      type: Boolean,
      default: true
    },
    showCancelBtn: {
      type: Boolean,
      default: true
    },
    confirmBtnText: {
      type: String,
      default: '确定'
    },
    cancelBtnText: {
      type: String,
      default: '取消'
    },
    closeOnClickModal: {
      type: Boolean,
      default: true
    },
    closeOnPressEscape: {
      type: Boolean,
      default: true
    },
    showClose: {
      type: Boolean,
      default: true
    },
    beforeClose: {
      type: Function,
      default: null
    },
    appendToBody: {
      type: Boolean,
      default: false
    },
    lockScroll: {
      type: Boolean,
      default: true
    },
    customClass: {
      type: String,
      default: ''
    },
    top: {
      type: String,
      default: '15vh'
    },
    destroyOnClose: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:visible', 'cancel', 'confirm'],
  setup(props, { emit }) {
    const cancel = () => {
      emit('update:visible', false)
      emit('cancel')
    }
    
    const confirm = () => {
      emit('confirm')
    }

    return {
      cancel,
      confirm
    }
  }
})
</script>

<style lang="scss">
.dialog-wrapper {
  .dialog-content {
    padding: 20px 0;
  }
  
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
}
</style>
