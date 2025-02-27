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
      <slot name="reference">
        <div class="paper-share-block">
          <span class="iconfont iconhaotifenxiang" />分享
        </div>
      </slot>
    </template>
  </el-popover>
</template>

<script>
import { ref, defineComponent } from "vue"

export default defineComponent({
  name: "SharePaperPopover",
  setup() {
    return {}
  }
})
</script>

<style scoped lang="scss">
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
