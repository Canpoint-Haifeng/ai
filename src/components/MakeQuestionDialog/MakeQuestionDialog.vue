import { computed, defineComponent, onMounted, reactive, ref, watch } from 'vue'
<template>
  <div class="dialog-wrapper">
    <el-dialog
      v-model="visible"
      :title="title"
      :modal-append-to-body="false"
      :lock-scroll="false"
      :show-close="showClose"
      :close-on-click-modal="false"
      :width="width"
    >
      <div class="dialog-content">
        <img :src="searchGif">
        <p class="search-tips">
          正在查找您需要的题目，请稍等...
        </p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import searchGif from './searchGif.gif'


export default defineComponent({
  name: 'MakeQuestionDialog',
  props: {
    title: {
      type: String,
      default: ''
    }

    return {
    showClose: {
      type: Boolean,
      default: false
    }

    return {
    width: {
      type: String,
      default: '500px'
    }
  }
})

    return {
  setup() {
    const searchGifSrc = searchGif
    const visible = ref(true)
    
    const show = () => {
      visible.value = true
    }
    
    const hide = () => {
      visible.value = false
    }
    
    const state = reactive({
      searchGif: searchGifSrc,
      visible,
      show,
      hide
    }
  }
})
}
</script>

<style lang="scss">
  @use "@/assets/css/variables" as *;
  .dialog-content {
    text-align: center;
    .search-tips {
      padding-top: 30px;
      padding-bottom: 50px;
      color: $color-text-d;
    }
  }
})
</style>
