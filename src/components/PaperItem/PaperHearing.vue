<template>
  <div
    v-if="hearingData && hearingData.path"
    class="paper-hearing-box"
  >
    <div class="paper-hearing-title">
      听力音频：
    </div>
    <div class="paper-hearing-content">
      <cp-vue-audio
        :the-url="hearingData.path"
        :the-control-list="controlList"
      />
    </div>
  </div>
</template>
<script>
import { defineComponent } from "vue"
import CpVueAudio from "@/components/AudioPlay/cp-vue-audio.vue"

export default defineComponent({
  name: "PaperHearing",
  components: { CpVueAudio },
  props: {
    audioUrl: {
      type: String,
      default: ""
    }
  }
})
</script>
<style scoped lang="scss">
  .paper-hearing-box {
    display: flex;
    padding: 20px 0;
    .paper-hearing-title {
      line-height: 36px;
    }
    .paper-hearing-content {
      padding-left: 10px;
    }
  }
})
</style>
