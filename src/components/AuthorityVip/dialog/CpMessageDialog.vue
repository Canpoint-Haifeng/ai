<!--
该确认框为 唯一的 确认框，如果想要多个 请另寻他法
如果同时弹出两个确认框 就会用问题 ，请注意哦
-->

<template>
  <div>
    <el-dialog
      :visible="visible"
      :title="title"
      width="500px"
      class="login-vip-dialog"
      top="11.5%"
      :append-to-body="true"
      :lock-scroll="false"
      @update:visible="visible = $event"
      @close="hide"
    >
      <div class="cp-comfirm-box">
        <div
          class="cp-comfirm-block"
          v-html="content"
        />
        <div class="cp-comfirm-bottom-place">
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
  name: "CpMessageDialog",
  props: {
    initDate: {
      type: Object,
      default: () => ({ comfirm: null, title: "提示", content: "确定删除？" })
    }
  },
  setup() {
    return {}
  }
})
</script>
<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
@import "@/assets/css/mixins.scss";
@import "@/assets/css/variables.scss";
@import "@/assets/css/variables.scss";
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
    padding: 40px 20px 20px 20px;
    text-align: center;
    line-height: 25px;
  }
  
  .cp-comfirm-bottom-place {
    padding: 30px 20px;
    text-align: center;
  }
</style>

