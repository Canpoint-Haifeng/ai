<template>
  <div class="invite-bear">
    <div class="invite-bear-body">
      <div class="invite-bear-title">
        邀请好友
      </div>
      <div class="invite-bear-desc">
        邀请好友注册，双方各得10胖大海
      </div>
      <div
        class="invite-bear-btn"
        @click="onInvite"
      >
        立即邀请
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'InviteBear',
  emits: ['invite'],
  setup(props, { emit }) {
    const onInvite = () => {
      emit('invite')
    }
    
    return {
      onInvite
    }
  }
})
</script>

<style scoped lang="scss">
.invite-bear {
  width: 100px;
  height: 100px;
  cursor: pointer;
  
  .invite-bear-body {
    background-color: #fff;
    border-radius: 8px;
    padding: 10px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    
    .invite-bear-title {
      font-size: 14px;
      font-weight: bold;
      color: #333;
      margin-bottom: 5px;
    }
    
    .invite-bear-desc {
      font-size: 12px;
      color: #666;
      margin-bottom: 10px;
    }
    
    .invite-bear-btn {
      background-color: #487FFF;
      color: #fff;
      font-size: 12px;
      text-align: center;
      padding: 5px 0;
      border-radius: 4px;
      
      &:hover {
        background-color: #3a6ae0;
      }
    }
  }
}
</style>
