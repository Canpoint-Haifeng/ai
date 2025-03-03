<template>
  <el-popover
    popper-class="company-weixin-qr"
    placement="left-start"
    width="128"
    trigger="hover"
  >
    <div class="popover-box">
      <img :src="weixinQr">
      <div class="title">
        全品AI教研云-体验交流群
      </div>
    </div>
    <template #reference>
      <div class="app-feed-back">
        <span class="iconfont iconshiliangzhinengduixiang-06" />
        <div class="text">
          进群<br>交流
        </div>
      </div>
    </template>
  </el-popover>
</template>

<script>
import ImgSrc from '@/assets/images/index/compony-weixin.png'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'CompanyWeiXin',
  setup() {
    const weixinQr = ref(ImgSrc)
    
    return {
      weixinQr
    }
  }
})
</script>

<style lang="scss" scoped>
.app-feed-back {
  width: 40px;
  height: 62px;
  background: #ffffff;
  text-align: center;
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

.popover-box {
  padding: 5px 8px 0 8px;
  img {
    width: 110px;
    height: 110px;
  }
  .title {
    padding-top: 4px;
    color: #000000;
    font-size: 12px;
    line-height: 20px;
    text-align: center;
  }
}
</style>
<style>
.company-weixin-qr.el-popover {
  min-width: 100px;
  border-radius: 6px;
}
</style>
