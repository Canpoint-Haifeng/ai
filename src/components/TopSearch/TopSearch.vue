<template>
  <div>
    <div class="head-contenter">
      <div class="center">
        <div class="name">
          全品文教-基础教育的内容供应商和服务者
        </div>
        <div class="help">
          <div class="help">
            <a
              class="link"
              href="https://tech.canpoint.cn"
              target="_blank"
            >开放平台</a>
            <div class="line" />
            <div class="service_code_wrap">
              官方客服
              <div class="service_code">
                <img
                  src="./img/service_code.png"
                  alt="官方客服"
                >
                <span>全品AI教研云-微信客服</span>
              </div>
            </div>
            <div class="line" />
            <span>帮助中心</span>
            <el-button
              v-if="!loginStatus"
              style="margin-left: 50px;"
              type="text"
              @click="showLogin"
            >
              登录
            </el-button>
            <el-popover
              popper-class="popper-class-my"
              placement="bottom"
              trigger="hover"
            >
              <user-center-popover
                :user-info="userInfo"
                @logout="logout"
              />
              <template #reference>
                <div
                  v-if="loginStatus"
                  class="user-center"
                >
                  <span class="el-dropdown-link top">
                    <img
                      style="width: 24px;"
                      :src="
                        userInfo.profilePhoto || require('./img/user_4_fill.svg')
                      "
                      :alt="userInfo.nickname"
                      class="logo-img"
                    >
                    我的
                  </span>
                  <i class="el-icon-arrow-down" />
                </div>
              </template>
            </el-popover>
          </div>
        </div>
      </div>
    </div>
    <div class="top-search">
      <div class="content-container">
        <div
          class="logo"
          @click="goIndex"
        >
          <a :href="url">
            <img
              src="./img/logo.png"
              alt="全品AI教研云"
              class="logo-img"
            >
          </a>
        </div>
        <div class="search-form">
          <div class="container">
            <div class="home-search-input">
              <div class="tab-btn">
                <div
                  v-for="item in searchOptions"
                  :key="item.label"
                  class="btns"
                  :class="{ 'active-btn': currSearchOption === item.label }"
                  @mousedown="event => handleCommand(event, item)"
                >
                  {{ item.name }}
                </div>
              </div>
              <el-input
                v-model="keywords"
                popper-class="search-autocomplete-suggestions custom-dropdown-menu"
                maxlength="100"
                class="search-input"
                :placeholder="searchPlaceholder"
                @keyup.enter="search"
                @focus="handleFocus"
                @blur="blurEvent"
              />
            </div>

            <div
              class="search-btn"
              @click="search"
            >
              <i class="iconfont icon-search_3_line" />
            </div>
          </div>
        </div>
        <div class="right">
        </div>
      </div>
      <!-- 登录弹窗 -->
      <app-login ref="appLogin" />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount, inject, watch, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { defineComponent } from 'vue'
import CTS from '@/common/js/constant'
import { API } from '@/api/config'
import HistoryMessageList from './HistoryMessageList.vue'
import userCenterPopover from './userCenterPopover.vue'
import {
  isLogin,
  getToken,
  removeToken,
  removeSessionStore,
} from '@/common/js/util'

export default defineComponent({
  name: 'TopSearch',
  components: {
    HistoryMessageList,
    userCenterPopover,
  },
  props: {
    messageList: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  setup() {
    const instance = getCurrentInstance()
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const Bus = inject('Bus')
    
    const appLogin = ref(null)
    const historyMsgListRef = ref(null)
    const loginStatus = ref(false)
    const keywords = ref('')
    const currSearchOption = ref(1)
    const searchPlaceholder = ref('可输入教案名称搜索')
    const showSearchOptions = ref(false)
    const url = ref('/')
    
    const searchOptions = ref([
      {
        label: 1,
        name: '教案',
        className: 'btn-paper',
        placeholder: '可输入教案名称搜索',
      },
    ])
    
    // Computed properties
    const currSubject = computed(() => store.state.currSubject)
    const fullpath = computed(() => store.state.fullpath)
    const userInfo = computed(() => store.state.userInfo)
    
    const isHome = computed(() => {
      if (fullpath.value == 'paperIndex') {
        return true
      } else {
        return false
      }
    })
    
    // Methods
    const init = () => {
      loginStatus.value = isLogin()
      loginStatus.value && getUserInfo()
    }
    
    const getUserInfo = () => {
      let parms = {
        token: getToken(),
      }
      let set = {
        authCode: 2,
      }
      instance.proxy.apiPost(API.GET_SSO_VERIFY, parms, set).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          store.dispatch('updateUserInfo', res.data)
          if (res.data.rewards && res.data.rewards.length) {
            showCpReceiveReward(res.data.rewards)
          }
        } else if (res.code === CTS.constant.AUTH_TOKEN_CALLBACK_CODE) {
          loginStatus.value = false
          setTimeout(() => {
            store.dispatch('updateUserInfo', {
              t: new Date().getTime(),
            })
          }, 2000)
        }
      })
    }
    
    const logout = () => {
      let parms = {
        url: API.LOGOUT.urlPath,
        apiId: 100099,
        isWhitelist: 0,
        httpMethod: 1,
        strParams: {
          token: getToken(),
        },
      }
      instance.proxy.newPost({ urlPath: API.LOGOUT.baseURL }, parms).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          removeToken()
          removeSessionStore('serviceInfo')
          localStorage.clear()
          loginStatus.value = false
          store.commit('CLEAR_CACHE_DICT')
          window.location.reload()
        }
      })
    }
    
    const showLogin = () => {
      appLogin.value.showLogin()
    }
    
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
      router.push('/paper/detail' + queryStr)
    }
    
    const handleFocus = () => {
      // if (historyMsgListRef.value) {
      //   historyMsgListRef.value.show()
      // }
    }
    
    const blurEvent = () => {
      // if (historyMsgListRef.value) {
      //   historyMsgListRef.value.closed()
      // }
    }
    
    const updateKeyWords = () => {
      if (route.name === 'searchPaper' && route.query.keywords) {
        keywords.value = route.query.keywords
        currSearchOption.value = 2
      } else if (
        route.name === 'searchQuestion' &&
        route.query.keywords
      ) {
        keywords.value = route.query.keywords
        currSearchOption.value = 1
      } else {
        keywords.value = ''
      }
    }
    
    const goIndex = () => {
      router.push({
        name: 'paperIndex',
      })
    }
    
    const searchPaperList = (queryString, callback) => {
      let parms = {
        period: currSubject.value.periodCode,
        subjectCode: currSubject.value.subjectCode,
        paperName: keywords.value, // 试卷关键字
        pageSize: 20,
      }
      // apiGet(API.MANAGE_PAPER_LIST, parms).then((res) => {
      //   let paperList = []
      //   if (res.code === CTS.constant.SUCCESS_CODE) {
      //     paperList = res.data.list
      //     if (!paperList.length) {
      //       paperList = [{ value: '暂无数据' }]
      //     } else {
      //       paperList.forEach((item) => {
      //         item.value = item.paperName
      //       })
      //     }
      //   } else {
      //     paperList = [{ value: '暂无数据' }]
      //   }
      //   callback(paperList)
      // })
    }
    
    const search = () => {
      if (!loginStatus.value) return
      if (!keywords.value.trim()) {
        console.log(keywords.value.trim())
        return
      }

      // if (historyMsgListRef.value) {
      //   historyMsgListRef.value.saveCookieData(keywords.value.trim())
      // }

      if (isHome.value) {
        let path =
          currSearchOption.value === 1 ? '/search/question' : '/search/paper'
        router.push(path + '?keywords=' + keywords.value)
      } else {
        let name =
          currSearchOption.value === 1 ? 'searchQuestion' : 'searchPaper'
        if (
          route.name == name &&
          route.query.keywords == keywords.value
        ) {
          return
        }
        router.push({
          name,
          query: {
            keywords: keywords.value,
          },
        })
      }
    }
    
    const handleCommand = (event, command) => {
      event.preventDefault()
      currSearchOption.value = command.label
      searchPlaceholder.value = command.placeholder
      if (
        route.name === 'searchPaper' &&
        route.query.keywords &&
        command.label === 2
      ) {
        keywords.value = route.query.keywords
      } else if (
        route.name === 'searchQuestion' &&
        route.query.keywords &&
        command.label === 1
      ) {
        keywords.value = route.query.keywords
      } else {
        keywords.value = ''
      }
    }
    
    const visibleChange = (visible) => {
      showSearchOptions.value = visible
    }
    
    const entryUpload = () => {
      if (!isLogin()) {
        appLogin.value.showLogin()
      } else {
        let parms = {
          token: getToken(),
        }
        instance.proxy.wayGet(API.TOKEN_VERIFY, parms).then(res => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            router.push({
              name: 'PaperUpload',
            })
          } else {
            appLogin.value.showLogin()
            ElMessage.error('验证已经失效，请重新登录!')
          }
        })
      }
    }
    
    // Lifecycle hooks
    onMounted(() => {
      init()
      Bus.on('showAppLogin', showLogin)
      url.value = router.resolve('/index').href
      updateKeyWords()
    })
    
    onBeforeUnmount(() => {
      Bus.off('showAppLogin', showLogin)
    })
    
    // Watch for route changes
    watch(() => route, () => {
      loginStatus.value = isLogin()
    })
    
    return {
      appLogin,
      historyMsgListRef,
      loginStatus,
      keywords,
      currSearchOption,
      searchPlaceholder,
      searchOptions,
      showSearchOptions,
      url,
      userInfo,
      currSubject,
      fullpath,
      isHome,
      init,
      getUserInfo,
      logout,
      showLogin,
      changeHisText,
      changeHotPaper,
      handleFocus,
      blurEvent,
      updateKeyWords,
      goIndex,
      searchPaperList,
      search,
      handleCommand,
      visibleChange,
      entryUpload
    }
  }
})
</script>

<style lang="scss">
.user-center {
  margin-left: 50px;
}
.popper-class-my {
  background: rgb(246, 249, 255);
  padding: 0;
  height: 222px;
  margin-top: 0px;
  .new-avatar-img {
    width: 24px;
    height: 24px;
    object-fit: cover;
  }
}
.search-autocomplete-suggestions {
  border: 1px solid $color-theme;
  box-shadow: 0px 4px 6px 0px rgba(42, 77, 138, 0.1);
  &.el-popper[x-placement^='bottom'] {
    margin-top: 22px;
  }
  li {
    line-height: 42px;
    color: $color-text;
    transition: 0.2s;
    &:hover {
      background: $color-menu-l-hover;
      color: $color-theme-d;
    }
    &:first-child:hover {
      border-radius: 4px 4px 0 0;
    }
    &:last-child:hover {
      border-radius: 0 0 4px 4px;
    }
  }
}
</style>
<style lang="scss" scoped>
.top-search {
  width: 100%;
  min-width: 1200px;
  height: 100px;
  box-sizing: border-box;
  background: $color-white;
  padding: 10px 0;
  // overflow: hidden;
  .content-container {
    display: flex;
    align-items: flex-start;
  }
  .logo {
    //width: 198px;
    // height: 52px;
    margin-right: 28px;
    display: flex;
    align-items: flex-end;
    .logo-img {
      width: 198px;
      //height: 60px;
      cursor: pointer;
      margin-right: 10px;
    }
    span {
      font-size: 12px;
    }
  }
  .search-form {
    margin-left: 180px;
    width: 520px;
    height: 50px;
    background: rgba(72, 127, 255, 0.1);
    border-radius: 25px;
    margin-top: 10px;
    padding: 5px;
    .container {
      height: 100%;
      position: relative;
      background: #ffffff;
      border-radius: 25px;
      border: 1px solid rgba(72, 127, 255, 0.2);
      display: flex;
      align-items: center;
    }
    .home-search-input {
      @include flex();
      flex: 1;
      // border: 1px solid #c1c9cd;
      border-right-width: 0;
      height: 100%;
      border-radius: 12px 0 0 12px;
      .tab-btn {
        display: flex;
        margin: 0 10px 0 10px;
        border-radius: 12px;
        overflow: hidden;
        .btns {
          width: 50px;
          height: 24px;
          line-height: 22px;
          text-align: center;
          cursor: pointer;
          background: #f0f0f0;
          font-size: 12px;
        }
        .active-btn {
          background: #4b8ff5;
          color: #fff;
          border: 1px solid #4b8ff5;
        }
      }

      .search-input {
        width: 320px;
      }
      
      .search-input :deep(.el-input__inner) {
        height: 20px;
        line-height: 20px;
        border: none;
        // border-left: 1px solid #cfcfcf;
        border-radius: 0;
        color: $color-text-d;
        padding: 0;
        padding-left: 12px;
        font-size: $font-size-medium;
        &:focus {
          // border-left: 1px solid $color-theme;
        }
      }
    }

    .search-btn {
      width: 54px;
      height: 20px;
      // line-height: 46px;
      // background: #4b8ff5;
      cursor: pointer;
      // border-radius: 0px 12px 12px 0px;
      text-align: center;
      transition: 0.2s;
      display: grid;
      border-left: 2px solid #e2e2e2;
      &:hover {
        // background: $color-theme-d;
      }
      .icon-search_3_line {
        color: #487fff;
        font-size: 22px;
        place-self: center;
      }
    }
  }
  .right {
    display: flex;
    align-items: center;
    margin-top: 24px;
    margin-left: 90px;
    > div {
      color: #487fff;
      display: flex;
      align-items: center;
      cursor: pointer;
      &:not(:last-child) {
        margin-right: 40px;
      }
      i {
        font-size: 22px;
        margin-right: 10px;
      }
    }
  }
  
  .right :deep(.el-dropdown .el-dropdown-link) {
    display: block;
    max-width: 70px;
    @include textEllipsis();
  }
  
  .top-invite-segment {
    width: 90px;
    height: 40px;
    position: relative;
  }
  .top-upload {
    margin-top: 6px;
    width: 150px;
    height: 40px;
    line-height: 38px;
    border: 1px solid transparent;
    text-align: center;
    border-radius: 20px;
    cursor: pointer;
    transition: 0.2s;
    box-sizing: border-box;
    border: 1px solid $color-theme;
    .icon-box {
      display: inline-block;
      vertical-align: middle;
      height: 40px;
      margin-right: 12px;
      .iconupload {
        font-size: 24px;
        color: $color-theme;
      }
    }
    .text {
      color: $color-theme;
    }
    &:hover {
      border: 1px solid #3e73cd;
      .text,
      .iconupload {
        color: #3e73cd;
      }
    }
  }
}
.search-dropdown-menu {
  border: 1px solid $color-theme;
  width: 90px;
  height: 85px;
  padding: 0;
  background: $color-white;
  overflow: visible;
  box-shadow: 0px 4px 6px 0px rgba(42, 77, 138, 0.1);
  &.el-popper[x-placement^='bottom'] {
    margin-top: 10px;
  }
}

.search-dropdown-menu :deep(.dropdown-menu-item) {
  padding: 0;
  line-height: 42px;
  color: $color-text;
  text-align: center;
  transition: 0.2s;
  &:hover {
    background: $color-menu-l-hover;
    color: $color-theme-d;
  }
  &:first-child:hover {
    border-radius: 4px 4px 0 0;
  }
  &:last-child:hover {
    border-radius: 0 0 4px 4px;
  }
}

.head-contenter {
  background: #f6f6f6;
  height: 40px;
  line-height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  .center {
    width: 1200px;
    display: flex;
    justify-content: space-between;
    font-family: Microsoft YaHei, Microsoft YaHei;
    font-weight: 400;
    font-size: 14px;
    color: #333333;
    text-align: left;
    font-style: normal;
    text-transform: none;
    img {
      position: relative;
      top: -2px;
    }
    .icon-zhanghuxinxi1 {
      background: #666666;
      border-radius: 50%;
      color: #fff;
    }
    .help {
      font-size: 12px;
      margin-left: 64px;
      display: flex;
      align-items: center;
      .link {
        //margin-right: 15px;
      }
      .line {
        display: inline-block;
        width: 1px;
        height: 16px;
        border-right: 1px solid #d8d8d8;
        margin: 0 20px;
      }
      span {
        cursor: pointer;
        &:hover {
          color: #487fff;
        }
      }
      .service_code_wrap {
        z-index: 99;
        display: flex;
        position: relative;
        &:hover {
          .service_code {
            display: flex;
          }
        }
        .service_code {
          display: none;
          padding: 25px 20px 0 20px;
          flex-direction: column;
          width: 150px;
          height: 175px;
          background: url('./img/service_bg.png') center/cover no-repeat;
          position: absolute;
          top: 24px;
          left: -50px;
          span {
            height: 18px;
            line-height: 18px;
          }
          img {
            display: inline-block;
            margin-bottom: 4px;
            width: 110px;
            height: 110px;
          }
        }
      }
    }
    .help-div {
      display: flex;
      flex-direction: row;
    }
  }
}
</style>
