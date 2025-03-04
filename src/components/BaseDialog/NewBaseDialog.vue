<template>
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
    :center="center"
    :destroy-on-close="destroyOnClose"
    :top="top"
    :modal="modal"
    :modal-append-to-body="modalAppendToBody"
    @close="handleClose"
  >
    <slot></slot>
    <template #footer>
      <div class="dialog-footer" v-if="showFooter">
        <el-button @click="handleCancel" v-if="showCancelBtn">
          {{ cancelBtnText }}
        </el-button>
        <el-button type="primary" @click="handleConfirm" v-if="showConfirmBtn">
          {{ confirmBtnText }}
        </el-button>
        <slot name="footer"></slot>
      </div>
    </template>
  </el-dialog>
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
    center: {
      type: Boolean,
      default: false
    },
    destroyOnClose: {
      type: Boolean,
      default: false
    },
    top: {
      type: String,
      default: '15vh'
    },
    modal: {
      type: Boolean,
      default: true
    },
    modalAppendToBody: {
      type: Boolean,
      default: true
    },
    showFooter: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:visible', 'cancel', 'confirm', 'close'],
  setup(props, { emit }) {
    const handleCancel = () => {
      emit('update:visible', false)
      emit('cancel')
    }
    
    const handleConfirm = () => {
      emit('confirm')
    }
    
    const handleClose = () => {
      emit('close')
    }
    
    return {
      handleCancel,
      handleConfirm,
      handleClose
    }
  }
})
</script>

<style lang="scss" scoped>
.dialog-footer {
  text-align: center;
}
</style>
