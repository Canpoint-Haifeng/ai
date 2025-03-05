<template>
  <div>
    <WxActivityItem
      v-if="highBoatActivity"
      :activityData="activityData"
      @endProcess="runActivityProcess"
    ></WxActivityItem>
  </div>
</template>

<script>
  /**
   *  这是一个首页活动管理器
   * **/
  // import ThreeGoodGift from './ThreeGoodGift.js'
  // import HelpMidtermActivityItem from './HelpMidtermActivityItem.js'
  import WxActivityItem from './WxActivityItem.js'
  import { setCookie, getCookie } from '@/common/js/util.js'
  export default {
    components: { WxActivityItem },
    data() {
      return {
        highBoatActivity: false,
        //  活动列表 'threeGoodgiftActivity' 'helpMidtermActivityItem'
        activityData: {
          code: 'highBoatActivity',
          name: '2023高考真题',
          w: 637,
          h: 635,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          imageUrl:
            'http://cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/png/fc89a0bf-317c-4ff7-a7f4-b4effbfd0675.png',
          buttonList: [
            {
              imageUrl:
                'http://cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/png/4d6f24e3-ad17-4391-9485-0366e85d1393.png',
              activityUrl: '//ti.canpoint.cn/collegeexam/pastexam',
              w: 283,
              h: 89,
              top: 567,
              left: 175,
            },
            {
              imageUrl:
                'http://cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/png/d8e8086e-6801-453f-9236-cf95ba1c2e6f.png',
              w: 47,
              h: 47,
              top: 0,
              left: 609,
            },
          ],
        },
        // 'highBoatActivityItem'
        activityProcess: [],
      }
    },
    mounted() {
      this.runActivityProcess()
    },
    methods: {
      // 三重好礼 活动
      highBoatActivityItem() {
        if (!getCookie('highBoatActivityItem')) {
          this.highBoatActivity = true
          setCookie('highBoatActivityItem', '1', 1)
        }
      },
      runActivityProcess(activeName) {
        this[activeName] = false
        if (this.activityProcess && this.activityProcess.length) {
          let pop = this.activityProcess.pop()
          if (this[pop]) {
            this[pop]()
          }
        }
      },
    },
  }
</script>

<style scoped lang="scss"></style>
@import "@/assets/css/variables.scss";
