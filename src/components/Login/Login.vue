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
      :close-on-click-modal="false"
      :closed="hide"
    >
      <div class="login-container">
        <div
          class="login-left"
          :style="loginLeftStyle"
        >
          <div class="login-logo">
            <img
              src="@/assets/images/logo-slogan.svg"
              alt="logo"
              height="30"
            >
          </div>
        </div>
        <div class="login-right">
          <div class="login-account-segment">
            <div class="login-tabs">
              <span
                class="tabs-text"
                :class="{ active: currentIndex === 0 }"
                @click="tabHandle(0)"
              >账号密码登录</span>
              <span
                class="tabs-text"
                :class="{ active: currentIndex === 1 }"
                @click="tabHandle(1)"
              >验证码登录</span>
            </div>
            <div
              v-show="currentIndex === 0"
              class="tabs-content"
            >
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
                    placeholder="请输入手机号/邮箱"
                    autocomplete="off"
                    class="form-input"
                  >
                    <template #prefix>
                      <i class="el-icon-user" />
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item
                  prop="password"
                  class="form-item"
                >
                  <el-input
                    v-model="loginData.password"
                    placeholder="请输入密码"
                    autocomplete="off"
                    type="password"
                    class="form-input"
                    @keyup.enter="login('loginForm')"
                  >
                    <template #prefix>
                      <i class="el-icon-key" />
                    </template>
                  </el-input>
                </el-form-item>
                <div
                  class="custom-error"
                  :class="loginData.errorStatus ? 'error-show' : ''"
                >
                  <span class="error-text">{{
                    loginData.errorText || '-'
                  }}</span>
                </div>
                <!-- 加一个用户使用了解勾选 -->
                <div class="form-item-agree">
                  <el-checkbox v-model="loginData.agree">
                    <span class="font-12">
                      我已同意并阅读<span
                        class="text"
                        @click="privacyPolicy"
                      >《全品AI教研云隐私政策》</span>
                    </span>
                  </el-checkbox>
                </div>

                <el-form-item class="form-item form-item-submit">
                  <el-button
                    v-if="isValue"
                    type="primary"
                    class="btn login-btn"
                    @click="login('loginForm')"
                  >
                    登录
                  </el-button>
                  <el-button
                    v-else
                    type="primary"
                    class="btn btn-disabled"
                  >
                    登录
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
            <div
              v-show="currentIndex === 1"
              class="tabs-content"
            >
              <el-form
                ref="loginFormVs"
                :model="loginVsData"
                :rules="loginVsRules"
              >
                <el-form-item
                  prop="phone"
                  class="form-item"
                >
                  <el-input
                    v-model="loginVsData.phone"
                    placeholder="请输入手机号"
                    autocomplete="off"
                    class="form-input"
                    @blur="onFocus"
                  >
                    <template #prefix>
                      <i class="el-icon-mobile-phone" />
                    </template>
                  </el-input>
                </el-form-item>
                <div class="noCaptcha-wrapper">
                  <no-captcha
                    v-if="visible"
                    :custom-width="customWidth"
                    @check-code-success="onCheckCodeSuccess"
                  />
                </div>
                <el-form-item
                  prop="vsCode"
                  class="form-item"
                >
                  <el-input
                    v-model="loginVsData.vsCode"
                    placeholder="请输入验证码"
                    autocomplete="off"
                    class="form-input"
                    @keyup.enter="login('loginForm')"
                  >
                    <template #prefix>
                      <i class="el-icon-key" />
                    </template>
                  </el-input>
                  <div
                    v-if="loginVsData.vsCodeStatus"
                    class="append-btn"
                    style="width: 95px"
                  >
                    <div class="line" />
                    {{ loginVsData.vsCodeText }}
                  </div>
                  <div
                    v-else
                    class="append-btn"
                    :class="{ isdisavled: isVfCode }"
                  >
                    <span @click="getVfcode">
                      <div class="line" />
                      {{ loginVsData.vsCodeText }}
                    </span>
                  </div>
                </el-form-item>
                <div
                  class="custom-error"
                  :class="loginVsData.errorStatus ? 'error-show' : ''"
                >
                  <span class="error-text">{{
                    loginVsData.errorText || '-'
                  }}</span>
                </div>
                <div class="form-item-agree form-item-agree2">
                  <el-checkbox v-model="loginVsData.agree">
                    <span class="font-12">
                      我已同意并阅读<span
                        class="text"
                        @click="privacyPolicy"
                      >《全品AI教研云隐私政策》</span>
                    </span>
                  </el-checkbox>
                </div>
                <el-form-item
                  class="form-item form-item-submit"
                  style="margin-top: 0"
                >
                  <el-button
                    v-if="isValueVs"
                    type="primary"
                    class="btn login-btn"
                    @click="loginVs('loginFormVs')"
                  >
                    登录
                  </el-button>
                  <el-button
                    v-else
                    type="primary"
                    class="btn btn-disabled"
                  >
                    登录
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="form-item-service">
              <span
                class="text font-12"
                @click="goFindPassword('/retrievePassword')"
              >忘记密码?</span>
              <span
                class="text font-12 color-theme"
                @click="goRegister"
              >免费注册></span>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, getCurrentInstance } from 'vue'
import { useLoginForm } from './composition/useLoginForm'
import NoCaptcha from '@/components/NoCaptcha/NoCaptcha.vue'
import commonUrl from '@/common/js/project-url'

export default defineComponent({
  name: 'Login',
  components: {
    NoCaptcha,
  },
  props: {
    showLoginEvent: Function,
    hideLoginEvent: Function,
  },
  emits: ['goRegister'],
  setup(props, { emit }) {
    const instance = getCurrentInstance()
    
    // Use the composition function
    const {
      visible,
      currentIndex,
      customWidth,
      loginData,
      loginVsData,
      loginRules,
      loginVsRules,
      loginLeftStyle,
      isValue,
      isValueVs,
      isVfCode,
      show,
      hide,
      tabHandle,
      login,
      loginVs,
      getVfcode,
      onCheckCodeSuccess,
      onFocus,
      privacyPolicy
    } = useLoginForm(instance)
    
    // Additional methods specific to this component
    const goRegister = () => {
      emit('goRegister')
    }
    
    const goFindPassword = () => {
      instance.proxy.openWindowLink('//account.canpoint.cn/#/retrievePassword')
    }
    
    // Override hide method to call the prop function
    const hideWithEvent = () => {
      hide()
      if (props.hideLoginEvent) {
        props.hideLoginEvent()
      }
    }
    
    // Override show method to call the prop function
    const showWithEvent = () => {
      show()
      if (props.showLoginEvent) {
        props.showLoginEvent()
      }
    }
    
    return {
      visible,
      currentIndex,
      customWidth,
      loginData,
      loginVsData,
      loginRules,
      loginVsRules,
      loginLeftStyle,
      isValue,
      isValueVs,
      isVfCode,
      show: showWithEvent,
      hide: hideWithEvent,
      tabHandle,
      login,
      loginVs,
      getVfcode,
      onCheckCodeSuccess,
      onFocus,
      privacyPolicy,
      goRegister,
      goFindPassword
    }
  }
})
</script>

<style lang="scss">
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
}

.login-dialog :deep(.el-dialog__header) {
  padding: 0;
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
    .form-item {
      position: relative;
      margin-bottom: 30px;
      
      :deep(.icon-box) {
        position: absolute;
        top: 0;
        left: 16px;
        .iconfont {
          color: $color-text-d;
          font-size: $font-size-medium;
        }
      }
      
      :deep(.form-input) {
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
      
      :deep(.el-form-item__error) {
        padding-top: 8px;
        color: #ff5733;
        display: none;
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
