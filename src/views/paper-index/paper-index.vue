<template>
  <div class="index-wrapper">
    <!-- 最热试卷 最新试卷 同步教学题 -->
    <HotNewSyncPaper @show-login="showLogin" />
    <!-- 每周好题 阶段测试题 升学备考题 -->
    <!-- <MultiGoodQuestion @showLogin="showLogin"></MultiGoodQuestion> -->
    <!-- <MyCompositionPaper @showLogin="showLogin"></MyCompositionPaper> -->
    <!-- 活动弹框 -->
    <!-- <PaperHomeActivity @showLogin="showLogin"></PaperHomeActivity> -->
    <app-login ref="appLogin" />
    <!-- <CpVipLoginActivity @showLogin="showLogin"></CpVipLoginActivity> -->
    <!-- <parallel-paper-box ref="parallelPaperBoxRef"></parallel-paper-box> -->
    <!-- <img src="https://cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/home.png" alt=""> -->
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
import CTS from '@/common/js/constant'
import { API } from '@/api/config'
import scrollIntoView from 'scroll-into-view'

import { mapState } from 'vuex'
import { isLogin, setStore, getStore } from '@/common/js/util'
import Carousel from '@/components/Carousel/Carousel'
import imgSrc1 from '@/assets/images/index/banner1.png'
import imgSrc3 from '@/assets/images/index/banner3.png'

import VipOne from '@/assets/images/vip1.png'
import VipTwo from '@/assets/images/vip2.png'
import VipSch from '@/assets/images/school.png'
import CpVipLoginActivity from '@/components/Backtop/CpVipLoginActivity'
import VideoSegment from '../../components/VideoPlay/video-segment.vue'
import ClaimPointsBox from './compontents/ClaimPointsBox'
import parallelPaperBox from './compontents/parallel-paper-box'
import MyCompositionPaper from './compontents/MyCompositionPaper'
import HotNewSyncPaper from './compontents/HotNewSyncPaper'
import MultiGoodQuestion from './compontents/MultiGoodQuestion'
import HomeUserApp from './compontents/HomeUserApp'
import { paperIndexTurnConfig } from '@/common/config/tikuCfg'
import PaperHomeActivity from './compontents/activity/PaperHomeActivity'

export default {
  components: {
    Carousel,
    CpVipLoginActivity,
    VideoSegment,
    parallelPaperBox,
    MyCompositionPaper,
    HotNewSyncPaper,
    MultiGoodQuestion,
    HomeUserApp,
    PaperHomeActivity,
    ClaimPointsBox,
  },
  data() {
    return {
      imgsData: [],
      listData: [],
      isLogin: isLogin(),
      userOrgInfo: {
        balance: 0,
        orgName: null,
      },
      tbPaperList: [],
      bkPaperList: [],
      newsPaperList: [],
      currentServiceId: null,
      videoList: [],
      currentSign: false,
    }
  },
  computed: {
    ...mapState([
      'currSubject',
      'userInfo',
      'serviceInfo',
      'schoolVerify',
      'canpointPoints',
    ]),
    getUserLeveName() {
      let leveObj = {
        name: null,
        img: null,
      }
      switch (this.currentServiceId) {
        case 1:
          leveObj.name = '普通用户'
          leveObj.img = VipOne
          break
        case 2:
          leveObj.name = 'VIP用户'
          leveObj.img = VipTwo
          break
        case 3:
          leveObj.name = '学校用户'
          leveObj.img = VipSch
          break
        case 4:
          leveObj.name = '学校用户'
          leveObj.img = VipSch
          break
        case 5:
          leveObj.name = '学校用户'
          leveObj.img = VipSch
          break
      }
      return leveObj
    },
    userImgBadge() {
      if (this.canpointPoints && this.canpointPoints.badge) {
        return `url(${this.canpointPoints.badge})`
      } else {
      }
      return ''
    },
  },
  watch: {
    serviceInfo: {
      handler(nv, ov) {
        this.currentServiceId = nv.serviceId
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    // if (getStore('appLogin') === 'show') {
    //   setStore('appLogin', 'hide')
    //   this.showLogin()
    // }
  },
  mounted() {
    this.init()
  },
  methods: {
    onSchoolQues() {
      this.openWindowLink('//ti.canpoint.cn/about/#/paper/questionBank')
    },
    onInteractivePlaza() {
      this.openWindowLink('//ti.canpoint.cn/about/#/paper/questionApi')
    },
    // 如果第一次进入页面 显示 活动
    querySignTask() {
      this.currentSign = false
      if (!isLogin()) return
      this.apiGet(API.USER_QUERYSIGNTASK).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          let isSign = res.data.isSign || ''
          let currentDaily = res.data.nowWeek
          // 今天是否签到
          this.currentSign = isSign.indexOf(currentDaily + '') == -1
        }
      })
    },
    async searchPaperList() {
      let parms = {
        period: this.currSubject.periodCode,
        subjectCode: this.currSubject.subjectCode,
        pageSize: 10,
      }
      // let newsPaperList = await this.apiGet(API.MANAGE_PAPER_LIST, parms)
      // this.newsPaperList = newsPaperList.data.list
    },
    openModelSegment(index) {
      let path = ''
      switch (index) {
        case 0:
          path = '/paper/chapter/selection'
          break
        case 1:
          path = '/paper/center'
          break
        case 2:
          path = '/paper/knowledge/selection'
          break
        case 3:
          this.openPaperIndexTurnConfig()
          return
      }
      if (path) {
        this.$router.push({ path: path })
      }
    },
    openPaperIndexTurnConfig() {
      let item = paperIndexTurnConfig.find(
        item => item.period == this.currSubject.subjectCode,
      )
      console.log(item)
      if (item) {
        this.openWindowLink(item.address)
      } else {
        this.openWindowLink('https://www.canpointgz.cn/book.html')
      }
    },
    async init() {
      //this.querySignTask()
      // this.getIndexBannerList()
      // await this.getIndexVideoList()
      let params = this.$route.params
      if (params && params.type == 1) {
        // 滚动到视频的位置
        this.$nextTick(() => {
          this.onScrollToElement()
        })
      }
    },
    // 监听点击试题定位
    onScrollToElement() {
      let watchRef = this.$refs.watchvideoRef
      if (!watchRef) {
        return
      }
      this.$nextTick(() => {
        const element = this.$refs.watchvideoRef.$el
        scrollIntoView(
          element,
          {
            time: 500,
          },
          () => {},
        )
      })
    },
    // 获取 视频
    getIndexVideoList() {
      return this.apiGet(API.PAGEINDEX_VIDEO_LIST).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          this.videoList = res.data
        }
      })
    },
    // 获取 banner
    getIndexBannerList() {
      let params = {
        periodCode: this.currSubject.periodCode,
        subjectCode: this.currSubject.subjectCode,
      }
      this.apiGet(API.PAGEINDEX_BANNER_LIST, params).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          if (res.data && res.data.length > 0) {
            this.imgsData = res.data
          } else {
            this.imgsData = [
              {
                id: 3,
                pictureUrl: imgSrc1,
              },
              {
                id: 5,
                pictureUrl: imgSrc3,
              },
            ]
          }
        } else {
          this.imgsData = [
            {
              id: 3,
              pictureUrl: imgSrc1,
            },
            {
              id: 5,
              pictureUrl: imgSrc3,
            },
          ]
        }
      })
    },

    openVipDialog() {
      // CpBuyVip.install({})
      this.openSystemPathLink('vip/buyvip')
    },
    // 显示登录弹框
    showLogin() {
      this.$nextTick(() => {
        this.$refs.appLogin.showLogin()
      })
    },
    // 获取用户信息 过期
    // getUserInfo() {
    //   let url = {
    //     urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/sys/user/userData'
    //   }
    //   this.apiGet(url, {
    //     showLoading: true
    //   }).then(res => {
    //     if (res.code === CTS.constant.SUCCESS_CODE) {
    //       if (res.data && res.data.balance) {
    //         this.userOrgInfo.balance = res.data.balance
    //       }
    //       if (res.data && res.data.org) {
    //         this.userOrgInfo.orgName = res.data.org.orgName
    //       }
    //     }
    //   })
    // },

    // 登录
    login() {
      this.$refs.appLogin.showLogin()
    },
    // 注册
    register() {
      this.$refs.appLogin.showRegister()
    },
    // 资源跳转
    goTo(type) {
      if (this.isLogin) {
        if (type === 'myCollect') {
          this.$router.push({ name: 'myCollect' })
        } else if (type === 'myPaper') {
          this.$router.push('/paper/resources/papers')
        } else if (type === 'myUpload') {
          this.$router.push(
            '/paper/resources/papers?tabActiveName=myUploadPaper',
          )
        } else if (type === 'chapterPaper') {
          this.$router.push({ name: 'chapterquesSelection' })
        } else if (type === 'knowledgePaper') {
          this.$router.push({ name: 'knowledgeSelection' })
        } else if (type === 'myGroupPer') {
          this.$router.push('/paper/intelligence/grouppaper')
        } else if (type === 'parallelPaper') {
          // 平行组卷
          // this.$router.push('/paper/intelligence/chapter')
          this.$refs.parallelPaperBoxRef.show()
        }
      } else {
        this.$refs.appLogin.showLogin()
      }
    },
    // 更多
    seeMore() {
      this.$router.push('/paper/center')
    },
    // 点击查看
    seeDetail(paperItem) {
      if (this.isLogin) {
        // this.$router.push({
        //   path: '/paper/detail',
        //   query: {
        //     paperIdEnc: item.paperIdEnc,
        //     source: item.source,
        //   },
        // })

        let viewCount = paperItem.viewCount || paperItem.totalCountView || 0

        let queryStr =
          '?paperIdEnc=' +
          paperItem.paperIdEnc +
          '&source=' +
          paperItem.source +
          '&viewCount=' +
          viewCount +
          '&pn=' +
          (paperItem.provinceName || '')

        queryStr += '&subject=' + this.currSubject.subjectCode
        window.open(this.$router.resolve('/paper/detail').href + queryStr)
      } else {
        this.$refs.appLogin.showLogin()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
.index-wrapper {
  width: 1200px;
  margin: 0 auto;
  padding-bottom: 20px;
  > img {
    width: 100%;
    height: 800px;
    margin-top: 16px;
  }
  .banner-wrap {
    height: 232px;
    margin-top: 20px;
    overflow: hidden;
    display: flex;
    border-radius: 6px;

    .banner-cn {
      width: 580px;
      height: 100%;
      margin-right: 15px;
    }

    .extension-area {
      margin-right: 15px;
      width: 158px;
      height: 232px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .school-ques {
        width: 158px;
        height: 108px;
        background: url(//cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/png/794fb368-1e28-4532-8148-fc8a7bd8d485.png)
          no-repeat;
        background-size: 158px 108px;
        cursor: pointer;
        user-select: none;
      }
      .Interactive-plaza {
        width: 158px;
        height: 108px;
        background: url(//cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/png/f47f4b9b-76f3-452a-9ceb-23d3311037f8.png)
          no-repeat;
        background-size: 158px 108px;
        cursor: pointer;
        user-select: none;
      }
      // http://cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/png/7bcb3775-444d-407c-a68a-cb11af9f869e.png
      // http://cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/png/ef80c56a-b64a-45b9-9026-0a72130eb841.png
    }

    .user-info {
      width: 430px;
      height: 232px;
      background: $color-white;
      border-radius: 6px;
      padding: 30px 0;
      box-sizing: border-box;

      .user-tit {
        display: flex;
        padding: 0 5px 0 20px;

        .img-box {
          width: 62px;
          height: 62px;
          // overflow: hidden;
          margin-right: 20px;
          position: relative;

          .user-img {
            width: 62px;
            height: 62px;
            border-radius: 50%;
          }
          .user-img-badge {
            position: absolute;
            width: 30px;
            height: 30px;
            background-size: 30px 30px;
            bottom: -10px;
            right: -10px;
          }
        }
      }
    }
  }

  .stb-servers {
    display: flex;
    margin-top: 16px;
    margin-bottom: 16px;
    justify-content: space-between;

    .stb-school,
    .stb-app {
      width: 592px;
      height: 333px;
      background: #fff;
      border-radius: 6px;
      padding: 20px;
      box-sizing: border-box;

      h1 {
        padding-left: 8px;
        font-size: 20px;
        font-weight: bold;
        color: #333333;
        padding-bottom: 20px;
      }

      :deep(.el-carousel) {
        border-radius: 0;
        overflow: hidden;
      }
    }

    .stb-app {
      ul {
        display: flex;
        justify-content: space-around;
        padding-top: 37px;
        a {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 40px;
          cursor: pointer;
          img {
            width: 132px;
            height: 132px;
          }
          span {
            font-size: 14px;
            color: #333333;
            padding-top: 15px;
          }
        }

        a:hover {
          span {
            color: #487fff;
          }
        }
      }
    }
  }
}
.primary-school-models {
  display: flex;
  justify-content: space-between;
  padding-top: 16px;
  .model-image {
    width: 288px;
    height: 100px;
    border-radius: 6px;
    cursor: pointer;
  }
}
.question-content {
  background: #fff;
  margin-top: 16px;
  display: flex;
  border-radius: 6px;
  padding-bottom: 6px;

  .ques-left {
    display: none;
  }

  .ques-left,
  .ques-right {
    width: 100%;

    .ques-tit {
      height: 60px;
      line-height: 60px;
      border-bottom: 1px solid #eeeeee;

      .tit {
        font-size: 20px;
        font-weight: bold;
        color: #333333;
        padding-left: 28px;
      }

      img {
        width: 35px;
        position: relative;
        top: -8px;
        left: 15px;
      }

      .more {
        float: right;
        padding-right: 20px;
        font-size: 15px;
        color: $color-theme;
        cursor: pointer;
      }

      .more:hover {
        color: $color-theme-d;
      }

      .clearfix {
        clear: both;
      }
    }

    ul {
      border-right: 1px solid #eeeeee;
      margin-top: 10px;
      display: flex;
      flex-wrap: wrap;

      li {
        display: flex;
        align-items: center;
        height: 40px;
        background: #fff;
        width: 50%;
        background: #fafafa;
        cursor: pointer;
        box-sizing: border-box;

        // margin-bottom: 5px;
        .spot {
          display: inline-block;
          width: 4px;
          height: 4px;
          background: #a5bac5;
          margin-left: 18px;
          margin-right: 5px;
        }

        p {
          color: #333333;
          flex: 1;
          height: auto;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          line-height: 40px;
        }

        .num {
          padding-right: 20px;
          color: #666666;
        }
      }

      li:nth-child(1),
      li:nth-child(2),
      li:nth-child(5),
      li:nth-child(6),
      li:nth-child(9),
      li:nth-child(10) {
        background: #fafafa;
        border-right: 1px solid #eeeeee;
        // margin-right: 8px;
      }

      li:nth-child(3),
      li:nth-child(4),
      li:nth-child(7),
      li:nth-child(8) {
        background: #fff;
        border-right: 1px solid #eeeeee;
        // margin-left: 8px;
      }

      li:nth-child(even) {
        border-right: none;
      }

      li:hover {
        background-color: #f6fbff;

        p,
        .num {
          color: #487fff;
        }

        .spot {
          background: #487fff;
        }
      }
    }

    .even {
      background: #fafafa;
    }

    .odd {
      background: #fff;
    }
  }

  .ques-right {
    ul {
      border-right: none;
    }
  }
}

.user-info-c {
  display: flex;
  justify-content: space-between;
  width: calc(100% - 82px);
  .user-name {
    .user-name-info {
      .name {
        font-size: 20px;
        font-weight: bold;
        color: #333;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        line-height: 35px;
        width: 175px;
        display: block;
      }
      .vip-info {
        display: flex;
        img {
          width: 70px;
          height: 23px;
          vertical-align: sub;
          display: inline-block;
        }

        .vip-leve {
          font-size: 14px;
          color: #333;
          padding-left: 8px;
          line-height: 23px;
        }

        .leve {
          padding-left: 20px;
          color: #487fff;
          font-size: 14px;
          cursor: pointer;
          line-height: 23px;
        }
        i {
          color: #487fff;
          font-size: 15px;
          transform: scale(0.8);
        }
      }
    }
  }
}

.no-login {
  .user-login {
    span {
      font-size: 20px;
      font-weight: bold;
      color: #487fff;
      cursor: pointer;
      line-height: 35px;
    }
  }
  .user-c {
    flex: 1;
  }

  .user-fast {
    font-size: 16px;
    color: #666666;
    line-height: 16px;
  }
}
.claim-box-segment {
  display: inline-block;
  width: 104px;
  height: 58px;
  padding-right: 30px;
}
.treasure-box-segment {
  display: inline-block;
  width: 85px;
  height: 58px;
  padding-right: 20px;
  .sign-in-benefit {
    position: relative;
    cursor: pointer;
    user-select: none;
    .sign-in-tips {
      position: relative;
      line-height: 24px;
      text-align: center;
      font-weight: 400;
      width: 84px;
      background: #ffeedf;
      border-radius: 12px;

      font-size: 12px;
      font-weight: bold;
      color: #ff6c46;

      &::after {
        display: block;
        content: '';
        border-width: 5px;
        border-style: solid;
        border-color: #ffeedf transparent transparent transparent;

        /* 定位 */
        position: absolute;
        left: 45%;
        top: 100%;
      }
    }
    &::after {
      content: '';
      position: absolute;
      display: inline-block;
      width: 53px;
      height: 40px;
      background: url(//cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/png/f446cb2b-466d-4b44-838e-67d043eef1d0.png)
        no-repeat;
      background-size: 53px 40px;
      top: 26px;
      left: 16px;
    }
  }
}
</style>
