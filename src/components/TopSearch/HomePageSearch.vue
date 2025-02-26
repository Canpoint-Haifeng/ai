<template>
  <div
    class="home-page-search-position"
    :style="{ backgroundImage: defaultThemeUrlBg }"
  >
    <div class="home-top-body content-container">
      <div class="home-top-logo-subject">
        <div class="logo-block">
          <a href="//ti.canpoint.cn/"><img
            src="@/assets/images/logo-slogan.svg"
            alt="全品AI教研云"
            height="46"
          ></a>
        </div>
      </div>
      <div class="home-search-form-box">
        <div
          class="home-search-form"
          :style="{ transform: searchTransform }"
        >
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
              v-model="keywords"
              popper-class="search-autocomplete-suggestions custom-dropdown-menu"
              maxlength="100"
              class="search-input"
              :placeholder="searchPlaceholder"
              @keyup.enter.native="search"
              @focus="handleFocus"
              @blur="blurEvent"
            />
            <!-- 处理 cookie 搜索缓存数据的组件 -->
            <HistoryMessageList
              ref="historyMsgListRef"
              :curr-search-option="currSearchOption"
              @change-his-text="changeHisText"
              @change-hot-paper="changeHotPaper"
            />
          </div>
          <div
            class="search-btn"
            @click="search"
          >
            <i class="iconfont iconsearch" />
          </div>
        </div>

        <div class="use-control-segment">
          <div
            class="edit-theme"
            @click="onEditTheme"
          >
            换主题
          </div>
        </div>
      </div>
      <!-- <div class="cp-activity-goodgift-image" @click="skipToActivity"></div> -->
      <HomePageBoxs
        :list="boxList"
        @show-login="showLogin"
      />

      <div class="home-top-set-config">
        <span @click="openSetHomePageBlock">
          <span class="iconfont icongengduo" />
          <span class="text">定制我的快捷选题路径</span><i class="el-icon-arrow-right" />
        </span>
      </div>
    </div>

    <div
      v-if="showFixed"
      class="home-page-search-fixed"
    >
      <app-top-search :curr-subject="currSubject" />
    </div>
    <!-- 登录弹窗 -->
    <app-login ref="appLogin" />

    <DiaHomeSetPageBlock
      ref="diaHomeSetPageBlockRef"
      @change-success="onChangeSuccess"
    />

    <!-- 设置 主题 -->
    <DiaSetUserTheme ref="diaSetUserThemeRef" />
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch, inject } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import CTS from '@/common/js/constant'
import { API } from '@/api/config'
import { isLogin, setCookieSubjectVolume } from '@/common/js/util'
import HomePageBoxs from './HomePageBoxs.vue'
import DiaHomeSetPageBlock from './DiaHomeSetPageBlock.vue'
import DiaSetUserTheme from './DiaSetUserTheme.vue'
import HistoryMessageList from './HistoryMessageList.vue'

export default {
  components: {
    HomePageBoxs,
    DiaHomeSetPageBlock,
    DiaSetUserTheme,
    HistoryMessageList,
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const Bus = inject('Bus')
    
    // Refs
    const historyMsgListRef = ref(null)
    const diaHomeSetPageBlockRef = ref(null)
    const diaSetUserThemeRef = ref(null)
    const appLogin = ref(null)
    
    // Reactive state
    const showFixed = ref(false)
    const boxList = ref([])
    const listData = ref([]) // 学段学科筛选
    const keywords = ref('')
    const searchPlaceholder = ref('可输入教案名称搜索')
    const currSearchOption = ref(1)
    const searchOptions = ref([
      {
        label: 1,
        name: '找教案',
        className: 'btn-paper',
        placeholder: '可输入教案名称搜索',
      },
    ])
    const showSearchOptions = ref(false)
    const sendEventFlag = ref(true) // 第一次 变化时 发出 事件
    const searchTransform = ref('translate3d(0, 0, 0)') // translate3d(17px, 160px, 0px)
    
    // Computed
    const currSubject = computed(() => store.state.currSubject)
    const allVipDict = computed(() => store.state.allVipDict)
    const userTheme = computed(() => store.state.userTheme)
    
    const defaultThemeUrlBg = computed(() => {
      if (userTheme.value && userTheme.value.themeUrl) {
        return `url('${userTheme.value.themeUrl}')`
      } else {
        return ''
      }
    })
    
    // Watchers
    watch(() => currSubject.value, () => {
      getDefaultConfigs()
      if (!(userTheme.value && userTheme.value.themeUrl)) {
        getDefaultUserTheme()
      }
    })
    
    // Lifecycle hooks
    onMounted(() => {
      initWindowsEvent()
      getDefaultConfigs()
      if (!(userTheme.value && userTheme.value.themeUrl)) {
        getDefaultUserTheme()
      }
      renderScrollFixed()
    })
    
    onUnmounted(() => {
      destroyedWindowsEvent()
    });
    
    // Methods
    const changeHisText = (item) => {
      keywords.value = item
      search()
    }
    
    const changeHotPaper = (paperItem) => {
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
    }
    
    const handleFocus = () => {
      historyMsgListRef.value.show()
    }
    
    const blurEvent = () => {
      historyMsgListRef.value.closed()
    }
    
    // Action methods
    const updateCurrentSubject = (subject) => {
      store.dispatch('updateCurrentSubject', subject)
    }
    
    const onEditTheme = () => {
      if (isLogin()) {
        diaSetUserThemeRef.value.show()
      } else {
        appLogin.value.showLogin()
      }
      // Track event
      console.log('Track event: 学科主页, 点击换主题, 次数')
    }
    
    const showLogin = () => {
      appLogin.value.showLogin()
    }
    
    const search = () => {
      if (!keywords.value.trim()) {
        console.log(keywords.value.trim())
        return
      }
      let path =
        currSearchOption.value === 1 ? 'search/question' : 'search/paper'
      window.open(router.resolve(path + '?keywords=' + keywords.value).href)
      //判断如果当前获取到搜索历史list长度大于5,不能添加，把数组的第一条的数据删除
      historyMsgListRef.value.saveCookieData(keywords.value.trim())
    }
    
    // Helper methods
    const initWindowsEvent = () => {
      window.addEventListener('scroll', renderScrollFixed)
    }
    
    const destroyedWindowsEvent = () => {
      window.removeEventListener('scroll', renderScrollFixed)
    }
    
    const getPageScrollTop = () => {
      let scrollPos = 0
      if (window.pageYOffset) {
        scrollPos = window.pageYOffset
      } else if (document.documentElement && document.documentElement.scrollTop) {
        scrollPos = document.documentElement.scrollTop
      } else if (document.body) {
        scrollPos = document.body.scrollTop
      }
      return scrollPos
    }
    
    const renderScrollFixed = () => {
      let comparisonTop = getPageScrollTop()
      let destinationY = 370
      if (comparisonTop > destinationY) {
        showFixed.value = true
        blurEvent() //  关闭消息框
        if (sendEventFlag.value) {
          sendEventFlag.value = false
          Bus.$emit('sendShowFixedFlag')
        }
      } else {
        showFixed.value = false
      }
    }
    
    const onChangeSuccess = () => {
      Bus.$emit('updateUserAppConfig')
      getDefaultConfigs()
    }
    
    const openSetHomePageBlock = () => {
      if (isLogin()) {
        let list = {}
        boxList.value.forEach(item => {
          list[item.id] = true
        })
        diaHomeSetPageBlockRef.value.show(list, [...boxList.value])
      } else {
        appLogin.value.showLogin()
      }
    }
    
    // API methods
    const getDefaultUserTheme = () => {
      if (!(currSubject.value && currSubject.value.periodCode)) {
        return
      }
      let url = API.USERTHEME_GETDEFAULTTHEME
      if (isLogin()) {
        url = API.USERTHEME_GETUSERTHEME
      }
      
      fetch(url)
        .then(res => res.json())
        .then(res => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            store.commit('UPDATE_USERTHEME', res.data)
          }
        })
        .catch(err => {
          console.error('Failed to get user theme', err)
        })
    }
    
    const getDefaultConfigs = async () => {
      if (!(currSubject.value && currSubject.value.periodCode)) {
        return
      }
      let params = {
        stage: currSubject.value.periodCode,
        subject: currSubject.value.subjectCode,
      }
      
      let url = API.MY_NOTOKEN_DEFAULTCONFIGS
      if (isLogin()) {
        url = API.MY_HOMEPAGECONFIG_USER_DEFAULTCONFIGS
      }
      
      try {
        const response = await fetch(url + '?' + new URLSearchParams(params).toString())
        const res = await response.json()
        
        if (res.code === CTS.constant.SUCCESS_CODE) {
          boxList.value = res.data.map(v => {
            return {
              ...v,
              url: v.url.replace('ti.canpoint.cn', 'ti-demo.canpoint.cn:8433'),
            }
          })
        }
        
        await getSubjectList()
      } catch (error) {
        console.error('Failed to get default configs', error)
      }
    }
    
    const getSubjectList = async () => {
      if (listData.value && listData.value.length) return
      
      try {
        const res = await store.dispatch('getConfigData', { 
          vm: this, 
          type: 2, 
          strParams: {} 
        })
        
        listData.value = res || []
      } catch (error) {
        console.error('Failed to get subject list', error)
      }
    }
    
    return {
      historyMsgListRef,
      diaHomeSetPageBlockRef,
      diaSetUserThemeRef,
      appLogin,
      showFixed,
      boxList,
      keywords,
      searchPlaceholder,
      currSearchOption,
      searchTransform,
      defaultThemeUrlBg,
      changeHisText,
      changeHotPaper,
      handleFocus,
      blurEvent,
      onEditTheme,
      openSetHomePageBlock,
      showLogin,
      search
    }
  }
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
      :deep(.el-input__inner) {
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
