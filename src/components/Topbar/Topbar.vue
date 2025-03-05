<template>
  <div class="topbar-wrapper">
    <div class="topbar">
      <div class="topbar-left">
        <div
          class="logo"
          @click="goHome"
        >
          <img
            src="@/assets/images/logo.png"
            alt="logo"
          >
        </div>
        <div class="title">
          备课助手
        </div>
      </div>
      <div class="topbar-right">
        <div
          v-if="isLogin"
          class="user-info"
        >
          <div class="user-avatar">
            <img
              :src="userInfo.avatar || defaultAvatar"
              alt="avatar"
            >
          </div>
          <div class="user-name">
            {{ userInfo.nickname || userInfo.username }}
          </div>
          <div class="user-dropdown">
            <el-dropdown
              trigger="click"
              @command="handleCommand"
            >
              <span class="el-dropdown-link">
                <i class="el-icon-arrow-down" />
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="userCenter">
                    个人中心
                  </el-dropdown-item>
                  <el-dropdown-item command="logout">
                    退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
        <div
          v-else
          class="login-register"
        >
          <span
            class="login"
            @click="login"
          >登录</span>
          <span class="divider">|</span>
          <span
            class="register"
            @click="register"
          >注册</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import defaultAvatar from '@/assets/images/default-avatar.png'

export default defineComponent({
  name: 'Topbar',
  setup() {
    const isLogin = ref(false)
    const userInfo = ref({
      avatar: '',
      nickname: '',
      username: ''
    })

    const goHome = () => {
      window.location.href = '/'
    }

    const login = () => {
      console.log('Login')
    }

    const register = () => {
      console.log('Register')
    }

    const handleCommand = (command) => {
      if (command === 'userCenter') {
        console.log('User center')
      } else if (command === 'logout') {
        console.log('Logout')
        isLogin.value = false
      }
    }

    return {
      isLogin,
      userInfo,
      defaultAvatar,
      goHome,
      login,
      register,
      handleCommand
    }
  }
})
</script>

<style lang="scss" scoped>
@import "@/assets/css/mixins.scss";
@import "@/assets/css/variables.scss";
@import "@/assets/css/variables.scss";
.topbar-wrapper {
  height: 60px;
  background-color: #fff;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.1);
}

.topbar {
  width: 1200px;
  height: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.topbar-left {
  display: flex;
  align-items: center;

  .logo {
    width: 40px;
    height: 40px;
    margin-right: 10px;
    cursor: pointer;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .title {
    font-size: 18px;
    font-weight: 500;
    color: #333;
  }
}

.topbar-right {
  display: flex;
  align-items: center;

  .user-info {
    display: flex;
    align-items: center;

    .user-avatar {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 10px;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .user-name {
      font-size: 14px;
      color: #333;
      margin-right: 5px;
    }

    .user-dropdown {
      cursor: pointer;
    }
  }

  .login-register {
    font-size: 14px;
    color: #333;

    .login, .register {
      cursor: pointer;

      &:hover {
        color: #487fff;
      }
    }

    .divider {
      margin: 0 10px;
      color: #dcdfe6;
    }
  }
}
</style>
