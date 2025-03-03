<template>
  <div class="dialog-wrapper">
    <el-dialog
      v-model="visible"
      :title="title"
      :top="top"
      :modal-append-to-body="addbody"
      :append-to-body="addbody"
      :show-close="showClose"
      :width="width"
    >
      <div class="dialog-content">
        <slot name="dialogTips" />
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            v-if="showCancelBtn"
            class="btn btn-gray"
            @click="cancel"
          >
            {{
              cancelBtnText
            }}
          </el-button>
          <el-button
            v-if="showConfirmBtn"
            class="btn btn-shadow"
            @click="comfirm"
          >
            {{ confirmBtnText }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'BaseDialog',
  props: {
    addbody: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '提示',
    },
    showClose: {
      type: Boolean,
      default: true,
    },
    width: {
      type: String,
      default: '500px',
    },
    showConfirmBtn: {
      type: Boolean,
      default: true,
    },
    showCancelBtn: {
      type: Boolean,
      default: true,
    },
    confirmBtnText: {
      type: String,
      default: '确定',
    },
    cancelBtnText: {
      type: String,
      default: '取消',
    },
    top: {
      type: String,
      default: '15vh',
    },
  },
  setup(props, { emit }) {
    const visible = ref(false)
    
    const show = () => {
      visible.value = true
    }
    
    const hide = () => {
      visible.value = false
    }
    
    const cancel = () => {
      hide()
      emit('cancle')
    }
    
    const comfirm = () => {
      show()
      emit('comfirm')
    }
    
    return {
      visible,
      show,
      hide,
      cancel,
      comfirm
    }
  }
}
</script>

<style lang="scss">
  .dialog-content {
    text-align: center;
    .dialog-tips {
      padding-top: 50px;
      padding-bottom: 20px;
      color: $color-text-d;
    }
  }
</style>
