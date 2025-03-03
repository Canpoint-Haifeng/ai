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
  function realFormatSecond(second) {
    var secondType = typeof second

    if (secondType === 'number' || secondType === 'string') {
      second = parseInt(second)

      var hours = Math.floor(second / 3600)
      second = second - hours * 3600
      var mimute = Math.floor(second / 60)
      second = second - mimute * 60

      return (
        hours + ':' + ('0' + mimute).slice(-2) + ':' + ('0' + second).slice(-2)
      )
    } else {
      return '0:00:00'
    }
  }

  export default {
    name: 'VueAudio',
    props: {
      theUrl: {
        type: String,
        required: true,
      },
      theSpeeds: {
        type: Array,
        default() {
          return [1, 1.5, 2]
        },
      },
      // // 不显示下载
      // noDownload: false,
      // // 不显示静音
      // noMuted: false,
      // // 不显示音量条
      // noVolume: false,
      // // 不显示进度条
      // noProcess: false,
      // // 只能播放一个
      // onlyOnePlaying: false,
      // // 不要快进按钮
      // noSpeed: false
      theControlList: {
        type: String,
        default: '',
      },
    },
    setup() {
      const formatSecond = (second = 0) => {
        return realFormatSecond(second)
      }
      
      const transPlayPause = (value) => {
        return value ? '暂停' : '播放'
      }
      
      const transMutedOrNot = (value) => {
        return value ? '放音' : '静音'
      }
      
      const transSpeed = (value) => {
        return '当前快进' + value
      }
      
      return {
        formatSecond,
        transPlayPause,
        transMutedOrNot,
        transSpeed
      }
    },
    data() {
      return {
        url: this.theUrl || '',
        audio: {
          currentTime: 0,
          maxTime: 0,
          playing: false,
          muted: false,
          speed: 1,
          waiting: true,
          preload: 'none',
        },

        sliderTime: 0,
        volume: 50,
        speeds: this.theSpeeds,
        flag: false,

        controlList: {
          // 不显示下载
          noDownload: false,
          // 不显示静音
          noMuted: false,
          // 不显示音量条
          noVolume: false,
          // 不显示进度条
          noProcess: false,
          // 只能播放一个
          onlyOnePlaying: false,
          // 不要快进按钮
          noSpeed: false,
        },
      }
    },
    created() {
      this.setControlList()
      this.$nextTick(() => {
        this.$refs.sliderprocess.$el.onmousedown = () => {
          this.flag = true
        }
      })
    },
    methods: {
      setControlList() {
        let controlList = this.theControlList.split(' ')
        controlList.forEach((item) => {
          if (this.controlList[item] !== undefined) {
            this.controlList[item] = true
          }
        })
      },
      changeSpeed() {
        let index = this.speeds.indexOf(this.audio.speed) + 1
        this.audio.speed = this.speeds[index % this.speeds.length]
        this.$refs.audio.playbackRate = this.audio.speed
      },
      startMutedOrNot() {
        this.$refs.audio.muted = !this.$refs.audio.muted
        this.audio.muted = this.$refs.audio.muted
      },
      // 音量条toolTip
      formatVolumeToolTip(index) {
        return '音量条: ' + index
      },
      // 进度条toolTip
      formatProcessToolTip(index = 0) {
        index = parseInt((this.audio.maxTime / 100) * index)
        return '进度条: ' + realFormatSecond(index)
      },
      // 音量改变
      changeVolume(index = 0) {
        this.$refs.audio.volume = index / 100
        this.volume = index
      },
      // 播放跳转
      changeCurrentTime(index) {
        this.$refs.audio.currentTime = parseInt(
          (index / 100) * this.audio.maxTime,
        )
        this.flag = false
      },
      startPlayOrPause() {
        return this.audio.playing ? this.pausePlay() : this.startPlay()
      },
      // 开始播放
      startPlay() {
        this.$refs.audio.play()
      },
      // 暂停
      pausePlay() {
        this.$refs.audio.pause()
      },
      // 当音频暂停
      onPause() {
        this.audio.playing = false
      },
      // 当发生错误, 就出现loading状态
      onError() {
        this.audio.waiting = true
      },
      // 当音频开始等待
      onWaiting(res) {
        console.log(res)
      },
      // 当音频开始播放
      onPlay(res) {
        this.audio.playing = true
        this.audio.loading = false

        if (!this.controlList.onlyOnePlaying) {
          return
        }

        let target = res.target

        let audios = document.getElementsByTagName('audio')

        ;[...audios].forEach((item) => {
          if (item !== target) {
            item.pause()
          }
        })
      },
      // 当timeupdate事件大概每秒一次，用来更新音频流的当前播放时间
      onTimeupdate(res) {
        // console.log('timeupdate')
        this.audio.currentTime = res.target.currentTime
        if (!this.flag) {
          this.sliderTime = parseInt(
            (this.audio.currentTime / this.audio.maxTime) * 100,
          )
        }
      },
      // 当加载语音流元数据完成后，会触发该事件的回调函数
      // 语音元数据主要是语音的长度之类的数据
      onLoadedmetadata(res) {
        console.log('loadedmetadata')
        console.log(res)
        this.audio.waiting = false
        this.audio.maxTime = parseInt(res.target.duration)
      },
    },
  }
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
</style>
<style lang="scss">
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
</style>
