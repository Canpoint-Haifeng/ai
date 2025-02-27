<template>
  <el-popover
    v-model="visable"
    placement="bottom"
    title=""
    width="170"
    trigger="click"
    @show="onShow"
  >
    <div class="cp-share-paper-body">
      <div class="cp-share-paper-qr">
        <img
          v-if="imgUrl"
          class="cp-share-paper-img"
          :src="imgUrl"
          alt=""
        >
      </div>
      <div class="cp-share-paper-title">
        微信扫码分享
      </div>
      <div class="cp-share-paper-tips">
        5人喜欢即可获得下载券
      </div>
    </div>
    <template #reference>
      <div class="paper-share-block">
        <span class="iconfont iconhaotifenxiang" />分享
      </div>
    </template>
  </el-popover>
</template>

<script>
  import { API } from '@/api/config'
  import { isLogin } from '@/common/js/util'
  import { defineComponent, ref, reactive, computed, onMounted, watch } from "vue"

export default defineComponent({
    props: {
      subjectCode: [String, Number],
      questionId: String,
      reloadImgUrl: {
        type: Boolean,
        default: false,
      }

    return {
    }

    return {
    setup() {
      const state = reactive({
        imgUrl: '',
        visable: false,
      }
    }

    return {
    methods: {
      onShow() {
        if (!isLogin()) {
          this.Bus.$emit('showAppLogin')
          this.visable = false
          return
        }
        if (!this.imgUrl || this.reloadImgUrl) {
          this.imgUrl = ''
          let subject = this.subjectCode + ''
          let params = {
            questionId: this.questionId,
            source: 1,
            period: subject.substring(0, 2),
            subjectCode: subject,
          }
          this.apiPost(API.QUESIOTN_QUESTIONSHARE, params).then((res) => {
            if (this.checkoutRes(res)) {
              this.imgUrl = res.data.img
              this.$emit('createShareId')
            }
          }
        }
      }

    return {
    }

    return {
  }
})
</script>

<style scoped lang="scss">
  .paper-share-block {
    display: inline-block;
    cursor: pointer;
    user-select: none;
    .iconfont {
      display: inline-block;
      padding-right: 5px;
      color: #fea600;
    }
  }
})

  .cp-share-paper-body {
    .cp-share-paper-title {
      text-align: center;
      color: #000000;
    }
    .cp-share-paper-tips {
      text-align: center;
      color: #000000;
    }
    .cp-share-paper-qr {
      padding: 10px 0;
      height: 160px;
      text-align: center;
      .cp-share-paper-img {
        width: 160px;
        display: inline-block;
      }
    }
  }
})
</style>
