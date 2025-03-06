<template>
  <el-dialog
    :visible="visible" @update:visible="$emit('update:visible', $event)"
    :title="title"
    :width="width"
    :show-close="showClose"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :before-close="handleClose"
  >
    <div class="reward-content">
      <div class="reward-icon">
        <i class="iconfont iconreward" />
      </div>
      <div class="reward-title">
        <h3>{{ rewardTitle }}</h3>
      </div>
      <div class="reward-desc">
        <p>{{ rewardDesc }}</p>
      </div>
      <div class="reward-btn">
        <el-button
          type="primary"
          @click="handleConfirm"
        >
          {{ confirmButtonText }}
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '领取奖励'
    },
    width: {
      type: String,
      default: '400px'
    },
    showClose: {
      type: Boolean,
      default: true
    },
    closeOnClickModal: {
      type: Boolean,
      default: false
    },
    closeOnPressEscape: {
      type: Boolean,
      default: false
    },
    rewardTitle: {
      type: String,
      default: '恭喜您获得奖励'
    },
    rewardDesc: {
      type: String,
      default: '您已成功领取奖励，请在个人中心查看'
    },
    confirmButtonText: {
      type: String,
      default: '确定'
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    handleConfirm() {
      this.$emit('confirm')
      this.handleClose()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/mixins.scss";
@import "@/assets/css/variables.scss";
@import "@/assets/css/variables.scss";
.reward-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  
  .reward-icon {
    font-size: 48px;
    color: #f56c6c;
    margin-bottom: 20px;
  }
  
  .reward-title {
    margin-bottom: 10px;
    h3 {
      font-size: 18px;
      color: #333;
    }
  }
  
  .reward-desc {
    margin-bottom: 20px;
    text-align: center;
    p {
      font-size: 14px;
      color: #666;
      line-height: 1.5;
    }
  }
  
  .reward-btn {
    width: 100%;
    display: flex;
    justify-content: center;
  }
}
</style>
