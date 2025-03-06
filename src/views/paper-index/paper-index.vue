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
import CTS from '@/common/js/constant'
import { API } from '@/api/config'
import scrollIntoView from 'scroll-into-view'
import { isLogin, setStore, getStore } from '@/common/js/util'
import Carousel from '@/components/Carousel/Carousel.vue'
import HotNewSyncPaper from './compontents/HotNewSyncPaper.vue'
import AppLogin from '@/components/AppLogin/AppLogin.vue'
import SynchronousTeaching from './compontents/SynchronousTeaching.vue'
import imgSrc1 from '@/assets/images/index/banner1.png'
import imgSrc3 from '@/assets/images/index/banner3.png'
import VipOne from '@/assets/images/vip1.png'
import VipTwo from '@/assets/images/vip2.png'
import VipSch from '@/assets/images/school.png'
import CpVipLoginActivity from '@/components/Backtop/CpVipLoginActivity.vue'
import VideoSegment from '../../components/VideoPlay/video-segment.vue'
import ClaimPointsBox from './compontents/ClaimPointsBox.vue'
import parallelPaperBox from './compontents/parallel-paper-box.vue'
import MyCompositionPaper from './compontents/MyCompositionPaper.vue'
import MultiGoodQuestion from './compontents/MultiGoodQuestion.vue'
import HomeUserApp from './compontents/HomeUserApp.vue'
import { paperIndexTurnConfig } from '@/common/config/tikuCfg'
import PaperHomeActivity from './compontents/activity/PaperHomeActivity.vue'

import { ref, reactive, computed, watch, onMounted, nextTick, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'PaperIndex',
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
    AppLogin
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    
    const appLogin = ref(null)
    const watchvideoRef = ref(null)
    const parallelPaperBoxRef = ref(null)
    
    const state = reactive({
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
    })

    // Computed properties
    const currSubject = computed(() => store.state.currSubject)
    const userInfo = computed(() => store.state.userInfo)
    const serviceInfo = computed(() => store.state.serviceInfo)
    const schoolVerify = computed(() => store.state.schoolVerify)
    const canpointPoints = computed(() => store.state.canpointPoints)
    
    // Additional computed properties
    const getUserLeveName = computed(() => {
      const leveObj = {
        name: null,
        img: null,
      }
      switch (state.currentServiceId) {
        case 1:
          leveObj.name = '普通用户'
          leveObj.img = VipOne
          break
        case 2:
          leveObj.name = 'VIP用户'
          leveObj.img = VipTwo
          break
        case 3:
        case 4:
        case 5:
          leveObj.name = '学校用户'
          leveObj.img = VipSch
          break
      }
      return leveObj
    })

    const userImgBadge = computed(() => {
      if (canpointPoints.value?.badge) {
        return `url(${canpointPoints.value.badge})`
      }
      return ''
    })

    // Methods
    const init = async () => {
      if (router.currentRoute.value.params?.type === 1) {
        nextTick(() => {
          onScrollToElement()
        })
      }
    }

    const onScrollToElement = () => {
      if (!watchvideoRef.value) return
      nextTick(() => {
        const element = watchvideoRef.value.$el
        scrollIntoView(element, { time: 500 }, () => {})
      })
    }

    const showLogin = () => {
      nextTick(() => {
        appLogin.value.showLogin()
      })
    }

    const register = () => {
      appLogin.value.showRegister()
    }

    const login = () => {
      appLogin.value.showLogin()
    }

    const openWindowLink = (url) => {
      window.open(url)
    }

    const onSchoolQues = () => {
      openWindowLink('//ti.canpoint.cn/about/#/paper/questionBank')
    }

    const onInteractivePlaza = () => {
      openWindowLink('//ti.canpoint.cn/about/#/paper/questionApi')
    }

    const querySignTask = async () => {
      state.currentSign = false
      if (!isLogin()) return
      const res = await apiGet(API.USER_QUERYSIGNTASK)
      if (res.code === CTS.constant.SUCCESS_CODE) {
        const isSign = res.data.isSign || ''
        const currentDaily = res.data.nowWeek
        state.currentSign = isSign.indexOf(currentDaily + '') === -1
      }
    }

    const searchPaperList = async () => {
      const params = {
        period: currSubject.value.periodCode,
        subjectCode: currSubject.value.subjectCode,
        pageSize: 10,
      }
      // const res = await apiGet(API.MANAGE_PAPER_LIST, params)
      // state.newsPaperList = res.data.list
    }

    const openModelSegment = (index) => {
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
          openPaperIndexTurnConfig()
          return
      }
      if (path) {
        router.push({ path })
      }
    }

    const openPaperIndexTurnConfig = () => {
      const item = paperIndexTurnConfig.find(
        item => item.period === currSubject.value.subjectCode
      )
      if (item) {
        openWindowLink(item.address)
      } else {
        openWindowLink('https://www.canpointgz.cn/book.html')
      }
    }

    const getIndexVideoList = () => {
      return apiGet(API.PAGEINDEX_VIDEO_LIST).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          state.videoList = res.data
        }
      })
    }

    const getIndexBannerList = () => {
      const params = {
        periodCode: currSubject.value.periodCode,
        subjectCode: currSubject.value.subjectCode,
      }
      apiGet(API.PAGEINDEX_BANNER_LIST, params).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          if (res.data && res.data.length > 0) {
            state.imgsData = res.data
          } else {
            state.imgsData = [
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
          state.imgsData = [
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
    }

    const openVipDialog = () => {
      // CpBuyVip.install({})
      openSystemPathLink('vip/buyvip')
    }

    const openSystemPathLink = (path) => {
      router.push({ path })
    }

    const goTo = (type) => {
      if (state.isLogin) {
        if (type === 'myCollect') {
          router.push({ name: 'myCollect' })
        } else if (type === 'myPaper') {
          router.push('/paper/resources/papers')
        } else if (type === 'myUpload') {
          router.push(
            '/paper/resources/papers?tabActiveName=myUploadPaper',
          )
        } else if (type === 'chapterPaper') {
          router.push({ name: 'chapterquesSelection' })
        } else if (type === 'knowledgePaper') {
          router.push({ name: 'knowledgeSelection' })
        } else if (type === 'myGroupPer') {
          router.push('/paper/intelligence/grouppaper')
        } else if (type === 'parallelPaper') {
          // 平行组卷
          // router.push('/paper/intelligence/chapter')
          parallelPaperBoxRef.value.show()
        }
      } else {
        appLogin.value.showLogin()
      }
    }

    const seeMore = () => {
      router.push('/paper/center')
    }

    const seeDetail = (paperItem) => {
      if (state.isLogin) {
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

        queryStr += '&subject=' + currSubject.value.subjectCode

        window.open(router.resolve('/paper/detail').href + queryStr)
      } else {
        appLogin.value.showLogin()
      }
    }

    // Watch effects
    watch(() => serviceInfo.value, (nv) => {
      state.currentServiceId = nv.serviceId
    }, { immediate: true, deep: true })

    // Lifecycle hooks
    onMounted(() => {
      init()
    })
    
    return {
      ...toRefs(state),
      appLogin,
      watchvideoRef,
      parallelPaperBoxRef,
      currSubject,
      userInfo,
      serviceInfo,
      schoolVerify,
      canpointPoints,
      getUserLeveName,
      userImgBadge,
      init,
      onScrollToElement,
      showLogin,
      register,
      login,
      openWindowLink,
      onSchoolQues,
      onInteractivePlaza,
      querySignTask,
      searchPaperList,
      openModelSegment,
      openPaperIndexTurnConfig,
      getIndexVideoList,
      getIndexBannerList,
      openVipDialog,
      openSystemPathLink,
      goTo,
      seeMore,
      seeDetail
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/assets/css/mixins.scss";
@import "@/assets/css/variables.scss";
@import "@/assets/css/variables.scss";
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
      }

      li:nth-child(3),
      li:nth-child(4),
      li:nth-child(7),
      li:nth-child(8) {
        background: #fff;
        border-right: 1px solid #eeeeee;
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

