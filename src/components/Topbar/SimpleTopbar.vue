<template>
  <div class="top-bar">
    <div class="content-container">
      <div class="top-menu">
        <ul class="top-menu-list fr">
          <li class="list-item">
            <span class="text" @click="showLogin">登录</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'SimpleTopbar',
  setup() {
    const showLogin = () => {
      console.log('Show login dialog')
    }

    return {
      showLogin
    }
  }
})
</script>

<style lang="scss" scoped>
@use "@/assets/css/variables" as *;
.top-bar {
  width: 100%;
  min-width: 1200px;
  height: 40px;
  background: $color-background-d;
  .top-menu {
    .top-menu-list {
      height: 40px;
      display: flex;
      align-items: center;
      .list-item {
        .text {
          padding: 13px 15px;
          transition: 0.2s;
          cursor: pointer;
          color: rgba(255, 255, 255, 0.6);
          font-size: 12px;
          &:hover {
            color: #fff;
          }
        }
      }
    }
  }
}
</style>
