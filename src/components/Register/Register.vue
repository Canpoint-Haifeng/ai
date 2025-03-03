<template>
  <div>
    <el-dialog
      v-model="visible"
      title=" "
      width="824px"
      class="login-dialog"
      top="11.5%"
      :append-to-body="true"
      :lock-scroll="false"
      :closed="hide"
    >
      <div
        v-if="!(registerRewards && registerRewards.length)"
        class="login-container"
      >
        <div class="login-logo">
          <img
            src="@/assets/images/logo-slogan.svg"
            alt="logo"
            height="30"
          >
          <!-- <span class="interval"></span> -->
          <!-- <img src="@/assets/images/slogan.svg" width="104" /> -->
        </div>
        <div class="login-content">
          <h2 class="login-title color-3">
            快速注册
            <!-- <div class="tips">注册即可获得10颗胖大海和3张下载券</div> -->
          </h2>

          <el-form
            ref="loginForm"
            :model="loginData"
            :rules="loginRules"
          >
            <el-form-item
              prop="account"
              class="form-item"
            >
              <el-input
                v-model="loginData.account"
                class="form-input"
                placeholder="请输入手机号"
                autocomplete="off"
                @blur="onFocus"
              >
                <template #prefix>
                  <i class="el-icon-mobile-phone" />
                </template>
              </el-input>
            </el-form-item>
            <el-form-item
              prop="password"
              class="form-item"
            >
              <span class="icon-box">
                <i class="el-icon-key" />
              </span>
              <el-input
                v-model="loginData.password"
                class="form-input"
                placeholder="设置密码（6-18位数字或字母组合）"
                autocomplete="off"
                type="password"
                @blur="onFocus"
              >
                <template #prefix>
                  <i class="el-icon-key" />
                </template>
              </el-input>
            </el-form-item>
            <div class="noCaptcha-wrapper">
              <no-captcha
                v-if="visible"
                @check-code-success="onCheckCodeSuccess"
              />
            </div>
            <el-form-item
              prop="vfcode"
              class="form-item vfcode"
            >
              <el-input
                v-model="loginData.vfcode"
                class="form-input form-input-short"
                placeholder="请输入短信验证码"
                autocomplete="off"
                @blur="onFocus"
              >
                <template #prefix>
                  <i class="el-icon-key" />
                </template>
              </el-input>
              <div
                v-if="loginData.vfcodeStatus"
                class="code-btn"
              >
                <span>{{ loginData.vfcodeText }}</span>
              </div>
              <div
                v-else
                class="code-btn"
                :class="isVfCode ? '' : 'btn-disabled'"
                @click="getVfcode"
              >
                <span>获取验证码</span>
              </div>
            </el-form-item>
            <el-form-item
              prop="agree"
              :inline-message="true"
              :show-message="false"
              :hide-required-asterisk="true"
              class="form-item form-item-agree"
            >
              <el-checkbox v-model="loginData.agree">
                <span
                  class="font-12"
                  @click="entryAgreement"
                >
                  我同意<span class="text">《全品AI教研云隐私政策》</span>
                </span>
              </el-checkbox>
            </el-form-item>
            <div
              class="custom-error"
              :class="loginData.errorStatus ? 'error-show' : ''"
            >
              <span class="iconfont iconerror" />
              <span class="error-text">{{ loginData.errorText }}</span>
            </div>
            <!-- 1111111111111111111111111111111111111111111111111111111111111111111111 -->
            <el-form-item class="form-item form-item-submit">
              <el-button
                v-if="isValue"
                class="btn login-btn"
                @click="register('loginForm')"
              >
                注册
              </el-button>
              <el-button
                v-else
                type="primary"
                class="btn btn-disabled"
              >
                注册
              </el-button>
            </el-form-item>
            <div class="form-item-service">
              <span
                v-if="haslogin == 1"
                class="font-12"
              >
                已注册, <span
                  class="text"
                  @click="goLogin"
                >去登录</span>
              </span>
            </div>
          </el-form>
        </div>
      </div>
      <div
        v-else
        class="login-container"
      >
        <div class="login-logo">
          <img
            src="@/assets/images/logo-slogan.svg"
            alt="logo"
            height="30"
          >
        </div>
        <div class="login-content">
          <h2 class="login-success-title color-3">
            注册成功，恭喜获得
          </h2>
        </div>

        <div class="reward-list">
          <div
            v-for="(item, index) in registerRewards"
            :key="index"
            class="reward-item"
          >
            <img
              :src="item.goodsInfoPicture"
              :style="{
                width: item.width + 'px',
                height: item.height + 'px',
              }"
            >
            <div
              class="reward-info"
              v-html="item.content"
            />
          </div>
        </div>
        <div
          class="register-success-bottom"
          @click="gotoReload"
        >
          <div class="register-success-button">
            开始使用
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, computed, onMounted, nextTick } from 'vue'
import CTS from '@/common/js/constant'
import { setToken, encrypt, getToken } from '@/common/js/util'
import { API } from '@/api/config'
// import commonUrl from '@/common/js/project-url'
import NoCaptcha from '@/components/NoCaptcha/NoCaptcha'

export default defineComponent({
  name: 'Register',
  components: {
    NoCaptcha,
  },
  props: {
    onGoLogin: {
      type: Function,
      default: null
    },
    onGoAgreement: {
      type: Function,
      default: null
    },
    registerRewards: {
      type: Array,
      default: () => []
    },
    haslogin: {
      type: Number,
      default: 1
    }
  },
  setup(props, { emit }) {
    const visible = ref(false)
    const loginForm = ref(null)
    const loginSuccese = ref(false)
    const checkeNCData = ref({})
    let interval = null

    const loginData = reactive({
      account: '',
      codeStatus: false, // 滑动验证码
      vfcode: '',
      password: '',
      agree: true,
      errorStatus: false,
      errorText: '',
      vfcodeStatus: false,
      vfCodeDiabled: true, // 验证码禁用状态
      vfcodeText: '获取验证码',
    })

    const validateAccount = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号'))
      } else {
        let str = value.trim()
        if (CTS.constant.phoneReg.test(str)) {
          callback()
        } else {
          loginData.errorStatus = false
          return callback(new Error('请输入正确的手机号'))
        }
      }
    }

    const validateVfcode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入短信验证码'))
      } else {
        const vfcode = CTS.constant.vfcodeReg
        if (vfcode.test(value)) {
          callback()
        } else {
          loginData.errorStatus = false
          return callback(new Error('验证码是4位数字'))
        }
      }
    }

    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        const passwordReg = CTS.constant.passwordReg
        if (passwordReg.test(value)) {
          callback()
        } else {
          loginData.errorStatus = false
          return callback(new Error('密码是6~18位字母、数字'))
        }
      }
    }

    const loginRules = {
      account: [{ validator: validateAccount, trigger: 'blur' }],
      password: [{ validator: validatePassword, trigger: 'blur' }],
      vfcode: [{ validator: validateVfcode, trigger: 'blur' }],
      agree: [{ required: true, message: '', trigger: 'change' }],
    }

    // 是否可以发送短信验证码
    const isVfCode = computed(() => {
      return !!(loginData.account && loginData.codeStatus)
    })

    const isValue = computed(() => {
      return !!(
        loginData.account &&
        loginData.password &&
        loginData.codeStatus &&
        loginData.vfcode &&
        loginData.agree
      )
    })

    // 显示注册弹窗
    const show = () => {
      visible.value = true
    }

    // 关闭注册弹窗
    const hide = () => {
      visible.value = false
    }

    // 去登陆
    const goLogin = () => {
      if (props.onGoLogin) {
        props.onGoLogin()
      }
    }

    const onFocus = () => {
      loginData.errorStatus = false
    }

    // 监听滑动验证码
    const onCheckCodeSuccess = (params) => {
      checkeNCData.value = params
      loginData.codeStatus = true // 检验成功
      loginData.errorStatus = false
    }

    // 进入服务协议
    const entryAgreement = () => {
      hide()
      openWindowLink(import.meta.env.VITE_SRC + 'infomationAuth')
    }

    const register = (formName) => {
      loginForm.value.validate((valid, result) => {
        // 1. 参数验证
        if (!valid) {
          const key = Object.keys(result)[0]
          loginData.errorStatus = true
          loginData.errorText = result[key][0].message
        } else {
          // 2.注册提交
          loginData.errorStatus = false
          let parms = {
            isWhitelist: 0,
            httpMethod: 1,
            url: API.REGISTER.urlPath,
            apiId: API.REGISTER.apiId,
            strParams: {
              account: loginData.account,
              password: encrypt(loginData.password),
              vCode: loginData.vfcode,
            },
          }
          let set = {
            showLoading: true,
            message: '注册中...',
          }
          newPost({ urlPath: API.REGISTER.baseURL }, parms, set).then(
            res => {
              if (res && res.code === CTS.constant.SUCCESS_CODE) {
                // 3 .注册后显示注册成功
                loginSuccese.value = true
                // 登录后把token存到cookie
                loginHttp(loginData.account, loginData.password)
              } else {
                loginSuccese.value = false
                loginData.errorStatus = true
                loginData.errorText = res.msg
              }
            },
          )
        }
      })
    }

    //  注册 成功 获取 用户 信息 获取奖励
    const getUserInfo = () => {
      let parms = {
        token: getToken(),
      }
      let set = {
        authCode: 2,
      }
      apiPost(API.GET_SSO_VERIFY, parms, set).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          if (res.data.rewards && res.data.rewards.length) {
            showReceiveReward(res.data.rewards)
          } else {
            window.location.reload()
          }
        }
      })
    }

    const gotoReload = () => {
      window.location.href = import.meta.env.VITE_SRC
    }

    const showReceiveReward = (rewards) => {
      for (let item of rewards) {
        item.width = 115
        item.hegiht = 115
        item.content =
          item.goodsName +
          '<span style="color:#FF6A00;">×' +
          item.num +
          '</span>'
      }
      registerRewards.value = rewards
    }

    const getVfcode = () => {
      // 1.校验参数
      if (!loginData.account) {
        loginData.errorStatus = true
        loginData.errorText = '请输入手机号'
        return
      }
      if (!CTS.constant.phoneReg.test(loginData.account)) {
        loginData.errorStatus = true
        loginData.errorText = '请输入正确的手机号'
        return
      }
      if (!loginData.password) {
        loginData.errorStatus = true
        loginData.errorText = '请设置登录密码'
        return
      }
      if (!loginData.codeStatus) {
        loginData.errorStatus = true
        loginData.errorText = '请完成滑动验证'
        return
      }
      // 2.验证码秒数减少
      changeVf()
      let parms = {
        strParams: {
          account: loginData.account,
          sessionId: checkeNCData.value.strParams.sessionId,
        },
        isWhitelist: 0,
        httpMethod: 1,
        url: API.VCODE.urlPath,
        apiId: API.VCODE.apiId,
      }
      let set = {
        message: '发送验证码中',
      }
      // 2.发送验证码请求
      newPost({ urlPath: API.VCODE.baseURL }, parms, set).then(res => {
        if (res && res.code === CTS.constant.SUCCESS_CODE) {
          // 3.请求成功后改变验证码显示
        } else {
          loginData.errorStatus = true
          loginData.errorText = res.msg
          setTimeout(() => {
            window.clearInterval(interval)
            loginData.vfcodeStatus = false
            loginData.vfcodeText = '获取验证码'
          }, 1000)
        }
      })
    }

    const loginHttp = (account, password) => {
      let parms = {
        url: API.LOGIN.urlPath,
        apiId: API.LOGIN.apiId,
        isWhitelist: 0,
        httpMethod: 1,
        strParams: {
          account: account,
          password: encrypt(password),
        },
      }
      newPost({ urlPath: API.LOGIN.urlLocalPath }, parms).then(res => {
        if (res && res.code === CTS.constant.SUCCESS_CODE) {
          // 3 .注册后显示注册成功
          // 登录后把token存到cookie
          setToken(res.data.token, 30)
          getUserInfo()
        }
      })
    }

    const changeVf = () => {
      let time = 60
      loginData.vfcodeStatus = true
      loginData.vfcodeText = `60S后重新获取`
      interval = window.setInterval(function() {
        --time
        loginData.vfcodeText = `${time}S后重新获取`
        if (time < 0) {
          loginData.vfcodeStatus = false
          loginData.vfcodeText = `获取验证码`
          window.clearInterval(interval)
        }
      }, 1000)
    }

    onMounted(() => {
      console.log('创建 register')
    })

    return {
      visible,
      loginForm,
      loginSuccese,
      loginData,
      loginRules,
      isVfCode,
      isValue,
      show,
      hide,
      goLogin,
      onFocus,
      onCheckCodeSuccess,
      entryAgreement,
      register,
      getUserInfo,
      gotoReload,
      showReceiveReward,
      getVfcode,
      loginHttp,
      changeVf
    }
  }
})
</script>

<style lang="scss">
// .v-modal {
//   opacity: 0.1;
// }
</style>

<style lang="scss" scoped>
.login-dialog :deep(.el-dialog) {
  width: 824px;
  height: 540px;
  padding: 32px 32px 70px 32px;
  box-sizing: border-box;
  box-shadow: 0px 0px 30px 0px rgba(62, 115, 205, 0.4);
  border-radius: 6px;
}

.login-dialog :deep(.el-dialog__header) {
  padding: 0;
}
.login-container {
  .login-logo {
    height: 34px;
    display: flex;
    align-items: center;
  }
  .interval {
    width: 1px;
    height: 20px;
    margin: 0 10px;
    background-color: #898989;
  }
  .login-title {
    width: 360px;
    margin-bottom: 30px;
    font-size: $font-size-large;
    font-weight: 500;
    color: $color-text-d;
    .tips {
      font-size: $font-size-small;
      color: $color-text-l;
      margin-top: 10px;
    }
  }
  .login-success-title {
    width: 360px;
    margin-bottom: 30px;
    font-size: $font-size-large;
    font-weight: 500;
    color: $color-text-d;
    text-align: center;
  }
  .login-content {
    width: 360px;
    margin: 0 auto;
    margin-top: 30px;
  }
  .form-item {
    margin-bottom: 20px;
    .form-input {
      width: 100%;
      height: 40px;
      border: 1px solid $color-border;
      border-radius: 0;
      color: $color-text-d;
    }
    .form-input-short {
      width: 220px;
    }
  }
  :deep(.form-item) {
    .el-form-item__content {
      display: flex;
      align-items: center;
    }
    .el-form-item__error {
      display: none;
    }
    .el-input__inner {
      height: 40px;
      line-height: 40px;
      border: 1px solid $color-border;
      border-radius: 0;
      color: $color-text-d;
    }
    .el-input__prefix {
      left: 10px;
      color: $color-text-l;
    }
    .el-input__inner:focus {
      border-color: $color-button-d;
    }
    .el-checkbox__inner {
      border-radius: 0;
    }
    .el-checkbox__input.is-checked .el-checkbox__inner {
      background-color: $color-button-d;
      border-color: $color-button-d;
    }
    .el-checkbox__input.is-checked + .el-checkbox__label {
      color: $color-text-l;
    }
  }
  .form-item-agree {
    margin-bottom: 10px;
  }
  .form-item-submit {
    margin-top: 30px;
    margin-bottom: 10px;
  }
  .form-item-service {
    text-align: center;
    color: $color-text-l;
    .text {
      color: $color-button-d;
      cursor: pointer;
    }
  }
  .icon-box {
    position: absolute;
    left: 10px;
    top: 0;
    height: 40px;
    line-height: 40px;
    color: $color-text-l;
    z-index: 1;
  }
  .code-btn {
    width: 130px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    background-color: $color-button-d;
    color: #fff;
    cursor: pointer;
    margin-left: 10px;
  }
  .btn-disabled {
    background-color: $color-button-l;
    cursor: not-allowed;
  }
  .custom-error {
    height: 0;
    overflow: hidden;
    transition: all 0.3s;
    color: $color-error;
    .iconfont {
      margin-right: 5px;
    }
  }
  .error-show {
    height: 20px;
  }
  .login-btn {
    width: 100%;
    height: 40px;
    background-color: $color-button-d;
    color: #fff;
    border-radius: 0;
    border-color: $color-button-d;
  }
  .login-btn:hover {
    background-color: $color-button-d;
    color: #fff;
    border-color: $color-button-d;
  }
  .noCaptcha-wrapper {
    margin-bottom: 20px;
  }
}
.reward-list {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 20px;
  .reward-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 20px;
    .reward-info {
      margin-top: 10px;
      font-size: 14px;
      color: $color-text-d;
    }
  }
}
.register-success-bottom {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 40px;
  .register-success-button {
    width: 120px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    background-color: $color-button-d;
    color: #fff;
    cursor: pointer;
  }
}
</style>
