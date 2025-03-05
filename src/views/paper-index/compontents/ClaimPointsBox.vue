<template>
  <div class="claim-points-box" @click="openPointsInfo">
    <div class="claim-tips" v-if="currentSign">签到领福利</div>
    <div class="user-point" :class="!currentSign ? 'signed' : ''">
      <div class="text">{{ canpointPoints.useablePoints || 0 }}</div>
    </div>
  </div>
</template>
<script>
  import { mapState, mapActions } from 'vuex'
  export default {
    props: {
      currentSign: Boolean,
    },
    computed: {
      ...mapState(['canpointPoints']),
    },
    data() {
      return {}
    },
    mounted() {
      this.getCanpointPoints({ vm: this })
    },
    methods: {
      ...mapActions(['getCanpointPoints']),
      openPointsInfo() {
        this.$router.push('/paper/users/myPoints')
      },
    },
  }
</script>
<style scoped lang="scss">
  .claim-points-box {
    cursor: pointer;
    user-select: none;
    .claim-tips {
      margin-left: 15px;
      margin-bottom: 5px;
      position: relative;
      line-height: 24px;
      text-align: center;
      font-weight: 400;
      width: 84px;
      background: #ffeedf;
      border-radius: 12px;

      font-size: 12px;
      font-weight: bold;
      color: #ff6c46;

      &::after {
        display: block;
        content: '';
        border-width: 5px;
        border-style: solid;
        border-color: #ffeedf transparent transparent transparent;

        /* 定位 */
        position: absolute;
        left: 45%;
        top: 100%;
      }
    }
    .user-point {
      background: url(//cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/png/ef80c56a-b64a-45b9-9026-0a72130eb841.png)
        no-repeat;
      width: 104px;
      height: 34px;
      background-size: 104px 34px;

      &.signed {
        margin-top: 20px;
      }

      .text {
        font-size: 16px;
        font-weight: bold;
        color: #ffffff;
        line-height: 18px;

        padding: 8px 0 0 40px;
        width: 64px;
        text-align: center;
      }
    }
  }
</style>
