<!--
该确认框为 唯一的 确认框，如果想要多个 请另寻他法
如果同时弹出两个确认框 就会用问题 ，请注意哦
-->

<template>
  <div>
    <el-dialog
      :visible="visible"
      @update:visible="$emit('update:visible', $event)"
      :title="title"
      width="500px"
      class="login-vip-dialog"
      top="11.5%"
      :append-to-body="true"
      :lock-scroll="false"
      @close="hide"
    >
      <div class="cp-comfirm-box">
        <div
          class="cp-comfirm-block"
          v-html="content"
        />
        <div class="cp-comfirm-bottom-place">
          <el-button
            v-if="!cancelHide"
            class="btn btn-gray"
            @click="visible = false"
          >
            取消
          </el-button>
          <el-button
            class="btn btn-shadow-pay"
            @click="onConfirm"
          >
            确认
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ref, defineComponent } from "vue"

export default defineComponent({
  name: "CpConfigDialog",
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update:visible"],
  setup(props, { emit }) {
    const dialogVisible = ref(props.visible)
    
    return ({
      dialogVisible
    })
  }
})
</script>

<style lang="scss" scoped>
@use "@/assets/css/variables" as *;
  .btn.btn-shadow-pay {
    width: 100px;
    background: #487FFF;
    border-radius: 4px;
    padding: 0;
    line-height: 30px;
    border: none;
    box-shadow: 0px 1px 6px 0px rgba(206, 89, 75, 0.18);
    margin-left: 20px;
  }
  
  .cp-comfirm-block {
    padding: 80px 20px 30px 20px;
    text-align: center;
  }
  
  .cp-comfirm-bottom-place {
    padding: 30px 20px;
    text-align: right;
  }
</style>
