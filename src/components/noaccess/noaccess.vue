<template>
  <div class="noaccess">
    <div class="icon-box">
      <i class="noaccess-icon" />
    </div>
    <p class="noaccess-text">
      {{ text }}
    </p>
    <slot />
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NoAccess',
  props: {
    text: {
      type: String,
      default: '抱歉，您的账号暂无权限访问此页面'
    }
  }
})
</script>

<style lang="scss" scoped>
  .noaccess {
    min-width: 160px;
    margin: 0 auto;
    text-align: center;
    color: $color-text-l;
    .icon-box {
      display: inline-block;
      width: 156px;
      height: 118px;
      .noaccess-icon {
        display: inline-block;
        width: 100%;
        height: 100%;
        background: url(./noaccess-img.png) no-repeat;
        background-size: contain;
      }
    }
    .noaccess-text {
      margin: 30px 0;
      color: $color-text-l;
    }
  }
</style>
