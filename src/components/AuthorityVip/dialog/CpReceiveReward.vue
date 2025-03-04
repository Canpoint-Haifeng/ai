<template>
  <el-dialog
    v-model="visible"
    title="恭喜获得奖励"
    width="420px"
    class="cp-receive-reward-dialog"
    :append-to-body="true"
    :lock-scroll="false"
    :close-on-click-modal="false"
    :show-close="true"
  >
    <div class="reward-content">
      <div class="reward-icon">
        <i class="iconfont iconreward"></i></template></template>
      </div>
      <div class="reward-title">{{ rewardInfo.title }}</div>
      <div class="reward-desc">{{ rewardInfo.description }}</div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="onConfirm">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue'

export default defineComponent({
  name: 'CpReceiveReward',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    rewardData: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['update:modelValue', 'confirm'],
  setup(props, { emit }) {
    const visible = ref(props.modelValue)
    
    const rewardInfo = reactive({
      title: props.rewardData.title || '恭喜获得奖励',
      description: props.rewardData.description || '您已获得奖励，请查收'
    })
    
    const onConfirm = () => {
      emit('confirm')
      emit('update:modelValue', false)
    }
    
    return {
      visible,
      rewardInfo,
      onConfirm
    }
  }
})
</script>

<style lang="scss" scoped>
.cp-receive-reward-dialog {
  .reward-content {
    padding: 20px;
    text-align: center;
    
    .reward-icon {
      font-size: 48px;
      color: #f5a623;
      margin-bottom: 16px;
    }
    
    .reward-title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 12px;
    }
    
    .reward-desc {
      font-size: 14px;
      color: #666;
    }
  }
  
  .dialog-footer {
    text-align: center;
  }
}
</style>
