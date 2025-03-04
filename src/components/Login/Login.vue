<template>
  <div>
    <el-dialog
      title=" "
      width="824px"
      class="login-dialog"
      top="11.5%"
      :append-to-body="true"
      :lock-scroll="false"
      :close-on-click-modal="false"
      :visible="visible"
      @update:visible="visible = $event"
      :closed="hide"
    >
      <div class="login-container">
        <div class="login-left" :style="loginLeftStyle">
          <div class="login-logo">
            <img src="@/assets/images/logo-slogan.svg" alt="logo" height="30" />
          </div>
        </div>
        <div class="login-right">
          <div class="login-account-segment">
            <div class="login-tabs">
              <span
                class="tabs-text"
                :class="{ active: currentIndex === 0 }"
                @click="tabHandle(0)"
                >账号密码登录</span
              >
              <span
                class="tabs-text"
                :class="{ active: currentIndex === 1 }"
                @click="tabHandle(1)"
                >验证码登录</span
              >
            </div>
            <div class="tabs-content" v-show="currentIndex === 0">
              <el-form :model="loginData" :rules="loginRules" ref="loginForm">
                <el-form-item prop="account" class="form-item">
                  <el-input
                    v-model="loginData.account"
                    placeholder="请输入手机号/邮箱"
                    autocomplete="off"
                    class="form-input"
                  >
                    <template #prefix>
                      <i class="el-icon-user"></i></template></template>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item prop="password" class="form-item">
                  <el-input
                    v-model="loginData.password"
                    placeholder="请输入密码"
                    autocomplete="off"
                    type="password"
                    @keyup.enter="login('loginForm')"
                    class="form-input"
                  >
                    <template #prefix>
                      <i class="el-icon-key"></i></template></template>
                    </template>
                  </el-input>
                </el-form-item>
                <div
                  class="custom-error"
                  :class="loginData.errorStatus ? 'error-show' : ''"
                >
                  <!--<span class="iconfont iconerror"></span>-->
                  <span class="error-text">{{
                    loginData.errorText || '-'
                  }}</span>
                </div>
                <!-- 加一个用户使用了解勾选 -->
                <div class="form-item-agree">
                  <el-checkbox v-model="loginData.agree">
                    <span class="font-12">
                      我已同意并阅读<span class="text" @click="privacyPolicy"
                        >《全品AI教研云隐私政策》</span
                      >
                    </span>
                  </el-checkbox>
                </div>
                <!-- <div class="div_read">
                </div> -->

                <el-form-item class="form-item form-item-submit">
                  <el-button
                    type="primary"
                    class="btn login-btn"
                    v-if="isValue"
                    @click="login('loginForm')"
                    >登录</el-button
                  >
                  <el-button type="primary" class="btn btn-disabled" v-else
                    >登录</el-button
                  >
                </el-form-item>
              </el-form>
            </div>
            <div class="tabs-content" v-show="currentIndex === 1">
              <el-form
                :model="loginVsData"
                :rules="loginVsRules"
                ref="loginFormVs"
              >
                <el-form-item prop="phone" class="form-item">
                  <el-input
                    v-model="loginVsData.phone"
                    placeholder="请输入手机号"
                    autocomplete="off"
                    @blur="onFocus"
                    class="form-input"
                  >
                    <template #prefix>
                      <i class="el-icon-mobile-phone"></i></template></template>
                    </template>
                  </el-input>
                </el-form-item>
                <div class="noCaptcha-wrapper">
                  <no-captcha
                    :customWidth="customWidth"
                    v-if="visible"
                    @checkCodeSuccess="onCheckCodeSuccess"
                  ></no-captcha>
                </div>
                <el-form-item prop="vsCode" class="form-item">
                  <el-input
                    v-model="loginVsData.vsCode"
                    placeholder="请输入验证码"
                    autocomplete="off"
                    @keyup.enter="login('loginForm')"
                    class="form-input"
                  >
                    <template #prefix>
                      <i class="el-icon-key"></i></template></template>
                    </template>
                  </el-input>
                  <div
                    class="append-btn"
                    v-if="loginVsData.vsCodeStatus"
                    style="width: 95px"
                  >
                    <div class="line"></div>
                    {{ loginVsData.vsCodeText }}
                  </div>
                  <div
                    class="append-btn"
                    :class="{ isdisavled: isVfCode }"
                    v-else
                  >
                    <span @click="getVfcode">
                      <div class="line"></div>
                      {{ loginVsData.vsCodeText }}
                    </span>
                  </div>
                </el-form-item>
                <div
                  class="custom-error"
                  :class="loginVsData.errorStatus ? 'error-show' : ''"
                >
                  <!--<span class="iconfont iconerror"></span>-->
                  <span class="error-text">{{
                    loginVsData.errorText || '-'
                  }}</span>
                </div>
                <div class="form-item-agree form-item-agree2">
                  <el-checkbox v-model="loginVsData.agree">
                    <span class="font-12">
                      我已同意并阅读<span class="text" @click="privacyPolicy"
                        >《全品AI教研云隐私政策》</span
                      >
                    </span>
                  </el-checkbox>
                </div>
                <el-form-item
                  class="form-item form-item-submit"
                  style="margin-top: 0"
                >
                  <el-button
                    type="primary"
                    class="btn login-btn"
                    v-if="isValueVs"
                    @click="loginVs('loginFormVs')"
                    >登录</el-button
                  >
                  <el-button type="primary" class="btn btn-disabled" v-else
                    >登录</el-button
                  >
                </el-form-item>
              </el-form>
            </div>
            <div class="form-item-service">
              <span
                class="text font-12"
                @click="goFindPassword('/retrievePassword')"
                >忘记密码?</span
              >
              <span class="text font-12 color-theme" @click="goRegister"
                >免费注册></span
              >
            </div>
            <!-- 微信小程序已下架 -->
            <!-- <div class="login-wx-login" v-if="currentIndex === 0">
              <div class="login-wx-login-text" @click="showWxLogin = true">
                <span class="wx-login-icon"></span>
                微信扫码登录
              </div>
            </div> -->
          </div>
          <!-- <div v-show="showWxLogin">
            <WxProgramLogin
              v-if="visible"
              @changeAccount="showWxLogin = false"
            ></WxProgramLogin>
          </div> -->
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CTS from '@/common/js/constant'
import commonUrl from '@/common/js/project-url'
import { API } from '@/api/config'
// import wxlogin from 'vue-wxlogin'
import NoCaptcha from '@/components/NoCaptcha/NoCaptcha'
// import WxProgramLogin from './WxProgramLogin'
import { setToken, removeToken, encrypt } from '@/common/js/util'
import { loginLeftList } from './config'
let interval = null
export default {
  data() {
    let validateAccount = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号/邮箱'))
      } else {
        let str = value.trim()
        if (CTS.constant.phoneReg.test(str) || CTS.constant.emilReg.test(str)) {
          callback()
        } else {
          this.loginData.errorStatus = false
          return callback(new Error('请输入正确的手机号或者邮箱'))
        }
      }
    }
    let validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (CTS.constant.passwordReg.test(value)) {
          callback()
        } else {
          this.loginData.errorStatus = false
          return callback(new Error('密码是6~18位字母、数字'))
        }
      }
    }
    let validatePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号'))
      } else {
        let str = value.trim()
        if (CTS.constant.phoneReg.test(str)) {
          callback()
        } else {
          this.loginVsData.errorStatus = false
          return callback(new Error('请输入正确的手机号'))
        }
      }
    }
    let validateVscode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'))
      } else {
        const passwordReg = CTS.constant.vfcodeReg
        if (passwordReg.test(value)) {
          callback()
        } else {
          this.loginVsData.errorStatus = false
          return callback(new Error('验证码是4位数字'))
        }
      }
    }
    return {
      initDate: {
        visible: false,
        onGoRegister: null,
        onGoAgreement: null,
        infomationAuth: null,
      },
      infomationAuth: null,
      onGoAgreement: null,
      customWidth: 300,
      visible: false,
      currentIndex: 0,
      onGoRegister: null,
      //   showWxLogin: true,
      wxLoginConfig: {
        appid: 'wx773a40341606402b',
        scope: 'snsapi_login',
        redirect_uri: encodeURIComponent(
          'https://www.canpoint.net/login/third/tiwxlogin',
        ),
        // redirect_uri: encodeURIComponent('https://cj.canpoint.net/123123'),
        state: Math.random() * 1000,
        theme: 'black',
        href: process.env.VUE_APP_WXLOGIN_CSS,
        // 'https://tiku-doc-collection-api-test.canpoint.net/ti-wxlogin.css'
      },
      loginData: {
        account: '',
        password: '',
        errorStatus: false,
        errorText: '',
        codeStatus: false,
        agree: false,
      },
      loginRules: {
        account: [{ validator: validateAccount, trigger: 'blur' }],
        password: [{ validator: validatePassword, trigger: 'blur' }],
        agree: [{ required: true, message: '请勾选', trigger: 'change' }],
      },
      loginVsData: {
        phone: '',
        vsCode: '',
        errorStatus: false,
        errorText: '',
        vsCodeStatus: false,
        vsCodeText: '获取验证码',
        agree: false,
      },
      loginVsRules: {
        phone: [{ validator: validatePhone, trigger: 'blur' }],
        vsCode: [{ validator: validateVscode, trigger: 'submit' }],
        agree: [{ required: true, message: '请勾选', trigger: 'change' }],
      },
      checkeNCData: {},
      loginLeftStyle: {}, // 可以修改背景的 样式设置
    }
  },
  created() {
    let index = Math.floor(Math.random() * loginLeftList.length)
    // console.log(loginLeftList.length,index)
    this.loginLeftStyle = {
      background: `url(${loginLeftList[index]}) no-repeat`,
      backgroundSize: '412px 540px',
    }
  },
  computed: {
    isValue() {
      return !!(this.loginData.account && this.loginData.password)
    },
    inIndex() {
      return this.$route.query.isIndex ? this.$route.query.isIndex : ''
    },
    isValueVs() {
      return !!(this.loginVsData.phone && this.loginVsData.vsCode)
    },
    // 是否可以发送短信验证码
    isVfCode() {
      return !(this.loginVsData.phone && this.loginData.codeStatus)
    },
  },
  watch: {
    visible(newValue) {
      if (newValue) {
        // this.wxLoginInit()
      }
    },
  },
  methods: {
    onCheckCodeSuccess(params) {
      this.checkeNCData = params
      this.loginData.codeStatus = true // 检验成功
      this.loginData.errorStatus = false
    },
    wxLoginInit() {
      this.$nextTick(() => {
        // const redirectUri = encodeURIComponent(window.location.href)
        const redirectUri = encodeURIComponent(
          'http://ti-demo.canpoint.cn:8433/',
        )
        console.log(redirectUri)
        /* eslint-disable */
        // const wxlogin = new WxLogin({
        //   self_redirect: false,
        //   id: 'loginQrcode',
        //   appid: 'wx773a40341606402b',
        //   scope: 'snsapi_login',
        //   redirect_uri: redirectUri,
        //   state: 'wechat_redirect',
        //   style:'black',
        //   href: ''
        // })
        console.log(wxlogin)
      })
    },
    // 关闭登录弹窗
    show() {
      this.visible = true
      if (this.showLoginEvent) {
        this.showLoginEvent()
      }
    },
    // 关闭登录弹窗
    hide() {
      this.visible = false
      if (this.hideLoginEvent) {
        this.hideLoginEvent()
      }
    },
    tabHandle(index) {
      this.currentIndex = index
    },
    // 去注册
    goRegister() {
      if (this.onGoRegister) {
        this.onGoRegister()
      }
      // this.$emit('goRegister')
    },
    // 账号密码登录提交
    login(loginForm) {
      if (!this.loginData.agree) {
        this.$message.error('请阅读并勾选全品AI教研云隐私政策')
        return
      }
      this.$refs[loginForm].validate((valid, result) => {
        // 1. 参数验证
        if (!valid) {
          const key = Object.keys(result)[0]
          this.loginData.errorStatus = true
          this.loginData.errorText = result[key][0].message
        } else {
          // 2.登录提交
          this.loginData.errorStatus = false
          removeToken()
          let parms = {
            url: API.LOGIN.urlPath,
            apiId: API.LOGIN.apiId,
            isWhitelist: 0,
            httpMethod: 1,
            strParams: {
              account: this.loginData.account.trim(),
              password: encrypt(this.loginData.password),
            },
            // account: this.loginData.account.trim(),
            // password: encrypt(this.loginData.password),
          }
          this.newPost({ urlPath: API.LOGIN.urlLocalPath }, parms).then(res => {
            // this.wayPost(API.LOGIN, parms).then(res => {
            if (res && res.code === CTS.constant.SUCCESS_CODE) {
              // 3 .注册后显示注册成功
              this.loginSuccese = true
              // 登录后把token存到cookie
              setToken(res.data.token, 30)
              window.location.reload()
            } else {
              this.loginData.errorStatus = true
              this.loginData.errorText = res.msg
            }
          })
        }
      })
    },
    // 验证码登录
    loginVs(loginFormVs) {
      if (!this.loginVsData.agree) {
        this.$message.error('请阅读并勾选全品AI教研云隐私政策')
        return
      }
      this.$refs[loginFormVs].validate((valid, result) => {
        // 1. 参数验证
        if (!valid) {
          const key = Object.keys(result)[0]
          this.loginVsData.errorStatus = true
          this.loginVsData.errorText = result[key][0].message
        } else {
          // 2.登录提交
          this.loginVsData.errorStatus = false
          let parms = {
            url: API.VCODELOGIN.urlPath,
            apiId: API.VCODELOGIN.apiId,
            isWhitelist: 0,
            httpMethod: 1,
            strParams: {
              mobile: this.loginVsData.phone.trim(),
              vCode: this.loginVsData.vsCode.trim(),
            },
          }
          let set = {
            authCode: 1,
          }
          this.newPost({ urlPath: API.VCODELOGIN.baseURL }, parms, set).then(
            res => {
              if (res && res.code === CTS.constant.SUCCESS_CODE) {
                // 3 .登陆后把token存到cookie
                setToken(res.data.token, 30)
                window.location.reload()
              } else {
                this.loginVsData.errorStatus = true
                this.loginVsData.errorText = res.msg
              }
            },
          )
        }
      })
    },
    getVfcode() {
      // 1.校验参数
      if (!this.loginVsData.phone) {
        this.loginVsData.errorStatus = true
        this.loginVsData.errorText = '请输入手机号'
        return
      }
      if (!CTS.constant.phoneReg.test(this.loginVsData.phone)) {
        this.loginVsData.errorStatus = true
        this.loginVsData.errorText = '请输入正确的手机号'
        return
      }
      // 2.验证码秒数减少
      this.changeVf()
      let parms = {
        url: API.SENDVCODE.urlPath,
        apiId: API.SENDVCODE.apiId,
        isWhitelist: 0,
        httpMethod: 1,
        strParams: {
          mobile: this.loginVsData.phone,
          sessionId: this.checkeNCData.strParams.sessionId,
        },
      }
      let set = {
        message: '发送验证码中',
      }
      // 2.发送验证码请求
      this.newPost({ urlPath: API.SENDVCODE.baseURL }, parms, set).then(res => {
        if (res && res.code === CTS.constant.SUCCESS_CODE) {
          // 3.请求成功后改变验证码显示
        } else {
          this.loginVsData.errorStatus = true
          this.loginVsData.errorText = res.msg
          setTimeout(() => {
            window.clearInterval(interval)
            this.loginVsData.vsCodeStatus = false
            this.loginVsData.vsCodeText = '获取验证码'
          }, 1000)
        }
      })
    },
    changeVf() {
      let that = this
      let time = 60
      that.loginVsData.vsCodeStatus = true
      that.loginVsData.vsCodeText = `60S后重新获取`
      interval = window.setInterval(function() {
        --time
        that.loginVsData.vsCodeText = `${time}S后重新获取`
        if (time < 0) {
          that.loginVsData.vsCodeStatus = false
          that.loginVsData.vsCodeText = `获取验证码`
          window.clearInterval(interval)
        }
      }, 1000)
    },
    // 找回密码
    goFindPassword() {
      this.openWindowLink(
        // commonUrl.eduCloudUrl.accountMainUrl + '/#/retrievePassword',
        '//account.canpoint.cn/#/retrievePassword',
      )
    },
    onFocus() {
      this.loginVsData.errorStatus = false
    },
    redirectInfo() {
      //   this.hide()
      this.hide()
      if (this.onGoAgreement) {
        this.onGoAgreement()
      }
    },
    // 进入服务协议
    privacyPolicy() {
      this.hide()
      this.openWindowLink(process.env.VUE_APP_SRC + 'infomationAuth')
    },
  },
  components: {
    NoCaptcha,
  },
}
</script>

<style lang="scss">
// .v-modal {
//   opacity: 0.1;
// }
.weui_msg {
  padding-top: 0;
  width: 198px;
  height: 198px;
}
.weui_icon_msg:before {
  font-size: 34px;
}
</style>

<style lang="scss" scoped>
.login-dialog :deep(.el-dialog) {
    width: 824px;
    padding: 0px;
    box-sizing: border-box;
    box-shadow: 0px 0px 30px 0px rgba(62, 115, 205, 0.4);
    border-radius: 6px;
    .el-dialog__header {
      padding: 0;
    }
  }
}
.login-container {
  display: flex;
  .login-logo {
    padding: 35px 0 0 35px;
    text-align: left;
  }
  .interval {
    width: 1px;
    height: 20px;
    margin: 0 10px;
    background-color: #898989;
  }
  .login-title {
    margin: 36px 0 28px 0;
    font-weight: normal;
    font-size: 18px;
  }
  .login-tabs {
    @include flex();
    justify-content: space-around;
    margin: 26px 0 38px 0;
    .tabs-text {
      cursor: pointer;
      font-size: $font-size-large;
      &.active {
        color: $color-text-d;
        font-weight: 700;
        font-size: 24px;
      }
    }
  }
  .login-left {
    height: 540px;
    margin: 0 auto;
    width: 412px;
    text-align: center;
    background: #f3f4fb;
    border-radius: 6px 0 0 6px;
    .login-qrcode {
      display: inline-block;
      width: 230px;
      height: 230px;
      margin-bottom: 16px;
      border: 1px solid $color-border;
      box-sizing: border-box;
      .qrcode {
        width: 100%;
        height: 100%;
      }
    }
  }
  .login-right {
    width: 412px;
    .login-account-segment {
      padding: 89px 55px 0px 55px;
    }
    .noCaptcha-wrapper {
      margin-bottom: 22px;
    }
    .form-item :deep(.icon-box) {
      position: relative;
      margin-bottom: 30px;
        position: absolute;
        top: 0;
        left: 16px;
        .iconfont {
          color: $color-text-d;
          font-size: $font-size-medium;
        }
      }
      .form-input {
        .el-input__inner {
          height: 40px;
          line-height: 40px;
          border: 1px solid $color-border;
          border-radius: 4px;
          padding-left: 45px;
          color: $color-text-d;
          transition: 0.2s;
          &:focus {
            border: 1px solid $color-theme;
          }
          &:focus + .el-input__prefix {
            color: $color-text-d;
          }
        }
        .el-input__prefix {
          top: 4px;
          left: 16px;
          color: $color-text-ll;
        }
      }
      .el-form-item__error {
        padding-top: 8px;
        color: #ff5733;
        display: none;
        // &:before {
        //   display: inline-block;
        //   content: "\e71a";
        //   color: $color-theme-l;
        // }
      }
      .append-btn {
        position: absolute;
        width: 80px;
        top: 2px;
        right: 2px;
        height: 36px;
        line-height: 36px;
        font-size: 12px;
        cursor: pointer;
        color: $color-theme;
        background-color: #ffffff;
        box-sizing: border-box;
        .line {
          position: absolute;
          top: 10px;
          left: -20px;
          height: 20px;
          width: 1px;
          background-color: #e2e6ec;
        }
      }
    }
    .custom-error {
      opacity: 0;
      color: $color-theme-l;
      .iconerror {
        margin-right: 5px;
        vertical-align: -1px;
        font-size: $font-size-medium;
      }
      .error-text {
        font-size: $font-size-small;
      }
      &.error-show {
        opacity: 1;
      }
    }
    .form-item-submit {
      margin-top: 10px;
      margin-bottom: 20px;
      .btn {
        width: 100%;
        height: 40px;
        padding: 0;
        // box-shadow:0px 2px 6px 0px rgba(42,77,138,0.2);
        border-radius: 4px;
      }
      .login-btn {
        background: #487fff;
      }
      .login-btn:hover {
        background: $color-theme-d;
      }
      .btn-disabled {
        background: $color-disabled;
        border: 1px solid $color-disabled;
        cursor: not-allowed;
      }
    }
    .form-item-service {
      margin-bottom: 50px;
      @include flex();
      justify-content: space-between;
      .text {
        cursor: pointer;
        &:hover {
          color: $color-theme;
        }
      }
    }
    .form-item-other {
      .line {
        width: 100%;
        height: 1px;
        background: $color-background-l;
      }
      .login-qq {
        width: 92px;
        height: 20px;
        background: $color-white;
        margin: -10px auto;
        cursor: pointer;
        text-align: center;
        transition: 0.2s;
        .iconqq {
          margin-right: 5px;
          vertical-align: middle;
          font-size: $font-size-medium-x;
          color: #e2e2e2;
        }
        .text {
          color: $color-text-ll;
        }
        &:hover {
          .iconqq,
          .text {
            color: $color-theme;
          }
        }
      }
    }

    .form-item-agree {
      :deep(.el-checkbox__label) {
        font-size: 12px;
        padding-left: 6px;
        .text {
          font-size: 12px;
          color: #487fff;
        }
      }
    }
    .form-item-agree2 {
      margin-bottom: 10px;
    }
  }
}

.append-btn.isdisavled {
  pointer-events: none;
  color: #c0c0c0;
  span {
    pointer-events: none;
    color: #c0c0c0 !important;
  }
}

.login-wx-login {
  text-align: center;
  position: relative;
  .login-wx-login-text {
    display: inline-block;
    width: 120px;
    font-size: 12px;
    font-weight: 400;
    color: #487fff;
    line-height: 24px;
    box-sizing: border-box;
    cursor: pointer;
    user-select: none;
    .wx-login-icon {
      display: inline-block;
      width: 15px;
      height: 15px;
      background: url(//cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/png/8befc174-169a-4f75-8510-f81f25f85f65.png)
        no-repeat;
      background-size: 15px 15px;
      vertical-align: text-bottom;
    }
    &::before,
    &::after {
      content: '';
      position: absolute;
      display: block;
      left: 50%;
      top: 50%;
      -webkit-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
      border-top: 1px solid #e2e2e2;
      width: 90px;
    }
    &::before {
      margin-left: -100px;
    }
    &::after {
      margin-left: 100px;
    }
  }
}
.div_read {
  font-size: 12px;
  a {
    color: #487fff;
    font-size: 12px;
  }
  :deep(.el-checkbox__label) {
    font-size: 12px;
    padding-left: 6px;
  }
}
</style>
