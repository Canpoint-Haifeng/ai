<template>
  <div class="video" @contextmenu.prevent="onContextMenu">
    <vue3-video-play
      ref="videoPlayer"
      :width="pwidth"
      :height="pheight"
      :src="videoURL"
      :poster="posterUrl"
      :playsinline="true"
      :autoplay="false"
      :muted="false"
      :loop="false"
      :preload="'auto'"
      :rate="[0.5, 1.0, 1.5, 2.0]"
      @play="onPlayerPlay"
      @pause="onPlayerPause"
      @ended="onPlayerEnded"
      @statechanged="playerStateChanged"
    />
    <div v-if="isshow && posterUrl" class="mask-video-image">
      <img class="video-image" :src="posterUrl" />
    </div>
    <div v-if="isshow && posterUrl" class="mask-video-image"></div>
    <img
      class="palyer-icon"
      src="../../assets/images/play.png"
      alt=""
      v-show="isplay"
      @click="onPlayerPlay"
    />
    <!-- 产品要求一直不显示暂停按钮 by 吴兴武 -->
    <!-- <img src="../../assets/images/playStop.png"
      alt=""
      v-show="!isplay"
      @click="onPlayerPause"
      class="play_btn"
    /> -->
  </div>
</template>

<script>
  import CTS from '@/common/js/constant'
  import { API } from '@/api/config'
  import { isLogin } from '@/common/js/util'
  import vue3VideoPlay from 'vue3-video-play'
  import 'vue3-video-play/dist/style.css'
  
  export default {
    name: 'Video',
    props: {
      videoItem: Object,
      pwidth: String,
      pheight: String,
    },
    watch: {
      videoItem() {
        this.renderVideoItem()
      },
    },
    data() {
      return {
        isFinishTask: false,
        isplay: true,
        isshow: false,
        videoURL: '',
        posterUrl: '',
      }
    },
    mounted() {
      this.renderVideoItem()
    },
    methods: {
      onContextMenu() {
        return false
      },
      // 播放状态改变回调
      playerStateChanged(playerCurrentState) {
        // console.log('player current update state', playerCurrentState)
      },
      async renderVideoItem() {
        if (this.videoItem) {
          this.posterUrl = this.videoItem.pictureUrl || ''
          let res = await this.apiQueryAudiosData(this.videoItem.videoId)
          if (res.code == 200) {
            if (res && res.data) {
              this.videoURL = res.data.url || ''
              this.isplay = true
              this.isshow = false
            }
          } else {
            this.videoURL = ''
            this.isplay = true
            this.isshow = false
          }
        }
      },
      // 播放回调
      onPlayerPlay() {
        // 开始播放
        if (!this.isFinishTask) {
          this.isFinishTask = true
          this.watchVideoTask()
        }

        this.isplay = false
        this.isshow = false
        this.$refs.videoPlayer.play()
      },
      // 完成 播放视频的 任务
      watchVideoTask() {
        // 登录了 点击 开始播放 就完成完成视频任务
        // USER_TASK_WATCHVIDEO
        if (isLogin()) {
          this.apiGet(API.USER_TASK_WATCHVIDEO).then((res) => {
            if (res.code === CTS.constant.SUCCESS_CODE) {
              console.log(res)
              if (res.data && res.data.length) {
                // 表示有奖励哦
                this.showCpReceiveReward(res.data)
              }
            }
          })
        }
      },
      // 暂停回调
      onPlayerPause() {
        this.isplay = true
        this.isshow = false
        this.$refs.videoPlayer.pause()
      },
      // 结束回调
      onPlayerEnded() {
        this.isplay = true
        this.isshow = true
      },
    },
    components: {
      vue3VideoPlay,
    },
  }
</script>
<style lang="scss" scoped>
  .video-player {
    position: relative;
    max-width: 1200px;
    border-radius: 6px;
    overflow: hidden;

    .palyer-icon {
      width: 116px;
      height: 116px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      opacity: 0.8;
      &.play_btn {
        opacity: 0;
        transition: all 1s;
      }
    }
    &:hover {
      .play_btn {
        opacity: 1;
      }
    }
    .end {
      width: 100%;
      height: 675px;
      position: absolute;
      top: 0px;
      left: 0px;
      background: url('../../assets/images/coverUrl.png');
      background-size: cover;
      .end_box {
        width: 100%;
        height: 675px;
        background: rgba(0, 0, 0, 0.2);
      }
    }
  }
  .video :deep(.vjs-big-play-button) {
    display: none !important;
  }
  .video :deep(.video-js.vjs-ended .vjs-big-play-button) {
    display: none !important;
  }
  .video :deep(.video-js) {
    background-color: #fff;
    .vjs-tech {
      object-fit: fill;
      height: 506px;
    }
  }
  .video :deep(.vjs-poster) {
    background-color: transparent;
  }

  .video :deep(.vjs-text-track-display) {
    position: absolute;
    bottom: 0em;
    background: rgba(0, 0, 0, 0.2);
  }
  .video :deep(.video-js .vjs-play-progress:before) {
    z-index: 0;
  }
  .mask-video-image {
    width: 100%;
    height: 675px;
    background-color: rgba(0, 0, 0, 0.2);
    position: absolute;
    top: 0;
    text-align: center;
    pointer-events: none;
    .video-image {
      display: inline-block;
      height: 100%;
      max-width: 100%;
    }
  }
</style>
