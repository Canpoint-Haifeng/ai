<template>
  <div v-if="visible">
    <div class="receive-reward-segment">
      <div class="receive-reward-body">
        <div
          class="receive-reward-content"
          :class="{
            receive_animation: startAnimation,
          }"
        >
          <div
            v-if="rewardsImage.length"
            class="receive-reward-animation"
          />
          <div class="receive-reward-bg">
            <div
              class="receive-reward-bg-content"
              :class="{ rewardsNum: rewardsNum >= 3 }"
            />
          </div>
          <div
            v-if="rewardsNum === 1"
            class="receive-reward-images"
          >
            <div
              v-for="(item, index) in rewardsImage"
              :key="index"
              class="reward-item"
            >
              <img
                :src="item.url"
                :style="{
                  width: item.width + 'px',
                  height: item.height + 'px',
                }"
              >
              <div
                class="reward-info"
                v-html="item.content"
              />
            </div>
          </div>
          <div
            v-if="rewardsNum > 1"
            class="receive-reward-images-list"
            :class="{ list2: rewardsNum == 2, list3: rewardsNum >= 3 }"
          >
            <div
              v-for="(item, index) in rewardsImage"
              :key="index"
              class="reward-item"
            >
              <img
                :src="item.url"
                :style="{
                  width: item.width + 'px',
                  height: item.height + 'px',
                }"
              >
              <div
                class="reward-info"
                v-html="item.content"
              />
            </div>
          </div>
        </div>

        <div
          class="receive-reward-close"
          @click="visible = false"
        >
          <span class="iconfont iconclose_cricle" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, defineComponent } from "vue"

export default defineComponent({
  name: "CpReceiveReward",
  props: {
    initDate: {
      type: Object,
      default: () => ({ comfirm: null, rewards: [] })
    }
  },
  setup() {
    return {}
  }
})
</script>

<style scoped lang="scss">
  .receive-reward-segment {
    position: fixed;
    top: 0;
    height: 0;
    width: 100%;
    height: 100%;
    background-color: #00000099;
    z-index: 100001;

    .receive-reward-body {
      position: relative;
      width: 378px;
      height: 378px;
      margin: 260px auto;

      .receive-reward-content {
        min-height: 378px;
        transform: scale(0.1);
        transition: transform 0.5s;
      }
      .receive-reward-content.receive_animation {
        transform: scale(1);
      }
      .receive-reward-close {
        width: 26px;
        height: 26px;
        // background-image: url('http://cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/png/689050a9-f7b1-4d19-bdfc-dc9916422958.png');
        // background-size: 26px 26px;
        position: absolute;
        right: -60px;
        top: -60px;
        z-index: 1;
        cursor: pointer;
        .iconfont {
          font-size: 26px;
          color: white;
        }
      }
      .receive-reward-animation {
        position: absolute;
        width: 500px;
        height: 500px;
        top: -120px;
        left: -66px;
        background-image: url('http://cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/png/d8f67f87-8430-45d2-89d0-b49af40baeb3.png');
        background-size: 100% 100%;
        animation: rotate-scale-up 5.65s linear infinite both;
      }
      .receive-reward-bg {
        position: absolute;
        left: 0;
        top: -150px;
        .receive-reward-bg-content {
          width: 378px;
          min-height: 160px;
          background-image: url('http://cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/png/def029ec-f627-4a1f-8c2d-66ae25d19090.png');
          background-repeat: no-repeat;
          background-size: 100% 100%;
          &.rewardsNum {
            height: 200px;
          }
        }
        &:before {
          display: block;
          content: ' ';
          width: 378px;
          height: 200px;
          background-image: url('http://cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/png/1a93077a-0bc6-43b5-89fa-ef7cc3291c7f.png');
          background-repeat: no-repeat;
          background-size: 100% 100%;
        }
        &:after {
          display: block;
          content: ' ';
          width: 378px;
          height: 140px;
          background-image: url('http://cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/png/88a4fedd-cfaa-4cb8-b883-597a15244d26.png');
          background-repeat: no-repeat;
          background-size: 100% 100%;
        }
      }

      .receive-reward-images {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        justify-content: space-around;
        width: 378px;
        .reward-item {
          width: 230px;
        }
        .reward-info {
          font-size: 20px;
          font-weight: bold;
          color: #af6c25;
          line-height: 24px;
          text-align: center;
        }
      }

      .receive-reward-images-list {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        justify-content: space-around;

        box-sizing: border-box;
        width: 378px;
        &.list2 {
          padding: 90px 50px;
        }
        &.list3 {
          padding: 30px 50px;
          flex-wrap: wrap-reverse;
        }
        .reward-item {
          width: 115px;
          img {
            border: 4px solid #fff3e0;
            border-radius: 8px;
            background-color: white;
          }
        }
        .reward-info {
          padding-top: 10px;
          font-size: 12px;
          font-weight: bold;
          color: #af6c25;
          line-height: 15px;
          text-align: center;
          // padding: 15px 0;
          padding: 10px 15px 10px 15px;
        }
      }
    }
  }
})

  @keyframes rotate-scale-up {
    0% {
      transform: scale(1) rotateZ(0);
    }
    50% {
      transform: scale(1.2) rotateZ(180deg);
    }
    100% {
      transform: scale(1) rotateZ(360deg);
    }
  }
})
</style>
