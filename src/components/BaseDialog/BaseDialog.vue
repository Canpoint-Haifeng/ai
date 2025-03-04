<template>
  <el-dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :title="title"
    :width="width"
    @close="$emit('cancel')"
  >
    <slot></slot>
    <template #footer>
      <div>
        <el-button @click="$emit('update:visible', false); $emit('cancel')">
          {{ cancelText }}
        </el-button>
        <el-button type="primary" @click="$emit('confirm')">
          {{ confirmText }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'BaseDialog',
  props: {
    visible: Boolean,
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
  emits: ['update:visible', 'cancel', 'confirm']
}
</script>
