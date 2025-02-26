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
        </div>
        <div class="login-content">
          <h2 class="login-title color-3">
            快速注册
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
import { defineComponent, getCurrentInstance } from 'vue'
import { useRegisterForm } from './composition/useRegisterForm'
import NoCaptcha from '@/components/NoCaptcha/NoCaptcha.vue'

export default defineComponent({
  name: 'Register',
  components: {
    NoCaptcha,
  },
  props: {
    onGoLogin: Function,
    onGoAgreement: Function,
  },
  setup(props) {
    const instance = getCurrentInstance()
    
    // Use the composition function
    const {
      visible,
      loginSuccese,
      registerRewards,
      haslogin,
      loginData,
      loginRules,
      isVfCode,
      isValue,
      show,
      hide,
      onFocus,
      onCheckCodeSuccess,
      entryAgreement,
      register,
      getVfcode,
      gotoReload
    } = useRegisterForm(instance)
    
    // Additional methods specific to this component
    const goLogin = () => {
      if (props.onGoLogin) {
        props.onGoLogin()
      }
    }
    
    return {
      visible,
      loginSuccese,
      registerRewards,
      haslogin,
      loginData,
      loginRules,
      isVfCode,
      isValue,
      show,
      hide,
      onFocus,
      onCheckCodeSuccess,
      entryAgreement,
      register,
      getVfcode,
      gotoReload,
      goLogin
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
    font-weight: 400;
    color: #333333;
    line-height: 24px;
    text-align: center;
    .tips {
      font-size: 12px;
      font-weight: 400;
      color: #ff6a00;
      line-height: 17px;
    }
  }
  .login-content {
    width: 360px;
    margin: 0 auto;
    .form-item {
      position: relative;
      margin-bottom: 30px;
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
      :deep(.form-input-short) {
        .el-input__inner {
          padding-right: 95px;
        }
      }
      :deep(.el-form-item__error) {
        padding-top: 8px;
        color: #ff5733;
        display: none;
      }
      .code-btn {
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
        &::before {
          content: '';
          position: absolute;
          top: 10px;
          left: 0px;
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
      @include flex();
      justify-content: space-between;
      .text {
        cursor: pointer;
        color: $color-theme;
        &:hover {
          color: $color-theme;
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
  }
}

.btn-disabled {
  pointer-events: none;
  color: #c0c0c0;
  span {
    pointer-events: none;
    color: #c0c0c0 !important;
  }
}

.reward-list {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 40px;
  .reward-item {
    width: 115px;
    height: 160px;
    margin: 0 20px;
    text-align: center;
    .reward-info {
      margin-top: 10px;
      font-size: 14px;
      font-weight: 400;
      color: #333333;
      line-height: 20px;
    }
  }
}

.login-success-title {
  width: 360px;
  margin-bottom: 30px;
  font-size: $font-size-large;
  font-weight: 400;
  color: #333333;
  line-height: 24px;
  text-align: center;
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
    background: #487fff;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 400;
    color: #ffffff;
    text-align: center;
    cursor: pointer;
  }
}
</style>
