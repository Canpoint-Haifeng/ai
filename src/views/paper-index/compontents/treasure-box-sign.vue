<template>
  <div
    class="treasure-box-sign"
    @click="openSignPage"
  >
    <div class="sign-tips">
      签到领福利
    </div>
    <img
      :src="treasureBoxImage"
      alt=""
    >
  </div>
</template>

<script>
  import { isLogin } from '@/common/js/util'
  export default {
    data() {
      return {
        treasureBoxImage: require('@/assets/images/index/treasure-box.png'),
      }
    },
    methods: {
      openSignPage() {
        // 如果登录了
        if (isLogin()) {
          this.$router.push({ name: 'accountInfo' })
          this.eventStatistics(['_trackEvent', '学科主页', '签到', '次数'])
        } else {
          this.$emit('showLogin')
        }
      },
    },
  }
</script>

<style scoped lang="scss">
  .treasure-box-sign {
    padding-left: 10px;
    text-align: center;
    cursor: pointer;
    .sign-tips {
      position: relative;
      width: 75px;
      line-height: 23px;
      text-align: center;
      background: #fef5ed;
      font-size: 12px;
      font-weight: 400;
      color: #fe7700;
      margin-bottom: 10px;
      &::after {
        display: block;
        content: '';
        border-width: 5px;
        border-style: solid;
        border-color: #fef5ed transparent transparent transparent;

        /* 定位 */
        position: absolute;
        left: 45%;
        top: 100%;
      }
    }
    img {
      width: 41px;
      height: 34px;
      margin: 0 auto;
    }
  }
</style>
