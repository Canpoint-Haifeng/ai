<template>
  <div class="history-message-list">
    <div class="header">
      <span class="title">消息通知</span>
      <span
        class="more"
        @click="$emit('goToMessageCenter')"
      >查看更多</span>
    </div>
    <div
      v-if="messageList && messageList.length"
      class="message-content"
    >
      <div
        v-for="(item, index) in messageList"
        :key="index"
        class="message-item"
      >
        <div class="message-title">
          {{ item.title }}
        </div>
        <div class="message-time">
          {{ formatTime(item.createTime) }}
        </div>
      </div>
    </div>
    <div
      v-else
      class="empty-message"
    >
      暂无消息
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import dayjs from 'dayjs'

export default defineComponent({
  name: 'HistoryMessageList',
  props: {
    messageList: {
      type: Array,
      default: () => []
    }
  },
  emits: ['goToMessageCenter'],
  setup() {
    // Format time to YYYY-MM-DD
    const formatTime = (time) => {
      if (!time) return ''
      return dayjs(time).format('YYYY-MM-DD')
    }
    
    return {
      formatTime
    }
  }
})
</script>

<style lang="scss" scoped>
.history-message-list {
  position: absolute;
  top: 45px;
  right: 0;
  width: 300px;
  background: #ffffff;
  box-shadow: 0px 0px 30px 1px rgba(27, 50, 89, 0.2);
  border-radius: 8px;
  z-index: 9999;
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    padding: 0 15px;
    border-bottom: 1px solid #e5e5e5;
    
    .title {
      font-size: 16px;
      font-weight: 500;
      color: #333333;
    }
    
    .more {
      font-size: 14px;
      color: #487fff;
      cursor: pointer;
    }
  }
  
  .message-content {
    max-height: 300px;
    overflow-y: auto;
    
    .message-item {
      padding: 15px;
      border-bottom: 1px solid #f5f5f5;
      cursor: pointer;
      
      &:hover {
        background: #f9f9f9;
      }
      
      .message-title {
        font-size: 14px;
        color: #333333;
        margin-bottom: 5px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .message-time {
        font-size: 12px;
        color: #999999;
      }
    }
  }
  
  .empty-message {
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #999999;
  }
}
</style>
