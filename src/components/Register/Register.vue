<template>
  <div>
    <el-dialog
      title=" "
      width="824px"
      class="login-dialog"
      top="11.5%"
      :append-to-body="true"
      :lock-scroll="false"
      :visible.sync="visible"
      :closed="hide"
    >
      <div
        class="login-container"
        v-if="!(registerRewards && registerRewards.length)"
      >
        <div class="login-logo">
          <img src="@/assets/images/logo-slogan.svg" alt="logo" height="30" />
          <!-- <span class="interval"></span> -->
          <!-- <img src="@/assets/images/slogan.svg" width="104" /> -->
        </div>
        <div class="login-content">
          <h2 class="login-title color-3">
            快速注册
            <!-- <div class="tips">注册即可获得10颗胖大海和3张下载券</div> -->
          </h2>

          <el-form :model="loginData" :rules="loginRules" ref="loginForm">
            <el-form-item prop="account" class="form-item">
              <el-input
                class="form-input"
                v-model="loginData.account"
                placeholder="请输入手机号"
                autocomplete="off"
                @blur="onFocus"
              >
                <i slot="prefix" class="el-icon-mobile-phone"></i>
              </el-input>
            </el-form-item>
            <el-form-item prop="password" class="form-item">
              <span class="icon-box">
                <i class="el-icon-key"></i>
              </span>
              <el-input
                class="form-input"
                v-model="loginData.password"
                placeholder="设置密码（6-18位数字或字母组合）"
                autocomplete="off"
                type="password"
                @blur="onFocus"
              >
                <i slot="prefix" class="el-icon-key"></i>
              </el-input>
            </el-form-item>
            <div class="noCaptcha-wrapper">
              <no-captcha
                v-if="visible"
                @checkCodeSuccess="onCheckCodeSuccess"
              ></no-captcha>
            </div>
            <el-form-item prop="vfcode" class="form-item vfcode">
              <el-input
                class="form-input form-input-short"
                v-model="loginData.vfcode"
                placeholder="请输入短信验证码"
                autocomplete="off"
                @blur="onFocus"
              >
                <i slot="prefix" class="el-icon-key"></i>
              </el-input>
              <div class="code-btn" v-if="loginData.vfcodeStatus">
                <span>{{ loginData.vfcodeText }}</span>
              </div>
              <div
                class="code-btn"
                v-else
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
                <span class="font-12" @click="entryAgreement">
                  我同意<span class="text">《全品AI教研云隐私政策》</span>
                </span>
              </el-checkbox>
            </el-form-item>
            <div
              class="custom-error"
              :class="loginData.errorStatus ? 'error-show' : ''"
            >
              <span class="iconfont iconerror"></span>
              <span class="error-text">{{ loginData.errorText }}</span>
            </div>
            <!-- 1111111111111111111111111111111111111111111111111111111111111111111111 -->
            <el-form-item class="form-item form-item-submit">
              <el-button
                v-if="isValue"
                class="btn login-btn"
                @click="register('loginForm')"
                >注册</el-button
              >
              <el-button v-else type="primary" class="btn btn-disabled"
                >注册</el-button
              >
            </el-form-item>
            <div class="form-item-service">
              <span class="font-12" v-if="haslogin == 1">
                已注册, <span class="text" @click="goLogin">去登录</span>
              </span>
            </div>
          </el-form>
        </div>
      </div>
      <div class="login-container" v-else>
        <div class="login-logo">
          <img src="@/assets/images/logo-slogan.svg" alt="logo" height="30" />
        </div>
        <div class="login-content">
          <h2 class="login-success-title color-3">注册成功，恭喜获得</h2>
        </div>

        <div class="reward-list">
          <div
            class="reward-item"
            v-for="(item, index) in registerRewards"
            :key="index"
          >
            <img
              :src="item.goodsInfoPicture"
              :style="{
                width: item.width + 'px',
                height: item.height + 'px',
              }"
            />
            <div class="reward-info" v-html="item.content"></div>
          </div>
        </div>
        <div class="register-success-bottom" @click="gotoReload">
          <div class="register-success-button">开始使用</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CTS from '@/common/js/constant'
import { setToken, encrypt, getToken } from '@/common/js/util'
import { API } from '@/api/config'
// import commonUrl from '@/common/js/project-url'
import NoCaptcha from '@/components/NoCaptcha/NoCaptcha'
let interval = null
export default {
  data() {
    let validateAccount = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号'))
      } else {
        let str = value.trim()
        if (CTS.constant.phoneReg.test(str)) {
          callback()
        } else {
          this.loginData.errorStatus = false
          return callback(new Error('请输入正确的手机号'))
        }
      }
    }
    let validateVfcode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入短信验证码'))
      } else {
        const vfcode = CTS.constant.vfcodeReg
        if (vfcode.test(value)) {
          callback()
        } else {
          this.loginData.errorStatus = false
          return callback(new Error('验证码是4位数字'))
        }
      }
    }
    let validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        const passwordReg = CTS.constant.passwordReg
        if (passwordReg.test(value)) {
          callback()
        } else {
          this.loginData.errorStatus = false
          return callback(new Error('密码是6~18位字母、数字'))
        }
      }
    }
    return {
      initDate: {
        visible: false,
        onGoLogin: null,
        onGoAgreement: null,
        registerRewards: [],
        haslogin: 1,
      },
      visible: false,
      onGoLogin: null,
      onGoAgreement: null,
      loginSuccese: false,
      registerRewards: [],
      loginData: {
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
      },
      loginRules: {
        account: [{ validator: validateAccount, trigger: 'blur' }],
        password: [{ validator: validatePassword, trigger: 'blur' }],
        vfcode: [{ validator: validateVfcode, trigger: 'blur' }],
        agree: [{ required: true, message: '', trigger: 'change' }],
      },
      checkeNCData: {},
      haslogin: 1,
    }
  },
  computed: {
    // 是否可以发送短信验证码
    isVfCode() {
      return !!(this.loginData.account && this.loginData.codeStatus)
    },
    isValue() {
      return !!(
        this.loginData.account &&
        this.loginData.password &&
        this.loginData.codeStatus &&
        this.loginData.vfcode &&
        this.loginData.agree
      )
    },
  },
  created() {
    console.log('创建 register')
  },
  methods: {
    // 显示注册弹窗
    show() {
      this.visible = true

      // this.$emit('showRegister')
    },
    // 关闭注册弹窗
    hide() {
      this.visible = false
      // this.$emit('hideRegister')
    },
    // 去登陆
    goLogin() {
      // this.showReceiveReward([
      //   {
      //     pointsGoodsId: 33,
      //     goodsInfoPicture:
      //       'https://cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/stb-points/goods/goods_info_p.png',
      //     num: 1,
      //     goodsName: '胖大海',
      //   },
      //   {
      //     pointsGoodsId: 33,
      //     goodsInfoPicture:
      //       'https://cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/stb-points/goods/goods_info_p.png',
      //     num: 2,
      //     goodsName: '胖大海',
      //   },
      // ])
      if (this.onGoLogin) {
        this.onGoLogin()
      }
    },
    onFocus() {
      this.loginData.errorStatus = false
    },
    // 监听滑动验证码
    onCheckCodeSuccess(params) {
      // sessionId: data.csessionid,
      // sig: data.sig,
      // token: ncToken,
      // scene: this.scene
      console.log(`1111111111111`)
      this.checkeNCData = params
      this.loginData.codeStatus = true // 检验成功
      this.loginData.errorStatus = false
    },
    // 进入服务协议
    entryAgreement() {
      this.hide()
      this.openWindowLink(import.meta.env.VITE_SRC + 'infomationAuth')
      //   if (this.onGoAgreement) {
      //     this.onGoAgreement()
      //   }
      // this.$router.push({ name: 'agreement' })
    },
    register(loginForm) {
      this.$refs[loginForm].validate((valid, result) => {
        // 1. 参数验证
        if (!valid) {
          const key = Object.keys(result)[0]
          this.loginData.errorStatus = true
          this.loginData.errorText = result[key][0].message
        } else {
          // 2.注册提交
          this.loginData.errorStatus = false
          let parms = {
            isWhitelist: 0,
            httpMethod: 1,
            url: API.REGISTER.urlPath,
            apiId: API.REGISTER.apiId,
            strParams: {
              account: this.loginData.account,
              password: encrypt(this.loginData.password),
              vCode: this.loginData.vfcode,
            },
          }
          let set = {
            showLoading: true,
            message: '注册中...',
          }
          this.newPost({ urlPath: API.REGISTER.baseURL }, parms, set).then(
            res => {
              if (res && res.code === CTS.constant.SUCCESS_CODE) {
                // 3 .注册后显示注册成功
                this.loginSuccese = true
                // 登录后把token存到cookie
                // setToken(res.data.token, 30)
                // console.log(res.data.token)
                // window.location.reload()
                //  注册 成功
                console.log(this.loginData.account, this.loginData.password)
                this.loginHttp(this.loginData.account, this.loginData.password)
              } else {
                this.loginSuccese = false
                this.loginData.errorStatus = true
                this.loginData.errorText = res.msg
              }
            },
          )
        }
      })
    },
    //  注册 成功 获取 用户 信息 获取奖励
    getUserInfo() {
      let parms = {
        token: getToken(),
      }
      let set = {
        authCode: 2,
      }
      console.log('getUserInfo')
      this.apiPost(API.GET_SSO_VERIFY, parms, set).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          if (res.data.rewards && res.data.rewards.length) {
            this.showReceiveReward(res.data.rewards)
          } else {
            window.location.reload()
          }
        }
      })
    },
    gotoReload() {
      // window.location.reload()
      window.location.href = import.meta.env.VITE_SRC
    },
    showReceiveReward(rewards) {
      // goodsInfoPicture
      for (let item of rewards) {
        item.width = 115
        item.hegiht = 115
        item.content =
          item.goodsName +
          '<span style="color:#FF6A00;">×' +
          item.num +
          '</span>'
      }
      this.registerRewards = rewards
      console.log(this.registerRewards)
    },
    getVfcode() {
      // 1.校验参数
      if (!this.loginData.account) {
        this.loginData.errorStatus = true
        this.loginData.errorText = '请输入手机号'
        return
      }
      if (!CTS.constant.phoneReg.test(this.loginData.account)) {
        this.loginData.errorStatus = true
        this.loginData.errorText = '请输入正确的手机号'
        return
      }
      if (!this.loginData.password) {
        this.loginData.errorStatus = true
        this.loginData.errorText = '请设置登录密码'
        return
      }
      if (!this.loginData.codeStatus) {
        this.loginData.errorStatus = true
        this.loginData.errorText = '请完成滑动验证'
        return
      }
      // 2.验证码秒数减少
      this.changeVf()
      // sessionId: data.csessionid,
      // sig: data.sig,
      // token: ncToken,
      // scene: this.scene
      let parms = {
        strParams: {
          account: this.loginData.account,
          sessionId: this.checkeNCData.strParams.sessionId,
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
      this.newPost({ urlPath: API.VCODE.baseURL }, parms, set).then(res => {
        if (res && res.code === CTS.constant.SUCCESS_CODE) {
          // 3.请求成功后改变验证码显示
        } else {
          this.loginData.errorStatus = true
          this.loginData.errorText = res.msg
          setTimeout(() => {
            window.clearInterval(interval)
            this.loginData.vfcodeStatus = false
            this.loginData.vfcodeText = '获取验证码'
          }, 1000)
        }
      })
    },
    loginHttp(account, password) {
      let parms = {
        url: API.LOGIN.urlPath,
        apiId: API.LOGIN.apiId,
        isWhitelist: 0,
        httpMethod: 1,
        strParams: {
          account: account,
          password: encrypt(password),
        },
        // account: this.loginData.account.trim(),
        // password: encrypt(this.loginData.password),
      }
      this.newPost({ urlPath: API.LOGIN.urlLocalPath }, parms).then(res => {
        // this.wayPost(API.LOGIN, parms).then(res => {
        if (res && res.code === CTS.constant.SUCCESS_CODE) {
          // 3 .注册后显示注册成功
          // 登录后把token存到cookie
          setToken(res.data.token, 30)
          this.getUserInfo()
          // window.location.reload()
        }
      })
    },
    changeVf() {
      let that = this
      let time = 60
      that.loginData.vfcodeStatus = true
      that.loginData.vfcodeText = `60S后重新获取`
      interval = window.setInterval(function() {
        --time
        that.loginData.vfcodeText = `${time}S后重新获取`
        if (time < 0) {
          that.loginData.vfcodeStatus = false
          that.loginData.vfcodeText = `获取验证码`
          window.clearInterval(interval)
        }
      }, 1000)
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
</style>

<style lang="scss" scoped>
.login-dialog :deep() {
  .el-dialog {
    width: 824px;
    height: 540px;
    padding: 32px 32px 70px 32px;
    box-sizing: border-box;
    box-shadow: 0px 0px 30px 0px rgba(62, 115, 205, 0.4);
    border-radius: 6px;
    .el-dialog__header {
      padding: 0;
    }
  }
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
    font-weight: 700;
    text-align: center;
    .tips {
      font-size: 12px;
      line-height: 30px;
      font-weight: 300;
      color: #666666;
    }
  }
  .login-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .form-item /deep/ {
      position: relative;
      .is-error {
        .form-input {
          .el-input__inner {
            border: 1px solid $color-theme-l;
          }
        }
      }
      .icon-box {
        position: absolute;
        top: 0;
        left: 16px;
        .iconfont {
          color: $color-text-d;
          font-size: $font-size-medium;
        }
      }
      .form-input {
        width: 360px;
        .el-input__inner {
          height: 40px;
          line-height: 40px;
          border: 1px solid $color-border;
          border-radius: 4px;
          padding-left: 45px;
          color: $color-text-d;
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
        &.form-input-short {
          width: 220px;
        }
      }
    }
    .vfcode {
      margin-bottom: 18px;
    }
    .noCaptcha-wrapper {
      margin-bottom: 22px;
    }
    .code-btn {
      display: inline-block;
      width: 126px;
      height: 40px;
      line-height: 40px;
      margin-left: 14px;
      cursor: pointer;
      background-color: $color-theme;
      text-align: center;
      border-radius: 4px;
      span {
        color: $color-white;
        padding: 0 10px;
      }
      &.btn-disabled {
        background: $color-disabled;
        border: 1px solid $color-disabled;
        cursor: not-allowed;
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
    .form-item-agree /deep/ {
      margin-top: -5px;
      margin-bottom: 5px;
      .el-radio__input.is-checked + .el-radio__label {
        color: $color-text;
      }
      .text {
        color: $color-theme;
      }
    }
    .form-item-submit {
      margin-top: 15px;
      margin-bottom: 15px;
      .btn {
        width: 360px;
        height: 40px;
        padding: 0;
        box-shadow: 0px 2px 6px 0px rgba(42, 77, 138, 0.2);
        border-radius: 4px;
        font-size: $font-size-medium;
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
      width: 360px;
      text-align: center;
      .text {
        cursor: pointer;
        color: $color-theme;
        &:hover {
          color: $color-theme-d;
        }
      }
    }
  }
}

.login-success-title {
  font-size: 30px;
  padding: 30px 0;
}
.reward-list {
  display: flex;
  width: 400px;
  justify-content: space-around;
  margin: 0 auto;
  .reward-item {
    width: 190px;
    text-align: center;
  }
}
.register-success-bottom {
  padding-top: 100px;
  .register-success-button {
    margin: 0 auto;
    width: 300px;
    line-height: 40px;
    text-align: center;
    background-color: $color-theme;
    color: white;
    cursor: pointer;
    user-select: none;
    border-radius: 6px;
  }
}
</style>
