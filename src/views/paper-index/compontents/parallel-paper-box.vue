<template>
  <el-dialog
    :visible="visible"
    :title="title"
    width="500px"
    class="login-vip-dialog"
    top="11.5%"
    :append-to-body="true"
    :lock-scroll="false"
    @update:visible="visible = $event"
    @close="hide"
  >
    <div class="parallel-paper-box">
      <div class="paraller-describe">
        您可以从下列卷库中选择一张试卷，作为模板，沿用知识点、题型、分数，重新匹配试题，快速组一份平行试卷
      </div>
      <div class="parallel-image">
        <img
          :src="parallelBoxImage"
          alt=""
        >
      </div>
      <div class="parallel-buttons">
        <span @click="goPage('paperCenter')">试卷宝</span>
        <span
          v-if="
            schoolVerify && (currentServiceId == 4 || currentServiceId == 5)
          "
          @click="goPage('schoolPaper')"
        >校本资源</span>
        <span @click="goPage('resourcesPaper')">我的资源</span>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    computed: {
      ...mapState(['serviceInfo', 'schoolVerify']),
    },
    watch: {
      serviceInfo: {
        handler(nv, ov) {
          this.currentServiceId = nv.serviceId
        },
        immediate: true,
        deep: true,
      },
    },
    data() {
      return {
        parallelBoxImage: require('@/assets/images/index/parallel_paper.png'),
        title: '平行组卷',
        visible: false,
        currentServiceId: '',
      }
    },
    mounted() {
      if (this.serviceInfo && this.serviceInfo.serviceId) {
        this.currentServiceId = this.serviceInfo.serviceId
      }
    },
    methods: {
      goPage(v) {
        if (v) {
          this.$router.push({ name: v })
        }
      },
      show() {
        this.visible = true
      },
      hide() {
        this.visible = false
      },
    },
  }
</script>

<style scoped lang="scss">
  .parallel-paper-box {
    padding: 20px 50px 30px 50px;
    .paraller-describe {
      line-height: 26px;
      font-size: 14px;
      font-weight: 400;
      color: #666666;
    }
    .parallel-image {
      padding: 20px 0 40px 0;
      img {
        width: 411px;
        height: 124px;
      }
    }
    .parallel-buttons {
      display: flex;
      justify-content: space-around;
      box-sizing: border-box;
      span {
        width: 100px;
        line-height: 30px;
        background: #f5f5f5;
        border-radius: 4px;
        color: #666666;
        text-align: center;
        cursor: pointer;
        user-select: none;
      }
    }
  }
</style>
