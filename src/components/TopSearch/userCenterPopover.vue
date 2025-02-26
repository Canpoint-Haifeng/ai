<template>
  <div class="user-center-popover">
    <div class="user-info">
      <div class="user-avatar">
        <img
          :src="userInfo.headImgUrl || require('@/assets/images/default-avatar.png')"
          alt="avatar"
        >
      </div>
      <div class="user-name">
        {{ userInfo.nickName || userInfo.mobile }}
      </div>
    </div>
    <div class="divider" />
    <div class="menu-list">
      <div
        class="menu-item"
        @click="$emit('command', 'userCenter')"
      >
        <i class="iconfont iconuser" />
        <span>个人中心</span>
      </div>
      <div
        class="menu-item"
        @click="$emit('command', 'message')"
      >
        <i class="iconfont iconmessage" />
        <span>消息中心</span>
      </div>
      <div
        class="menu-item"
        @click="$emit('command', 'logout')"
      >
        <i class="iconfont iconlogout" />
        <span>退出登录</span>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'UserCenterPopover',
  props: {
    userInfo: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['command']
})
</script>

<style lang="scss" scoped>
.user-center-popover {
  position: absolute;
  top: 45px;
  right: 0;
  width: 200px;
  background: #ffffff;
  box-shadow: 0px 0px 30px 1px rgba(27, 50, 89, 0.2);
  border-radius: 8px;
  z-index: 9999;
  padding: 20px;
  
  .user-info {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    
    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 10px;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    
    .user-name {
      font-size: 14px;
      color: #333333;
      max-width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  
  .divider {
    height: 1px;
    background: #e5e5e5;
    margin-bottom: 15px;
  }
  
  .menu-list {
    .menu-item {
      display: flex;
      align-items: center;
      height: 40px;
      cursor: pointer;
      
      &:hover {
        color: #487fff;
      }
      
      i {
        font-size: 16px;
        margin-right: 10px;
      }
      
      span {
        font-size: 14px;
      }
    }
  }
}
</style>
