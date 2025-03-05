<template>
  <el-dialog
    :visible="visible"
    title="每日VIP"
    width="676px"
    class="login-vip-dialog"
    top="11.5%"
    :append-to-body="true"
    :lock-scroll="false"
    :closed="hide"
    @update:visible="visible = $event"
  >
    <div class="login-vip-container">
      <div class="login-vip-left">
        <div class="login-vip-title">
          <img
            src="@/assets/images/activity/viplogin1.png"
            alt=""
          >
        </div>
        <div class="login-vip-list">
          <div class="login-vip-list-item">
            <span class="iconfont iconshiliangzhinengduixiang-" />
            <span>每日VIP权限下组卷免费下载次数<span class="c">10次/天</span>，试卷免费下载次数<span class="c">10次/天</span>，每月免费下载总题量<span class="c">1000道</span>；</span>
          </div>
          <div class="login-vip-list-item">
            <span class="iconfont iconshiliangzhinengduixiang-" />
            <span>每日VIP权限期内无限次使用细目表组卷功能；</span>
          </div>
          <div class="login-vip-list-item">
            <span class="iconfont iconshiliangzhinengduixiang-" />
            <span>单张试卷最大试题量70题；</span>
          </div>
          <div class="login-vip-list-item">
            <span class="iconfont iconshiliangzhinengduixiang-" />
            <span>超出每日VIP权限范围的试题收费具体请查看"用户权限"。</span>
          </div>
        </div>
      </div>
      <div class="login-vip-right">
        <div class="login-vip-right-title">
          <img
            src="@/assets/images/activity/viplogin2.png"
            alt=""
          >
        </div>
        <div class="login-vip-right-content">
          <div class="login-vip-right-content-title">
            <span>选择学科：</span>
          </div>
          <div class="login-vip-right-content-subject">
            <cp-subject-select
              ref="subject1Ref"
              @change-subject="changeSubject"
            />
          </div>
          <div class="login-vip-right-content-title">
            <span>选择VIP类型：</span>
          </div>
          <div class="login-vip-right-content-type">
            <div
              v-for="(item, index) in vipTypeList"
              :key="index"
              class="login-vip-right-content-type-item"
              :class="{ active: vipType === item.type }"
              @click="vipType = item.type"
            >
              <div class="login-vip-right-content-type-item-title">
                <span>{{ item.title }}</span>
              </div>
              <div class="login-vip-right-content-type-item-price">
                <span>{{ item.price }}</span>
              </div>
            </div>
          </div>
          <div class="login-vip-right-content-btn">
            <el-button
              class="btn btn-shadow-pay"
              @click="onPay"
            >
              立即开通
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { computed, defineComponent, onMounted, reactive, ref, watch } from 'vue'
import CpSubjectSelect from "@/components/CpFan/Components/CpSubjectSelect.vue"

export default defineComponent({
  name: "LoginObtainVipDialog",
  components: { CpSubjectSelect },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update:visible"],
  setup(props, { emit }) {
    const subject1Ref = ref(null)
    const vipType = ref(1)
    const vipTypeList = ref([
      { type: 1, title: '1天', price: '免费' },
      { type: 2, title: '1个月', price: '¥29.9' },
      { type: 3, title: '1年', price: '¥299' }
    ])
    
    const changeSubject = () => {
      // Implementation
    }
    
    const onPay = () => {
      // Implementation
    }
    
    const hide = () => {
      emit('update:visible', false)
    }
    
    return {
      subject1Ref,
      vipType,
      vipTypeList,
      changeSubject,
      onPay,
      hide
    }
  }
})
</script>

<style lang="scss" scoped>
@import "@/assets/css/mixins.scss";
@import "@/assets/css/variables.scss";
@import "@/assets/css/variables.scss";
@use "@/assets/css/variables" as *;
.login-vip-container {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  .login-vip-left {
    width: 310px;
    height: 425px;
    background: #fbfbfb;
    border-radius: 6px;

    .login-vip-title {
      width: 310px;
      height: 64px;
      border-radius: 6px 6px 0px 0px;
    }
    .login-vip-list {
      box-sizing: border-box;
      padding: 20px 40px;
      border: 1px solid #e5e5e5;
      border-top-width: 0px;
      height: 362px;
      border-radius: 0px 0px 6px 6px;
      .mini-image {
        width: 15px;
        height: 12px;
        padding-bottom: 5px;
      }
    }
  }
  .login-vip-right {
    box-sizing: border-box;
    position: relative;
    width: 310px;
    height: 425px;
    background: #fbfbfb;
    border-radius: 6px;
    .login-vip-right-title {
      width: 310px;
      height: 64px;
      border-radius: 6px 6px 0px 0px;
    }
    .login-vip-right-content {
      box-sizing: border-box;
      padding: 20px 40px;
      border: 1px solid #e5e5e5;
      border-top-width: 0px;
      height: 362px;
      border-radius: 0px 0px 6px 6px;
      .login-vip-right-content-title {
        font-size: 14px;
        color: #333333;
        line-height: 32px;
      }
      .login-vip-right-content-subject {
        margin-bottom: 20px;
      }
      .login-vip-right-content-type {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        .login-vip-right-content-type-item {
          width: 100px;
          height: 60px;
          background: #ffffff;
          border-radius: 4px;
          border: 1px solid #e5e5e5;
          cursor: pointer;
          &.active {
            border: 1px solid #ff7e3d;
            background: rgba(255, 126, 61, 0.05);
          }
          .login-vip-right-content-type-item-title {
            font-size: 14px;
            color: #333333;
            line-height: 32px;
            text-align: center;
          }
          .login-vip-right-content-type-item-price {
            font-size: 12px;
            color: #ff7e3d;
            line-height: 20px;
            text-align: center;
          }
        }
      }
      .login-vip-right-content-btn {
        text-align: center;
        margin-top: 30px;
        .btn.btn-shadow-pay {
          width: 100px;
          background: #487FFF;
          border-radius: 4px;
          padding: 0;
          line-height: 30px;
          border: none;
          box-shadow: 0px 1px 6px 0px rgba(206, 89, 75, 0.18);
        }
      }
    }
  }
}

.login-vip-list {
  li {
    display: flex;
    justify-content: space-between;
    line-height: 24px;
    font-size: 12px;
    color: #666666;
    .r {
      font-family: Microsoft YaHei;
      color: #b9884e;
    }
  }
  .iconfont {
    font-size: 12px;
    padding-right: 5px;
  }
}
</style>
