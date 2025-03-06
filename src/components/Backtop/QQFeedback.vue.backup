<template>
  <el-popover
    popper-class="company-weixin-qr"
    placement="left-start"
    width="482"
    :visible="showPopover"
    trigger="hover"
    @update:visible="showPopover = $event"
  >
    <template #default>
      <div class="popover-box">
        <UserFeedBackBody
          :show-popover="showPopover"
          @show-login="showLogin"
          @confirm-success="confirmSuccess"
        />
      </div>
    </template>
    <template #reference>
      <div class="app-feed-back">
        <span class="iconfont iconshiliangzhinengduixiang-05" />
        <div class="text">
          问题<br>反馈
        </div>
      </div>
    </template>
  </el-popover>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import { useStore } from 'vuex'
import UserFeedBackBody from './components/UserFeedBackBody.vue'

export default defineComponent({
  name: 'QQFeedback',
  components: { UserFeedBackBody },
  setup(props, { emit }) {
    const store = useStore()
    const showPopover = ref(false)
    
    const userInfo = computed(() => store.state.userInfo)
    
    const showLogin = () => {
      emit('showLogin')
    }
    
    const upDateCurrHref = () => {
      // 进入反馈页面
    }
    
    const confirmSuccess = () => {
      showPopover.value = false
    }
    
    return {
      showPopover,
      userInfo,
      showLogin,
      upDateCurrHref,
      confirmSuccess
    }
  }
})
</script>

<style lang="scss" scoped>
@import "@/assets/css/mixins.scss";
@import "@/assets/css/variables.scss";
@import "@/assets/css/variables.scss";
.app-feed-back {
  width: 40px;
  height: 62px;
  background: #ffffff;

  text-align: center;
  border-radius: 4px 0px 0px 0px;
  user-select: none;
  cursor: pointer;

  .iconfont {
    display: inline-block;
    font-size: 26px;
    padding-top: 4px;
    color: #666666;
  }
  .text {
    font-size: 10px;
    line-height: 12px;
    color: #666666;
  }
  &:hover {
    background: $color-theme;
    .text,
    .iconfont {
      color: #ffffff;
    }
  }
}
</style>
