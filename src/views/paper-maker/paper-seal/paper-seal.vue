<template>
  <div
    v-if="paperOptions[6].isSet"
    class="paper-seal"
  >
    <!-- 考生输入栏 -->
    <div class="test-input">
      <div class="item">
        <span class="text">学校：</span>
        <em class="line" />
      </div>
      <div class="item">
        <span class="text">姓名：</span>
        <em class="line" />
      </div>
      <div class="item">
        <span class="text">班级：</span>
        <em class="line" />
      </div>
      <div class="item">
        <span class="text">考号：</span>
        <em class="line" />
      </div>
    </div>
    <div class="line-text color-9 font-12">
      密封线内不要答题
    </div>
  </div>
</template>

<script>
import setPaperOptionsMixin from '@/common/mixins/setPaperOptionsMixin'
export default {
  mixins: [setPaperOptionsMixin]
}
</script>

<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
  .paper-seal {
    position: absolute;
    width: 50px;
    height: 100%;
    border-right: 1px dashed $color-text-l;
    .test-input {
      width: 618px;
      transform: rotateZ(-90deg) translate(-705px,32px);
      transform-origin: bottom left;
      .item {
        margin-right: 15px;
        display: inline-block;
        .line {
          display: inline-block;
          margin-left: 5px;
          width: 85px;
          height: 16px;
          border-bottom: 1px solid $color-text;
        }
      }
    }
    .line-text {
      width: 600px;
      line-height: 15px;
      line-height: 15px;
      letter-spacing: 63px;
      transform: rotateZ(-90deg) translate(-650px,58px);
      transform-origin: bottom left;
    }
  }
</style>
