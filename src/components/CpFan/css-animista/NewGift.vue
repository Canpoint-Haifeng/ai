<template>
  <div class="new-gift">
    <div class="new-gift-body" @click="onOpenRegister">
      <div class="new-gift-title">新人礼包</div>
      <div class="new-gift-desc">注册即送20胖大海</div>
      <div class="new-gift-btn">立即领取</div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NewGift',
  emits: ['open-register'],
  setup(props, { emit }) {
    const onOpenRegister = () => {
      emit('open-register')
    }
    
    return ({
      onOpenRegister
    }
  }
})
</script>

<style scoped lang="scss">
.new-gift {
  width: 100px;
  height: 100px;
  cursor: pointer;
  
  .new-gift-body {
    background-color: #fff;
    border-radius: 8px;
    padding: 10px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    
    .new-gift-title {
      font-size: 14px;
      font-weight: bold;
      color: #333;
      margin-bottom: 5px;
    }
    
    .new-gift-desc {
      font-size: 12px;
      color: #666;
      margin-bottom: 10px;
    }
    
    .new-gift-btn {
      background-color: #FF7E00;
      color: #fff;
      font-size: 12px;
      text-align: center;
      padding: 5px 0;
      border-radius: 4px;
      
      &:hover {
        background-color: #e67100;
      }
    }
  }
}
</style>
