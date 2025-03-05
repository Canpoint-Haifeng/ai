<template>
  <div class="videoPlay">
    <div class="video_container">
      <video-play
        class="video-player vjs-custom-skin"
        pwidth="900px"
        pheight="506px"
        ref="videoControl"
        v-if="currentItem"
        :videoItem="currentItem"
      >
      </video-play>
    </div>
    <div class="video_right">
      <div class="video_header">
        <span class="video_span">功能讲解</span>
      </div>
      <div class="video_list">
        <ul class="list">
          <li
            v-for="(item, index) in videoList"
            :key="index"
            @click="addClass(index)"
            :class="{ listStyle: index == current }"
            :title="item.videoName"
          >
            {{ item.videoName }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      videoList: Array,
    },
    data() {
      return {
        currentItem: '',
        videoSpan: '展开',
        isshow: 0,
        slideTogger: true,
        current: 0,
      }
    },
    mounted() {
      this.initVideo()
    },
    methods: {
      initVideo() {
        this.addClass(0)
      },
      addClass(index) {
        this.current = index
        this.currentItem = this.videoList[index]
        // console.log(this.currentItem)
      },
      // 点击展开收缩
      togger() {
        this.slideTogger = !this.slideTogger
        if (this.isshow == 0) {
          this.isshow = 1
          this.videoSpan = '收起'
        } else {
          this.isshow = 0
          this.videoSpan = '展开'
        }
      },
    },
  }
</script>

<style scoped lang="scss">
  .videoPlay {
    height: 506px;
    width: 100%;
    padding-bottom: 0px !important;
    border-radius: 6px;
    position: relative;
    overflow: hidden;

    .video_container {
      width: 900px;
      height: 506px;

      .icon-video-play {
        font-size: 50px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        cursor: pointer;
      }
    }

    .video_right {
      display: inline-block;
      width: 300px;
      height: 100%;
      background: white;
      user-select: none;

      .video_header {
        padding: 20px;
        border-bottom: 1px solid #eeeeee;
        .video_span {
          display: inline-block;
          padding-left: 30px;
          position: relative;
          line-height: 26px;
          font-size: 20px;
          font-weight: bold;
          color: #333333;

          &::before {
            content: '';
            display: inline-block;
            width: 22px;
            height: 20px;
            position: absolute;
            left: 0;
            top: 4px;
            background: url(//cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/png/c4f8e6b0-0d40-4da4-b5a2-4b86259048e8.png)
              no-repeat;
            background-size: 22px 20px;
          }
        }
      }
      .video_list {
        padding: 0 20px;
        .list {
          li {
            margin: 10px 0px;
            padding: 9px 15px;
            line-height: 20px;
            font-size: 16px;
            color: #8590a6;
            cursor: pointer;
            user-select: none;
            &.listStyle {
              color: $color-theme;
              font-weight: bold;
              background: #487FFF12;
              border-radius: 12px;
            }
          }
        }
      }
    }
  }
</style>
