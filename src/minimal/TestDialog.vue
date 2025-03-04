<template>
  <el-dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    title="Test Dialog"
    width="30%"
  >
    <span>This is a test dialog to verify Vue 3 compatibility.</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$emit('update:visible', false)">Cancel</el-button>
        <el-button type="primary" @click="$emit('update:visible', false)">Confirm</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TestDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:visible']
})
</script>

<style lang="scss" scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
