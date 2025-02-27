<template>
  <div />
</template>

<script>
import { ElMessage } from 'element-plus'

import { defineComponent, ref, reactive, computed, onMounted, watch } from "vue"

export default defineComponent({
  name: 'NoQueMessage',
  setup() {
    const showMessage = (news) => {
      ElMessage({
        offset: 300,
        center: true,
        duration: 1000,
        customClass: 'message-box',
        iconClass: 'iconfont iconerror',
        message: news
      }
    }
    
    const state = reactive({
      showMessage
    }
  }
})
}
</script>

<style lang="scss">
  @use "@/assets/css/variables" as *;
  .message-box {
    min-width: 200px;
    height: 50px;
    line-height: 50px;
    border-radius: 6px;
    background:rgba(255,110,93,1);
    box-shadow:0px 4px 6px 0px rgba(255,110,93,0.2), 0px 2px 10px 0px rgba(255,183,175,1);
    padding: 0 65px;
    color: $color-white;
    font-size: $font-size-medium-x;
    border: none;
    .iconfinish {
      margin-right: 10px;
    }
  }
})
</style>
