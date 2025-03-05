<template>
  <div>
    <el-dialog
      :visible="visible"
      :title="title"
      :width="width"
      @update:visible="$emit('update:visible', $event)"
    >
      <slot />
      <template #footer>
        <div>
          <el-button @click="handleCancel">
            {{ cancelText }}
          </el-button>
          <el-button
            type="primary"
            @click="handleConfirm"
          >
            {{ confirmText }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'SimpleDialog',
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
  emits: ['update:visible', 'cancel', 'confirm'],
  methods: {
    handleCancel() {
      this.$emit('update:visible', false)
      this.$emit('cancel')
    },
    handleConfirm() {
      this.$emit('confirm')
    }
  }
}
</script>
