import { computed, defineComponent, onMounted, reactive, ref, watch } from 'vue'
<template>
  <div
    class="video"
    @contextmenu.prevent="onContextMenu"
  >
    <!-- Temporarily comment out vue3-video-play component until package is available -->
    <div class="video-placeholder">
      <p>Video player temporarily unavailable</p>
      <button @click="onPlayerPlay">Play</button>
      <button @click="onPlayerPause">Pause</button>
    </div>
    <div
      v-if="isshow && posterUrl"
      class="mask-video-image"
    >
      <img
        class="video-image"
        :src="posterUrl"
      >
    </div>
    <div
      v-if="isshow && posterUrl"
      class="mask-video-image"
    />
    <img
      v-show="isplay"
      class="palyer-icon"
      src="../../assets/images/play.png"
      alt=""
      @click="onPlayerPlay"
    >
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
// Temporarily comment out vue3-video-play import until package is available
// import vue3VideoPlay from 'vue3-video-play'
// import 'vue3-video-play/dist/style.css'


export default defineComponent({
  name: 'Video',
  components: {
    // vue3VideoPlay,
  })

    return {
  props: {
    videoItem: Object,
    pwidth: String,
    pheight: String,
  })

    return {
  setup(props, { refs }) {
    const videoPlayer = ref(null)
    const isFinishTask = ref(false)
    const isplay = ref(true)
    const isshow = ref(false)
    const videoURL = ref('')
    const posterUrl = ref('')
    
    // Watch for changes in videoItem
    watch(() => props.videoItem, () => {
      renderVideoItem()
    })
    
    // Methods
    const onContextMenu = () => {
      return false
    }
    
    // Player state changed callback
    const playerStateChanged = (playerCurrentState) => {
      // console.log('player current update state', playerCurrentState)
    }
    
    const renderVideoItem = async () => {
      if (props.videoItem) {
        posterUrl.value = props.videoItem.pictureUrl || ''
        try {
          // Commented out until API is properly implemented
          // let res = await apiQueryAudiosData(props.videoItem.videoId)
          // if (res.code == 200) {
          //   if (res && res.data) {
          //     videoURL.value = res.data.url || ''
          //     isplay.value = true
          //     isshow.value = false
          //   }
          // } else {
          //   videoURL.value = ''
          //   isplay.value = true
          //   isshow.value = false
          // }
          
          // Temporary implementation
          videoURL.value = props.videoItem.videoUrl || ''
          isplay.value = true
          isshow.value = false
          console.log('Video item rendered with URL:', videoURL.value)
        } catch (error) {
          console.error('Error rendering video item:', error)
          videoURL.value = ''
          isplay.value = true
          isshow.value = false
        }
      }
    }
    
    // Play callback
    const onPlayerPlay = () => {
      // Start playing
      if (!isFinishTask.value) {
        isFinishTask.value = true
        watchVideoTask()
      }

      isplay.value = false
      isshow.value = false
      // Commented out until video player component is available
      // videoPlayer.value.play()
      console.log('Video play triggered')
    }
    
    // Complete video watching task
    const watchVideoTask = () => {
      // If logged in, complete the video watching task
      if (isLogin()) {
        try {
          // Commented out until API is properly implemented
          // apiGet(API.USER_TASK_WATCHVIDEO).then((res) => {
          //   if (res.code === CTS.constant.SUCCESS_CODE) {
          //     console.log(res)
          //     if (res.data && res.data.length) {
          //       // Indicates there is a reward
          //       showCpReceiveReward(res.data)
          //     }
          //   }
          // })
          console.log('Video watching task completed')
        } catch (error) {
          console.error('Error completing video watching task:', error)
        }
      }
    }
    
    // Pause callback
    const onPlayerPause = () => {
      isplay.value = true
      isshow.value = false
      // Commented out until video player component is available
      // videoPlayer.value.pause()
      console.log('Video pause triggered')
    }
    
    // End callback
    const onPlayerEnded = () => {
      isplay.value = true
      isshow.value = true
    }
    
    // Lifecycle hooks
    onMounted(() => {
      renderVideoItem()
    })
    
    const state = reactive({
      videoPlayer,
      isFinishTask,
      isplay,
      isshow,
      videoURL,
      posterUrl,
      onContextMenu,
      playerStateChanged,
      renderVideoItem,
      onPlayerPlay,
      watchVideoTask,
      onPlayerPause,
      onPlayerEnded
    }
  }
}
</script>
<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
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
  
  .video-placeholder {
    width: 100%;
    min-height: 300px;
    background-color: #f5f5f5;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    
    p {
      margin: 10px 0;
      font-size: 16px;
      color: #666;
    }
    
    .video-controls {
      display: flex;
      gap: 10px;
      margin: 10px 0;
      
      button {
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        
        &.play-btn {
          background-color: #487FFF;
          color: white;
        }
        
        &.pause-btn {
          background-color: #f0f0f0;
          color: #333;
        }
      }
    }
    
    .video-url {
      margin-top: 10px;
      padding: 10px;
      background-color: #eee;
      border-radius: 4px;
      max-width: 90%;
      overflow: hidden;
      text-overflow: ellipsis;
      
      p {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
</style>
