<template>
  <div class="wx-code-login">
    <div class="wx-login-title">
      微信扫码快速登录
    </div>
    <div class="wx-qrcode-img">
      <img
        v-if="imgUrl"
        :src="imgUrl"
      >
      <div
        v-if="codeStatus == 3 || codeStatus == 4"
        class="wx-code-error"
      >
        <img
          src="@/assets/images/refreashicon.png"
          @click="wxCodeLogin"
        >
        <div class="error-info">
          二维码失效，点击重试
        </div>
      </div>
    </div>
    <div class="wx-change-account">
      <div
        class="change-account-btn"
        @click="changeAccount"
      >
        账号密码/验证码登录
      </div>
    </div>
    <div class="login-text color-9 font-12">
      注：请用全品AI教研云预留手机号绑定的微信扫码登录，否则您将无法使用您已有账号的权限
    </div>
    <div
      v-if="codeStatus == 2"
      class="wx-code-info"
    >
      <div class="success-info">
        <span class="el-icon-success" /><span>扫码成功!</span>
      </div>
      <div class="place-info">
        请在微信中点击确认即可登录
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
import CTS from '@/common/js/constant'
import { API } from '@/api/config'
import { setToken } from '@/common/js/util'
import { defineComponent, ref, reactive, computed, onMounted, watch } from "vue"

export default defineComponent({
  setup() {
    const state = reactive({
      imgUrl: '',
      uuid: '',
      codeStatus: '',
    }
  }
})

    return {
  mounted() {
    this.wxCodeLogin()
  }
})

    return {
  beforeUnmount() {
    this.clearTimeclearInterval()
  }
})

    return {
  methods: {
    changeAccount() {
      this.$emit('changeAccount')
    }

    return {
    startTickEvent() {})

    return {
    wxCodeLogin() {
      this.apiGet(API.wxCodeLogin).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          this.imgUrl = res.data.img
          this.uuid = res.data.uuid
          this.codeStatus = res.data.codeStatus
          if (!this.timer) {
            this.timer = setInterval(this.weChatCodeLoginResult, 2000)
          }
        }
      }
    }

    return {
    clearTimeclearInterval() {
      clearInterval(this.timer)
      this.timer = 0
    }

    return {
    weChatCodeLoginResult() {
      // NOT_SCAN("正常", 1),
      // SCANNED("被扫描", 2),
      // EXPIRED("过期",3),
      // INVALID("失效",4),
      // SUCCESS("成功",5);
      if (this.uuid) {
        this.apiGet(API.queryWxCodeTick, { uuid: this.uuid }).then(res => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            this.codeStatus = res.data.codeStatus
            if (
              this.codeStatus == 3 ||
              this.codeStatus == 4 ||
              this.codeStatus == 5
            ) {
              this.clearTimeclearInterval()
              if (this.codeStatus == 5) {
                setToken(res.data.token, 30)
                window.location.reload()
              }
            }
          }
        }
      }
    }

    return {
  }
})

    return {
}
</script>

<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
.wx-code-login {
  width: 412px;
  .wx-qrcode-img {
    position: relative;
    width: 230px;
    height: 230px;
    box-sizing: border-box;
    border: 1px solid #e2e2e2;
    margin: 10px auto;
    padding: 10px;
    img {
      width: 210px;
      height: 210px;
    }
  }
})
  .login-text {
    line-height: 20px;
    width: 250px;
    text-align: left;
    margin: 0 auto;
  }
})
  .wx-code-info {
    color: #666666;
    margin-top: 10px;
    text-align: center;
    .el-icon-success {
      color: #53e160;
      font-size: 24px;
      margin-right: 10px;
      vertical-align: sub;
    }
    .success-info {
      font-size: 16px;
      line-height: 30px;
    }
    .place-info {
      font-size: 14px;
    }
  }
})

  .wx-code-error {
    position: absolute;
    width: 230px;
    height: 230px;
    left: 0;
    top: 0;
    box-sizing: border-box;
    background-color: #00000099;
    color: #ffffff;
    img {
      width: 44px;
      height: 44px;
      margin: 80px auto 10px auto;
      cursor: pointer;
    }
  }
})
}

.wx-login-title {
  padding: 67px 0 14px 0;
  line-height: 30px;
  font-size: 24px;
  text-align: center;
  font-weight: bold;
  color: #222222;
}

.wx-change-account {
  padding: 10px 0 17px 0;
  text-align: center;
  .change-account-btn {
    display: inline-block;
    width: 200px;
    height: 40px;
    background: #487fff;
    border-radius: 20px;

    font-size: 14px;
    color: #ffffff;
    line-height: 24px;

    text-align: center;
    line-height: 40px;
    cursor: pointer;
    user-select: none;
  }
})
}
</style>
