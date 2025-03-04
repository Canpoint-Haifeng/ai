import { computed, defineComponent, onMounted, reactive, ref, watch } from 'vue'
<template>
  <el-dialog
    :visible="visible"
    @update:visible="visible = $event"
    title="VIP激活"
    width="676px"
    class="login-vip-dialog"
    top="11.5%"
    :append-to-body="true"
    :lock-scroll="false"
    :closed="hide"
  >
    <div class="login-activation-vip">
      <div class="vip-tabs-pane-block">
        <div class="vip-select-subject">
          <span class="vip-subject-title">选择学科：</span>
          <span class="vip-subject-list"><cp-subject-select
            ref="subject1Ref"
            @change-subject="changeSubject"
          /></span>
        </div>
        <div class="vip-introduce">
          <div class="t">
            VIP权限介绍：
          </div>
          <div>
            1、VIP权限下组卷免费下载次数
            <span class="c">10次/天</span>
            ，试卷免费下载次数
            <span class="c">10次/天</span>
            ，每月免费下载总题量
            <span class="c">1000道</span>
            ；
          </div>
          <div>2、VIP权限期内无限次使用细目表组卷功能；</div>
          <div>3、单张试卷最大试题量70题；</div>
          <div>4、超出VIP权限范围的试题收费具体请查看“用户权限”。</div>
        </div>
      </div>

      <div class="vip-bottom-place">
        <el-button
          class="btn btn-gray"
          @click="visible = false"
        >
          取消
        </el-button>
        <el-button
          class="btn btn-shadow-pay"
          @click="onActivation"
        >
          确认开通
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { ref, defineComponent } from "vue"
import CpSubjectSelect from "@/components/CpFan/Components/CpSubjectSelect.vue"

export default defineComponent({
  name: "LoginActivationVipDialog",
  components: { CpSubjectSelect },
  setup() {
    return {}
  }
})
</script>

<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
  .login-activation-vip {
    padding: 20px 0px 20px 0px;
    .vip-introduce {
      width: 650px;
      margin: 0 auto;
      padding: 30px 20px 10px 20px;
      & > div {
        color: #666666;
        line-height: 20px;
        font-size: 12px;
        .c {
          color: #ff7e3d;
        }
      }
      .t {
        color: #333333;
        font-size: 14px;
        line-height: 26px;
      }
    }
    .vip-bottom-place {
      padding: 20px;
      text-align: right;
    }
    .vip-tabs-pane-block {
      min-height: 240px;
    }

    .btn.btn-shadow-pay {
      width: 100px;
      background: #487FFF;
      border-radius: 4px;
      padding: 0;
      line-height: 30px;
      border: none;
      box-shadow: 0px 1px 6px 0px rgba(206, 89, 75, 0.18);
    }

    .vip-select-subject {
      display: flex;
      margin: 0 auto;
      padding: 40px 0 10px 0;
      .vip-subject-title {
        width: 100px;
        line-height: 32px;
        font-size: 16px;
        color: #666666;
        text-align: right;
      }
      .vip-subject-list {
        flex: 1;
      }
    }
  }
</style>
