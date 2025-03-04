<template>
  <el-popover
    popper-class="company-weixin-qr"
    placement="left-start"
    width="482"
    v-model="showPopover"
    trigger="hover"
  >
    <div class="popover-box">
      <UserFeedBackBody
        :showPopover="showPopover"
        @showLogin="showLogin"
        @confirmSuccess="confirmSuccess"
      ></UserFeedBackBody>
    </div>
    <div slot="reference" class="app-feed-back">
      <span class="iconfont iconshiliangzhinengduixiang-05"></span>
      <div class="text">问题<br />反馈</div>
    </div>
  </el-popover>
</template>

<script>
  import { mapState } from 'vuex'
  import UserFeedBackBody from './components/UserFeedBackBody'
  export default {
    components: { UserFeedBackBody },
    data() {
      return {
        showPopover: false,
      }
    },
    computed: {
      ...mapState(['userInfo']),
    },
    methods: {
      showLogin() {
        this.$emit('showLogin')
      },
      upDateCurrHref() {
        // 进入反馈页面
      },
      confirmSuccess() {
        this.showPopover = false
      },
    },
  }
</script>

<style lang="scss" scoped>
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
