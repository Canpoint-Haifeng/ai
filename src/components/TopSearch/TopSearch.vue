<template>
  <div class="top-search">
    <div class="search-box">
      <div class="search-select">
        <el-select
          v-model="currSearchOption"
          class="search-select-box"
          popper-class="search-select-popper"
        >
          <el-option
            v-for="item in searchOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="search-input">
        <el-input
          v-model="searchText"
          placeholder="请输入关键词"
          class="search-input-box"
          @focus="onFocus"
          @blur="onBlur"
          @keyup.enter="search"
        >
          <template #suffix>
            <el-button
              class="search-btn"
              @click="search"
            >
              <i class="iconfont iconsearch" />
            </el-button>
          </template>
        </el-input>
        <message-list
          :is-show="isShow"
          :curr-search-option="currSearchOption"
          :history-list="historyList"
          :value="hotPaperList"
          @clear-list="clearList"
          @change-history-text="changeHistoryText"
          @change-paper-name="changePaperName"
        />
      </div>
    </div>
    <div class="user-box">
      <div
        v-if="isLogin"
        class="user-center"
        @click="toggleUserCenter"
      >
        <div class="user-avatar">
          <img
            :src="userInfo.headImgUrl || require('@/assets/images/default-avatar.png')"
            alt="avatar"
          >
        </div>
        <div class="user-name">
          {{ userInfo.nickName || userInfo.mobile }}
        </div>
        <i
          class="el-icon-arrow-down"
          :class="{ 'is-active': isShowUserCenter }"
        />
        <user-center-popover
          v-show="isShowUserCenter"
          :user-info="userInfo"
          @command="handleCommand"
        />
      </div>
      <div
        v-else
        class="login-box"
      >
        <span
          class="login-btn"
          @click="showLogin"
        >登录</span>
        <span class="divider">|</span>
        <span
          class="register-btn"
          @click="showRegister"
        >注册</span>
      </div>
      <div
        v-if="isLogin"
        class="message-box"
      >
        <div
          class="message-icon"
          @click="toggleMessageList"
        >
          <i class="iconfont iconmessage" />
          <div
            v-if="messageCount > 0"
            class="message-count"
          >
            {{ messageCount > 99 ? '99+' : messageCount }}
          </div>
        </div>
        <history-message-list
          v-show="isShowMessageList"
          :message-list="messageList"
          @go-to-message-center="goToMessageCenter"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, getCurrentInstance } from 'vue'
import { useTopSearch } from './composition/useTopSearch'
import MessageList from './messageList.vue'
import UserCenterPopover from './userCenterPopover.vue'
import HistoryMessageList from './HistoryMessageList.vue'

export default defineComponent({
  name: 'TopSearch',
  components: {
    MessageList,
    UserCenterPopover,
    HistoryMessageList
  },
  setup() {
    const instance = getCurrentInstance()
    
    // Use the composition function
    const {
      searchText,
      isShow,
      currSearchOption,
      historyList,
      hotPaperList,
      isLogin,
      userInfo,
      messageCount,
      isShowUserCenter,
      isShowMessageList,
      messageList,
      searchOptions,
      onFocus,
      onBlur,
      search,
      clearList,
      changeHistoryText,
      changePaperName,
      handleCommand,
      showLogin,
      showRegister,
      toggleUserCenter,
      toggleMessageList,
      goToMessageCenter
    } = useTopSearch(instance)
    
    return {
      searchText,
      isShow,
      currSearchOption,
      historyList,
      hotPaperList,
      isLogin,
      userInfo,
      messageCount,
      isShowUserCenter,
      isShowMessageList,
      messageList,
      searchOptions,
      onFocus,
      onBlur,
      search,
      clearList,
      changeHistoryText,
      changePaperName,
      handleCommand,
      showLogin,
      showRegister,
      toggleUserCenter,
      toggleMessageList,
      goToMessageCenter
    }
  }
})
</script>

<style lang="scss" scoped>
.top-search {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 46px;
  
  .search-box {
    display: flex;
    align-items: center;
    width: 628px;
    height: 46px;
    background: #ffffff;
    border: 1px solid #c1c9cd;
    border-radius: 23px;
    overflow: hidden;
    
    .search-select {
      width: 80px;
      height: 100%;
      border-right: 1px solid #c1c9cd;
      
      :deep(.search-select-box) {
        width: 100%;
        height: 100%;
        
        .el-input {
          height: 100%;
          
          .el-input__inner {
            height: 100%;
            border: none;
            background: transparent;
            text-align: center;
            color: #333333;
            font-size: 14px;
          }
          
          .el-input__suffix {
            right: 5px;
          }
        }
      }
    }
    
    .search-input {
      flex: 1;
      height: 100%;
      position: relative;
      
      :deep(.search-input-box) {
        height: 100%;
        
        .el-input__inner {
          height: 100%;
          border: none;
          background: transparent;
          padding-left: 20px;
          padding-right: 60px;
          color: #333333;
          font-size: 14px;
        }
        
        .el-input__suffix {
          right: 10px;
        }
      }
      
      .search-btn {
        width: 40px;
        height: 40px;
        background: #487fff;
        border-radius: 50%;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        
        i {
          color: #ffffff;
          font-size: 20px;
        }
      }
    }
  }
  
  .user-box {
    display: flex;
    align-items: center;
    
    .user-center {
      display: flex;
      align-items: center;
      cursor: pointer;
      position: relative;
      
      .user-avatar {
        width: 36px;
        height: 36px;
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
        margin-right: 5px;
        max-width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .el-icon-arrow-down {
        font-size: 12px;
        color: #999999;
        transition: transform 0.3s;
        
        &.is-active {
          transform: rotate(180deg);
        }
      }
    }
    
    .login-box {
      display: flex;
      align-items: center;
      
      .login-btn, .register-btn {
        font-size: 14px;
        color: #333333;
        cursor: pointer;
        
        &:hover {
          color: #487fff;
        }
      }
      
      .divider {
        margin: 0 10px;
        color: #c1c9cd;
      }
    }
    
    .message-box {
      margin-left: 20px;
      position: relative;
      
      .message-icon {
        position: relative;
        cursor: pointer;
        
        i {
          font-size: 24px;
          color: #333333;
        }
        
        .message-count {
          position: absolute;
          top: -8px;
          right: -8px;
          min-width: 16px;
          height: 16px;
          background: #ff5733;
          border-radius: 8px;
          font-size: 12px;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
        }
      }
    }
  }
}

:deep(.search-select-popper) {
  .el-select-dropdown__item {
    text-align: center;
    font-size: 14px;
    
    &.selected {
      color: #487fff;
    }
  }
}
</style>
