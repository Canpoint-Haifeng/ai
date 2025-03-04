<template>
  <div
    class="home-page-search-position"
    :style="{ backgroundImage: defaultThemeUrlBg }"
  >
    <div class="home-top-body content-container">
      <div class="home-top-logo-subject">
        <div class="logo-block">
          <a href="//ti.canpoint.cn/"
            ><img
              src="@/assets/images/logo-slogan.svg"
              alt="全品AI教研云"
              height="46"
          /></a>
        </div>
      </div>
      <div class="home-search-form-box">
        <div class="home-search-form" :style="{ transform: searchTransform }">
          <div class="home-search-input">
            <!-- <div class="tab-btn">
              <div
                class="btns"
                v-for="item in searchOptions"
                :key="item.label"
                @mousedown="event => handleCommand(event, item)"
                :class="{ 'active-btn': currSearchOption === item.label }"
              >
                {{ item.name }}
              </div>
            </div> -->
            <el-input
              popper-class="search-autocomplete-suggestions custom-dropdown-menu"
              v-model="keywords"
              maxlength="100"
              class="search-input"
              @keyup.enter="search"
              :placeholder="searchPlaceholder"
              @focus="handleFocus"
              @blur="blurEvent"
            >
            </el-input>
            <!-- 处理 cookie 搜索缓存数据的组件 -->
            <HistoryMessageList
              ref="historyMsgListRef"
              :currSearchOption="currSearchOption"
              @changeHisText="changeHisText"
              @changeHotPaper="changeHotPaper"
            ></HistoryMessageList>
          </div>
          <div class="search-btn" @click="search">
            <i class="iconfont iconsearch"></i></template></template>
          </div>
        </div>

        <div class="use-control-segment">
          <div class="edit-theme" @click="onEditTheme">换主题</div>
        </div>
      </div>
      <!-- <div class="cp-activity-goodgift-image" @click="skipToActivity"></div> -->
      <HomePageBoxs :list="boxList" @showLogin="showLogin"></HomePageBoxs>

      <div class="home-top-set-config">
        <span @click="openSetHomePageBlock">
          <span class="iconfont icongengduo"></span>
          <span class="text">定制我的快捷选题路径</span
          ><i class="el-icon-arrow-right"></i></template></template>
        </span>
      </div>
    </div>

    <div v-if="showFixed" class="home-page-search-fixed">
      <app-top-search :currSubject="currSubject"></app-top-search>
    </div>
    <!-- 登录弹窗 -->
    <app-login ref="appLogin"></app-login>

    <DiaHomeSetPageBlock
      ref="diaHomeSetPageBlockRef"
      @changeSuccess="onChangeSuccess"
    ></DiaHomeSetPageBlock>

    <!-- 设置 主题 -->
    <DiaSetUserTheme ref="diaSetUserThemeRef"></DiaSetUserTheme>
  </div>
</template>

<script>
import CTS from '@/common/js/constant'
import { API } from '@/api/config'
import windowScrollResetMixin from '@/common/mixins/windowScrollResetMixin'
import { isLogin, setCookieSubjectVolume } from '@/common/js/util'
import { mapState, mapActions } from 'vuex'
import HomePageBoxs from './HomePageBoxs'
import DiaHomeSetPageBlock from './DiaHomeSetPageBlock'
import DiaSetUserTheme from './DiaSetUserTheme'
import HistoryMessageList from './HistoryMessageList.vue'
export default {
  components: {
    HomePageBoxs,
    DiaHomeSetPageBlock,
    DiaSetUserTheme,
    HistoryMessageList,
  },
  mixins: [windowScrollResetMixin],
  data() {
    return {
      showFixed: false,
      boxList: [],
      listData: [], // 学段学科筛选
      keywords: '',
      searchPlaceholder: '可输入教案名称搜索',
      currSearchOption: 1,
      searchOptions: [
        // {
        //   label: 1,
        //   name: '找试题',
        //   className: 'btn-ques',
        //   placeholder: '请输入试题内容搜索',
        // },
        {
          label: 1,
          name: '找教案',
          className: 'btn-paper',
          placeholder: '可输入教案名称搜索',
        },
      ],
      showSearchOptions: false,
      sendEventFlag: true, // 第一次 变化时 发出 事件
      searchTransform: 'translate3d(0, 0, 0)', // translate3d(17px, 160px, 0px)
    }
  },
  computed: {
    ...mapState(['currSubject', 'allVipDict', 'userTheme']),
    defaultThemeUrlBg() {
      if (this.userTheme && this.userTheme.themeUrl) {
        return `url('${this.userTheme.themeUrl}')`
      } else {
        return ''
      }
    },
  },
  watch: {
    currSubject() {
      this.getDefaultConfigs()
      if (!(this.userTheme && this.userTheme.themeUrl)) {
        this.getDefaultUserTheme()
      }
    },
    // showFixed(nval) {
    //   if (nval) {
    //     this.$refs.msgListRef.closed()
    //   }
    // },
  },
  created() {
    this.initWindowsEvent()
  },
  destroyed() {
    this.destroyedWindowsEvent()
  },
  async mounted() {
    this.getDefaultConfigs()
    if (!(this.userTheme && this.userTheme.themeUrl)) {
      this.getDefaultUserTheme()
    }
    this.renderScrollFixed()
  },
  methods: {
    changeHisText(item) {
      this.keywords = item
      this.search()
    },
    changeHotPaper(paperItem) {
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
    },
    handleFocus() {
      this.$refs.historyMsgListRef.show()
    },
    blurEvent() {
      this.$refs.historyMsgListRef.closed()
    },
    // 提交更新学段学科state
    ...mapActions(['updateCurrentSubject']),
    onEditTheme() {
      if (isLogin()) {
        this.$refs.diaSetUserThemeRef.show()
      } else {
        this.$refs.appLogin.showLogin()
      }
      this.czcTrackEvent(['_trackEvent', '学科主页', '点击换主题', '次数'])
    },
    skipToActivity() {
      // http://ti.canpoint.cn/fullactive/springfestival
      this.openSystemPathLink('fullactive/springfestival')
    },
    // 切换学段学科
    selectSubject(item, subItem) {
      let currSubject = {
        periodCode: item.code,
        periodName: item.name,
        subjectCode: subItem.code,
        subjectName: subItem.name,
      }
      if (!isLogin()) {
        // 未登录本地无token
        setCookieSubjectVolume(currSubject, '')
        this.updateCurrentSubject(currSubject)
        window.location.reload()
      } else {
        // 已登录本地有token
        this.updateServerSubject(currSubject)
      }
      // 组卷编辑和组卷预览特殊处理学科切换
    },
    // 更新服务端默认学科
    updateServerSubject(currSubject, isRefresh = true) {
      let parms = {
        periodCode: currSubject.periodCode,
        subjectCode: currSubject.subjectCode,
      }
      let set = {
        authCode: 2,
      }
      this.apiPost(API.UPDATE_DEFAULT_SUBJECT, parms, set).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          setCookieSubjectVolume(currSubject, '')
          this.updateCurrentSubject(currSubject)
          isRefresh && window.location.reload()
        } else if (res.code === CTS.constant.AUTH_TOKEN_CALLBACK_CODE) {
          // 本地token过期
          setCookieSubjectVolume(currSubject, '')

          this.updateCurrentSubject(currSubject)
          isRefresh && window.location.reload()
        }
      })
    },
    // 获取学段学科数据
    getSubjectList() {
      if (this.listData && this.listData.length) return
      return this.$store
        .dispatch('getConfigData', { vm: this, type: 2, strParams: {} })
        .then(res => {
          this.listData = res || []

          // console.log('getConfigData', this.listData)
        })
    },
    renderScrollFixed(e) {
      let comparisonTop = this.getPageScrollTop()
      let destinationY = 370
      // let startMoveY = destinationY - 125
      if (comparisonTop > destinationY) {
        this.showFixed = true
        this.blurEvent() //  关闭消息框
        if (this.sendEventFlag) {
          this.sendEventFlag = false
          this.Bus.$emit('sendShowFixedFlag')
        }
      } else {
        this.showFixed = false
        // if (comparisonTop > startMoveY) {
        //   let differY = comparisonTop - startMoveY
        //   let differX = Math.floor((differY / 125) * 17)
        //   this.searchTransform = `translate3d(${differX}px,${differY}px,0)`
        // } else {
        //   this.searchTransform = 'translate3d(0,0,0)'
        // }
      }

      // console.log(this.showFixed, 'showFix')
    },

    onChangeSuccess() {
      this.Bus.$emit('updateUserAppConfig')
      this.getDefaultConfigs()
    },
    openSetHomePageBlock() {
      if (isLogin()) {
        let list = {}
        this.boxList.forEach(item => {
          list[item.id] = true
        })
        this.$refs.diaHomeSetPageBlockRef.show(list, [...this.boxList])
      } else {
        this.$refs.appLogin.showLogin()
      }
    },
    showLogin() {
      this.$refs.appLogin.showLogin()
    },
    // 点击搜索  保存记录到cookie-历史搜索
    search() {
      if (!this.keywords.trim()) {
        console.log(this.keywords.trim())
        return
      }
      let path =
        this.currSearchOption === 1 ? 'search/question' : 'search/paper'
      this.openSystemPathLink(path + '?keywords=' + this.keywords)
      //判断如果当前获取到搜索历史list长度大于5,不能添加，把数组的第一条的数据删除
      this.$refs.historyMsgListRef.saveCookieData(this.keywords.trim())
    },
    // 搜索条件切换
    handleCommand(event, command) {
      event.preventDefault()
      this.currSearchOption = command.label
      this.searchPlaceholder = command.placeholder
      if (
        this.$route.name === 'searchPaper' &&
        this.$route.query.keywords &&
        command.label === 2
      ) {
        this.keywords = this.$route.query.keywords
      } else if (
        this.$route.name === 'searchQuestion' &&
        this.$route.query.keywords &&
        command.label === 1
      ) {
        this.keywords = this.$route.query.keywords
      } else {
        this.keywords = ''
      }
    },
    getDefaultUserTheme() {
      if (!(this.currSubject && this.currSubject.periodCode)) {
        return
      }
      let url = API.USERTHEME_GETDEFAULTTHEME
      if (isLogin()) {
        url = API.USERTHEME_GETUSERTHEME
      }
      this.apiGet(url).then(res => {
        if (this.checkoutRes(res)) {
          // this.themeUrl = res.data.themeUrl
          this.$store.commit('UPDATE_USERTHEME', res.data)
        }
      })
    },
    async getDefaultConfigs() {
      if (!(this.currSubject && this.currSubject.periodCode)) {
        return
      }
      let params = {
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
      }
      // console.log(params, 'parmas-----11')
      let url = API.MY_NOTOKEN_DEFAULTCONFIGS
      if (isLogin()) {
        url = API.MY_HOMEPAGECONFIG_USER_DEFAULTCONFIGS
      }
      await this.apiGet(url, params).then(res => {
        if (this.checkoutRes(res)) {
          this.boxList = res.data.map(v => {
            return {
              ...v,
              url: v.url.replace('ti.canpoint.cn', 'ti-demo.canpoint.cn:8433'),
            }
          })
        }
      })

      await this.getSubjectList()
    },
    openGoodQuestion() {
      this.$router.push({
        path: '/question/goodquestions',
      })
    },
  },
}
</script>

<style scoped lang="scss">
.home-top-body {
  position: relative;
  height: 446px;
}
.home-page-search-fixed {
  z-index: 1003;
  position: fixed;
  top: 40px;
  left: 0;
  width: 100%;
  height: 100px;
  background-color: white;
}
.home-top-logo-subject {
  position: relative;
  display: flex;
  justify-content: space-between;
  padding-top: 40px;
  .logo-block {
    width: 500px;
    height: 46px;
  }
  .subject-block {
    width: 240px;
    height: 48px;
    background: #ffffff;
    border: 1px solid #d9e4f577;
    border-radius: 24px;
    line-height: 48px;
    text-align: center;
    cursor: pointer;
    user-select: none;
  }
}
.subject-block {
  width: 240px;
  height: 48px;
  background: #ffffff;
  border: 1px solid #d9e4f577;
  border-radius: 24px;
  line-height: 48px;
  text-align: center;
  cursor: pointer;
  user-select: none;
}
.home-search-form-box {
  text-align: center;
  padding-top: 30px;
  position: relative;
}
.home-search-form {
  position: relative;
  z-index: 99;
  @include flex();
  width: 628px;
  height: 46px;
  margin-right: 25px;
  border-radius: 12px;
  margin-top: 2px;
  margin: 0 auto;
  background-color: white;

  .home-search-input {
    @include flex();
    width: 528px;
    border: 1px solid #c1c9cd;
    border-right-width: 0;
    height: 44px;
    border-radius: 12px 0 0 12px;
    .tab-btn {
      display: flex;
      margin: 0 10px 0 10px;
      .btns {
        width: 78px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border-radius: 4px;
        box-sizing: border-box;
        cursor: pointer;
        background: #fff;
        border: 1px solid #e2e2e2;
        margin-right: 10px;
      }
      .active-btn {
        background: #4b8ff5;
        color: #fff;
        border: 1px solid #4b8ff5;
      }
    }
    .search-input {
      width: 430px;
      :deep() .el-input__inner {
        height: 20px;
        line-height: 20px;
        border: none;
        border-left: 1px solid #cfcfcf;
        border-radius: 0;
        color: $color-text-d;
        padding: 0;
        padding-left: 12px;
        font-size: $font-size-medium;
        &:focus {
          border-left: 1px solid $color-theme;
        }
      }
    }
  }
  .search-btn {
    width: 110px;
    height: 46px;
    line-height: 46px;
    background: #4b8ff5;
    cursor: pointer;
    border-radius: 0px 12px 12px 0px;
    text-align: center;
    transition: 0.2s;
    &:hover {
      background: $color-theme-d;
    }
    .iconsearch {
      color: $color-white;
      font-size: 22px;
    }
  }
}

.home-top-set-config {
  text-align: center;
  font-size: 16px;
  font-weight: 400;
  color: #4b8ff5;
  padding: 38px 0 80px 0;
  cursor: pointer;
  user-select: none;
  .text {
    padding-right: 19px;
    padding-left: 5px;
  }
}

.subject-block {
  .iconfont {
    color: #4b8ff5;
    font-size: 20px;
    display: inline-block;
    padding-right: 5px;
  }
  .curr-subject {
    font-size: 20px;
    font-weight: bold;
    color: #4b8ff5;
    display: inline-block;
    padding-right: 5px;
  }

  .tips {
    height: 18px;
    font-size: 18px;
    font-weight: 400;
    color: #969ca4;
  }
}

.home-page-search-position {
  position: relative;
  margin-top: 40px;
  background-image: url('//cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/jpg/fbc8c0f4-29ea-4a46-a70d-b4cd4989d289.jpg');
  background-position: center;
  background-repeat: no-repeat;
  // background: url('//cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/jpg/11562856-6990-4490-a604-b718278ea2c6.jpg')
  //   center center no-repeat;
  // background: linear-gradient(
  //     4deg,
  //     rgba(38, 8, 31, 0.2) 30%,
  //     rgba(213, 49, 127, 0.1) 45%,
  //     rgba(232, 120, 12, 0.1) 100%
  //   ),
  //   url('//cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/jpg/11562856-6990-4490-a604-b718278ea2c6.jpg')
  //     center center no-repeat;
  // background: url('http://qp-tiku-test.oss-cn-beijing.aliyuncs.com/jpg/a201a29c-3569-496c-b821-fef6c1cd4a4e.jpg')
  //   center center no-repeat;
  background-size: 1920px 446px;
}

.subject-body-list {
  padding: 15px 15px 5px 15px;
  .subject-menu-item {
    background: none;
    margin-bottom: 20px;
    height: auto;
    line-height: 16px;
    padding: 0;
    cursor: pointer;
    user-select: none;
    .title {
      margin-bottom: 12px;
      color: $color-text-d;
      font-size: $font-size-medium-x;
      display: flex;
      align-items: center;
      font-weight: bold;
      .line {
        display: inline-block;
        vertical-align: -1px;
        width: 4px;
        height: 18px;
        background: $color-theme;
        margin-right: 8px;
      }
    }
    .content {
      overflow: hidden;
      padding: 8px 0;
      .text {
        float: left;
        line-height: 14px;
        margin: 0px 1px;
        color: $color-text;
        padding: 4px 15px;
        border: 1px solid transparent;
        position: relative;
        margin-right: 10px;
        &:hover,
        &.active {
          color: $color-white;
          border-radius: 12px;
          background: $color-theme;
        }
        &.vip::after {
          content: '';
          position: absolute;
          display: inline-block;
          width: 16px;
          height: 16px;
          top: -8px;
          right: 0px;
          background-image: url('../../assets/images/index/vip-icon.png');
          background-size: 16px 16px;
        }
        &.vip:hover,
        &.vip.active {
          background: #fef8e7;
          border: 1px solid #ffdb94;
          border-radius: 12px;
          color: #9b610b;
        }
      }
    }
  }
}

.cp-activity-goodgift-image {
  position: absolute;
  top: 30px;
  left: 500px;
  background: url('//cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/png/9cc2b960-66a0-49ee-810a-4568a4959f43.png')
    center center no-repeat;
  background-size: 208px 57px;
  width: 208px;
  height: 57px;
  cursor: pointer;
  user-select: none;
}

.use-control-segment {
  display: flex;
  position: absolute;
  top: 35px;
  right: 166px;
  .edit-theme {
    width: 90px;
    height: 35px;
    background: #ffffff99;
    border: 1px solid #d9e4f5;
    border-radius: 18px;
    text-align: center;
    line-height: 35px;
    color: #666666;
    cursor: pointer;
    user-select: none;

    &:hover {
      color: $color-theme;
    }

    &::before {
      content: '';
      display: inline-block;
      background-image: url(http://cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/png/09bd0b02-8f81-434e-b9e2-eb95ae5f8f68.png);
      background-repeat: no-repeat;
      background-size: 19px 16px;
      width: 19px;
      height: 16px;

      vertical-align: text-bottom;
      padding-right: 2px;
    }
  }
}
</style>
