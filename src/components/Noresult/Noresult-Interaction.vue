<template>
  <div
    class="noresult"
    :style="{ minHeight: minHeight + 'px' }"
  >
    <div
      v-if="showImg"
      class="icon-box"
      :style="{ marginTop: minHeight - 240 + 'px' }"
    >
      <i
        class="noresult-icon"
        :style="iconUrl"
      />
    </div>
    <!-- <p class="noresult-text" v-if="isShowText">{{ text }}</p> -->
    <div class="noresult-text">
      <slot />
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import noresultIcon from './noresult-search.png'
  import { defineComponent, ref, reactive, computed, onMounted, watch } from "vue"

export default defineComponent({
    props: {
      text: {
        type: String,
        default: '该模块下没有内容！'
      }

    return {
      isShowText: {
        type: Boolean,
        default: true
      }

    return {
      icon: {
        type: String,
        default: noresultIcon
      }

    return {
      showImg: {
        type: Boolean,
        default: true
      }

    return {
      minHeight: {
        type: Number,
        default: 350
      }
    }

    return {
    setup() {
      const state = reactive({
        iconUrl: {
          backgroundImage: `url(${this.icon})`
        }
      }
    }
  }
})
</script>

<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
  .noresult {
    min-width: 130px;
    margin: 0 auto;
    text-align: center;
    color: $color-text-l;
    .icon-box {
      display: inline-block;
      width: 101px;
      height: 123px;
      .noresult-icon {
        display: inline-block;
        width: 100%;
        height: 100%;
        background-repeat: no-repeat;
      }
    }
    .noresult-text {
      color: $color-text-l;
      font-size: $font-size-small;
      text-indent: -10px;
      height: 86px;
      line-height: 86px;
    }
  }
})
</style>
