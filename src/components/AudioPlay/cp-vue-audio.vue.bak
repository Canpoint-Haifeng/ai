<template>
  <div
    v-show="url"
    class="di main-wrap"
  >
    <!-- 这里设置了ref属性后，在vue组件中，就可以用this.$refs.audio来访问该dom元素 -->
    <audio
      ref="audio"
      class="dn"
      :src="url"
      :preload="audio.preload"
      @play="onPlay"
      @error="onError"
      @waiting="onWaiting"
      @pause="onPause"
      @timeupdate="onTimeupdate"
      @loadedmetadata="onLoadedmetadata"
    />
    <div class="functions">
      <el-button
        type="primary"
        :icon="
          audio.playing === true
            ? 'iconfont icon-zanting'
            : 'iconfont icon-icon_play'
        "
        circle
        @click.stop="startPlayOrPause"
      />
      <el-tooltip
        class="item"
        effect="dark"
        :content="transSpeed(audio.speed)"
        placement="top"
      >
        <el-button
          v-show="!controlList.noSpeed"
          type="primary"
          icon="iconfont icon-kuaijin"
          circle
          @click="changeSpeed"
        />
      </el-tooltip>
      <span class="stime">{{ formatSecond(audio.currentTime) }}</span>

      <el-slider
        v-show="!controlList.noProcess"
        ref="sliderprocess"
        v-model="sliderTime"
        :format-tooltip="formatProcessToolTip"
        class="slider-process"
        @change="changeCurrentTime"
      />

      <span class="etime">{{ formatSecond(audio.maxTime) }}</span>
      <el-tooltip
        popper-class="process"
        effect="dark"
        placement="top"
      >
        <template #content>
          <div class="c">
            <el-slider
              v-model="volume"
              :format-tooltip="formatVolumeToolTip"
              vertical
              height="100px"
              class="slider-volume"
              @change="changeVolume"
            />
          </div>
        </template>
        <i
          :class="
            audio.muted === true
              ? 'iconfont icon-jingyin'
              : 'iconfont icon-shengyin'
          "
          @click="startMutedOrNot"
        />
      </el-tooltip>

      <el-button
        v-show="!controlList.noDownload"
        type="primary"
        icon="iconfont icon-xiazai-s"
        circle
        class="down"
      >
        <a
          :href="url"
          target="_blank"
          class="download"
          download
        />
      </el-button>
    </div>
  </div>
</template>

<script>
import { ref, defineComponent } from "vue"

export default defineComponent({
  name: "CpVueAudio",
  props: {
    audioUrl: {
      type: String,
      default: ""
    }
  },
  setup() {
    const audioRef = ref(null)
    
    return {
      audioRef
    }
  }
})
</script>
<style scoped lang="scss">
  .functions :deep() {
    .el-button--primary {
      background-color: $color-theme;
    }
    .el-slider__bar {
      background-color: $color-theme;
    }
    .el-slider__button {
      border: 2px solid $color-theme;
    }
  }
})
  .main-wrap {
    padding: 0 15px;
    display: inline-block;
    height: 36px;
    background: rgba(243, 246, 253, 1);
    border: 1px solid rgba(226, 230, 236, 1);
    border-radius: 18px;
    .functions {
      display: flex;
      align-items: center;
      height: 36px;
      .el-button {
        padding: 0;
        width: 24px;
        height: 24px;
        :deep(.iconfont) {
          font-size: 12px;
        }
      }
      .stime,
      .etime {
        padding-left: 15px;
        padding-right: 5px;
        font-size: 14px;
        color: #9a9a9a;
      }
      .slider-process {
        display: inline-block;
        width: 220px;
        position: relative;
        margin-left: 15px;
        :deep(.el-slider__runway) {
          margin: 12px 0;
          .el-slider__button-wrapper {
            height: 30px;
            width: 30px;
            top: -12px;
            .el-slider__button {
              width: 12px;
              height: 12px;
            }
          }
        }
      }
      .dn {
        display: none;
      }

      .iconfont {
        color: #999999;
        font-size: 16px;
        cursor: pointer;
      }
      .down {
        position: relative;
        margin-left: 5px;
        .download {
          display: inline-block;
          width: 32px;
          height: 32px;
          position: absolute;
          top: 0;
          left: 0;
        }
      }
    }
  }
})
</style>
<style lang="scss">
  @use "@/assets/css/variables" as *;
  .process {
    padding: 10px 0;
    .slider-volume {
      .el-slider__runway {
        .el-slider__button-wrapper {
          height: 30px;
          width: 30px;
          left: -12px;
          .el-slider__button {
            width: 12px;
            height: 12px;
          }
        }
      }
    }
  }
})
</style>
