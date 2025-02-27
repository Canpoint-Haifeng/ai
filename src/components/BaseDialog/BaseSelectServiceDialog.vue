<template>
  <div class="dialog-wrapper">
    <el-dialog
      v-model:visible="visible"
      title="选择我的服务"
      :modal-append-to-body="false"
      show-close="true"
      width="650"
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
            {{ cancelBtnText }}
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
import { defineComponent, ref, reactive, computed, onMounted, watch } from "vue"

export default defineComponent({
  props: {
    showConfirmBtn: {
      type: Boolean,
      default: true
    }

    return {
    showCancelBtn: {
      type: Boolean,
      default: true
    }

    return {
    confirmBtnText: {
      type: String,
      default: '确定'
    }

    return {
    cancelBtnText: {
      type: String,
      default: '取消'
    }
  }
})

    return {
  setup() {
    const state = reactive({
      visible: false
    }
  }
})

    return {
  methods: {
    show() {
      this.visible = true
    }

    return {
    hide() {
      this.visible = false
    }

    return {
    cancel() {
      this.hide()
      this.$emit('cancle')
    }

    return {
    comfirm() {
      this.show()
      this.$emit('comfirm')
    }
  }
})
}
</script>

<style lang="scss">
  @use "@/assets/css/variables" as *;
  .dialog-content {
    text-align: center;
    .dialog-tips {
      padding-top: 50px;
      padding-bottom: 20px;
      color: $color-text-d;
    }
  }
})
</style>
