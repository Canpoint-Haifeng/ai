<template>
  <div class="top-bar">
    <div class="content-container top-h">
      <h1><span>全品文教</span> - 学生用品提供商和教育服务者</h1>
      <div class="top-menu fr">
        <ul
          v-if="!loginStatus"
          class="top-menu-list"
        >
          <li
            class="list-item item-login"
            @click="showLogin"
          >
            <span class="text"><i class="iconfont iconuser" />登录</span>
            <em class="line">|</em>
          </li>
          <li
            class="list-item"
            @click="showRegister"
          >
            <span class="text">注册</span>
            <em class="line">|</em>
          </li>
          <li
            class="list-item"
            @click="entryPage('help')"
          >
            <span class="text">帮助中心</span>
          </li>
        </ul>
        <ul
          v-else
          class="top-menu-list"
        >
          <li class="list-item">
            <span class="username">{{ username }}</span>
          </li>
          <li
            class="list-item"
            @click="entryPage('help')"
          >
            <span class="text">帮助中心</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginStatus: false,
      username: 'User'
    }
  },
  methods: {
    showLogin() {
      console.log('Login clicked')
    },
    showRegister() {
      console.log('Register clicked')
    },
    entryPage(page) {
      console.log('Navigate to', page)
    }
  }
}
</script>
<style lang="scss">
@import "@/assets/css/variables.scss";
.top-bar {
  width: 100%;
  min-width: 1200px;
  height: 40px;
  background: #487fff;
  color: #fff;
  
  .top-h {
    display: flex;
    align-items: center;
    justify-content: space-between;
    h1 {
      font-size: 12px;
      opacity: 0.6;
      color: #fff;
      font-weight: 400;
      span {
        font-size: 14px;
        font-weight: 600;
      }
    }
  }
  
  .top-menu {
    .top-menu-list {
      display: flex;
      align-items: center;
      .list-item {
        display: flex;
        align-items: center;
        cursor: pointer;
        transition: 0.2s;
        &:hover {
          color: #d6e2ff;
          .text {
            color: #d6e2ff;
          }
        }
        .text {
          color: #fff;
          transition: 0.2s;
        }
        .line {
          margin: 0 10px;
          font-style: normal;
        }
        &.item-login {
          .text {
            i {
              margin-right: 5px;
            }
          }
        }
      }
    }
  }
}
</style>

