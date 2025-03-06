<template>
  <div>
    <el-dialog
      :visible="visible"
      :title="title"
      :width="width"
      @update:visible="$emit('update:visible', $event)"
    >
      <div>
        <slot />
      </div>
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
  name: 'NewBaseDialog',
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

<style lang="scss" scoped>
@import "@/assets/css/mixins.scss";
@import "@/assets/css/variables.scss";
@import "@/assets/css/variables.scss";
.dialog-footer {
  text-align: center;
}
</style>
