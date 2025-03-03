<template>
  <div class="backtop-wrapper">
    <el-backtop
      :right="0"
      :bottom="85"
      class="backtop-container"
      :visibility-height="10"
    >
      <div class="app-top-back-part">
        <i class="iconfont iconshiliangzhinengduixiang-08" />
        <div class="text">
          置顶
        </div>
      </div>
    </el-backtop>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Backtop'
})
</script>

<style lang="scss" scoped>
  $color-theme: #3e7eff; // Define the theme color directly
  
  .app-top-back-part {
    position: absolute;
    right: 10px;
    width: 50px;
    height: 50px;
    background: #ffffff;
    box-shadow: 0px 2px 6px 0px rgba(42, 77, 138, 0.27);
    border-radius: 4px;
    text-align: center;
    user-select: none;
    cursor: pointer;
    .iconfont {
      display: inline-block;
      padding-top: 3px;
      font-size: 28px;
      color: #666666;
    }
    .text {
      font-size: 12px;
      transform: scale(0.9);
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
