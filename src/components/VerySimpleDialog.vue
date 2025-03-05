<template>
  <div>
    <el-dialog
      :visible="dialogVisible"
      :title="title"
      :width="width"
    >
      <slot />
      <template #footer>
        <el-button @click="handleCancel">
          {{ cancelText }}
        </el-button>
        <el-button
          type="primary"
          @click="handleConfirm"
        >
          {{ confirmText }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'VerySimpleDialog',
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
    cancelText: {
      type: String,
      default: '取消'
    },
    confirmText: {
      type: String,
      default: '确定'
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  methods: {
    handleCancel() {
      this.dialogVisible = false
      this.$emit('cancel')
    },
    handleConfirm() {
      this.$emit('confirm')
    }
  }
}
</script>
